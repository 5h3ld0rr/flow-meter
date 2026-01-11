import { Button, GlassCard, SearchInput } from "@/components/ui";
import { Header } from "@/components/layout";
import { getCustomers } from "@/lib/data/customers";
import { Plus } from "lucide-react";
import { CustomersTable } from "@/components/Customers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const customers = await getCustomers(params.search as string);

  return (
    <>
      <Header
        title="Customer Management"
        subtitle="Manage customer accounts and information"
      />

      {/* Actions Bar */}
      <GlassCard className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <SearchInput placeholder="Search customers..." className="md:w-96" />
          <Button
            variant="primary"
            href="/UMS/Customers/New"
            icon={<Plus size={20} />}
            className="font-medium"
          >
            Add Customer
          </Button>
        </div>
      </GlassCard>

      <CustomersTable data={customers} />
    </>
  );
}
