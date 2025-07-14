import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { Button, ConfigProvider } from "antd";
import { createStyles } from "antd-style";
import { fetchPrices } from "../../api/ServiceApi";

import type { ServicePrice } from "../../types/services";
import AddPriceForm from "../Master/AddPriceForm";

interface Column<T = ServicePrice> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: T[keyof T]) => string;
}

const columns: Column[] = [
  { id: "serviceCode", label: "Service Code", minWidth: 120 },
  { id: "pkgUniqueId", label: "Package ID", minWidth: 100 },
  { id: "uniqueId", label: "Unique ID", minWidth: 100 },
  {
    id: "actualPrice",
    label: "Price",
    minWidth: 100,
    align: "right",
    format: (value) => `₹${value}`,
  },
  {
    id: "showoffPrice",
    label: "Showoff Price",
    minWidth: 120,
    align: "right",
  },
  {
    id: "offerDiscount",
    label: "Offer Discount (%)",
    minWidth: 120,
    align: "right",
  },
  {
    id: "minDiscount",
    label: "Min Discount (%)",
    minWidth: 100,
    align: "right",
  },
  {
    id: "maxDiscount",
    label: "Max Discount (%)",
    minWidth: 100,
    align: "right",
  },
  {
    id: "specialDiscount",
    label: "Special Discount (%)",
    minWidth: 130,
    align: "right",
  },
  {
    id: "offerCode",
    label: "Offer Code",
    minWidth: 120,
  },
  {
    id: "priceType",
    label: "Price Type",
    minWidth: 100,
    format: (value) => (value ? "Fixed" : "Hourly"),
  },
  {
    id: "priceActiveStatus",
    label: "Status",
    minWidth: 100,
    format: (value) => (value ? "Active" : "Inactive"),
  },
  {
    id: "offerStart",
    label: "Offer Start",
    minWidth: 120,
    format: (value) =>
      value ? new Date(value as string | Date).toLocaleDateString("en-IN") : "-",
  },
  {
    id: "offerEnd",
    label: "Offer End",
    minWidth: 120,
    format: (value) =>
      value ? new Date(value as string | Date).toLocaleDateString("en-IN") : "-",
  },
  {
    id: "minPersonRequired",
    label: "Staff",
    minWidth: 80,
    align: "right",
  },
  {
    id: "proportionalChargesExtraHours",
    label: "Extra Hour Charge",
    minWidth: 150,
    align: "right",
  },
  {
    id: "proportionalExtraHours",
    label: "Proportional Hours",
    minWidth: 150,
    align: "right",
  },
];

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, rgb(188, 226, 127), #BCE27F);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const PriceList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [prices, setPrices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const { styles } = useStyle();

  useEffect(() => {
    fetchPrices()
      .then((res) => {
        setPrices(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching prices:", err);
      });
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddPrice = () => setShowPriceForm(true);
  const handlePriceFormClose = () => setShowPriceForm(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px",
        }}
      >
        <h3>Price Listing</h3>
        <ConfigProvider button={{ className: styles.linearGradientButton }}>
          <Button
            style={{ backgroundColor: "#88E788", color: "whitesmoke" }}
            onClick={handleAddPrice}
          >
            Add Prices
          </Button>
        </ConfigProvider>
      </div>

      {showPriceForm ? (
        <AddPriceForm
          onBack={handlePriceFormClose}
          onSuccess={() => {
            handlePriceFormClose();
          }}
        />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="price table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id as string}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#C3C3C3",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {prices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((price, index) => (
                    <TableRow hover tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = price[column.id];
                        let displayValue: React.ReactNode = "-";

                        if (column.format && value !== null && value !== undefined) {
                          displayValue = column.format(value);
                        } else if (value instanceof Date) {
                          displayValue = value.toLocaleDateString("en-IN");
                        } else if (value !== null && value !== undefined) {
                          displayValue = value.toString();
                        }

                        return (
                          <TableCell key={column.id as string} align={column.align}>
                            {displayValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 100]}
            component="div"
            count={prices.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default PriceList;
