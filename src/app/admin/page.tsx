import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function Admin() {
  const user = await currentUser();
  if (!user) redirect("/entrar");
  if (
    !process.env.ADMIN_USER_IDS?.split(",")
      .map((s) => s.trim())
      .includes(user.id)
  )
    notFound();
  return (
    <main className="legal-page">
      <h1>Operações eaze</h1>
      <p>
        Autorização server-side validada. Nenhum dado individual de saúde é
        exposto nesta área.
      </p>
      <h2>Serviços configurados</h2>
      <ul>
        <li>Autenticação Supabase: configurada; sessão validada.</li>
        <li>
          Provedor de IA:{" "}
          {process.env.LLM_API_KEY
            ? "credencial presente; conectividade não testada"
            : "não configurado"}
          .
        </li>
        <li>Sincronização proprietária: bloqueada até validação física.</li>
      </ul>
      <p>
        Métricas agregadas multiusuário, custos e feature flags ainda não foram
        implementados. Não há chave privilegiada no aplicativo.
      </p>
    </main>
  );
}
