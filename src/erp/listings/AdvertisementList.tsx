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
import { fetchShowcase } from '../../api/ServiceApi';
import type { ServiceShowcase } from '../../types/services';
import AddAdvertisementForm from '../Master/AddAdvertisementForm';

interface Column <T = ServiceShowcase>{
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: T[keyof T]) => string;
}

const columns: Column[] = [
  { id: 'uniqueId', label: 'Ad ID', minWidth: 120 },
  { id: 'adTitle', label: 'Title', minWidth: 160 },
  { id: 'adActiveStatus', label: 'Status', minWidth: 100, format: (value) => (value ? 'Active' : 'Inactive') },
  { id: 'showcaseStartDate', label: 'Start Date', minWidth: 120, format: (value) => new Date(value as string | Date).toLocaleDateString('en-IN') },
  { id: 'showcaseEndDate', label: 'End Date', minWidth: 120, format: (value) => new Date(value as string | Date).toLocaleDateString('en-IN') },
  { id: 'showcaseStartTime', label: 'Start Time', minWidth: 100 },
  { id: 'showcaseEndTime', label: 'End Time', minWidth: 100 },
  { id: 'adPriceId', label: 'Price ID', minWidth: 100 },
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

const AdvertisementList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ads, setAds] = useState<ServiceShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdForm, setShowAdForm] = useState(false);
  const { styles } = useStyle();

  useEffect(() => {
    fetchShowcase()
      .then((res) => {
        setAds(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        console.error('Error fetching ads:', err);
      });
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddClick = () => setShowAdForm(true);
  const handleFormClose = () => setShowAdForm(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 20 }}>
        <h3>Advertisement Listing</h3>
        <ConfigProvider button={{ className: styles.linearGradientButton }}>
          <Button
            type="primary"
            style={{ backgroundColor: '#4CAF50', color: '#fff' }}
            onClick={handleAddClick}
          >
            Add Advertisement
          </Button>
        </ConfigProvider>
      </div>

      {showAdForm ? (
        <AddAdvertisementForm
          onBack={handleFormClose}
          onSuccess={() => {
            handleFormClose();
          }}
        />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="advertisement table">
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
                {ads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ad, index) => (
                  <TableRow hover key={ad._id ?? index}>
                    {columns.map((column) => {
                      const value = ad[column.id];
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
            count={ads.length}
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

export default AdvertisementList;
