"use client";

import { Button, Input, Modal, ModalRef, toast } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { updateCustomer } from "@/lib/actions/customers";

export const EditCustomerForm = ({ customer }: { customer: Customer }) => {
  const router = useRouter();
  const modalRef = useRef<ModalRef>(null);

  const [state, action, isPending] = useActionState(updateCustomer, undefined);

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
      title="Edit Customer"
      size="lg"
      expectedPath={`/UMS/Customers/${customer.customer_id}/Edit`}
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" action={action}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            name="name"
            label="Full Name"
            placeholder="John Doe"
            defaultValue={customer.name}
            required
          />
          <Input
            name="email"
            label="Email"
            type="email"
            placeholder="john@email.com"
            defaultValue={customer.email}
            required
          />
          <Input
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+1 234 567 8900"
            defaultValue={customer.phone}
            required
          />
          <Input
            name="customer_id"
            label="Customer ID"
            defaultValue={customer.customer_id}
            readOnly
          />
          <Input
            name="type"
            label="Customer Type"
            type="select"
            options={[
              { value: "household", label: "Household" },
              { value: "business", label: "Business" },
              { value: "government", label: "Government" },
            ]}
            defaultValue={customer.type}
            required
          />
        </div>
        <Input
          name="address"
          label="Address"
          placeholder="123 Main Street, City, State"
          defaultValue={customer.address}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button
            variant="primary"
            type="submit"
            fullWidth
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Customer"}
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
};
