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
import { Button, ConfigProvider, Modal } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AddOrderBookingForm from '../Master/AddOrderBookingForm';

interface OrderBookingFormValues {
  uniqueId: string;
  booking_id: string;
  service_category: string;
  service_code: string;
  offer_code: string;
  package_code: string;
  price_type: string;
  final_discount: number;
  taxable_value: number;
  total_value: number;
  total_value_per_service: number;
  gst_per_service: number;
  gst_per_service_pert: number;
  grandTotal: number;
}

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

const fetchMockOrders = (): Promise<OrderBookingFormValues[]> =>
  Promise.resolve([
    {
      uniqueId: '1',
      booking_id: '1001',
      service_category: 'Residential Cleaning',
      service_code: 'RES-001',
      offer_code: 'OFF10',
      package_code: 'PKG-01',
      price_type: 'Fixed',
      final_discount: 100,
      taxable_value: 900,
      total_value: 990,
      total_value_per_service: 495,
      gst_per_service: 45,
      gst_per_service_pert: 5,
      grandTotal: 990,
    },
  ]);

const OrderBookingList: React.FC = () => {
  const [orders, setOrders] = useState<OrderBookingFormValues[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderBookingFormValues | null>(null);
  const [invoiceVisible, setInvoiceVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const { styles } = useStyle();
  const now = new Date();
  const currentDate = now.toLocaleDateString();
  const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    fetchMockOrders().then(setOrders);
  }, []);

  const handleDownloadPDF = async () => {
    const invoiceEl = document.getElementById('invoiceContent');
    if (!invoiceEl) return;
    const canvas = await html2canvas(invoiceEl, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice-${selectedOrder?.booking_id}.pdf`);
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      {showForm ? (
        <AddOrderBookingForm
          onBack={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchMockOrders().then(setOrders);
          }}
        />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: 20 }}>
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

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ backgroundColor: "#E0E0E0" }} >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell align="center" style={{ backgroundColor: "#E0E0E0" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <TableRow hover key={order.uniqueId}>
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align}>{order[column.id]}</TableCell>
                    ))}
                    <TableCell align="center">
                      <Button
                        icon={<FileTextOutlined />}
                        type="link"
                        onClick={() => {
                          setSelectedOrder(order);
                          setInvoiceVisible(true);
                        }}
                      >
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={orders.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Modal
        open={invoiceVisible}
        onCancel={() => setInvoiceVisible(false)}
        title="Invoice Preview"
        footer={[
          <Button key="cancel" onClick={() => setInvoiceVisible(false)}>Cancel</Button>,
          <Button key="print" onClick={handleDownloadPDF}>Download PDF</Button>,
        ]}
        width={800}
      >
        <div id="invoiceContent" style={{ padding: 40, backgroundColor: '#fff', fontFamily: 'Arial' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <svg width="220" height="50" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#88b448" />
                    <stop offset="100%" stopColor="#34735b" />
                  </linearGradient>
                </defs>
                <text x="0" y="35" fontSize="32" fontWeight="bold" fontFamily="Arial" fill="url(#logoGradient)">
                  ClickNClean
                </text>
              </svg>
              <div style={{ fontWeight: 'bold', fontSize: 16 }}>Jodhpur</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: 0 }}>INVOICE</h1>
              <div><strong>Invoice#:</strong> INV-{selectedOrder?.booking_id}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
            <div>
              <div><strong>Bill To</strong></div>
              <div>Aaron Brown</div>
              <div>43268, Christiansen Heights</div>
              <div>New Jersey 7324</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Invoice Date:</strong>{currentDate}</div>
              <div><strong>Invoice Time:</strong>{currentTime}</div>
            </div>
          </div>

          <div><strong>Place Of Supply:</strong> Jodhpur,Rajasthan</div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 30 }}>
            <thead>
              <tr style={{ backgroundColor: '#000', color: '#fff' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>#</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Item & Description</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Qty</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Rate</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Discount</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>1</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{selectedOrder?.service_category}<br />{selectedOrder?.service_code}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>1.00</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{selectedOrder?.taxable_value.toFixed(2)}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{selectedOrder?.final_discount.toFixed(2)}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{selectedOrder?.total_value.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <table style={{ width: 300 }}>
              <tbody>
                <tr><td>Sub Total</td><td style={{ textAlign: 'right' }}>₹{selectedOrder?.total_value.toFixed(2)}</td></tr>
                <tr><td><strong>Total</strong></td><td style={{ textAlign: 'right' }}><strong>₹{selectedOrder?.total_value.toFixed(2)}</strong></td></tr>
                <tr style={{ backgroundColor: '#eee' }}><td><strong>Balance Due</strong></td><td style={{ textAlign: 'right' }}><strong>₹{selectedOrder?.grandTotal.toFixed(2)}</strong></td></tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40 }}>
            <div><strong>Notes</strong><p>Thanks for your business.</p></div>
            <div><strong>Payment Options</strong><div>💳 PayPal, Cards, UPI</div></div>
          </div>

          <div style={{ marginTop: 20 }}>
            <strong>Terms & Conditions</strong>
            <p>Your company’s terms and conditions will be displayed here.</p>
          </div>
        </div>
      </Modal>
    </Paper>
  );
};

export default OrderBookingList;
