# Publicação

1. Validar segurança, privacidade, requisitos regulatórios e hardware antes de abrir comercialmente.
2. Provisionar Supabase e aplicar migration; executar teste integrado de duas contas, confirmar RLS, e-mail, backups e exclusão.
3. Provisionar runtime Node 24, instalar `npm ci`, fornecer variáveis no cofre/ambiente, executar `npm run build` e `npm start` atrás de HTTPS.
4. Configurar APP_ORIGIN, URLs Auth e chave publicável no build. Restringir destinos de rede ao projeto Supabase e provedor escolhido; nunca trocar allowlist desconhecida por `*`.
5. LLM_API_KEY permanece no servidor. ADMIN_USER_IDS é uma allowlist de UUIDs gerida pelo operador; não aceitar papéis administrativos enviados pelo usuário.
6. Testar headers, CSP, PWA em HTTPS, atualização após versão do worker e ausência de dados pessoais em caches. Incrementar CACHE no `public/sw.js` ao mudar assets offline. Servir sw.js sem cache persistente de CDN.
7. Configurar monitoramento sem conteúdo de saúde, cotas financeiras globais, SMTP, alertas, atendimento LGPD, retenção e exclusão. Esses serviços operacionais ainda não foram provisionados.

O endpoint `/api/health` indica apenas que o processo HTTP responde; não comprova conexão do Supabase, IA ou pulseira. Uma resposta 200 isolada não é aceite do produto.

Configuração de nuvem salva em rascunho não publica o aplicativo nem comprova restauração em nova tarefa. O usuário revisa as configurações e publica o ambiente pelo produto. Não foi realizado deploy público nesta entrega.
