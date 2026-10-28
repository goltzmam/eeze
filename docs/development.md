# Desenvolvimento

## Dependências

Node 24, npm 11; `npm ci` usa package-lock.json. Testado neste ambiente com Linux e Chromium 154 instalado em `/usr/bin/chromium`. Não é necessário baixar um navegador se esse executável está disponível. Em outra máquina: `npx playwright install chromium` (requer destinos oficiais de distribuição permitidos pela política de rede).

## Supabase

1. Criar projeto de desenvolvimento dedicado.
2. Aplicar migration conforme database.md.
3. Preencher `.env.local` a partir de `.env.example`: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (apenas chave publicável). Sem esses valores o aplicativo informa indisponibilidade e bloqueia mutações.
4. Definir APP_ORIGIN com a origem exata, sem barra final. No desenvolvimento: http://localhost:3000. Na publicação: origem HTTPS real.
5. Configurar Auth Site URL e Redirect URLs para `<origem>/auth/callback`; manter confirmação de e-mail. Configurar SMTP confiável. Não desligar confirmação para fazer um teste passar.
6. Criar e confirmar duas contas de teste. Exercitar login/logout, recuperação por e-mail, consentimentos, plano com tarefa, Moment e exportação. Tentar acesso cruzado e verificar bloqueio.

A configuração pública do Supabase é embutida no bundle; alterações exigem novo build. Não use valores fictícios para declarar conexão configurada.

## IA opcional

LLM_API_URL é endpoint HTTPS completo `/chat/completions` de provedor OpenAI-compatible; LLM_MODEL seleciona modelo; LLM_API_KEY é somente server-side. Usar segredo seguro nas configurações do ambiente, com domínio de destino exato autorizado. Nenhuma chave foi solicitada ou embutida nesta entrega. A chave não existe neste ambiente. Autorizar `ai_analysis` na própria conta para cada conversa.

Sem dados suficientes, a resposta é determinística e não faz chamada externa. Sem provedor, agregados podem ser apresentados deterministicamente, sem alegar geração por modelo. O provedor atualmente classifica intenção/categoria via JSON validado; a resposta é renderizada deterministicamente. Conversa generativa aberta não está implementada; ver security.md.

## Comandos

`npm run dev`, `npm run build`, `npm start`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:e2e`.

E2E usa build de produção na porta 3000 (ou servidor já em execução fora de CI). Neste ambiente: `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e`. Testes de estados sem configuração devem rodar sem credenciais de produção. Nunca executar fixtures em banco real.

Screenshots responsivos são gerados em `test-results/hoje-{largura}.png`. Pasta ignorada pelo Git. E2E cobre sete larguras, rotas, indisponibilidade explícita da conta sem configuração, origem HTTP, admin, manifest e cache offline. Testes de BLE usam mocks de API de navegador isolados; não comprovam hardware físico.

## Nuvem

Cada tarefa já é isolada. Use `/workspace/eeze`; não crie worktree sem pedido explícito. Reutilize proxy e CA do ambiente. Não desative TLS ou verificação de pacotes. Instalação/build e browsers podem exigir execução fora das restrições locais de subprocessos/rede do sandbox, pelos mecanismos autorizados da plataforma. Processos não sobrevivem necessariamente à restauração; reinicie com `npm run dev` e valide `/api/health` e uma página.
