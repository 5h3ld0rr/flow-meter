"use client";

import { Button, Modal, ModalRef } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { deleteCustomer } from "@/lib/actions/customers";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const modalRef = useRef<ModalRef>(null);

  // Unwrap params
  params.then((p) => setCustomerId(p.id));

  const handleClose = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!customerId) return;

    setIsLoading(true);

    try {
      const result = await deleteCustomer(customerId);

      if (result.success) {
        toast.success("Customer deleted successfully");
        router.push("/UMS/Customers");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete customer");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Customer"
      size="md"
      expectedPath={`/UMS/Customers/${customerId}/Delete`}
      onClose={handleClose}
      ref={modalRef}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-100">
              Warning
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this customer? All associated data,
          including meters, readings, and billing information will be
          permanently removed.
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="danger"
            fullWidth
            onClick={handleDelete}
            loading={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete Customer"}
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
      </div>
    </Modal>
  );
}
