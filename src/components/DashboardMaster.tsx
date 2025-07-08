import React, { useState } from 'react';
import {
  Layout,
  Input,
  Space,
  Avatar,
  Badge,
  Button,
  Popover,
  List,
  Typography,
  Spin,
  message as AntMessage,
} from 'antd';
import {
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

interface Alert {
  _id: string;
  message: string;
  type?: 'info' | 'warning' | 'critical';
  seen?: boolean;
}

interface DashboardHeaderProps {
  userName: string;
  profilePicUrl?: string;
  toggleSidebar: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  profilePicUrl,
  toggleSidebar,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Alert[] = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAlertAsSeen = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}/seen`, { method: 'PATCH' });
    } catch (err) {
      console.error('Error marking alert as seen:', err);
    }
  };

  const handleBellClick = () => {
    setPopoverVisible((prev) => !prev);
    if (!popoverVisible) fetchAlerts();
  };

  const notificationContent = (
    <div style={{ width: 300 }}>
      {loading ? (
        <Spin />
      ) : alerts.length === 0 ? (
        <Text type="secondary">No notifications</Text>
      ) : (
        <List
          size="small"
          dataSource={alerts}
          renderItem={(item) => (
            <List.Item
              onClick={() => {
                AntMessage.info(item.message);
                markAlertAsSeen(item._id);
              }}
              style={{
                cursor: 'pointer',
                backgroundColor: item.seen ? '#f5f5f5' : '#e6f7ff',
              }}
            >
              <Text type={item.type === 'critical' ? 'danger' : undefined}>
                {item.message}
              </Text>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <Header
      style={{
        background: '#fff',
        padding: '0 24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}
      >
        {/* Sidebar toggle and search */}
        <Space size="middle">
          <Button
            shape="circle"
            icon={<MenuOutlined />}
            onClick={toggleSidebar}
            style={{ border: '1px solid #d9d9d9' }}
          />
          <Input
            size="middle"
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 300, borderRadius: 8, backgroundColor: '#fafafa' }}
          />
        </Space>

        {/* Notification bell and user info */}
        <Space size="middle">
          <Popover
            content={notificationContent}
            trigger="click"
            open={popoverVisible}
            onOpenChange={(v) => setPopoverVisible(v)}
            placement="bottomRight"
          >
            <Badge count={alerts.filter((a) => !a.seen).length} offset={[-1, 1]}>
              <Button
                shape="circle"
                icon={<BellOutlined />}
                onClick={handleBellClick}
                style={{ border: '1px solid rgba(255, 255, 255, 0.3)' }}
              />
            </Badge>
          </Popover>

          <Space>
            <Avatar
              size="large"
              src={profilePicUrl}
              icon={!profilePicUrl && <UserOutlined />}
            />
            <span style={{ fontWeight: 500, color: '#2f2f2f' }}>{userName}</span>
          </Space>
        </Space>
      </div>
    </Header>
  );
};

export default DashboardHeader;