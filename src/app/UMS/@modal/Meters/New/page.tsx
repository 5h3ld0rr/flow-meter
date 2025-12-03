"use client";

import { Button, Input, Modal, ModalRef } from "@/components/ui";
import { createMeter } from "@/lib/actions/meters";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useActionState } from "react";

export default function Page() {
  const router = useRouter();
  const modalRef = useRef<ModalRef>(null);

  const handleClose = () => {
    router.back();
  };
  const [state, action, isPending] = useActionState(createMeter, undefined);

  return (
    <Modal
      title="Add New Meter"
      size="lg"
      expectedPath="/UMS/Meters/New"
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" action={action}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Meter Type
            </label>
            <select className="w-full px-4 py-2.5 rounded-lg glass text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Electricity</option>
              <option>Water</option>
              <option>Gas</option>
            </select>
          </div>
          <Input label="Serial Number" placeholder="ELC-2024-XXX" required />
          <Input label="Customer ID" placeholder="C001" required />
          <Input label="Installation Date" type="date" required />
        </div>
        <Input label="Location" placeholder="123 Main Street, City" required />
        <Input label="Initial Reading" type="number" placeholder="0" required />

        <div className="flex gap-3 pt-4">
          <Button variant="primary" type="submit" fullWidth>
            Add Meter
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => modalRef.current?.close()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
