import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
let db: PGlite;
const alice = "00000000-0000-4000-8000-000000000001",
  bob = "00000000-0000-4000-8000-000000000002";
beforeAll(async () => {
  db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;insert into auth.users values('${alice}'),('${bob}');`,
  );
  const sql = readFileSync(
    "supabase/migrations/202610280001_foundation.sql",
    "utf8",
  ).replace("create extension if not exists pgcrypto;", "");
  await db.exec(sql);
}, 30000);
afterAll(async () => {
  await db?.close();
});
async function asUser(id: string) {
  await db.exec(
    `reset role;set role authenticated;set request.jwt.claim.sub='${id}';`,
  );
}
describe("migration applied to PostgreSQL WASM, actual RLS and constraints", () => {
  it("enables RLS on every personal table", async () => {
    const result = await db.query<{ relname: string }>(
      "select relname from pg_class join pg_namespace n on n.oid=relnamespace where n.nspname='public' and relkind='r' and not relrowsecurity",
    );
    expect(result.rows).toEqual([]);
  });
  it("isolates records and rejects foreign user inserts", async () => {
    await asUser(alice);
    await db.query(
      "insert into wellness_checkins(user_id,notes) values($1,$2)",
      [alice, "private technical fixture"],
    );
    await asUser(bob);
    expect(
      (await db.query("select * from wellness_checkins")).rows,
    ).toHaveLength(0);
    await expect(
      db.query("insert into wellness_checkins(user_id) values($1)", [alice]),
    ).rejects.toThrow(/row-level security/);
  });
  it("creates plans atomically and protects parent ownership", async () => {
    await asUser(alice);
    const plan = await db.query<{ id: string }>(
      "select create_habit_plan('sleep',7,'20:00') as id",
    );
    expect((await db.query("select * from plan_tasks")).rows).toHaveLength(7);
    await asUser(bob);
    expect((await db.query("select * from plans")).rows).toHaveLength(0);
    await expect(
      db.query(
        "insert into plan_tasks(user_id,plan_id,title,scheduled_for) values($1,$2,'bad',current_date)",
        [bob, plan.rows[0].id],
      ),
    ).rejects.toThrow(/foreign key/);
  });
  it("prevents client manufacturing health data or audit logs", async () => {
    await asUser(alice);
    await expect(
      db.query(
        "insert into measurements(user_id,device_id,metric_type,value,unit,measured_at,source,quality_status) values($1,gen_random_uuid(),'heart_rate',70,'bpm',now(),'spoof','valid')",
        [alice],
      ),
    ).rejects.toThrow(/permission denied/);
    await expect(
      db.query(
        "insert into audit_logs(actor_id,action,resource_type) values($1,'fake','fake')",
        [alice],
      ),
    ).rejects.toThrow(/permission denied/);
  });
  it("deduplicates raw measurements and enforces units", async () => {
    await db.exec("reset role");
    const d = await db.query<{ id: string }>(
      "insert into devices(user_id,external_id,connection_type,protocol) values($1,'fixture','web_bluetooth','test-only') returning id",
      [alice],
    );
    const values = [alice, d.rows[0].id];
    const insert =
      "insert into measurements(user_id,device_id,metric_type,value,unit,measured_at,source,quality_status) values($1,$2,'heart_rate',70,'bpm','2026-10-01','fixture','valid')";
    await db.query(insert, values);
    await expect(db.query(insert, values)).rejects.toThrow(/unique/);
    await expect(
      db.query(
        "insert into measurements(user_id,device_id,metric_type,value,unit,measured_at,source,quality_status) values($1,$2,'heart_rate',70,'%','2026-10-02','fixture','valid')",
        values,
      ),
    ).rejects.toThrow(/check constraint/);
  });
  it("enforces durable per-user AI budget", async () => {
    await asUser(alice);
    for (let i = 0; i < 10; i++)
      expect(
        (await db.query<{ ok: boolean }>("select consume_ai_budget() as ok"))
          .rows[0].ok,
      ).toBe(true);
    expect(
      (await db.query<{ ok: boolean }>("select consume_ai_budget() as ok"))
        .rows[0].ok,
    ).toBe(false);
    await asUser(bob);
    expect(
      (await db.query<{ ok: boolean }>("select consume_ai_budget() as ok"))
        .rows[0].ok,
    ).toBe(true);
  });
  it("requires AI consent and enforces conversation ownership", async () => {
    await asUser(alice);
    await expect(
      db.query("select save_ai_exchange(null,'question','answer')"),
    ).rejects.toThrow(/Consent required/);
    await db.query(
      "insert into consents(user_id,purpose,version) values($1,'ai_analysis','test')",
      [alice],
    );
    const conversation = await db.query<{ id: string }>(
      "select save_ai_exchange(null,'question','answer') as id",
    );
    expect((await db.query("select * from ai_messages")).rows).toHaveLength(2);
    await asUser(bob);
    expect((await db.query("select * from ai_messages")).rows).toHaveLength(0);
    await db.query(
      "insert into consents(user_id,purpose,version) values($1,'ai_analysis','test')",
      [bob],
    );
    await expect(
      db.query("select save_ai_exchange($1,'q','a')", [
        conversation.rows[0].id,
      ]),
    ).rejects.toThrow(/Forbidden/);
  });
});
