import { workspace } from "@/lib/data";
import { Chat } from "@/components/interactive";
import { SetupNotice } from "@/components/common";
export default async function AI() {
  const d = await workspace();
  return (
    <>
      <SetupNotice
        configured={d.configured}
        authenticated={!!d.user}
        error={d.error}
      />
      <Chat enabled={!!d.user} initial={d.messages} />
    </>
  );
}
