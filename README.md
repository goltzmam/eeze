# eaze Intelligence

Menos tela. Mais vida. Aplicação web/PWA de bem-estar em português, iniciada do repositório vazio. Não contém modo demonstração nem medições artificiais.

## Executar

Node.js 24 (validado com 24.19.0), npm 11.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

O aplicativo abre em `/hoje`. Sem Supabase configurado, apresenta estados vazios e explica a indisponibilidade das ações persistentes. Não há conta ou login fictício. Ver [configuração](docs/development.md).

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm start
# Com Chromium instalado neste ambiente:
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

## Estado real da implementação

- Next.js App Router, React, TypeScript strict, Tailwind, componente Button com Radix/cva, ícones Lucide, gráficos Recharts, layouts mobile/desktop e navegação real.
- Fluxos de cadastro, login, confirmação por e-mail, recuperação de senha e logout via Supabase Auth. **Não validados contra projeto Supabase remoto**: configuração ausente.
- Migration PostgreSQL com RLS, chaves compostas para propriedade, restrições de unidades, deduplicação, auditoria minimizada e RPCs transacionais. Testes executam SQL em PostgreSQL WASM (PGlite), não equivalem ao teste da infraestrutura Supabase/GoTrue/PostgREST.
- APIs autenticadas para planos/tarefas, Moments, consentimentos, exportação paginada e solicitação de exclusão. A exclusão final da conta é um processo operacional pendente; a UI explica isso.
- Motor determinístico de médias por dia observado e comparações de períodos, com mínimo de três dias por categoria. Não estima repouso, fases do sono, emoções ou índices clínicos.
- Conversas persistidas, consentimento específico, orçamento de 10 mensagens/hora no banco e integração HTTPS com provedor compatível com OpenAI. Sem provedor ou dados suficientes, resposta determinística explica os limites. Streaming, cards na conversa e gestão administrativa de custos ainda pendentes.
- Minha eaze: seleção real Web Bluetooth, conexão GATT e leitura opcional de serviços padrão SIG (informações e bateria). **Protocolo eaze, vinculação, coleta e sincronização não estão implementados/validados**. Nenhum comando proprietário é enviado. Safari/iPhone sem Web Bluetooth tem limitação explícita.
- PWA com ícones PNG/maskable, instalação, offline fallback sem cache de dados pessoais e atualização mediante ação do usuário.
- Administração com autorização server-side por UUID. Visão multiusuário, feature flags e custos ainda não implementados.

**Não está pronto para lançamento comercial.** Dependências e critérios restantes em [entrega](docs/delivery.md), [segurança](docs/security.md) e [conectividade](docs/wearable-integration.md).

## Documentação

- [Arquitetura](docs/architecture.md)
- [Banco de dados](docs/database.md)
- [Segurança e LGPD](docs/security.md)
- [Conectividade](docs/wearable-integration.md)
- [Desenvolvimento](docs/development.md)
- [Publicação](docs/deployment.md)
- [Conectar GitHub, Supabase e Vercel](docs/vercel-supabase.md)
- [Entrega e limitações](docs/delivery.md)
