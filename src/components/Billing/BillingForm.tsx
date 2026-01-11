"use client";

import { useActionState, useEffect } from "react";
import { generateBillAction } from "@/lib/actions/billing";
import { Button } from "@/components/ui";
import { Send, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface BillingSummary {
  customerId: string;
  customerName: string;
  meterId: string;
  previousReading: number;
  currentReading: number;
  startDate: string;
  endDate: string;
  readingId?: string;
  consumption: number;
  tariffRate: number;
  taxPercentage: number;
  amount: number;
  tax: number;
  total: number;
  meterFound: boolean;
  internalMeterId: number;
  internalCustomerId: number;
  error: string;
  utilityType: string;
}

export function BillingForm({
  billingSummary,
}: {
  billingSummary: BillingSummary;
}) {
  const [state, action, isPending] = useActionState(generateBillAction, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
    } else if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  const handleDownload = () => {
    try {
      if (!state?.bill) {
        toast.error("No bill data available to download");
        return;
      }

      const doc = new jsPDF();
      const bill = state.bill;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Company Header with Background
      doc.setFillColor(37, 99, 235); // Blue background
      doc.rect(0, 0, pageWidth, 45, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      const title = billingSummary.utilityType
        ? `${billingSummary.utilityType.toUpperCase()} BILL`
        : "UTILITY BILL";
      doc.text(title, pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("FlowMeter Utility Management System", pageWidth / 2, 30, {
        align: "center",
      });
      doc.text("Email: billing@flowmeter.com", pageWidth / 2, 37, {
        align: "center",
      });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Bill ID and Date Section
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`Bill ID: ${bill.billId}`, 20, 60);
      doc.text(
        `Issue Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 20,
        60,
        { align: "right" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Due Date: ${bill.dueDate}`, pageWidth - 20, 67, {
        align: "right",
      });

      // Customer Information Box
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(20, 75, pageWidth - 40, 30, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("BILL TO:", 25, 83);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`${bill.customerName}`, 25, 91);
      doc.text(`Customer ID: ${bill.customerId || "N/A"}`, 25, 98);

      // Billing Period
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Billing Period:", pageWidth - 85, 83);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`${bill.billingPeriodStart}`, pageWidth - 85, 91);
      doc.text(`to ${bill.billingPeriodEnd}`, pageWidth - 85, 98);

      // Consumption Details Table
      const consumptionData = [
        ["Previous Reading", `${bill.previousReading?.toFixed(2) || 0} units`],
        ["Current Reading", `${bill.currentReading?.toFixed(2) || 0} units`],
        ["Consumption", `${bill.consumption?.toFixed(2) || 0} units`],
        ["Tariff Rate", `Rs. ${bill.tariffRate?.toFixed(4) || 0}/unit`],
      ];

      autoTable(doc, {
        startY: 115,
        head: [["Description", "Value"]],
        body: consumptionData,
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235],
          fontSize: 10,
          fontStyle: "bold",
        },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 70, halign: "right" },
        },
      });

      // Charges Breakdown Table
      const chargesData = [
        ["Base Amount", `Rs. ${bill.baseAmount?.toFixed(2) || 0}`],
        ["Tax", `Rs. ${bill.taxAmount?.toFixed(2) || 0}`],
      ];

      autoTable(doc, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [["Charges", "Amount"]],
        body: chargesData,
        theme: "grid",
        headStyles: {
          fillColor: [37, 99, 235],
          fontSize: 10,
          fontStyle: "bold",
        },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { cellWidth: 70, halign: "right" },
        },
      });

      // Total Amount Box
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const totalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFillColor(37, 99, 235);
      doc.roundedRect(20, totalY, pageWidth - 40, 20, 3, 3, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("TOTAL AMOUNT DUE:", 25, totalY + 13);
      doc.text(
        `Rs. ${bill.amount?.toFixed(2) || 0}`,
        pageWidth - 25,
        totalY + 13,
        { align: "right" }
      );

      // Footer
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.text("Thank you for your business!", pageWidth / 2, footerY, {
        align: "center",
      });
      doc.text(
        "Please pay before the due date to avoid late fees.",
        pageWidth / 2,
        footerY + 5,
        { align: "center" }
      );

      // Save PDF
      doc.save(`Bill-${bill.billId}.pdf`);
      toast.success("Bill downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <form action={action} className="space-y-4">
      <input
        type="hidden"
        name="customerId"
        value={billingSummary.internalCustomerId}
      />
      <input
        type="hidden"
        name="meterId"
        value={billingSummary.internalMeterId}
      />
      <input
        type="hidden"
        name="readingId"
        value={billingSummary.readingId || ""}
      />
      <input type="hidden" name="startDate" value={billingSummary.startDate} />
      <input type="hidden" name="endDate" value={billingSummary.endDate} />
      <input
        type="hidden"
        name="previousReading"
        value={billingSummary.previousReading}
      />
      <input
        type="hidden"
        name="currentReading"
        value={billingSummary.currentReading}
      />
      <input
        type="hidden"
        name="consumption"
        value={billingSummary.consumption}
      />
      <input
        type="hidden"
        name="tariffRate"
        value={billingSummary.tariffRate}
      />
      <input type="hidden" name="baseAmount" value={billingSummary.amount} />
      <input type="hidden" name="taxAmount" value={billingSummary.tax} />
      <input type="hidden" name="totalAmount" value={billingSummary.total} />

      <div className="glass rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Billing Period
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {billingSummary.startDate} - {billingSummary.endDate}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Consumption
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {billingSummary.consumption.toFixed(2)} units
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Base Amount
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            Rs. {billingSummary.amount.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Tax ({billingSummary.taxPercentage}%)
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            Rs. {billingSummary.tax.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-900 dark:text-white">
            Total Amount
          </span>
          <span className="text-xl font-bold text-blue-600 dark:text-cyan-400">
            Rs. {billingSummary.total.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex gap-4 absolute bottom-0 left-0 p-6 w-full">
        <Button
          variant="secondary"
          href={`/UMS/Billing?step=1&meterId=${billingSummary.meterId}&customerId=${billingSummary.customerId}&readingId=${billingSummary.readingId}`}
          fullWidth
          disabled={isPending}
        >
          <ArrowLeft size={18} />
          Back
        </Button>
        {state?.success ? (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleDownload}
          >
            <Download size={18} />
            Download PDF
          </Button>
        ) : (
          <Button type="submit" variant="primary" fullWidth loading={isPending}>
            <Send size={18} />
            Generate Bill
          </Button>
        )}
      </div>
    </form>
  );
}
