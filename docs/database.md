# Banco de dados

Aplicar `supabase/migrations/202610280001_foundation.sql` em um projeto Supabase de desenvolvimento dedicado. Via Supabase CLI instalada e autenticada, executar `supabase link --project-ref <ref>` e `supabase db push`; alternativamente executar a migration pelo SQL Editor do projeto. Não forneça senhas no chat. A migration usa `auth.users`, `auth.uid()` e roles Supabase.

## Modelo

`profiles`, `devices`, `device_connections`, `measurements`, `sleep_sessions`, `activities`, `wellness_checkins`, `insights`, `plans`, `plan_tasks`, `ai_conversations`, `ai_messages`, `consents`, `audit_logs`, `deletion_requests` e `rate_limits`.

Todas as tabelas possuem RLS. A identidade vem de `auth.uid()`. Relações pessoais filhas usam `(parent_id,user_id)` referenciando chave única do pai; um usuário não pode vincular uma tarefa, mensagem ou medição a recurso de outra pessoa. Leituras e mutações da aplicação também filtram o proprietário.

Medições possuem chave única `(user_id,device_id,metric_type,measured_at,source)`. Unidade e limites de representação são verificados no banco; esses limites validam formato, não normalidade clínica. Não há API de ingestão aberta. Usuários autenticados não podem inserir ou atualizar dispositivos e medições até existir pipeline validado. Futuro adapter deve declarar se passos e sono representam intervalos ou totais; não marque contadores cumulativos como amostras incrementais.

## RPCs

- `create_habit_plan`: security invoker; plano e tarefas em uma transação, 3–30 dias, objetivo limitado e horário validado.
- `consume_ai_budget`: contador por usuário/hora, security definer com search_path fixado e `auth.uid()` obrigatório.
- `save_ai_exchange`: consentimento ativo e propriedade de conversa; cria mensagens em uma transação. Observação: a RPC autenticada é acessível ao próprio usuário via PostgREST; o conteúdo de conversas nunca é uma fonte confiável para medições ou analytics. Endurecimento de escrita exclusivamente server-side exigirá credencial/role dedicada e revisão separada.

Triggers de auditoria registram tipo de recurso/ação/ator, sem notas, valores fisiológicos ou texto de conversas. A RPC de IA registra o evento sem conteúdo.

## Validação

`tests/database.test.ts` aplica a migration em PGlite, com roles e `auth.uid()` de teste. Remove apenas `create extension pgcrypto` porque `gen_random_uuid()` é nativo nesse runtime. Testa RLS real, propriedade relacionada, unidades, permissões, deduplicação, consentimento e orçamento. Não testa SMTP, GoTrue, PostgREST, renovação remota de sessão, backups ou configuração do projeto Supabase.

A exclusão de `auth.users` por operador autorizado propaga por cascade. A aplicação registra solicitação; não tem privilégios administrativos para excluir a conta. Validar cascades, backups, retenção e evidência de atendimento no procedimento de produção. Não foi definida uma política de retenção definitiva.
