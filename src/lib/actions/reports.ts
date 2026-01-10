"use server";

import {
  getRevenueReport,
  getConsumptionReport,
  getCustomerReport,
  getDefaultersReport,
  getRevenueByUtilityType,
} from "@/lib/data/reports";
import {
  analyzeReportData,
  generateReportNarrative,
} from "@/lib/utils/ai-analyzer";

export const generateRevenueReportPDF = async () => {
  try {
    const [revenueData, utilityData] = await Promise.all([
      getRevenueReport(),
      getRevenueByUtilityType(),
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
            label: "Utility Types",
            value: utilityData.length.toString(),
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
            title: "Utility Performance",
            type: "table" as const,
            data: utilityData,
            columns: [
              { header: "Utility", dataKey: "utility_type" },
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
    const [revenueData, utilityData] = await Promise.all([
      getRevenueReport(),
      getRevenueByUtilityType(),
    ]);

    // Combine data into a single array for analysis
    const combinedData = [
      ...revenueData.map((r) => ({ type: "monthly_revenue", ...r })),
      ...utilityData.map((r) => ({ type: "utility_performance", ...r })),
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
    const [consumptionData, utilityData] = await Promise.all([
      getConsumptionReport(),
      getRevenueByUtilityType(),
    ]);

    const combinedData = [
      ...consumptionData.map((r) => ({ type: "consumption_trend", ...r })),
      ...utilityData.map((r) => ({ type: "utility_consumption", ...r })),
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
    const [customerData, utilityData] = await Promise.all([
      getCustomerReport(),
      getRevenueByUtilityType(),
    ]);

    const combinedData = [
      ...customerData.map((r) => ({ type: "customer_growth", ...r })),
      ...utilityData.map((r) => ({ type: "utility_customers", ...r })),
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
    const defaulterData = await getDefaultersReport();
    const topDefaulters = defaulterData.slice(0, 20); // Top 20 for analysis

    const combinedData = [
      ...topDefaulters.map((r) => ({ type: "top_defaulter", ...r })),
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
