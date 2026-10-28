# Entrega de engenharia — 28 de outubro de 2026

O repositório começou vazio, sem commits e sem arquivos de aplicação. Todos os arquivos listados abaixo foram criados nesta entrega; nenhum código preexistente foi substituído. Código não foi enviado ao GitHub nem publicado em produção.

## Fases e aceite real

| Fase | Implementado e validado localmente | Dependências / escopo ainda pendente |
| --- | --- | --- |
| 1 — Fundação | Next.js App Router, TypeScript strict, UI própria, navegação, fluxos Supabase Auth, migration versionada, RLS e PWA | Configurar projeto Supabase, aplicar migration e validar Auth/SMTP/PostgREST com duas contas reais. Fase não aceita integralmente ponta a ponta sem essa validação. |
| 2 — Conectividade | Pesquisa OpenH59, contratos de adapter, identificação GATT em leitura, mensagens de permissão/cancelamento/desconexão, protocolo não confirmado explícito | Modelo/firmware/protocolo e SDK/licença não confirmados; sem hardware físico no ambiente. Nome informado pelo usuário: eaze. Não confirma H59/LVW-51S. Sem vinculação persistida, coleta, ingestão ou sincronização proprietária. |
| 3 — Experiência principal | Hoje, Saúde, intervalos 7/30 dias, gráficos quando existem registros válidos, origem/período/qualidade, estados vazios | Histórico real aguarda ingestão. Detalhes de fases de sono, repouso cardíaco e métricas específicas dependem de semântica validada. Sem índice clínico inventado. |
| 4 — Inteligência e hábitos | Médias por dia observado, comparações de períodos, planos transacionais e tarefas, check-ins/Moments, relatórios derivados semanal/mensal, card SVG sem dados pessoais, conversa persistida com consentimento e cota | APIs de persistência aguardam Supabase real. Provedor LLM opcional não configurado/testado. Modelo limitado a intenção/categoria; geração aberta, streaming e cards na conversa não implementados. Regularidade de horários, ajustes automáticos de plano, notificações e relatórios persistidos ainda pendentes. Histórico de conversa exibe os 40 registros mais recentes, sem paginação completa. |
| 5 — Qualidade | Unitários, componentes RTL, SQL/RLS em PostgreSQL WASM, testes de navegador/PWA, sete larguras, axe mobile/desktop e revisão visual | Revisão física em iPhone/Android, hardware, pentest e revisão jurídica/regulatória. Administração tem autorização server-side e status de configuração; usuários agregados, custos, feature flags e monitoramento operacional pendentes. |

## Evidência executada

