"use client";

import { Button, Input, Modal, ModalRef } from "@/components/ui";
import { createUserAction } from "@/lib/actions/users";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Page() {
  const router = useRouter();
  const modalRef = useRef<ModalRef>(null);

  const [state, action, isPending] = useActionState(
    createUserAction,
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
      title="Add New User"
      size="md"
      expectedPath="/UMS/Users/New"
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" action={action}>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Full Name"
            name="full_name"
            placeholder="John Doe"
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@email.com"
            required
          />
          <Input
            label="Employee ID"
            name="employee_id"
            placeholder="EMP-2026-001"
            required
          />
          <Input
            label="Role"
            name="role"
            type="select"
            required
            options={[
              { value: "staff", label: "Staff (Standard Access)" },
              { value: "admin", label: "Administrator (Full Access)" },
              { value: "manager", label: "Manager" },
              { value: "officer", label: "Field Officer" },
              { value: "cashier", label: "Cashier" },
            ]}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password (min. 8 characters)"
            required
          />
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter password"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create User"}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            type="button"
            onClick={() => modalRef.current?.close()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
