import { useEffect, useState } from "react";
import { format } from "date-fns";
import type { Booking } from "../types/services";
import { cancelBooking, getMyBookings } from "../api/ServiceApi";

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "booked":
      return "bg-blue-100 text-blue-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    const res = await getMyBookings(user.id);
    if (res.success) {
      setOrders(res.bookings);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    const res = await cancelBooking(id);
    if (res.success) {
      fetchBookings();
    } else {
      alert(res.message);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded shadow space-y-2">
              <div className="flex justify-between items-center">
                <p className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusBadgeColor(order.status)}`}>
                  {order.status.replace("_", " ").toUpperCase()}
                </p>
                {order.status === "booked" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <p><strong>Service(s):</strong> {order.services.map((s) => s.serviceCode).join(", ")}</p>
              <p><strong>Date:</strong> {format(new Date(order.schedule.date), "dd MMM yyyy")}</p>
              <p><strong>Time:</strong> {order.schedule.time}</p>
              <p><strong>Total:</strong> ₹{order.grandTotal}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
