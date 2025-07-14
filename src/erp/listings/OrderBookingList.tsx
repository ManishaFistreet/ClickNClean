import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { Button, ConfigProvider } from 'antd';
import { createStyles } from 'antd-style';
import { fetchOrderBooking } from '../../api/ServiceApi';
import type { OrderBookingFormValues } from '../../types/services';
import AddOrderBookingForm from '../Master/AddOrderBookingForm';

interface Column<T = OrderBookingFormValues> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: T[keyof T]) => string;
}

const columns: Column[] = [
  { id: 'booking_id', label: 'Booking ID', minWidth: 120 },
  { id: 'service_category', label: 'Service Category', minWidth: 140 },
  { id: 'service_code', label: 'Service Code', minWidth: 120 },
  { id: 'offer_code', label: 'Offer Code', minWidth: 120 },
  { id: 'package_code', label: 'Package Code', minWidth: 130 },
  { id: 'price_type', label: 'Price Type', minWidth: 100 },
  { id: 'final_discount', label: 'Discount', minWidth: 100, align: 'right' },
  { id: 'taxable_value', label: 'Taxable Value', minWidth: 120, align: 'right' },
  { id: 'total_value', label: 'Total (Incl. Tax)', minWidth: 140, align: 'right' },
  { id: 'total_value_per_service', label: 'Total/Service', minWidth: 130, align: 'right' },
  { id: 'gst_per_service', label: 'GST Value', minWidth: 100, align: 'right' },
  { id: 'gst_per_service_pert', label: 'GST %', minWidth: 80, align: 'right' },
  { id: 'grandTotal', label: 'Grand Total', minWidth: 120, align: 'right' },
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

const OrderBookingList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState<OrderBookingFormValues[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { styles } = useStyle();

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetchOrderBooking();
      setOrders(res);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 20 }}>
        <h3>Order Booking Listing</h3>
        <ConfigProvider button={{ className: styles.linearGradientButton }}>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', color: '#fff' }}
            onClick={() => setShowForm(true)}
          >
            Add Order Booking
          </Button>
        </ConfigProvider>
      </div>

      {showForm ? (
        <AddOrderBookingForm
          onBack={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            loadBookings();
          }}
        />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, backgroundColor: '#E0E0E0' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                  <TableRow hover key={`${order.uniqueId || index}`}>
                    {columns.map((column) => {
                      const value = order[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value) : value ?? '-'}
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
            count={orders.length}
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

export default OrderBookingList;
