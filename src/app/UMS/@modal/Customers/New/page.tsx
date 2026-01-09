"use client";

import { Button, Input, Modal, ModalRef, toast } from "@/components/ui";
import { createCustomer } from "@/lib/actions/customers";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";

export default function Page() {
  const router = useRouter();
  const modalRef = useRef<ModalRef>(null);

  const [state, action, isPending] = useActionState(createCustomer, undefined);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        modalRef.current?.close();
        router.refresh();
      }
      toast(state.success ? "success" : "error", state.message);
    }
  }, [state, router]);

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      title="Add New Customer"
      size="lg"
      expectedPath="/UMS/Customers/New"
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" action={action}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="John Doe" required />
          <Input
            label="Email"
            type="email"
            placeholder="john@email.com"
            required
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+94 77 567 8900"
            required
          />
          <Input label="Customer ID" placeholder="Auto-generated" disabled />
        </div>
        <Input
          label="Address"
          placeholder="123 Main Street, City, State"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Utility Services
          </label>
          <div className="flex gap-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Electricity
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Water
              </span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Gas
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Customer"}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => modalRef.current?.close()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
