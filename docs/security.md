# Segurança e privacidade

## Controles implementados

Identidade validada por `getUser` no servidor; RLS em todas as tabelas pessoais; FK composta de propriedade; nenhuma chave privilegiada no frontend; Zod nos corpos de mutação; tamanho máximo de 64 KiB; origem obrigatória nas mutações; cabeçalhos CSP, anti-framing, nosniff e política de permissões; renderização escapada; APIs com erros minimizados e sem logs de conteúdo de saúde.

Tokens de sessão são geridos pelo fluxo SSR oficial do Supabase. A chave publishable é pública por definição e só funciona com políticas corretas. Nunca use service-role como chave pública. Supabase Auth deve manter confirmação de e-mail, limites de autenticação e proteção contra abuso. CAPTCHA/MFA precisam ser avaliados antes do lançamento.

Consentimentos de armazenamento e análise são independentes. Revogação de IA impede novos pedidos ao provedor; não apaga automaticamente registros anteriores. Não existe coleta de wearable ativa; qualquer futura ingestão deverá verificar consentimento no banco e tratar revogação em trânsito.

IA usa somente agregados e pergunta, sem IDs ou histórico bruto no prompt. System prompt separa instruções de conteúdo não confiável, não há ferramentas. O provedor pode retornar apenas dois enums validados (categoria e intenção); todo texto e valor exibido é produzido deterministicamente a partir dos agregados. Campos extras e prosa livre são rejeitados. Isso limita o assistente atual a resumos, comparações e orientação inicial, sem conversa generativa aberta. Validação adversarial com provedor real e revisão clínica continuam necessárias. Detecção lexical de sintomas é uma proteção complementar, não triagem clínica. Limite de 10 mensagens/hora/usuário é durável, mas cotas globais, orçamento financeiro e limites de tráfego ainda pendentes.

O service worker armazena somente fallback e ícones estáticos. Nunca páginas autenticadas, APIs, RSC ou medições. Respostas pessoais são no-store. Atualizações exigem ação e aviso para salvar formulários.

## Pendências para operação comercial

- Teste integrado com duas contas reais no Supabase, sessão, recuperação e SMTP.
- Pentest, teste de abuso, política de CSP sem unsafe-inline usando nonces e revisão da cadeia de dependências.
- Definição do controlador/encarregado/canal de direitos, bases legais, idade mínima e transferência internacional.
- Escolha de região, contrato com operadores, proteção de backups, retenção e eliminação verificável.
- Processamento das solicitações de exclusão, revogação e rastreabilidade de atendimento. UI distingue solicitação de exclusão concluída.
- Supervisão de custos e limites globais, observabilidade redigida e resposta a incidentes.
- Revisão da vinculação BLE/autenticação de dispositivo e integridade da origem antes da ingestão.
- Revisão jurídica, regulatória e de segurança clínica do conteúdo, inclusive mensagens de urgência.

Nenhuma alegação de conformidade LGPD, diagnóstico ou prontidão comercial é feita nesta entrega.
