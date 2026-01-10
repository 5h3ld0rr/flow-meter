import { getUserById } from "@/lib/data/users";
import { verifySession } from "@/lib/session/user";
import { notFound } from "next/navigation";
import { EditUserForm } from "@/components/Users/EditUserForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user] = await Promise.all([getUserById(id)]);
  const currentUser = await verifySession();

  if (!user || !currentUser) {
    notFound();
  }

  return (
    <EditUserForm user={user} currentUserId={Number(currentUser.userId)} />
  );
}