- `npm ci --no-fund`: instalação reprodutível pelo lockfile, concluída.
- `npm run dev`: iniciado; GET /api/health e GET /hoje retornaram 200 e conteúdo esperado.
- `npm run typecheck`: passou.
- `npm run lint`: passou sem warnings na verificação final.
- `npm test`: **23 testes passaram em 5 arquivos** (analytics, BLE, IA, SQL/RLS e componentes).
- `npm run build`: build de produção passou.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`: **20 testes passaram**; navegação, respostas de bloqueio, proteção de origem, admin, PWA/offline, sete larguras em Hoje e dez outras rotas, axe em quatro rotas nas larguras 390 e 1280.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades conhecidas reportadas no momento da execução. Isso não substitui auditoria de segurança.
- Screenshots em `test-results/hoje-{320,375,390,430,768,1024,1440}.png`, ignorados pelo Git. Inspeção visual realizada em mobile e desktop.

Falhas intermediárias corrigidas: origem interna do servidor divergente da origem do navegador; contrastes insuficientes detectados por axe; configuração de alias do runner de componentes; uso de ref na renderização do seletor de conversas. Download oficial do Chromium foi negado pela política de rede; testes usaram `/usr/bin/chromium` já instalado, sem contornar a política.

PGlite valida SQL e políticas no motor PostgreSQL WASM com autenticação de teste. Não equivale à integração de Supabase Auth/GoTrue, SMTP ou PostgREST remotos. Fixtures de engenharia não entram no produto. Testes de BLE não equivalem à validação física.

## Como executar e continuar

`npm ci`, `npm run dev`; consulte README.md e docs/development.md. Não há dados de demonstração. Sem Supabase configurado, formulários persistentes ficam indisponíveis com explicação e APIs retornam erro explícito.

Nas configurações do ambiente foram salvos `install_script`, `start_skill` e requisitos para NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e APP_ORIGIN. O usuário deve informar os valores nas configurações, autorizar o domínio exato do projeto Supabase na rede restrita, revisar/salvar e publicar o ambiente. A chave publicável não é chave privilegiada. Nenhuma credencial de IA foi inventada ou salva; o domínio do provedor será necessário para configurar um segredo com destino restrito.

A publicação do rascunho é uma ação do produto e não foi realizada. Restauração em nova tarefa não foi validada.

Próximo passo técnico: configurar Supabase e testar os fluxos com duas contas; obter modelo/firmware/app oficial ou documentação da unidade física, validar protocolo e só então implementar adapter e pipeline de sincronização idempotente. Em paralelo, completar revisão de segurança, privacidade e escopo independente restante acima.

**Não há integração de pulseira concluída nem prontidão comercial nesta entrega.**

## Arquivos criados

- `.env.example`
- `.gitignore`
- `.nvmrc`
- `README.md`
- `docs/architecture.md`
- `docs/database.md`
- `docs/delivery.md`
- `docs/deployment.md`
- `docs/development.md`
- `docs/security.md`
- `docs/wearable-integration.md`
- `eslint.config.mjs`
- `next-env.d.ts`
- `next.config.ts`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `postcss.config.mjs`
- `public/apple-touch-icon.png`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/icon.svg`
- `public/maskable-512.png`
- `public/offline.html`
- `public/sw.js`
- `src/app/(dashboard)/ai/page.tsx`
- `src/app/(dashboard)/hoje/page.tsx`
- `src/app/(dashboard)/insights/page.tsx`
- `src/app/(dashboard)/layout.tsx`
- `src/app/(dashboard)/moments/page.tsx`
- `src/app/(dashboard)/planos/page.tsx`
- `src/app/(dashboard)/saude/page.tsx`
- `src/app/(dashboard)/voce/minha-eaze/page.tsx`
- `src/app/(dashboard)/voce/page.tsx`
- `src/app/(dashboard)/voce/privacidade/page.tsx`
- `src/app/admin/page.tsx`
- `src/app/api/account/password/route.ts`
- `src/app/api/ai/route.ts`
- `src/app/api/auth/route.ts`
- `src/app/api/health/route.ts`
- `src/app/api/moments/route.ts`
- `src/app/api/plans/route.ts`
- `src/app/api/privacy/export/route.ts`
- `src/app/api/privacy/route.ts`
- `src/app/auth/callback/route.ts`
- `src/app/criar-conta/page.tsx`
- `src/app/entrar/page.tsx`
- `src/app/error.tsx`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/loading.tsx`
- `src/app/manifest.ts`
- `src/app/not-found.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/page.tsx`
- `src/app/privacidade/page.tsx`
- `src/app/recuperar/page.tsx`
- `src/app/redefinir/page.tsx`
- `src/app/termos/page.tsx`
- `src/components/common.tsx`
- `src/components/health-chart.tsx`
- `src/components/interactive.tsx`
- `src/components/metric-grid.tsx`
- `src/components/pwa.tsx`
- `src/components/shell.tsx`
- `src/components/ui/button.tsx`
- `src/features/ai/chat.tsx`
- `src/features/ai/grounding.ts`
- `src/features/ai/safety.ts`
- `src/features/analytics/engine.ts`
- `src/features/auth/components.tsx`
- `src/features/devices/connector.tsx`
- `src/features/insights/share-report.tsx`
- `src/features/moments/components.tsx`
- `src/features/plans/components.tsx`
- `src/features/privacy/components.tsx`
- `src/integrations/wearables/types.ts`
- `src/integrations/wearables/web-bluetooth.ts`
- `src/lib/client-api.ts`
- `src/lib/data.ts`
- `src/lib/http.ts`
- `src/lib/supabase/server.ts`
- `src/proxy.ts`
- `supabase/migrations/202610280001_foundation.sql`
- `tests/ai.test.ts`
- `tests/analytics.test.ts`
- `tests/bluetooth.test.ts`
- `tests/components.test.tsx`
- `tests/database.test.ts`
- `tests/e2e/app.spec.ts`
- `tsconfig.json`
- `vitest.config.mts`
