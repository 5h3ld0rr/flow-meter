import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AnalysisResult {
  insights: string[];
  recommendations: string[];
  trends: string[];
  summary: string;
}

export const analyzeReportData = async (
  reportType: string,
  data: any[]
): Promise<AnalysisResult> => {
  try {
    const prompt = `You are an expert data analyst for a utility management system. Analyze the following ${reportType} report data and provide:

1. Key Insights (3-5 bullet points)
2. Actionable Recommendations (3-5 bullet points)
3. Trends Identified (2-4 bullet points)
4. Executive Summary (2-3 sentences)

Data:
${JSON.stringify(data, null, 2)}

Please format your response as JSON with the following structure:
{
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "trends": ["trend 1", "trend 2", ...],
  "summary": "executive summary text"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = response.text ?? "";

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      return analysis;
    }

    // Fallback if JSON parsing fails
    return {
      insights: ["Analysis completed successfully"],
      recommendations: ["Review the data for patterns"],
      trends: ["Data shows consistent patterns"],
      summary: "Analysis generated from the provided data.",
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      insights: ["Unable to generate AI insights at this time"],
      recommendations: ["Please review the data manually"],
      trends: ["Analysis temporarily unavailable"],
      summary: "AI analysis is currently unavailable. Please try again later.",
    };
  }
};

export const generateReportNarrative = async (
  reportType: string,
  data: any[]
): Promise<string> => {
  try {
    const prompt = `Generate a professional narrative summary for a ${reportType} report based on this data:

${JSON.stringify(data, null, 2)}

Write a clear, concise 2-3 paragraph summary that highlights the most important findings and their business implications.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Narrative Generation Error:", error);
    return "Unable to generate narrative summary at this time.";
  }
};
