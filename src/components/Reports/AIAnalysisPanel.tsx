"use client";

import { useState } from "react";
import { Button, GlassCard } from "@/components/ui";
import { Sparkles, Loader2, TrendingUp, Lightbulb, Target } from "lucide-react";
import { toast } from "sonner";
import type { AnalysisResult } from "@/lib/utils/ai-analyzer";

interface AIAnalysisPanelProps {
  reportType: "revenue" | "consumption" | "customers" | "defaulters";
}

export const AIAnalysisPanel = ({ reportType }: AIAnalysisPanelProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [narrative, setNarrative] = useState<string>("");

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const {
        analyzeRevenueReport,
        analyzeConsumptionReport,
        analyzeCustomerReport,
        analyzeDefaultersReport,
      } = await import("@/lib/actions/reports");

      let result;
      switch (reportType) {
        case "revenue":
          result = await analyzeRevenueReport();
          break;
        case "consumption":
          result = await analyzeConsumptionReport();
          break;
        case "customers":
          result = await analyzeCustomerReport();
          break;
        case "defaulters":
          result = await analyzeDefaultersReport();
          break;
        default:
          result = await analyzeRevenueReport();
      }

      if (result.success && result.data) {
        setAnalysis({
          insights: result.data.insights,
          recommendations: result.data.recommendations,
          trends: result.data.trends,
          summary: result.data.summary,
        });
        setNarrative(result.data.narrative || "");
        toast.success("AI analysis completed!");
      } else {
        toast.error(result.error || "Failed to analyze report");
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to generate AI analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-purple-500 dark:text-[#51a2ff]" size={20} />
          AI-Powered Analysis
        </h3>
        <Button
          variant="primary"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze Report
            </>
          )}
        </Button>
      </div>

      {!analysis && !isAnalyzing && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Sparkles size={48} className="mx-auto mb-4 opacity-30" />
          <p>
            Click &quot;Analyze Report&quot; to get AI-powered insights and
            recommendations
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <Loader2
            size={48}
            className="mx-auto mb-4 animate-spin text-purple-500 dark:text-[#51a2ff]"
          />
          <p className="text-gray-600 dark:text-gray-400">
            AI is analyzing your report data...
          </p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          {/* Executive Summary */}
          {narrative && (
            <div className="bg-linear-to-r from-purple-50 to-blue-50 dark:from-[#51a2ff]/10 dark:to-[#51a2ff]/5 p-4 rounded-lg border border-purple-200 dark:border-[#51a2ff]/30">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Executive Summary
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {narrative}
              </p>
            </div>
          )}

          {/* Key Insights */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Lightbulb
                className="text-yellow-500 dark:text-[#51a2ff]"
                size={18}
              />
              Key Insights
            </h4>
            <ul className="space-y-2">
              {analysis.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-purple-500 dark:text-[#51a2ff] mt-1">
                    •
                  </span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Trends */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp
                className="text-green-500 dark:text-[#51a2ff]"
                size={18}
              />
              Identified Trends
            </h4>
            <ul className="space-y-2">
              {analysis.trends.map((trend, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-green-500 dark:text-[#51a2ff] mt-1">
                    •
                  </span>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target className="text-blue-500 dark:text-[#51a2ff]" size={18} />
              Recommendations
            </h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-blue-500 dark:text-[#51a2ff] mt-1">
                    •
                  </span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </GlassCard>
  );
};
