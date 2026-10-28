import { workspace } from "@/lib/data";
import { PageHeading, SetupNotice } from "@/components/common";
import { PrivacyControls } from "@/components/interactive";
export default async function Privacy() {
  const d = await workspace();
  return (
    <>
      <PageHeading
        eyebrow="PRIVACIDADE"
        title="Seus dados. Suas escolhas."
        description="Transparência para decidir. Liberdade para mudar."
      />
      <SetupNotice
        configured={d.configured}
        authenticated={!!d.user}
        error={d.error}
      />
      <PrivacyControls enabled={!!d.user} consents={d.consents} />
    </>
  );
}
