"use client";

import { Button } from "@/components/ui";
import { Download, Printer } from "lucide-react";

export const BillActions = () => {
    return (
        <div className="flex gap-4 justify-end">
            <Button variant="secondary" onClick={() => window.print()}>
                <Printer size={18} className="mr-2" />
                Print
            </Button>
            <Button
                variant="primary"
                onClick={() => alert("PDF Download not implemented yet")}
            >
                <Download size={18} className="mr-2" />
                Download PDF
            </Button>
        </div>
    );
};
