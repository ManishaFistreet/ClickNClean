import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, ConfigProvider } from 'antd';
import { createStyles } from 'antd-style';
import axios from 'axios';
import AddCustomerForm from '../Master/AddCustomerForm';
import type { User } from '../../types/services';

interface Column {
  id: string;
  label: string;
  minWidth: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string | number | Date) => string;
}

const columns: Column[] = [
  { id: 'profilePhoto', label: 'Photo', minWidth: 80, align: 'center' },
  { id: 'name', label: 'Name', minWidth: 150 },
  { id: 'email', label: 'Email', minWidth: 200 },
  { id: 'phone', label: 'Phone', minWidth: 150 },
  { id: 'city', label: 'City', minWidth: 150 },
  { id: 'createdAt', label: 'Registered On', minWidth: 180, format: (value) => new Date(value).toLocaleDateString('en-IN') },
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

export default function CustomerList() {
  const [rows, setRows] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showCustomerMaster, setShowCustomerMaster] = useState(false);
  const { styles } = useStyle();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users/all');
        setRows(res.data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = () => setShowCustomerMaster(true);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', padding: 2 }}>
      {showCustomerMaster ? (
        <AddCustomerForm onBack={() => setShowCustomerMaster(false)} />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-5">
            <h3>Customer Listing</h3>
            <ConfigProvider button={{ className: styles.linearGradientButton }}>
              <Button type="primary" onClick={handleClick}>
                Add Customer
              </Button>
            </ConfigProvider>
          </div>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      align={column.align || 'left'}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row._id}>
                      {columns.map((column) => {
                        let value: string | number | undefined | Date;

                        if (column.id === 'city') {
                          value = row.address?.city;
                        } else if (column.id === 'profilePhoto') {
                          value = row.profilePhoto;
                        } else {
                          value = row[column.id as keyof User] as string | number | undefined | Date;
                        }

                        // Special handling for photo
                        if (column.id === 'profilePhoto') {
                          return (
                            <TableCell key={column.id} align="center">
                              <img
                                src={typeof value === 'string' ? value : 'https://via.placeholder.com/40'}
                                alt="Profile"
                                width={40}
                                height={40}
                                style={{ borderRadius: '50%' }}
                              />

                            </TableCell>
                          );
                        }

                        return (
                          <TableCell key={column.id} align={column.align || 'left'}>
                            {column.format &&
                              (typeof value === 'string' ||
                                typeof value === 'number' ||
                                value instanceof Date)
                              ? column.format(value)
                              : typeof value === 'object' || typeof value === 'undefined'
                                ? '-'
                                : value}
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
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
    </Paper>
  );
}