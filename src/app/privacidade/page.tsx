import Link from "next/link";
export default function Privacy() {
  return (
    <main className="legal-page">
      <Link className="auth-brand" href="/hoje">
        eaze
      </Link>
      <h1>Privacidade com clareza.</h1>
      <p>
        Versão de engenharia · 28 de outubro de 2026. Esta política precisa de
        validação jurídica e identificação do controlador antes da abertura
        comercial.
      </p>
      <h2>O que é armazenado</h2>
      <p>
        Conta, planos, check-ins, consentimentos, conversas e registros de
        dispositivos quando disponíveis. Dados de saúde não são publicados ou
        armazenados pelo service worker.
      </p>
      <h2>Suas autorizações</h2>
      <p>
        O armazenamento de saúde e as análises por IA têm controles separados em
        Você → Privacidade. A IA recebe apenas resumos agregados, além da
        pergunta enviada por você. Evite inserir identificadores ou informações
        sensíveis desnecessárias na conversa.
      </p>
      <h2>Seus direitos</h2>
      <p>
        É possível exportar seus registros e solicitar exclusão. A solicitação
        depende do processamento pelo responsável pela privacidade. Revogar
        consentimento não exclui registros já armazenados.
      </p>
      <h2>Retenção e operadores</h2>
      <p>
        A implantação deve identificar o controlador, canal do encarregado,
        região do Supabase, provedor de IA, subprocessadores e política de
        retenção de backups. Esses elementos ainda não estão definidos. Não abra
        o serviço ao público antes dessa revisão.
      </p>
      <Link href="/voce/privacidade">Gerenciar minhas escolhas</Link>
    </main>
  );
}
