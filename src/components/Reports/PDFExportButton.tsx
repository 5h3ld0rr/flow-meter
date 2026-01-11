"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Download, Loader2 } from "lucide-react";
import { generatePDF, downloadPDF } from "@/lib/utils/pdf-generator";
import { toast } from "sonner";

interface PDFExportButtonProps {
  reportType: "revenue" | "consumption" | "customers" | "defaulters";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const PDFExportButton = ({
  reportType,
  variant = "primary",
  size = "md",
}: PDFExportButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = async () => {
    setIsGenerating(true);
    try {
      // Dynamically import the appropriate action
      const {
        generateRevenueReportPDF,
        generateConsumptionReportPDF,
        generateCustomerReportPDF,
        generateDefaultersReportPDF,
      } = await import("@/lib/actions/reports");

      let result;
      switch (reportType) {
        case "revenue":
          result = await generateRevenueReportPDF();
          break;
        case "consumption":
          result = await generateConsumptionReportPDF();
          break;
        case "customers":
          result = await generateCustomerReportPDF();
          break;
        case "defaulters":
          result = await generateDefaultersReportPDF();
          break;
      }

      if (result.success && result.data) {
        const pdf = generatePDF(result.data);
        const filename = `${reportType}-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        downloadPDF(pdf, filename);
        toast.success("PDF report generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate PDF");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleExport}
      disabled={isGenerating}
      className="relative"
    >
      {isGenerating ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <Download size={18} />
      )}
      {isGenerating ? "Generating..." : "Export PDF"}
    </Button>
  );
};
