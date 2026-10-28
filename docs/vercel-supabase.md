# Conectar GitHub, Supabase e Vercel

## Configuração preparada no repositório

`vercel.json` seleciona Next.js, `npm ci` e `npm run build`. Node.js 24.x está fixado em `package.json`. A raiz da aplicação é a raiz deste repositório (não definir `src` como Root Directory). O workflow GitHub Actions valida lint, tipos, testes e build, com E2E sem credenciais de produção. Não aplica migrations automaticamente.

## Autorizações necessárias

Importe `goltzmam/eeze` em https://vercel.com/new com a conta/time autorizados. Conceda ao aplicativo GitHub da Vercel acesso somente ao repositório necessário. Se já existir projeto Vercel, use Settings → Git para conectar esse repositório; não crie outro inadvertidamente. Selecione `main` como Production Branch. Pushes de branches poderão criar previews conforme configuração da Vercel.

No projeto Supabase correto, aplique `supabase/migrations/202610280001_foundation.sql` uma única vez. Não reaplique manualmente se a migration já tiver sido executada. Alternativa via CLI autenticada: `supabase link --project-ref <ref>` e `supabase db push`, após revisar o destino. Nenhuma credencial deve ser enviada por chat ou commitada.

## Variáveis na Vercel

| Nome | Origem | Escopo |
| --- | --- | --- |
| NEXT_PUBLIC_SUPABASE_URL | URL HTTPS do projeto Supabase | Build e runtime |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Chave publicável do projeto, nunca service-role | Build e runtime |
| APP_ORIGIN | Origem HTTPS exata e estável da aplicação, sem barra final | Servidor |

Se instalar a integração oficial Supabase–Vercel, confira os nomes efetivamente provisionados: este código exige exatamente os nomes acima; variáveis adicionais com outros nomes não substituem automaticamente estas.

Preencha as variáveis em Project Settings → Environment Variables para o ambiente desejado e faça novo deploy: variáveis NEXT_PUBLIC são incorporadas no build. Não use credenciais de produção em testes E2E ou previews sem intenção explícita. A integração de contas por si só não aplica a migration nem configura autenticação.

No Supabase Auth, configure Site URL com a origem canônica e Redirect URLs com `<origem>/auth/callback`. A recuperação usa essa mesma callback e encaminha para `/redefinir`. Mantenha confirmação de e-mail e configure SMTP. Para previews, use projeto de desenvolvimento isolado e origem exata por ambiente. O código atual não aceita automaticamente todos os subdomínios de preview na validação de origem.

O endpoint /api/health não verifica o banco; após deploy valide cadastro, confirmação, login, plano, check-in, consentimentos e exportação. Use duas contas e confirme isolamento. Verifique cabeçalhos e PWA em HTTPS. Integração física da pulseira continua pendente; deploy não a conclui.

## O que não foi automaticamente conectado

Uma configuração no Git não autentica a conta Vercel nem a Supabase. Credenciais, projeto/time de destino e acesso de rede são pré-requisitos externos. Não declarar deploy ativo sem URL e resultado de validação. Nunca salvar tokens em vercel.json, workflows ou arquivos .env versionados.
