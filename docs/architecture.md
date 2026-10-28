# Arquitetura

O checkout é `/workspace/eeze`. Cada tarefa de nuvem já é isolada; reutilize o checkout e não crie worktrees sem solicitação explícita.

## Camadas

- `src/app`: rotas App Router, handlers HTTP e composição server-side.
- `src/components`: shell responsivo, primitivas de UI, gráficos e formulários interativos. React escapa conteúdo e não utiliza HTML fornecido pelo usuário/modelo.
- `src/lib/supabase`: cliente SSR com cookies. `src/proxy.ts` renova sessão com `getUser`.
- `src/lib/http.ts`: identidade validada, mesma origem para mutações, limites de corpo e erros minimizados.
- `src/features/analytics`: análise pura e independente do modelo.
- `src/features/ai`: orientação determinística para poucos dados e sintomas urgentes.
- `src/integrations/wearables`: contrato de adapters e identificação Bluetooth em leitura, sem protocolo proprietário presumido.
- `supabase/migrations`: persistência, políticas e transações.

## Fluxos

Conta autenticada → API → Supabase com token do próprio usuário → RLS. O aplicativo não precisa de chave service-role e não permite ingestão arbitrária de medições pelo navegador.

Registros válidos → validação de unidade/qualidade/período → agregação diária → resumo estruturado → provedor opcional → resposta com evidência determinística → persistência atômica do par de mensagens. Até 10 requisições/hora/usuário no banco, timeout de 20 segundos, 100 tokens por resposta. Não há ferramentas de IA, navegação autônoma ou execução de instruções do modelo.

## Decisões e limites

Layouts de acompanhamento permanecem vazios sem dados reais. Não há seeding de produção. Fixtures existem somente em testes. Gráficos carregam somente quando existem registros para exibir. Limite de leitura de 10 mil medições evita consultas ilimitadas; ao atingir o limite, análises são bloqueadas para não apresentar médias truncadas. Uma agregação SQL paginada de grande escala é evolução necessária.

Planos são hábitos escolhidos pela pessoa, sem prescrição clínica. Check-ins são autorrelatos, nunca medições de dispositivo. Horários de exibição usam America/Sao_Paulo; armazenamento usa timestamptz. Preferência de fuso por usuário ainda pendente.

Sessões são verificadas no servidor e RLS aplica isolamento. O shell pode ser aberto sem sessão; acesso a dados e mutações requer conta. Administração exige UUID configurado no servidor, não metadata editável pelo cliente.

A camada atual de BLE não confirma identidade criptográfica, proprietário físico nem compatibilidade eaze. A persistência de medições deve ser adicionada somente após especificação de transporte/protocolo validado, autenticação do dispositivo, semântica dos pacotes, ingestão idempotente e testes físicos.
