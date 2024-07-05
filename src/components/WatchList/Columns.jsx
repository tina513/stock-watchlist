import { DollarSign, Percent } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import RowDeleteHandleCell from "./RowDeleteHandleCell";

export const Columns = [
  {
    accessorKey: "ticker",
    header: () => <div className="text-center">Ticker</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-left flex items-center">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "last_close",
    header: () => <div className="text-left">Last Close Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("last_close"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-left font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "price_change",
    header: ({ table }) => (
      <div className="text-left flex items-center">
        <span className="mr-1">Price Change</span>
        <ToggleGroup
          size={"sm"}
          type="single"
          defaultValue="dollar"
          onValueChange={(value) =>
            table.setState((c) => ({ ...c, priceDiffUnit: value }))
          }
        >
          <ToggleGroupItem value="dollar" aria-label="Toggle dollar">
            <DollarSign className="h-4 w-4" />
          </ToggleGroupItem>
          <span>/</span>
          <ToggleGroupItem value="percent" aria-label="Toggle percent">
            <Percent className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    ),
    cell: ({ row, table }) => {
      const unit = table.options?.state?.priceDiffUnit;
      const price = parseFloat(row.getValue("price"));
      const lastClose = parseFloat(row.getValue("last_close"));
      const priceDiff = price - lastClose;
      const formattedPriceDiff =
        unit === "percent"
          ? new Intl.NumberFormat("en-US", {
              style: "percent",
              maximumFractionDigits: 2,
            }).format(priceDiff / lastClose)
          : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 2,
            }).format(priceDiff);

      return (
        <div
          className={`text-left font-medium ${
            priceDiff > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {formattedPriceDiff}
        </div>
      );
    },
  },
  {
    id: "remove_ticker",
    cell: ({ row }) => <RowDeleteHandleCell ticker={row.original.ticker} />,
  },
];
