-- eaze Intelligence: execute once via Supabase migrations. No service-role key needed by app.
create extension if not exists pgcrypto;
create table public.profiles (id uuid primary key references auth.users on delete cascade, display_name text check(length(display_name)<=100), created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.devices (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users on delete cascade, external_id text not null check(length(external_id)<=200), name text, model text, manufacturer text, firmware text, connection_type text not null check(connection_type in ('web_bluetooth','manufacturer_api')), protocol text not null, created_at timestamptz not null default now(), unique(user_id,external_id), unique(id,user_id));
create table public.device_connections (id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,device_id uuid not null,status text not null check(status in ('disconnected','connected','interrupted')), last_connected_at timestamptz,last_synced_at timestamptz, foreign key(device_id,user_id) references public.devices(id,user_id) on delete cascade, unique(device_id));
create table public.measurements (id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,device_id uuid not null, metric_type text not null check(metric_type in ('heart_rate','spo2','steps','sleep_minutes','stress')), value numeric not null check(value>=0),unit text not null, measured_at timestamptz not null, received_at timestamptz not null default now(),source text not null,quality_status text not null check(quality_status in ('valid','uncertain','invalid')),metadata jsonb not null default '{}', foreign key(device_id,user_id) references public.devices(id,user_id) on delete cascade,unique(user_id,device_id,metric_type,measured_at,source),check((metric_type='heart_rate' and unit='bpm' and value between 1 and 300) or (metric_type='spo2' and unit='%' and value<=100) or (metric_type='steps' and unit='steps' and value<=200000) or (metric_type='sleep_minutes' and unit='min' and value<=1440) or (metric_type='stress' and unit='score' and value<=100)));
create index measurements_user_time on public.measurements(user_id,metric_type,measured_at desc);
create table public.sleep_sessions(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,device_id uuid not null,started_at timestamptz not null,ended_at timestamptz not null,duration_minutes int not null check(duration_minutes>=0),metadata jsonb not null default '{}',foreign key(device_id,user_id) references public.devices(id,user_id) on delete cascade,check(ended_at>started_at),unique(device_id,started_at));
create table public.activities(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,device_id uuid not null,activity_type text not null,started_at timestamptz not null,ended_at timestamptz,steps int check(steps>=0),metadata jsonb not null default '{}',foreign key(device_id,user_id) references public.devices(id,user_id) on delete cascade,check(ended_at is null or ended_at>=started_at));
create table public.wellness_checkins(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,recorded_at timestamptz not null default now(),mood int check(mood between 1 and 5),energy int check(energy between 1 and 5),kind text not null default 'checkin',notes text check(length(notes)<=1000));
create table public.insights(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,insight_type text not null,period_start timestamptz not null,period_end timestamptz not null,summary text not null,source_metadata jsonb not null default '{}',created_at timestamptz not null default now(),check(period_end>period_start));
create table public.plans(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,title text not null check(length(title)<=200),goal text not null,status text not null default 'active' check(status in ('active','completed','archived')),started_at timestamptz not null default now(),ended_at timestamptz,unique(id,user_id));
create table public.plan_tasks(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,plan_id uuid not null,title text not null,scheduled_for date not null,completed_at timestamptz,foreign key(plan_id,user_id) references public.plans(id,user_id) on delete cascade);
create table public.ai_conversations(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,created_at timestamptz not null default now(),unique(id,user_id));
create table public.ai_messages(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,conversation_id uuid not null,role text not null check(role in ('user','assistant')),content text not null check(length(content)<=12000),created_at timestamptz not null default now(),foreign key(conversation_id,user_id) references public.ai_conversations(id,user_id) on delete cascade);
create table public.consents(id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users on delete cascade,purpose text not null check(purpose in ('health_storage','ai_analysis')),version text not null,granted_at timestamptz not null default now(),revoked_at timestamptz,unique(user_id,purpose));
create table public.audit_logs(id uuid primary key default gen_random_uuid(),actor_id uuid not null references auth.users on delete cascade,action text not null,resource_type text not null,created_at timestamptz not null default now(),metadata jsonb not null default '{}');
create table public.deletion_requests(id uuid primary key default gen_random_uuid(),user_id uuid not null unique references auth.users on delete cascade,created_at timestamptz not null default now(),status text not null default 'pending' check(status in ('pending','processed')));
create table public.rate_limits(user_id uuid not null references auth.users on delete cascade,bucket timestamptz not null,count int not null,primary key(user_id,bucket));
alter table public.profiles enable row level security;
create policy owner on public.profiles for all to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
alter table public.devices enable row level security;
create policy owner on public.devices for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index devices_owner on public.devices(user_id);
alter table public.device_connections enable row level security;
create policy owner on public.device_connections for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index device_connections_owner on public.device_connections(user_id);
alter table public.measurements enable row level security;
create policy owner on public.measurements for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index measurements_owner on public.measurements(user_id);
alter table public.sleep_sessions enable row level security;
create policy owner on public.sleep_sessions for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index sleep_sessions_owner on public.sleep_sessions(user_id);
alter table public.activities enable row level security;
create policy owner on public.activities for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index activities_owner on public.activities(user_id);
alter table public.wellness_checkins enable row level security;
create policy owner on public.wellness_checkins for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index wellness_checkins_owner on public.wellness_checkins(user_id);
alter table public.insights enable row level security;
create policy owner on public.insights for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index insights_owner on public.insights(user_id);
alter table public.plans enable row level security;
create policy owner on public.plans for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index plans_owner on public.plans(user_id);
alter table public.plan_tasks enable row level security;
create policy owner on public.plan_tasks for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index plan_tasks_owner on public.plan_tasks(user_id);
alter table public.ai_conversations enable row level security;
create policy owner on public.ai_conversations for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index ai_conversations_owner on public.ai_conversations(user_id);
alter table public.ai_messages enable row level security;
create policy owner on public.ai_messages for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index ai_messages_owner on public.ai_messages(user_id);
alter table public.consents enable row level security;
create policy owner on public.consents for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index consents_owner on public.consents(user_id);
alter table public.deletion_requests enable row level security;
create policy owner on public.deletion_requests for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create index deletion_requests_owner on public.deletion_requests(user_id);
alter table public.audit_logs enable row level security;
create policy own_audit_read on public.audit_logs for select to authenticated using ((select auth.uid())=actor_id);
alter table public.rate_limits enable row level security;
-- Browser cannot manufacture device data, AI answers, or audit entries. Writes go through reviewed RPCs.
revoke all on all tables in schema public from anon;
grant select,insert,update,delete on public.profiles,public.wellness_checkins,public.plans,public.plan_tasks,public.consents,public.deletion_requests to authenticated;
grant select,delete on public.devices,public.device_connections,public.measurements,public.sleep_sessions,public.activities,public.insights,public.ai_conversations,public.ai_messages to authenticated;
revoke insert,update on public.devices,public.device_connections,public.measurements,public.sleep_sessions,public.activities,public.insights,public.ai_conversations,public.ai_messages from authenticated;
revoke all on public.rate_limits from authenticated;
revoke insert,update,delete on public.audit_logs from authenticated;
grant select on public.audit_logs to authenticated;
-- Atomic plan creation and tasks; invoker policies apply to both parent and child.
create function public.create_habit_plan(p_goal text,p_days int,p_time text) returns uuid language plpgsql security invoker set search_path=public as $$
declare pid uuid; task text;
begin
 if auth.uid() is null or p_days not between 3 and 30 or p_time !~ '^([01][0-9]|2[0-3]):[0-5][0-9]$' then raise exception 'Invalid plan'; end if;
 task=case p_goal when 'sleep' then 'Reserve um momento para desacelerar' when 'movement' then 'Faça uma pausa para se movimentar' when 'balance' then 'Registre como você está se sentindo' else null end;
 if task is null then raise exception 'Invalid goal'; end if;
 insert into plans(user_id,title,goal,ended_at) values(auth.uid(),task,p_goal,now()+make_interval(days=>p_days)) returning id into pid;
 insert into plan_tasks(user_id,plan_id,title,scheduled_for) select auth.uid(),pid,task||' às '||p_time,(now() at time zone 'America/Sao_Paulo')::date+d from generate_series(0,p_days-1) d;
 return pid;
end $$;
revoke all on function public.create_habit_plan(text,int,text) from public;
grant execute on function public.create_habit_plan(text,int,text) to authenticated;
-- Distributed per-user budget, independent of app process count.
create function public.consume_ai_budget() returns boolean language plpgsql security definer set search_path=public as $$
declare n int;
begin
 if auth.uid() is null then return false; end if;
 insert into rate_limits values(auth.uid(),date_trunc('hour',now()),1) on conflict(user_id,bucket) do update set count=rate_limits.count+1 returning count into n;
 return n<=10;
end $$;
revoke all on function public.consume_ai_budget() from public;
grant execute on function public.consume_ai_budget() to authenticated;
-- Transactional conversation pair. Identity is obtained from auth, never request JSON.
create function public.save_ai_exchange(p_conversation uuid,p_question text,p_answer text) returns uuid language plpgsql security definer set search_path=public as $$
declare cid uuid;
begin
 if auth.uid() is null then raise exception 'Unauthorized'; end if;
 if not exists(select 1 from consents where user_id=auth.uid() and purpose='ai_analysis' and revoked_at is null) then raise exception 'Consent required'; end if;
 cid=p_conversation;
 if cid is null then insert into ai_conversations(user_id) values(auth.uid()) returning id into cid;
 elsif not exists(select 1 from ai_conversations where id=cid and user_id=auth.uid()) then raise exception 'Forbidden'; end if;
 insert into ai_messages(user_id,conversation_id,role,content) values(auth.uid(),cid,'user',p_question),(auth.uid(),cid,'assistant',p_answer);
 insert into audit_logs(actor_id,action,resource_type) values(auth.uid(),'ai_exchange','ai_conversation');
 return cid;
end $$;
revoke all on function public.save_ai_exchange(uuid,text,text) from public;
grant execute on function public.save_ai_exchange(uuid,text,text) to authenticated;
-- Production ingestion intentionally absent until an eaze protocol is physically validated.
-- No client or server route can claim proprietary measurements are verified.
-- Audit resource changes without storing notes, measurements, questions or answers.
create function public.audit_owned_change() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if auth.uid() is not null and exists(select 1 from auth.users where id=auth.uid()) then
 insert into audit_logs(actor_id,action,resource_type) values(auth.uid(),lower(TG_OP),TG_TABLE_NAME);
 end if;
 if TG_OP='DELETE' then return OLD; end if;
 return NEW;
end $$;
revoke all on function public.audit_owned_change() from public;
create trigger audit_plans after insert or update or delete on public.plans for each row execute function public.audit_owned_change();
create trigger audit_tasks after insert or update or delete on public.plan_tasks for each row execute function public.audit_owned_change();
create trigger audit_moments after insert or update or delete on public.wellness_checkins for each row execute function public.audit_owned_change();
create trigger audit_consents after insert or update or delete on public.consents for each row execute function public.audit_owned_change();
create trigger audit_deletion after insert or update on public.deletion_requests for each row execute function public.audit_owned_change();
