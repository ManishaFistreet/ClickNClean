import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { Button, ConfigProvider } from 'antd';
import { createStyles } from 'antd-style';

import type { PackageData } from '../../types/services';
import AddPackageForm from '../Master/AddPackageForm';
import { fetchPackages } from '../../api/ServiceApi'; 

interface Column {
  id: keyof PackageData;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => string;
}

const columns: Column[] = [
  { id: 'packageName', label: 'Package Name', minWidth: 150 },
  { id: 'packageDetail', label: 'Details', minWidth: 200 },
  { id: 'mappedServiceCode', label: 'Service Code', minWidth: 130 },
  { id: 'packagePriceId', label: 'Price ID', minWidth: 100 },
  { id: 'mappedPriceMaster', label: 'Price Master', minWidth: 150 },
];

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

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [showForm, setShowForm] = useState<boolean>(false);

  const { styles } = useStyle();
  
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const data = await fetchPackages();
        setPackages(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch packages');
        setLoading(false);
      }
    };

    loadPackages();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddClick = () => setShowForm(true);
  const handleFormClose = () => setShowForm(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      {showForm ? (
        <AddPackageForm onBack={handleFormClose} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3>Package Listing</h3>
            <ConfigProvider button={{ className: styles.linearGradientButton }}>
              <Button type="primary" onClick={handleAddClick}>
                Add Package
              </Button>
            </ConfigProvider>
          </div>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="package table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth,backgroundColor: "#E0E0E0", }}>
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {packages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((pkg) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={pkg.UniqueId}>
                    {columns.map((column) => {
                      const value = pkg[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number' ? column.format(value) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={packages.length}
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

export default PackageList;
