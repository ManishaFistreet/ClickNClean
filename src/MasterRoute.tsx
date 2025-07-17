// src/routes/MasterRoute.tsx
import { Layout, ConfigProvider } from "antd";
import { useState } from "react";
import Dashboard from "./erp/Master/Dashboard";
import CustomerList from "./erp/listings/CustomerListing";
import AdvertisementList from "./erp/listings/AdvertisementList";
import OrderBookingList from "./erp/listings/OrderBookingList";
import AppSidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardMaster";
import PackageList from "./erp/listings/PackageList";
import LogInLogsList from "./erp/listings/LogINLogList";
import PriceList from "./erp/listings/PriceList";
import ServiceMasterList from "./erp/listings/ServiceListing";
import ServicePersonList from "./erp/listings/ServicePersonListing";
import RequestForm from "./erp/Master/RequestForm";
import AddUserAndServicePersonForm from "./erp/Master/AddUserAndServicePerson";

const { Content } = Layout;

export default function MasterRoute() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePageKey, setActivePageKey] = useState("1");
 const userName = localStorage.getItem("userName") || "Guest";
  const profilePicUrl = localStorage.getItem("profilePicUrl") || "";
  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const renderMasterPage = () => {
    switch (activePageKey) {
      case "1": return <Dashboard />;
       case "2": return <ServicePersonList />;
      case "3": return <RequestForm />;
      case "4": return <ServiceMasterList/>;
      case "5": return <PriceList />;
      case "6": return <PackageList />;
      case "7": return <CustomerList />;
      case "8": return <AdvertisementList />;
       case "9": return <LogInLogsList />;
      case "10": return <OrderBookingList />;
      case "11": return <AddUserAndServicePersonForm/>;
      default: return <Dashboard />;
    }
  };

  console.log("Active page key --",activePageKey);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemColor: "#197935",
            itemSelectedColor: "#197935",
            itemSelectedBg: "#ffffff",
            itemHoverColor: "#ffffff",
            itemHoverBg: "#02822b",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <AppSidebar collapsed={collapsed} onSelect={setActivePageKey} />
        <Layout>
          <DashboardHeader  userName= {userName} profilePicUrl ={profilePicUrl} toggleSidebar={toggleSidebar} />
          <Content style={{ margin: 16 }}>{renderMasterPage()}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}