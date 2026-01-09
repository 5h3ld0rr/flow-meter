"use server";

import { getRevenueReport, getRegionalReport } from "@/lib/data/reports";
import {
  analyzeReportData,
  generateReportNarrative,
} from "@/lib/utils/ai-analyzer";

export const generateRevenueReportPDF = async () => {
  try {
    const [revenueData, regionalData] = await Promise.all([
      getRevenueReport(),
      getRegionalReport(),
    ]);

    return {
      success: true,
      data: {
        title: "Revenue Report",
        subtitle: "Comprehensive Revenue Analysis",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        summary: [
          {
            label: "Total Revenue",
            value: `$${revenueData
              .reduce((sum, r) => sum + r.revenue, 0)
              .toLocaleString()}`,
          },
          {
            label: "Reporting Period",
            value: `${revenueData[0]?.month || "N/A"} - ${
              revenueData[revenueData.length - 1]?.month || "N/A"
            }`,
          },
          {
            label: "Total Regions",
            value: regionalData.length.toString(),
          },
        ],
        sections: [
          {
            title: "Monthly Revenue Breakdown",
            type: "table" as const,
            data: revenueData,
            columns: [
              { header: "Month", dataKey: "month" },
              { header: "Revenue ($)", dataKey: "revenue" },
              { header: "Target ($)", dataKey: "target" },
            ],
          },
          {
            title: "Regional Performance",
            type: "table" as const,
            data: regionalData,
            columns: [
              { header: "Region", dataKey: "region" },
              { header: "Customers", dataKey: "customers" },
              { header: "Consumption (kWh)", dataKey: "consumption" },
              { header: "Revenue ($)", dataKey: "revenue" },
            ],
          },
        ],
      },
    };
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return {
      success: false,
      error: "Failed to generate PDF report",
    };
  }
};

export const analyzeRevenueReport = async () => {
  try {
    const [revenueData, regionalData] = await Promise.all([
      getRevenueReport(),
      getRegionalReport(),
    ]);

    // Combine data into a single array for analysis
    const combinedData = [
      ...revenueData.map((r) => ({ type: "monthly_revenue", ...r })),
      ...regionalData.map((r) => ({ type: "regional_performance", ...r })),
    ];

    const analysis = await analyzeReportData("Revenue", combinedData);
    const narrative = await generateReportNarrative("Revenue", combinedData);

    return {
      success: true,
      data: {
        ...analysis,
        narrative,
      },
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      success: false,
      error: "Failed to analyze report",
    };
  }
};

export const analyzeConsumptionReport = async () => {
  try {
    const [revenueData, regionalData] = await Promise.all([
      getRevenueReport(),
      getRegionalReport(),
    ]);

    const combinedData = [
      ...revenueData.map((r) => ({ type: "consumption_trend", ...r })),
      ...regionalData.map((r) => ({ type: "regional_consumption", ...r })),
    ];

    const analysis = await analyzeReportData("Consumption", combinedData);
    const narrative = await generateReportNarrative(
      "Consumption",
      combinedData
    );

    return {
      success: true,
      data: {
        ...analysis,
        narrative,
      },
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      success: false,
      error: "Failed to analyze consumption report",
    };
  }
};

export const analyzeCustomerReport = async () => {
  try {
    const [revenueData, regionalData] = await Promise.all([
      getRevenueReport(),
      getRegionalReport(),
    ]);

    const combinedData = [
      ...revenueData.map((r) => ({ type: "customer_growth", ...r })),
      ...regionalData.map((r) => ({ type: "customer_distribution", ...r })),
    ];

    const analysis = await analyzeReportData("Customer", combinedData);
    const narrative = await generateReportNarrative("Customer", combinedData);

    return {
      success: true,
      data: {
        ...analysis,
        narrative,
      },
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      success: false,
      error: "Failed to analyze customer report",
    };
  }
};

export const analyzeDefaultersReport = async () => {
  try {
    const [revenueData, regionalData] = await Promise.all([
      getRevenueReport(),
      getRegionalReport(),
    ]);

    const combinedData = [
      ...revenueData.map((r) => ({ type: "defaulter_trend", ...r })),
      ...regionalData.map((r) => ({ type: "regional_defaulters", ...r })),
    ];

    const analysis = await analyzeReportData("Defaulters", combinedData);
    const narrative = await generateReportNarrative("Defaulters", combinedData);

    return {
      success: true,
      data: {
        ...analysis,
        narrative,
      },
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      success: false,
      error: "Failed to analyze defaulters report",
    };
  }
};

export const generateConsumptionReportPDF = async () => {
  try {
    // This would use consumption data - placeholder for now
    return {
      success: true,
      data: {
        title: "Consumption Report",
        subtitle: "Utility Consumption Analysis",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        summary: [],
        sections: [],
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to generate consumption report",
    };
  }
};

export const generateCustomerReportPDF = async () => {
  try {
    // This would use customer data - placeholder for now
    return {
      success: true,
      data: {
        title: "Customer Report",
        subtitle: "Customer Analytics and Insights",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        summary: [],
        sections: [],
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to generate customer report",
    };
  }
};

export const generateDefaultersReportPDF = async () => {
  try {
    // This would use defaulter data - placeholder for now
    return {
      success: true,
      data: {
        title: "Defaulters Report",
        subtitle: "Outstanding Payments Analysis",
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        summary: [],
        sections: [],
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to generate defaulters report",
    };
  }
};
