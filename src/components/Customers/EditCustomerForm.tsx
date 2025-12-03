"use client";

import { Button, Input, Modal, ModalRef } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { updateCustomer } from "@/lib/actions/customers";
import { toast } from "sonner";

export function EditCustomerForm({ customer }: { customer: Customer }) {
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

    try {
      const result = await updateCustomer(customer.customer_id, formData);

      if (result.success) {
        toast.success("Customer updated successfully");
        router.push("/UMS/Customers");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update customer");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Customer"
      size="lg"
      expectedPath={`/UMS/Customers/${customer.customer_id}/Edit`}
      onClose={handleClose}
      ref={modalRef}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
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
            disabled
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
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Customer"}
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
