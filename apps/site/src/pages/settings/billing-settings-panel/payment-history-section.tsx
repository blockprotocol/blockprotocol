import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  FunctionComponent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Stripe from "stripe";

import { Link } from "../../../components/link";
import { LinkButton } from "../../../components/link-button";
import {
  getDateFromStripeDate,
  internalApi,
} from "../../../lib/internal-api-client";
import {
  dateToHumanReadable,
  priceToHumanReadable,
} from "../../shared/subscription-utils";

const tableBorderColor = "#F1F3F6";

const Chip: FunctionComponent<{
  color: "purple" | "gray";
  children: ReactNode;
}> = ({ color, children }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderColor: ({ palette }) =>
        color === "purple" ? palette.purple[50] : palette.gray[20],
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: "7px",
    }}
  >
    <Typography
      sx={{
        color: ({ palette }) =>
          color === "purple" ? palette.purple[70] : palette.gray[50],
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {children}
    </Typography>
  </Box>
);

const TableCell = styled(MuiTableCell)(({ theme }) =>
  theme.unstable_sx({
    borderBottomWidth: 0,
    "&:not(:last-child)": {
      borderRightWidth: 1,
      borderRightColor: tableBorderColor,
      borderRightStyle: "solid",
    },
    fontSize: 14,
    padding: theme.spacing(1, 2),
  }),
);

export const PaymentHistorySection: FunctionComponent<{
  userHasStripeSubscription: boolean;
}> = ({ userHasStripeSubscription }) => {
  const [upcomingInvoice, setUpcomingInvoice] =
    useState<Stripe.UpcomingInvoice>();
  const [invoices, setInvoices] = useState<Stripe.Invoice[]>();

  const fetchInvoices = useCallback(async () => {
    const {
      data: { invoices: fetchedInvoices },
    } = await internalApi.getInvoices();

    setInvoices(fetchedInvoices.sort((a, b) => b.created - a.created));
  }, [setInvoices]);

  const fetchUpcomingInvoice = useCallback(async () => {
    const {
      data: { upcomingInvoice: fetchedUpcomingInvoice },
    } = await internalApi.getUpcomingInvoice();

    setUpcomingInvoice(fetchedUpcomingInvoice);
  }, [setUpcomingInvoice]);

  useEffect(() => {
    if (userHasStripeSubscription) {
      void fetchInvoices();
      void fetchUpcomingInvoice();
    }
  }, [fetchInvoices, fetchUpcomingInvoice, userHasStripeSubscription]);

  const allInvoices = useMemo<(Stripe.Invoice | Stripe.UpcomingInvoice)[]>(
    () =>
      upcomingInvoice ? [upcomingInvoice, ...(invoices ?? [])] : invoices ?? [],
    [upcomingInvoice, invoices],
  );

  return (
    <>
      <Typography
        variant="bpHeading2"
        sx={{ fontSize: 28, fontWeight: 400, marginBottom: 1 }}
      >
        Payment History
      </Typography>
      <Typography
        component="p"
        variant="bpSmallCopy"
        sx={{
          color: ({ palette }) => palette.gray[90],
          opacity: 0.66,
          marginBottom: 2,
        }}
      >
        {!userHasStripeSubscription || allInvoices.length === 0
          ? "No upcoming or previous payments could be found"
          : "Upcoming and historical bills you’ve incurred on this account"}
      </Typography>
      {allInvoices.length > 0 ? (
        <>
          <Table
            sx={{
              minWidth: 650,
              borderColor: tableBorderColor,
              borderWidth: 1,
              borderStyle: "solid",
              marginBottom: 2,
            }}
          >
            <TableHead
              sx={{
                borderBottomWidth: 1,
                borderBottomColor: tableBorderColor,
                borderBottomStyle: "solid",
              }}
            >
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Invoice Date</TableCell>
                <TableCell>Invoice ID</TableCell>
                <TableCell>Invoice Total</TableCell>
                <TableCell sx={{ width: 175 }}>Download As</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allInvoices.map((invoice) => {
                const isUpcomingInvoice = !("id" in invoice);

                const invoiceStatus = isUpcomingInvoice
                  ? "pending"
                  : invoice.status ?? "unknown";

                const invoiceId = isUpcomingInvoice
                  ? "-"
                  : `#${invoice.number}`;

                const capitalizedInvoiceStatus = `${invoiceStatus[0]?.toUpperCase()}${invoiceStatus.slice(
                  1,
                )}`;

                const invoiceDateStripeDate = isUpcomingInvoice
                  ? invoice.next_payment_attempt
                  : invoice.created;

                const invoiceDate = getDateFromStripeDate(
                  invoiceDateStripeDate ?? 0,
                );

                const formattedInvoiceDate = dateToHumanReadable(
                  invoiceDate,
                  "-",
                  true,
                );

                const invoicePrice = priceToHumanReadable({
                  amountInCents: invoice.amount_due,
                  currency: invoice.currency,
                });

                const availableOnFormattedDate = new Intl.DateTimeFormat(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                  },
                ).format(invoiceDate);

                return (
                  <TableRow key={invoiceId}>
                    <TableCell sx={{ position: "relative" }}>
                      {invoice.status ? (
                        <Chip
                          color={invoice.status === "paid" ? "purple" : "gray"}
                        >
                          {capitalizedInvoiceStatus}
                        </Chip>
                      ) : null}
                    </TableCell>
                    <TableCell>{formattedInvoiceDate}</TableCell>
                    <TableCell>{invoiceId}</TableCell>
                    <TableCell>
                      {invoicePrice}
                      {isUpcomingInvoice ? (
                        <Box
                          component="span"
                          sx={{ color: ({ palette }) => palette.gray[50] }}
                        >
                          {" "}
                          to date
                        </Box>
                      ) : undefined}
                    </TableCell>
                    <TableCell
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {invoice.invoice_pdf ? (
                        <LinkButton
                          target="_blank"
                          rel="noopener noreferrer"
                          href={invoice.invoice_pdf}
                          squared
                          variant="secondary"
                          size="small"
                          sx={{ fontSize: 13 }}
                        >
                          PDF
                        </LinkButton>
                      ) : (
                        <Chip color="gray">
                          {isUpcomingInvoice
                            ? `Available ${availableOnFormattedDate}`
                            : "Unavailable"}
                        </Chip>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Box display="flex" justifyContent="space-between">
            <Typography
              component="p"
              variant="bpSmallCopy"
              sx={{
                color: ({ palette }) => palette.gray[90],
                opacity: 0.66,
                marginBottom: 2,
              }}
            >
              Questions about your bill, or can’t pay by card?{" "}
              <Link href="/contact">Contact us</Link>
            </Typography>
            <Typography
              component="p"
              variant="bpSmallCopy"
              sx={{
                color: ({ palette }) => palette.gray[90],
                opacity: 0.66,
                marginBottom: 2,
              }}
            >
              Trying to cancel or downgrade?{" "}
              <Link href="/contact">Contact us</Link>
            </Typography>
          </Box>
        </>
      ) : null}
    </>
  );
};
