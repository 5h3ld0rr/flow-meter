"use client";

import { Button, Input, Modal, toast } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { updateMeter } from "@/lib/actions/meters";
import { ModalRef } from "@/components/ui/Modal";

export const EditMeterForm = ({ meter }: { meter: Meter }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<ModalRef>(null);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await updateMeter(meter.meter_id, formData);

    if (result.success) {
      router.back();
      router.refresh();
    }
    toast(result.success ? "success" : "error", result.message);
    setIsLoading(false);
  };

  return (
    <Modal
      title="Edit Meter"
      size="lg"
      expectedPath={`/UMS/Meters/${meter.meter_id}/Edit`}
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="serial_number"
            label="Serial Number"
            placeholder="ELC-2024-001"
            defaultValue={meter.serial_number}
            required
          />
          <Input
            name="utility_type"
            label="Utility Type"
            type="select"
            defaultValue={meter.utility_type}
            required
            options={[
              { value: "electricity", label: "Electricity" },
              { value: "water", label: "Water" },
              { value: "gas", label: "Gas" },
            ]}
          />
          <Input
            name="location"
            label="Location"
            placeholder="123 Main St"
            defaultValue={meter.location}
            required
          />
          <Input
            name="install_date"
            label="Install Date"
            type="date"
            defaultValue={meter.install_date.toString().split("T")[0]}
            required
          />
        </div>

        <Input
          name="status"
          label="Status"
          type="select"
          defaultValue={meter.status}
          required
          options={[
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "maintenance", label: "Maintenance" },
          ]}
        />
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Meter"}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => modalRef.current?.close()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
