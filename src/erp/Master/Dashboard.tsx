import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Table, Card } from 'antd';

interface Tip {
  title: string;
  description: string;
}

interface TipItem {
  advice: string;
}

interface BlogPost {
  profile: string;
  image: string;
  service: string;
  estimated: string;
  Amount: string;
}

interface BookedService {
  key: number;
  service: string;
  customer: string;
  date: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    fetch('https://api.fungenerators.com/fact/fod')
      .then(res => res.json())
      .then(data => {
        setTip({
          title: "Productivity Tip",
          description: data.slip.advice
        });
      })
      .catch(() => {
        setTip({ title: "Stay Focused", description: "Start your day with a clear goal." });
      });
  }, []);

  const chartOptions = {
    chart: { id: 'completed-services-overview', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    stroke: { curve: 'smooth' },
    colors: ['#6366f1'], // Tailwind Indigo-500
  };

  const chartSeries = [
    { name: 'Completed Services', data: [6, 10, 5, 15, 10, 14, 9] }
  ];

  const blogPosts: BlogPost[] = [
    {
      profile: "John Doe",
      image: "https://randomuser.me/api/portraits/men/10.jpg",
      service: "Residential Cleaning",
      estimated: "2 Hours",
      Amount: "₹1,500"
    },
    {
      profile: "Priya Sharma",
      image: "https://randomuser.me/api/portraits/women/21.jpg",
      service: "Carpet Cleaning",
      estimated: "4 Hours",
      Amount: "₹2,200"
    },
    {
      profile: "Ahmed Khan",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      service: "Office Cleaning",
      estimated: "5 Hours",
      Amount: "₹3,800"
    },
  ];

  const bookedServicesColumns = [
    { title: 'Service Name', dataIndex: 'service', key: 'service' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const bookedServicesData: BookedService[] = [
    { key: 1, service: 'Deep Cleaning', customer: 'John Doe', date: '2025-06-28', status: 'Completed' },
    { key: 2, service: 'Window Cleaning', customer: 'Jane Smith', date: '2025-06-29', status: 'Pending' },
    { key: 3, service: 'Carpet Cleaning', customer: 'Mike Lee', date: '2025-06-30', status: 'In Progress' },
    { key: 4, service: 'Office Cleaning', customer: 'Sarah Kim', date: '2025-07-01', status: 'Completed' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-6 space-y-6">
        {/* Chart & Tip Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="col-span-2 bg-white p-6 shadow rounded-lg">
            <h6 className="text-lg font-semibold mb-4">Completed Services Overview</h6>
            <Chart options={chartOptions} series={chartSeries} type="line" height={250} width={670} />
          </div>

          {/* Tip */}
          <div className="bg-white p-6 shadow rounded-lg flex flex-col justify-between">
            <div className="flex items-start gap-4 mb-4">
              <img
                src="https://img.freepik.com/free-vector/leaf-light-bulb-outline_78370-6712.jpg?semt=ais_hybrid&w=740"
                alt="Productivity Icon"
                className="h-14 w-14 object-contain"
              />
              <div>
                <h6 className="text-md font-semibold">{tip?.title || 'Loading...'}</h6>
                <p className="text-sm text-gray-600">{tip?.description || 'Fetching a useful tip...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booked Services Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white shadow rounded-lg">
            <Card title="Booked Services Table" bordered={false}>
              <Table
                columns={bookedServicesColumns}
                dataSource={bookedServicesData}
                pagination={{ pageSize: 4 }}
              />
            </Card>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">{/* Optional content */}</div>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
            >
              <img
                src={post.image}
                alt="User"
                className="w-16 h-16 rounded-full mb-3"
              />
              <div className="text-sm text-gray-800 w-full">
                <p className="mb-1 font-medium">Name: <span className="text-gray-700">{post.profile}</span></p>
                <p className="mb-1 font-medium">Service Allotted: <span className="text-gray-700">{post.service}</span></p>
                <p className="mb-1 font-medium">Estimated Time: <span className="text-gray-700">{post.estimated}</span></p>
                <p className="font-medium">Amount: <span className="text-gray-700">{post.Amount}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;