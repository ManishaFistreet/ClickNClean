import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Table, Card, Avatar } from 'antd';
import { LuCircleCheck, LuCircleX } from 'react-icons/lu';

interface Holiday {
  name: string;
  date: {
    iso: string;
  };
}

interface BookedService {
  key: number;
  service: string;
  customer: string;
  date: string;
  status: string;
  name: string;
  profile: string;
}

interface LeaveRequest {
  id: number;
  name: string;
  reason: string;
  date: string;
  profile: string;
}

const Dashboard: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([
    {
      id: 1,
      name: 'Ajay',
      reason: 'Fever',
      date: '2025-07-11',
      profile: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: 2,
      name: 'Vikas ',
      reason: 'Family Event',
      date: '2025-07-12',
      profile: 'https://randomuser.me/api/portraits/women/45.jpg',
    },
  ]);
  const [approvedLeaves, setApprovedLeaves] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    fetch(
      'https://calendarific.com/api/v2/holidays?api_key=IOTDYsyR4diBoJSqhFWgyPIucQoSCmmP&country=IN&year=2025'
    )
      .then((res) => res.json())
      .then((data) => {
        const allHolidays: Holiday[] = data?.response?.holidays || [];
        const today = new Date();

        const upcomingHolidays: Holiday[] = allHolidays
          .filter((holiday) => {
            const iso = holiday?.date?.iso;
            if (!iso) return false;
            const holidayDate = new Date(iso);
            return !isNaN(holidayDate.getTime()) && holidayDate >= today;
          })
          .sort(
            (a, b) =>
              new Date(a.date.iso).getTime() - new Date(b.date.iso).getTime()
          );

        setHolidays(upcomingHolidays);
      })
      .catch((error) => console.error('Failed to fetch holidays:', error));
  }, []);


  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? date.toLocaleDateString('en-IN', { weekday: 'long' })
      : '-';
  };

  const chartOptions = {
    chart: { id: 'completed-services-overview', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    stroke: { curve: 'smooth' as const },
    colors: ['#6366f1'],
  };

  const chartSeries = [
    { name: 'Completed Services', data: [6, 10, 5, 15, 10, 14, 9] },
  ];

  const bookedServicesData: BookedService[] = [
    {
      key: 1,
      name: 'Ajay',
      profile: 'https://randomuser.me/api/portraits/men/32.jpg',
      service: 'Deep Cleaning',
      customer: 'John Doe',
      date: '2025-06-28',
      status: 'Completed',
    },
    {
      key: 2,
      name: 'Akshay',
      profile: 'https://randomuser.me/api/portraits/men/44.jpg',
      service: 'Window Cleaning',
      customer: 'Jane Smith',
      date: '2025-06-29',
      status: 'Pending',
    },
    {
      key: 3,
      name: 'Vijay',
      profile: 'https://randomuser.me/api/portraits/men/21.jpg',
      service: 'Carpet Cleaning',
      customer: 'Mike Lee',
      date: '2025-06-30',
      status: 'In Progress',
    },
    {
      key: 4,
      name: 'Ishan',
      profile: 'https://randomuser.me/api/portraits/men/56.jpg',
      service: 'Office Cleaning',
      customer: 'Sarah Kim',
      date: '2025-07-01',
      status: 'Completed',
    },
  ];

  const bookedServicesColumns = [
    {
      title: 'Profile',
      dataIndex: 'profile',
      key: 'profile',
      render: (url: string) => <Avatar src={url} />,
    },
    { title: 'Service Person', dataIndex: 'name', key: 'name' },
    { title: 'Service Name', dataIndex: 'service', key: 'service' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const handleApprove = (id: number) => {
    const approved = pendingLeaves.find((leave) => leave.id === id);
    if (approved) {
      setApprovedLeaves([...approvedLeaves, approved]);
      setPendingLeaves(pendingLeaves.filter((leave) => leave.id !== id));
    }
  };

  const handleDecline = (id: number) => {
    setPendingLeaves(pendingLeaves.filter((leave) => leave.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-grow p-6 space-y-8">
        {/* Chart and Holiday Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-6 shadow rounded-xl">
            <h2 className="text-lg font-semibold mb-4">
              Completed Services Overview
            </h2>
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={250}
              width="100%"
            />
          </div>

          <div className="bg-white p-6 shadow rounded-xl max-h-[420px] overflow-auto">
            <h2 className="text-md font-semibold mb-4">
              🗓️ Holidays and Festival – 2025
            </h2>
            <table className="w-full text-sm table-auto border-collapse">
              <thead>
                <tr className="border-b text-left bg-gray-50">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Holiday</th>
                </tr>
              </thead>
              <tbody>
                {holidays.length > 0 ? (
                  holidays.map((holiday, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {holiday.date?.iso?.slice(0, 10) || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        {getDayName(holiday.date?.iso)}
                      </td>
                      <td className="py-3 px-4">{holiday.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-6 text-gray-500">
                      No upcoming holidays found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booked Services and Leave Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Card
              title="Booked Services Table"
              bordered={false}
              className="shadow rounded-xl"
            >
              <Table
                columns={bookedServicesColumns}
                dataSource={bookedServicesData}
                pagination={{ pageSize: 4 }}
              />
            </Card>
          </div>

          {/* Leave Requests */}
          <div className="bg-white p-6 shadow rounded-xl">
            <h1 className="text-md font-semibold mb-4 text-center">
              New Leave Requests
            </h1>

            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="border rounded-lg p-4 mb-4 bg-gray-50 text-sm space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={leave.profile} />
                    <p className="font-medium">{leave.name}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>
                      <strong>Reason:</strong> {leave.reason}
                    </span>
                    <span className="flex items-center gap-2">
                      <LuCircleCheck
                        onClick={() => handleApprove(leave.id)}
                        className="w-5 h-5 text-[#B6D73E] cursor-pointer"
                      />
                      <LuCircleX
                        onClick={() => handleDecline(leave.id)}
                        className="w-5 h-5 text-red-500 cursor-pointer"
                      />
                    </span>
                  </div>

                  <p>
                    <strong>Date:</strong> {leave.date} ({getDayName(leave.date)})
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mb-4">No pending requests</p>
            )}

            {approvedLeaves.length > 0 && (
              <div className="mt-6 border-t pt-4">
                <h2 className="text-md font-semibold mb-3">✅ Approved Leaves</h2>
                {approvedLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="border rounded-lg p-3 mb-3 bg-green-50 text-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar src={leave.profile} />
                      <p className="font-medium">{leave.name}</p>
                    </div>
                    <p><strong>Reason:</strong> {leave.reason}</p>
                    <p><strong>Date:</strong> {leave.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
