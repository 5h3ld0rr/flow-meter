import { Badge, Button, GlassCard } from "@/components/ui";
import { Header } from "@/components/layout";
import { BillActions } from "@/components/Billing/BillActions";
import { getBillById } from "@/lib/data/billing";
import { getCustomerById } from "@/lib/data/customers";
import { getMeterById } from "@/lib/data/meters";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const bill = await getBillById(parseInt(id));

    if (!bill) {
        notFound();
    }

    const customer = await getCustomerById(bill.customer_id.toString());
    const meter = await getMeterById(bill.meter_id.toString()); // Assuming meter_id in bill is int, need string for getMeterById if it expects string id? 
    // checking getMeterById signature: export async function getMeterById(id: string) -> expects string ID (e.g. M001) or internal ID?
    // getBillById returns meter_display_id which is likely the string ID.

    // Actually getBillById returns:
    // b.*, c.customer_id as customer_display_id, c.name as customer_name,
    // m.meter_id as meter_display_id, m.serial_number as meter_serial

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <Header
                title={`Bill ${bill.bill_id}`}
                subtitle="Bill Details and Invoice"
                showBackButton
            />

            <div className="max-w-4xl mx-auto">
                <GlassCard className="p-8">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                INVOICE
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                #{bill.bill_id}
                            </p>
                        </div>
                        <div className="text-right">
                            <Badge
                                variant={
                                    bill.status === "paid"
                                        ? "success"
                                        : bill.status === "overdue"
                                            ? "danger"
                                            : "warning"
                                }
                                size="md"
                            >
                                {bill.status.toUpperCase()}
                            </Badge>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Date Issued: {formatDate(bill.created_at)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Due Date: {formatDate(bill.due_date)}
                            </p>
                        </div>
                    </div>

                    {/* Bill To & From */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Bill To
                            </h3>
                            <div className="text-gray-900 dark:text-white">
                                <p className="font-semibold text-lg">{bill.customer_name}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    ID: {bill.customer_display_id}
                                </p>
                                {customer && <p className="text-gray-600 dark:text-gray-300">{customer.address}</p>}
                                {customer && <p className="text-gray-600 dark:text-gray-300">{customer.email}</p>}
                                {customer && <p className="text-gray-600 dark:text-gray-300">{customer.phone}</p>}
                            </div>
                        </div>
                        <div className="text-right md:text-left">
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                                Meter Details
                            </h3>
                            <div className="text-gray-900 dark:text-white">
                                <p className="font-semibold">Meter ID: {bill.meter_display_id}</p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Serial: {bill.meter_serial}
                                </p>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Billing Period</p>
                                    <p className="font-medium">
                                        {formatDate(bill.billing_period_start)} - {formatDate(bill.billing_period_end)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Usage Details Table */}
                    <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Previous Reading
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Current Reading
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Consumption
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                <tr>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                        Usage Charges
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                                        {bill.previous_reading}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 text-right">
                                        {bill.current_reading}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white text-right">
                                        {bill.consumption} units
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Calculations */}
                    <div className="flex justify-end mb-8">
                        <div className="w-full md:w-1/3 space-y-3">
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Base Amount</span>
                                <span>Rs. {bill.base_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span>Tax</span>
                                <span>Rs. {bill.tax_amount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 font-bold text-lg text-gray-900 dark:text-white">
                                <span>Total Amount</span>
                                <span className="text-blue-600 dark:text-cyan-400">Rs. {bill.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <BillActions />
                </GlassCard>
            </div>
        </>
    );
}
