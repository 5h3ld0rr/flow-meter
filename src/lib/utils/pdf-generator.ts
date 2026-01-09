import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
  title: string;
  subtitle?: string;
  date: string;
  sections: ReportSection[];
  summary?: {
    label: string;
    value: string;
  }[];
}

interface ReportSection {
  title: string;
  type: "table" | "text" | "chart";
  data?: any[];
  columns?: { header: string; dataKey: string }[];
  content?: string;
}

export const generatePDF = (reportData: ReportData): jsPDF => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(75, 46, 131); // Purple
  doc.text(reportData.title, 20, yPosition);
  yPosition += 10;

  if (reportData.subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(reportData.subtitle, 20, yPosition);
    yPosition += 8;
  }

  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on: ${reportData.date}`, 20, yPosition);
  yPosition += 15;

  // Summary Section
  if (reportData.summary && reportData.summary.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", 20, yPosition);
    yPosition += 8;

    reportData.summary.forEach((item) => {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${item.label}:`, 20, yPosition);
      doc.setTextColor(0, 0, 0);
      doc.text(item.value, 80, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }

  // Sections
  reportData.sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(section.title, 20, yPosition);
    yPosition += 8;

    if (section.type === "table" && section.data && section.columns) {
      autoTable(doc, {
        startY: yPosition,
        head: [section.columns.map((col) => col.header)],
        body: section.data.map((row) =>
          section.columns!.map((col) => row[col.dataKey] || "")
        ),
        theme: "striped",
        headStyles: {
          fillColor: [75, 46, 131],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [50, 50, 50],
        },
        alternateRowStyles: {
          fillColor: [245, 245, 250],
        },
        margin: { left: 20, right: 20 },
      });
      yPosition = (doc as any).lastAutoTable.finalY + 10;
    } else if (section.type === "text" && section.content) {
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      const splitText = doc.splitTextToSize(section.content, 170);
      doc.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 10;
    }
  });

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
    doc.text(
      "Flow Meter Management System",
      20,
      doc.internal.pageSize.height - 10
    );
  }

  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(filename);
};

export const getPDFBlob = (doc: jsPDF): Blob => {
  return doc.output("blob");
};
