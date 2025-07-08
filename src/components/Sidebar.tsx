import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import CustomerPlusIcon from "../assets/icons/customerplus.svg";
import RequestServiceIcon from '../assets/icons/requestservice.svg';
import Service from '../assets/icons/service.svg';
import Price from '../assets/icons/price.svg';
import Package from '../assets/icons/package.svg';
import Customer from '../assets/icons/customers.svg';
import Advertisement from '../assets/icons/Advertisement.svg';
import Logs from '../assets/icons/logs.svg';
import Orders from '../assets/icons/orders.svg';
import Dashboard from '../assets/icons/dashboard.svg';


const { Sider } = Layout;

interface AppSidebarProps {
  collapsed: boolean;
  onSelect: (key: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onSelect }) => {
  const [selectedKey, setSelectedKey] = useState<string>(
    localStorage.getItem('sidebarSelectedKey') || '1'
  );

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setSelectedKey(key);
    localStorage.setItem('sidebarSelectedKey', key);
    onSelect(key); // Notify parent
  };

  useEffect(() => {
    const savedKey = localStorage.getItem('sidebarSelectedKey');
    if (savedKey) setSelectedKey(savedKey);
  }, []);

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Dashboard',
      icon: (
        <img
          src={Dashboard}
          alt="Dashboard"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '2',
      label: 'Service Person List',
      icon: (
        <img
          src={CustomerPlusIcon}
          alt="ServicePerson List"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '3',
      label: 'Request Service',
      icon: (
        <img
          src={RequestServiceIcon}
          alt="Request service"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '4',
      label: 'Service Listing',
      icon: (
        <img
          src={Service}
          alt="Service"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '5',
      label: 'Price Listing',
      icon: (
        <img
          src={Price}
          alt="Price"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '6',
      label: 'Package Listing',
      icon: (
        <img
          src={Package}
          alt="Package"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '7',
      label: 'Customers Listing',
      icon: (
        <img
          src={Customer}
          alt="Customers Listing"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '8',
      label: 'Advertisement',
      icon: (
        <img
          src={Advertisement}
          alt="Advertisement"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '9',
      label: 'LogIn Logs',
      icon: (
        <img
          src={Logs}
          alt="LoginLogs"
          style={{ width: 18, height: 18 }}
        />
      )
    },
    {
      key: '10',
      label: 'Order & Booking',
      icon: (
        <img
          src={Orders}
          alt="OrderBookings"
          style={{ width: 18, height: 18 }}
        />
      )
    },
  ];
 

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      collapsedWidth={80}
      trigger={null}
      className='bg-background color-globalSecondary m-h-[100vh]'
    >
      <div className="text-2xl text-center mt-5 mb-5 font-bold whitespace-nowrap bg-[linear-gradient(115deg,#88b448,#214738,#34735b)] text-transparent bg-clip-text">
        ClickNClean
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        onClick={handleMenuClick}
       className='bg-background color-globalSecondary'
      />
    </Sider>
  );
};

export default AppSidebar;