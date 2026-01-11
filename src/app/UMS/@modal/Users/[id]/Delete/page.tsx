"use client";

import { Button, Modal, ModalRef, toast } from "@/components/ui";
import { useRouter } from "next/navigation";
import { use, useRef, useState } from "react";
import { deleteUser } from "@/lib/actions/users";
import { AlertTriangle } from "lucide-react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<ModalRef>(null);
  const { id: userId } = use(params);

  const handleClose = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const result = await deleteUser(userId);
      if (result.success) {
        modalRef.current?.close();
        router.refresh();
      }
      toast(result.success ? "success" : "error", result.message);
    } catch {
      toast("error", "An error occurred while deleting the customer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Delete User"
      size="md"
      expectedPath={`/UMS/Users/${userId}/Delete`}
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
          Are you sure you want to delete this user? All associated data will be
          permanently removed.
        </p>

        <div className="flex gap-3 pt-4">
          <Button
            variant="danger"
            fullWidth
            onClick={handleDelete}
            loading={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete User"}
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
