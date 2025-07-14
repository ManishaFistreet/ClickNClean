// src/erp/listings/PriceList.tsx
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
import { fetchPrices } from '../../api/ServiceApi';
import AddPriceForm from '../Master/AddPriceForm';
import type { PriceFormValues } from '../../types/services';
import type { Column } from './PackageList';
import { Dayjs } from 'dayjs';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }
      &::before {
        content: '';
        background: linear-gradient(135deg, rgb(188, 226, 127), #bce27f);
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

const columns: Column<PriceFormValues>[] = [
  {
    id: 'serviceCode',
    label: 'Service Code',
    minWidth: 120,
    format: (value) => {
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && value !== null) {
        return (
          (value as { code?: string; serviceCode?: string }).code ||
          (value as { serviceCode?: string }).serviceCode ||
          '[Invalid]'
        );
      }
      return '[Invalid]';
    }
  },
  {
    id: 'actualPrice',
    label: 'Price',
    minWidth: 100,
    align: 'right',
    format: (value) => `₹${value}`,
  },
  {
    id: 'showoffPrice',
    label: 'Showoff Price',
    minWidth: 120,
    align: 'right',
  },
  {
    id: 'offerDiscount',
    label: 'Offer Discount (%)',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'offerCode',
    label: 'Offer Code',
    minWidth: 120,
  },
  {
    id: 'priceType',
    label: 'Price Type',
    minWidth: 100,
    format: (value) => (value ? 'Fixed' : 'Hourly'),
  },
  {
    id: 'priceActiveStatus',
    label: 'Status',
    minWidth: 100,
    format: (value) => (value ? 'Active' : 'Inactive'),
  },
  {
    id: 'offerStart',
    label: 'Offer Start',
    minWidth: 120,
    format: (value) =>
      typeof value === 'object' && value !== null && 'format' in value
        ? (value as Dayjs).format('DD-MM-YYYY')
        : new Date(value as string | number | Date).toLocaleDateString('en-IN'),
  },
  {
    id: 'offerEnd',
    label: 'Offer End',
    minWidth: 120,
    format: (value) =>
      typeof value === 'object' && value !== null && 'format' in value
        ? (value as Dayjs).format('DD-MM-YYYY')
        : new Date(value as string | number | Date).toLocaleDateString('en-IN'),
  },
];

const PriceList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [prices, setPrices] = useState<PriceFormValues[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const { styles } = useStyle();

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const data = await fetchPrices();
        setPrices(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to fetch packages');
        }
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    };
    loadPrices();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddPrice = () => setShowPriceForm(true);
  const handlePriceFormClose = () => setShowPriceForm(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      {!showPriceForm ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px' }}>
            <h3>Price Listing</h3>
            <ConfigProvider button={{ className: styles.linearGradientButton }}>
              <Button style={{ backgroundColor: '#88E788', color: 'whitesmoke' }} onClick={handleAddPrice}>
                Add Prices
              </Button>
            </ConfigProvider>
          </div>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="price table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align ?? 'left'}
                      style={{ minWidth: column.minWidth, backgroundColor: "#E0E0E0", }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {prices
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align ?? 'left'}>
                            {column.format && value !== undefined && value !== null
                              ? String(column.format(value))
                              : String(value ?? '-')}
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
      ) : (
        <AddPriceForm
          onBack={handlePriceFormClose}
          onSuccess={async () => {
            handlePriceFormClose();
            const updated = await fetchPrices();
            setPrices(updated);
          }}
        />
      )}
    </Paper>
  );
};

export default PriceList;
