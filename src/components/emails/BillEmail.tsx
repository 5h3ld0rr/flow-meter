import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

interface BillEmailProps {
  customerName: string;
  billId: string;
  amount: number;
  dueDate: string;
  billingPeriodStart?: string;
  billingPeriodEnd?: string;
  consumption?: number;
  tariffRate?: number;
  baseAmount?: number;
  taxAmount?: number;
  utilityType?: string;
}

export const BillEmail = ({
  customerName,
  billId,
  amount,
  dueDate,
  billingPeriodStart,
  billingPeriodEnd,
  consumption,
  tariffRate,
  baseAmount,
  taxAmount,
  utilityType,
}: BillEmailProps) => {
  const getUsageLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "electricity":
        return "Electricity Usage";
      case "water":
        return "Water Usage";
      case "gas":
        return "Gas Usage";
      default:
        return "Usage";
    }
  };

  const getUnitLabel = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "electricity":
        return "kWh";
      case "water":
        return "Liters";
      case "gas":
        return "m³";
      default:
        return "units";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>
        Your {utilityType || "utility"} bill {billId} is ready - Amount Due: Rs.{" "}
        {amount.toFixed(2)}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>
              FlowMeter
              <br />
              {utilityType
                ? `${
                    utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
                  } Bill`
                : "Utility Bill"}
            </Heading>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Dear {customerName},</Text>
            <Text style={paragraph}>
              Your {utilityType || "utility"} bill for the current billing
              period is now available. Please find the details below:
            </Text>

            <Section style={billCard}>
              <Row style={billRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Bill ID:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={value}>{billId}</Text>
                </Column>
              </Row>

              {utilityType && (
                <Row style={billRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Utility Type:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>
                      {utilityType.charAt(0).toUpperCase() +
                        utilityType.slice(1)}
                    </Text>
                  </Column>
                </Row>
              )}

              {billingPeriodStart && billingPeriodEnd && (
                <Row style={billRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Billing Period:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>
                      {billingPeriodStart} - {billingPeriodEnd}
                    </Text>
                  </Column>
                </Row>
              )}

              {consumption !== undefined && (
                <Row style={billRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>{getUsageLabel(utilityType)}:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>
                      {consumption.toFixed(2)} {getUnitLabel(utilityType)}
                    </Text>
                  </Column>
                </Row>
              )}

              {tariffRate !== undefined && (
                <Row style={billRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Tariff Rate:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>
                      Rs. {tariffRate.toFixed(2)}/{getUnitLabel(utilityType)}
                    </Text>
                  </Column>
                </Row>
              )}

              {baseAmount !== undefined && (
                <Row style={billRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Base Amount:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>Rs. {baseAmount.toFixed(2)}</Text>
                  </Column>
                </Row>
              )}

              {taxAmount !== undefined && (
                <Row style={billRow}>
                  <Column style={labelColumn}>
                    <Text style={label}>Tax:</Text>
                  </Column>
                  <Column style={valueColumn}>
                    <Text style={value}>Rs. {taxAmount.toFixed(2)}</Text>
                  </Column>
                </Row>
              )}

              <Hr style={divider} />

              <Row style={billRow}>
                <Column style={labelColumn}>
                  <Text style={totalLabel}>Total Amount:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={totalValue}>Rs. {amount.toFixed(2)}</Text>
                </Column>
              </Row>

              <Row style={billRow}>
                <Column style={labelColumn}>
                  <Text style={label}>Due Date:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={dueDateValue}>{dueDate}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={paragraph}>
              Please ensure payment is made before the due date to avoid any
              late fees or service interruption.
            </Text>

            <Text style={footer}>
              If you have any questions or concerns about this bill, please
              contact our customer service team.
            </Text>

            <Text style={footer}>Thank you for your prompt payment.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BillEmail;

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#2563eb",
  padding: "24px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const content = {
  padding: "0 48px",
};

const greeting = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
  marginTop: "24px",
  color: "#1f2937",
  fontWeight: "600",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#4b5563",
  marginBottom: "16px",
};

const billCard = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "24px",
  marginTop: "24px",
  marginBottom: "24px",
  border: "1px solid #e5e7eb",
};

const billRow = {
  marginBottom: "12px",
};

const labelColumn = {
  width: "40%",
  verticalAlign: "top" as const,
};

const valueColumn = {
  width: "60%",
  verticalAlign: "top" as const,
};

const label = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
  padding: "0",
};

const value = {
  fontSize: "14px",
  color: "#1f2937",
  margin: "0",
  padding: "0",
  fontWeight: "500",
};

const totalLabel = {
  fontSize: "16px",
  color: "#1f2937",
  margin: "0",
  padding: "0",
  fontWeight: "700",
};

const totalValue = {
  fontSize: "18px",
  color: "#2563eb",
  margin: "0",
  padding: "0",
  fontWeight: "700",
};

const dueDateValue = {
  fontSize: "14px",
  color: "#dc2626",
  margin: "0",
  padding: "0",
  fontWeight: "600",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "16px 0",
};

const footer = {
  fontSize: "12px",
  lineHeight: "20px",
  color: "#6b7280",
  marginTop: "16px",
};
