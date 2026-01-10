"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, GlassCard, Input } from "@/components/ui";
import { Camera, Save } from "lucide-react";
import { verifyMeterIdAction } from "@/lib/actions/meters";
import { createReading } from "@/lib/actions/readings";
import { toast } from "sonner";
import { UTILITIES } from "@/constants";

interface ReadingFormProps {
  initialMeterId?: string;
}

export const ReadingForm = ({ initialMeterId }: ReadingFormProps) => {
  const [meterId, setMeterId] = useState(initialMeterId || "");
  const [currentReading, setCurrentReading] = useState("");
  const [meterDetails, setMeterDetails] = useState<{
    customerName?: string;
    location?: string;
    utilityType?: string;
    previousReading?: number | null;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateMeter = useCallback(
    async (id: string) => {
      if (!id) return;

      setIsLoading(true);
      const result = await verifyMeterIdAction(id);
      setIsLoading(false);

      if (result.success && result.data) {
        setMeterDetails({
          customerName: result.data.customer_name,
          location: result.data.location,
          utilityType: result.data.utility_type,
          previousReading: result.data.last_reading_value,
        });
        if (!initialMeterId) {
          // Only toast if manual entry, otherwise it might be annoying on page load,
          // but actually it's good confirmation. Let's keep it or maybe dampen it.
          // Keeping it for now as user feedback is good.
          toast.success("Meter found: " + result.data.customer_name);
        }
      } else {
        setMeterDetails(null);
        if (initialMeterId)
          toast.error(result.error || "Invalid Meter ID from URL");
        else toast.error(result.error || "Invalid Meter ID");
      }
    },
    [initialMeterId]
  );

  useEffect(() => {
    if (initialMeterId) {
      validateMeter(initialMeterId);
    }
  }, [initialMeterId, validateMeter]);

  const handleMeterIdBlur = async () => {
    if (meterId && meterId !== initialMeterId) {
      // Avoid re-validating if unchanged from initial
      // actually we should validate current value
      await validateMeter(meterId);
    } else if (meterId && !meterDetails) {
      await validateMeter(meterId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meterDetails || !currentReading) return;

    setIsSubmitting(true);
    try {
      const result = await createReading({
        meter_id: meterId,
        reading_value: parseFloat(currentReading),
        reading_date: new Date(),
      });

      if (result.success) {
        toast.success("Reading submitted successfully");
        // Reset form
        setMeterId("");
        setCurrentReading("");
        setMeterDetails(null);
      } else {
        toast.error(result.error || "Failed to submit reading");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUnit = () => {
    if (!meterDetails?.utilityType) return "";
    const utility =
      UTILITIES[meterDetails.utilityType as keyof typeof UTILITIES];
    return utility ? utility.unit : "";
  };

  const calculateConsumption = () => {
    if (
      !currentReading ||
      meterDetails?.previousReading === undefined ||
      meterDetails.previousReading === null
    )
      return "-";
    const current = parseFloat(currentReading);
    const previous = meterDetails.previousReading;
    const diff = current - previous;
    return diff >= 0 ? diff.toFixed(2) : "Invalid";
  };

  const unit = getUnit();

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        New Reading Entry
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Meter ID"
          placeholder="Scan or enter meter ID"
          required
          value={meterId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMeterId(e.target.value)
          }
          onBlur={handleMeterIdBlur}
          disabled={isLoading || isSubmitting}
          icon={
            isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600" />
            ) : undefined
          }
        />

        <div className="glass rounded-lg p-4 space-y-2 text-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Customer:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {meterDetails ? meterDetails.customerName : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Location:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {meterDetails ? meterDetails.location : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Type:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {meterDetails ? meterDetails.utilityType : "-"}
            </span>
          </div>
        </div>

        <Input
          label={`Current Reading (${unit})`}
          type="number"
          placeholder="Enter current reading"
          required
          value={currentReading}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCurrentReading(e.target.value)
          }
          disabled={!meterDetails || isSubmitting}
        />

        <div className="glass rounded-lg p-4 relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Previous Reading
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {meterDetails?.previousReading !== undefined &&
              meterDetails?.previousReading !== null
                ? `${meterDetails.previousReading} ${unit}`
                : `- ${unit}`}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current Reading
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {currentReading ? `${currentReading} ${unit}` : `- ${unit}`}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Consumption
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-cyan-400">
              {calculateConsumption()} {unit}
            </span>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button
            variant="secondary"
            fullWidth
            icon={<Camera size={18} />}
            type="button"
          >
            Scan Meter
          </Button>
          <Button
            variant="primary"
            fullWidth
            icon={<Save size={18} />}
            disabled={!meterDetails || !currentReading || isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Submit Reading"}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};
