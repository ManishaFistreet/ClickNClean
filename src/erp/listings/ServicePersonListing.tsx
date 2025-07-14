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
  Avatar,
} from "@mui/material";
import { Button, ConfigProvider, Select, Tabs, Tag } from "antd";
import { createStyles } from "antd-style";
import AddServicePerson from "../Master/AddServicePerson";
import dayjs from "dayjs";

const { TabPane } = Tabs;
const { Option } = Select;

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

interface ServicePerson {
  name: string;
  phone: string;
  email: string;
  profilephoto?: { url: string }[];
  city: string;
  state: string;
  street: string;
  categories: string;
  dateTime: string;
  status: "active" | "pending";
}

const initialMockData: ServicePerson[] = [
  {
    name: "Aman Verma",
    phone: "9876543210",
    email: "aman@example.com",
    profilephoto: [{ url: "https://randomuser.me/api/portraits/men/10.jpg" }],
    city: "Delhi",
    state: "Delhi",
    street: "MG Road",
    categories: "Deep Cleaning",
    dateTime: "2025-07-05 10:30 AM",
    status: "active",
  },
  {
    name: "Sneha Rathi",
    phone: "9123456789",
    email: "sneha@example.com",
    profilephoto: [{ url: "https://randomuser.me/api/portraits/women/11.jpg" }],
    city: "Mumbai",
    state: "Maharashtra",
    street: "Linking Road",
    categories: "Carpet Cleaning",
    dateTime: "2025-07-06 11:00 AM",
    status: "pending",
  },
  {
    name: "Ravi Kumar",
    phone: "9988776655",
    email: "ravi@example.com",
    profilephoto: [{ url: "https://randomuser.me/api/portraits/men/12.jpg" }],
    city: "Bangalore",
    state: "Karnataka",
    street: "Brigade Road",
    categories: "Sofa Cleaning",
    dateTime: "2025-07-07 2:00 PM",
    status: "active",
  },
  {
    name: "Priya Sharma",
    phone: "9988112233",
    email: "priya@example.com",
    profilephoto: [{ url: "https://randomuser.me/api/portraits/women/12.jpg" }],
    city: "Hyderabad",
    state: "Telangana",
    street: "Banjara Hills",
    categories: "Kitchen Cleaning",
    dateTime: "2025-07-08 3:30 PM",
    status: "pending",
  },
  {
    name: "Karan Mehta",
    phone: "8899001122",
    email: "karan@example.com",
    profilephoto: [{ url: "https://randomuser.me/api/portraits/men/13.jpg" }],
    city: "Chennai",
    state: "Tamil Nadu",
    street: "Anna Salai",
    categories: "Bathroom Cleaning",
    dateTime: "2025-07-09 9:00 AM",
    status: "active",
  },
  {
    name: "Anjali Desai",
    phone: "9876001122",
    email: "anjali@example.com",
    profilephoto: [{ url: "https://randomuser.me/api/portraits/women/13.jpg" }],
    city: "Pune",
    state: "Maharashtra",
    street: "FC Road",
    categories: "Disinfection",
    dateTime: "2025-07-10 10:00 AM",
    status: "pending",
  },
];

const columns = [
  { id: "profilephoto", label: "Photo" },
  { id: "name", label: "Name" },
  { id: "phone", label: "Phone" },
  { id: "email", label: "Email" },
  { id: "city", label: "City" },
  { id: "state", label: "State" },
  { id: "street", label: "Street" },
  { id: "categories", label: "Category" },
  { id: "dateTime", label: "Date & Time" },
  { id: "status", label: "Status" },
];

const ServicePersonList: React.FC = () => {
  const { styles } = useStyle();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active");

  const [servicePersons, setServicePersons] = useState<ServicePerson[]>(() => {
    const saved = localStorage.getItem("servicePersons");
    return saved ? JSON.parse(saved) : initialMockData;
  });

  useEffect(() => {
    localStorage.setItem("servicePersons", JSON.stringify(servicePersons));
  }, [servicePersons]);

  const handleStatusChange = (email: string, newStatus: "active" | "pending") => {
    const updated = servicePersons.map((p) =>
      p.email === email ? { ...p, status: newStatus } : p
    );
    setServicePersons(updated);
  };

  const filteredRows = servicePersons.filter((p) => p.status === activeTab);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      {showForm ? (
        <AddServicePerson onBack={() => setShowForm(false)} />
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3>Service Person Listing</h3>
            <ConfigProvider button={{ className: styles.linearGradientButton }}>
              <Button type="primary" onClick={() => setShowForm(true)}>
                Add Service Person
              </Button>
            </ConfigProvider>
          </div>

          <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key as "active" | "pending")}>
            <TabPane tab="Active" key="active" />
            <TabPane tab="Pending" key="pending" />
          </Tabs>

          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell key={col.id}>{col.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover key={row.email}>
                      {columns.map((col) => {
                        const value = row[col.id as keyof ServicePerson];

                        if (col.id === "profilephoto") {
                          const photoUrl = row.profilephoto?.[0]?.url || "https://via.placeholder.com/40";
                          return (
                            <TableCell key={col.id}>
                              <Avatar src={photoUrl} />
                            </TableCell>
                          );
                        }

                        if (col.id === "dateTime") {
                          return (
                            <TableCell key={col.id}>
                              {dayjs(row.dateTime).format("DD/MM/YYYY hh:mm A")}
                            </TableCell>
                          );
                        }

                        if (col.id === "status") {
                          if (activeTab === "pending") {
                            return (
                              <TableCell key={col.id}>
                                <Select
                                  value={row.status}
                                  onChange={(val) => handleStatusChange(row.email, val)}
                                  style={{ width: 100 }}
                                >
                                  <Option value="pending">Pending</Option>
                                  <Option value="active">Active</Option>
                                </Select>
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={col.id}>
                                <Tag>Completed</Tag>
                              </TableCell>
                            );
                          }
                        }

                        return (
                          <TableCell key={col.id}>
                            {typeof value === "string" || typeof value === "number" ? value : "-"}
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
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </Paper>
  );
};

export default ServicePersonList;
