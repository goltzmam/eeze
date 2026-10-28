import { currentUser } from "@/lib/supabase/server";
import { DeviceConnector } from "@/components/interactive";
export default async function Device() {
  const user = await currentUser();
  return <DeviceConnector enabled={!!user} />;
}
