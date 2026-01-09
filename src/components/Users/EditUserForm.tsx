"use client";

import { Button, Input, Modal, ModalRef } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { updateUserAction } from "@/lib/actions/users";
import { toast } from "sonner";

export const EditUserForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const modalRef = useRef<ModalRef>(null);

  const [state, action, isPending] = useActionState(
    updateUserAction,
    undefined
  );

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        modalRef.current?.close();
        router.refresh();
      }
      toast[state.success ? "success" : "error"](state.message);
    }
  }, [state, router]);

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      title="Edit User"
      size="lg"
      expectedPath={`/UMS/Users/${user.id}/Edit`}
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" action={action}>
        <input type="hidden" name="userId" value={user.id} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="full_name"
            label="Full Name"
            placeholder="John Doe"
            defaultValue={user.full_name}
            required
          />
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="john@email.com"
            defaultValue={user.email}
            required
          />
          <Input
            name="employee_id"
            label="Employee ID"
            defaultValue={user.employee_id}
            disabled
          />
          <Input
            name="role"
            label="Role"
            defaultValue={user.role}
            type="select"
            required
            options={[
              { value: "admin", label: "Admin" },
              { value: "staff", label: "Staff" },
              { value: "officer", label: "Officer" },
              { value: "cashier", label: "Cashier" },
              { value: "manager", label: "Manager" },
            ]}
          />
          <Input
            name="password"
            label="New Password (optional)"
            type="password"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update User"}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            type="button"
            onClick={() => modalRef.current?.close()}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
