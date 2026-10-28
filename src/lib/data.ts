import { currentUser, database, configured } from "./supabase/server";
import type { Measurement } from "@/features/analytics/engine";
export async function workspace() {
  const user = await currentUser();
  if (!user)
    return {
      user: null,
      configured: configured(),
      measurements: [] as Measurement[],
      plans: [],
      tasks: [],
      moments: [],
      devices: [],
      consents: [],
      messages: [],
      error: null,
    };
  const db = await database();
  const since = new Date(Date.now() - 60 * 86400000).toISOString();
  const results = await Promise.all([
    db
      .from("measurements")
      .select(
        "id,device_id,metric_type,value,unit,measured_at,quality_status,source",
      )
      .eq("user_id", user.id)
      .gte("measured_at", since)
      .order("measured_at", { ascending: false })
      .limit(10000),
    db
      .from("plans")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .limit(10),
    db
      .from("plan_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_for")
      .limit(300),
    db
      .from("wellness_checkins")
      .select("*")
      .eq("user_id", user.id)
      .order("recorded_at", { ascending: false })
      .limit(30),
    db.from("devices").select("*").eq("user_id", user.id).limit(10),
    db.from("consents").select("*").eq("user_id", user.id),
    db
      .from("ai_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);
  const error = results.some((r) => r.error)
    ? "Não foi possível carregar todos os registros. Tente novamente."
    : results[0].data?.length === 10000
      ? "O período excedeu o limite de leitura. As análises estão indisponíveis para evitar resultados incompletos."
      : null;
  return {
    user,
    configured: true,
    measurements: (error ? [] : results[0].data || []) as Measurement[],
    plans: results[1].data || [],
    tasks: results[2].data || [],
    moments: results[3].data || [],
    devices: results[4].data || [],
    consents: results[5].data || [],
    messages: (results[6].data || []).reverse(),
    error,
  };
}
export type Workspace = Awaited<ReturnType<typeof workspace>>;
