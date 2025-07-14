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
import { fetchServices } from "../../api/ServiceApi";
import type { ServiceMaster } from "../../types/services";
import AddServiceForm from "../Master/AddServiceForm";

interface Column<T = ServiceMaster> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: T[keyof T]) => string;
}

const columns: Column[] = [
  { id: "serviceCode", label: "Code", minWidth: 100 },
  { id: "serviceName", label: "Name", minWidth: 150 },
  { id: "serviceCategory", label: "Category", minWidth: 130 },
  {
    id: "serviceActiveStatus",
    label: "Status",
    minWidth: 100,
    format: (value) => (value ? "Active" : "Inactive"),
  },
  { id: "showoffPriceTag", label: "Price Tag", minWidth: 100 },
  { id: "currentActivePrice", label: "Active Price", minWidth: 120 },
];

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }
      &::before {
        content: "";
        background: linear-gradient(135deg, #bce27f, #bce27f);
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        transition: all 0.3s;
        opacity: 1;
      }
      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const ServiceMasterList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [services, setServices] = useState<ServiceMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { styles } = useStyle();

  const fetchServiceList = () => {
    setLoading(true);
    fetchServices()
      .then((res) => {
        setServices(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error("Failed to fetch services:", err);
      });
  };

  useEffect(() => {
    fetchServiceList();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddClick = () => setShowForm(true);
  const handleFormClose = () => {
    setShowForm(false);
    fetchServiceList(); // Refresh list on successful add
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {!showForm && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 20,
          }}
        >
          <h3>Service Master List</h3>
          <ConfigProvider button={{ className: styles.linearGradientButton }}>
            <Button
              type="primary"
              style={{ backgroundColor: "#4CAF50", color: "#fff" }}
              onClick={handleAddClick}
            >
              Add Service
            </Button>
          </ConfigProvider>
        </div>
      )}

      {showForm ? (
        <AddServiceForm onBack={handleFormClose} onSuccess={handleFormClose} />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="service master table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: "#E0E0E0",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {services
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((service, index) => (
                    <TableRow hover key={index}>
                      {columns.map((column) => {
                        const value = service[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format
                              ? column.format(value)
                              : value ?? "-"}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={services.length}
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

export default ServiceMasterList;
