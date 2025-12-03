import { getCustomerById } from "@/lib/data/customers";
import { notFound } from "next/navigation";
import EditCustomerForm from "@/components/Customers/EditCustomerForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return <EditCustomerForm customer={customer} />;
}
