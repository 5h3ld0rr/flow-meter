import { EditMeterForm } from "@/components/Meters";
import { getMeterById } from "@/lib/data/meters";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meter = await getMeterById(id);

  if (!meter) {
    notFound();
  }

  return <EditMeterForm meter={meter} />;
}
