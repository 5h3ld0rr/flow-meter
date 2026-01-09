import { getUserById } from "@/lib/data/users";
import { getCurrentUser } from "@/lib/session/user";
import { notFound, redirect } from "next/navigation";
import { EditUserForm } from "@/components/Users/EditUserForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, currentUser] = await Promise.all([
    getUserById(id),
    getCurrentUser(),
  ]);

  if (!user || !currentUser) {
    notFound();
  }

  if (currentUser.id == Number(id)) {
    redirect("/UMS/Users");
  }

  return <EditUserForm user={user} />;
}
