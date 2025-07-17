import React, { useEffect, useState } from "react";
import type { Booking, User } from "../../types/services";
import { assignServicePerson, fetchAllBookings, fetchAllUsers, fetchServicePersons, updateBookingStatus } from "../../api/ServiceApi";
import { Button } from "antd";

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [servicePersons, setServicePersons] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [bookingRes, usersRes, spRes] = await Promise.all([
        fetchAllBookings(),
        fetchAllUsers(),
        fetchServicePersons(),
      ]);
      console.log("Userss Response:", usersRes);
      setBookings(bookingRes)
      setUsers(usersRes.users);
      setServicePersons(spRes);
      setLoading(false);
    };
    load();
  }, []);

  const handleAssign = async (bookingId: string, personId: string) => {
    try {
      await assignServicePerson(bookingId, personId);
      alert("Assigned successfully");
    } catch (err) {
      console.error("Error assigning person:", err);
    }
  };

  const extractUserId = (user: string | { _id: string }) =>
    typeof user === "string" ? user : user._id;

  const getUserById = (userId: string) =>
    users.find((u) => u.id === userId)?.name || "Unknown";

  const handleConfirm = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "confirmed");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, confirmationStatus: "confirmed" } : b
        )
      );
      alert("Booking confirmed");
    } catch (err) {
      console.error("Error confirming booking:", err);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "rejected");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, confirmationStatus: "rejected" } : b
        )
      );
      alert("Booking rejected");
    } catch (err) {
      console.error("Error rejecting booking:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-xl p-4 shadow bg-white space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {getUserById(extractUserId(booking.user))}

                </h3>
                <span className="text-sm text-gray-600">
                  {booking.schedule.date} at {booking.schedule.time}
                </span>
              </div>

              <div className="text-sm text-gray-700">
                Status:{" "}
                <span
                  className={`font-medium capitalize ${booking.confirmationStatus === "rejected" ? "text-red-600" : ""
                    }`}
                >
                  {booking.confirmationStatus}
                </span>
              </div>


              <div className="text-sm">
                Total: ₹{booking.grandTotal} (GST: ₹{booking.gstTotal})
              </div>
              {booking.confirmationStatus !== "rejected" && (
                <div className="flex items-center gap-4">
                  <select
                    value=""
                    onChange={(e) => handleAssign(booking._id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    <option value="" disabled>
                      Assign Service Person
                    </option>
                    {servicePersons.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name || person.phone}
                      </option>
                    ))}
                  </select>

                  <Button variant="outlined" onClick={() => handleConfirm(booking._id)}>
                    Confirm
                  </Button>
                  <Button variant="filled" onClick={() => handleReject(booking._id)}>
                    Reject
                  </Button>
                </div>
              )}

              <details className="text-sm mt-2">
                <summary className="cursor-pointer text-blue-500">
                  View Services
                </summary>
                <ul className="mt-2 pl-4 list-disc">
                  {booking.services.map((s, i) => (
                    <li key={i}>
                      {s.serviceCode} - Qty: {s.quantity} - ₹{s.totalWithGst}
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;