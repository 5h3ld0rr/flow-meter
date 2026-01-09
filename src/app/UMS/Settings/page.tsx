import { Header } from "@/components/layout";
import { getAllTariffs } from "@/lib/data/billing";
import { getCurrentUser } from "@/lib/session/user";
import { SettingsClient } from "@/components/Settings";

export default async function Page() {
  const tariffs = await getAllTariffs();
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <>
      <Header
        title="Settings"
        subtitle="Manage system preferences and configurations"
      />
      <div className="max-w-6xl">
        <SettingsClient tariffs={tariffs} userId={user.id} />
      </div>
    </>
  );
}
