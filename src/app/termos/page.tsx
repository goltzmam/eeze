import Link from "next/link";
export default function Terms() {
  return (
    <main className="legal-page">
      <Link href="/hoje" className="auth-brand">
        eaze
      </Link>
      <h1>Bem-estar, com responsabilidade.</h1>
      <p>
        Versão de engenharia · 28 de outubro de 2026. Termos sujeitos a revisão
        jurídica antes do lançamento comercial.
      </p>
      <h2>Finalidade</h2>
      <p>
        A eaze Intelligence ajuda a observar registros e hábitos. Não é um
        dispositivo de diagnóstico, não prescreve tratamentos e não substitui
        profissionais de saúde.
      </p>
      <h2>Conectividade</h2>
      <p>
        A compatibilidade depende do navegador, modelo, firmware e protocolo. A
        conexão GATT não significa sincronização. O Safari no iPhone não oferece
        Web Bluetooth nativo.
      </p>
      <h2>Limites das informações</h2>
      <p>
        Medições podem ser incompletas ou imprecisas. A IA pode errar. Em
        urgências, procure atendimento apropriado; no Brasil, ligue 192.
      </p>
      <h2>Antes da disponibilização pública</h2>
      <p>
        O controlador deve definir elegibilidade, suporte, condições comerciais
        e regras de cancelamento. O produto ainda requer validação de segurança,
        privacidade, acessibilidade e hardware físico.
      </p>
    </main>
  );
}
