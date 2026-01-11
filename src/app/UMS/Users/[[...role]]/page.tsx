import { Header } from "@/components/layout";
import { getUserRoleStats, getUsersByRole } from "@/lib/data/users";
import { UsersTable } from "@/components/Users";
import Link from "next/link";
import { Button, GlassCard, SearchInput } from "@/components/ui";
import { Plus, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROLES } from "@/constants";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ role?: string[] }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const _params = await params;
  const _searchParams = await searchParams;

  const role = _params.role?.[0];

  const [roleStats, users] = await Promise.all([
    getUserRoleStats(),
    getUsersByRole(role, _searchParams.search),
  ]);

  return (
    <>
      <Header
        title="User Management"
        subtitle="Manage system roles, permissions and user accounts"
      />
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <Link href={"/UMS/Users"}>
              <GlassCard
                className={cn(
                  "flex flex-col p-3 rounded-xl border transition-all text-left group",
                  !role
                    ? "bg-gradient border-transparent text-white shadow-lg shadow-blue-500/20"
                    : "glass border-gray-100 dark:border-white/5 hover:border-blue-500/50"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      !role ? "text-orange-50" : "text-gray-500"
                    )}
                  >
                    Total
                  </span>
                  <UserIcon
                    size={18}
                    className={!role ? "text-orange-50" : "text-gray-400"}
                  />
                </div>
                <p className="text-2xl font-bold">{users.length}</p>
              </GlassCard>
            </Link>
            {roleStats.map((_role) => {
              const roleKey = _role.name.toLowerCase() as keyof typeof ROLES;
              const config = ROLES[roleKey];
              const Icon = config?.icon || UserIcon;
              const isActive = role?.toLowerCase() === _role.name.toLowerCase();

              return (
                <Link href={`/UMS/Users/${_role.name}`} key={_role.name}>
                  <GlassCard
                    className={cn(
                      "flex flex-col px-4 py-3 rounded-xl border transition-all text-left cursor-pointer",
                      isActive
                        ? "bg-gradient border-transparent text-white shadow-lg shadow-blue-500/20"
                        : "glass border-gray-100 dark:border-white/5 hover:border-blue-500/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-xs font-bold uppercase tracking-wider",
                          isActive ? "text-blue-50" : "text-gray-500"
                        )}
                      >
                        {_role.name}
                      </span>
                      <Icon
                        size={18}
                        className={isActive ? "text-blue-50" : config.iconClass}
                      />
                    </div>
                    <p className="text-2xl font-bold">{_role.users}</p>
                  </GlassCard>
                </Link>
              );
            })}
          </div>

          {/* Actions Bar */}
          <GlassCard className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <SearchInput
                placeholder="Search users by name or email..."
                className="md:w-96"
              />
              <Button
                variant="primary"
                href="/UMS/Users/New"
                icon={<Plus size={20} />}
                className="font-medium whitespace-nowrap"
              >
                Add New User
              </Button>
            </div>
          </GlassCard>

          <UsersTable data={users} />
        </div>
      </div>
    </>
  );
}
