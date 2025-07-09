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
import { fetchLoginLogs } from '../../api/ServiceApi';
import AddLoginLogsForm from '../Master/AddLoginLogsForm';
import type { LoginLog } from '../../types/services';

interface Column<T = LoginLog> {
  id: keyof T;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: T[keyof T]) => string;
}

const columns: Column[] = [
  { id: 'uniqueId', label: 'Log ID', minWidth: 100 },
  { id: 'ipAddress', label: 'IP Address', minWidth: 120 },
  {
    id: 'loginDate',
    label: 'Login Date',
    minWidth: 120,
    format: (value) => new Date(value as string).toLocaleDateString('en-IN'),
  },
  { id: 'loginTime', label: 'Login Time', minWidth: 100 },
  { id: 'loginLatitude', label: 'Latitude', minWidth: 100 },
  { id: 'loginLongitude', label: 'Longitude', minWidth: 100 },
  {
    id: 'loggedInBy',
    label: 'Source',
    minWidth: 100,
    format: (value) => (value === 'app' ? 'Mobile App' : 'Web'),
  },
  { id: 'loginAddress', label: 'Address', minWidth: 200 },
];

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #BCE27F, #7EC850);
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

const LoginLogList: React.FC = () => {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { styles } = useStyle();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchLoginLogs();
      setLogs(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load login logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => setShowForm(true);
  const handleFormClose = () => setShowForm(false);
  const handleFormSuccess = () => {
    handleFormClose();
    fetchData();
  };

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20 }}>
        <h3 style={{ margin: 0 }}>Login Logs</h3>
        {!showForm && (
          <ConfigProvider button={{ className: styles.linearGradientButton }}>
            <Button
              type="primary"
              style={{ backgroundColor: '#4CAF50', color: '#fff' }}
              onClick={handleAddClick}
            >
              Add Login Log
            </Button>
          </ConfigProvider>
        )}
      </div>

      {showForm ? (
        <AddLoginLogsForm onBack={handleFormClose} onSuccess={handleFormSuccess} />
      ) : (
        <>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="login logs table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        backgroundColor: '#F5F5F5',
                        fontWeight: 'bold',
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (
                  <TableRow hover key={log.uniqueId || index}>
                    {columns.map((column) => {
                      const value = log[column.id];
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
            count={logs.length}
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

export default LoginLogList;
