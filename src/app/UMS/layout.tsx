import { Sidebar } from "@/components/layout";
import { verifySession } from "@/lib/session/user";

export default async function Layout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const user = await verifySession();

  return (
    <>
      <Sidebar role={user?.role} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
          {modal}
        </div>
      </main>
    </>
  );
}
