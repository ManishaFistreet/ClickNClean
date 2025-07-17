import { useState, useEffect, useCallback } from "react";
import { format, isBefore, subHours } from "date-fns";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import type { Booking } from "../types/services";
import { fetchServiceById, getMyBookings, rescheduleBooking } from "../api/ServiceApi";

export interface ServiceDetail {
  _id: string;
  image: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  category: string;
  priceType: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [open, setOpen] = useState(false);
  const [serviceDetails, setServiceDetails] = useState<ServiceDetail[]>([]);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<string>("");
   const [rescheduleTime, setRescheduleTime] = useState<string>("");

  const fetchBookings = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    const res = await getMyBookings(user.id);
    if (res.success && res.bookings) {
      setBookings(res.bookings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

const handleOpenServiceDetail = async (bookingId: string) => {
  setLoading(true);
  try {
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) return;

    const fetchedDetails: ServiceDetail[] = await Promise.all(
      booking.services.map(async (s) => {
        const res = await fetchServiceById(s.serviceId);
        return {
          _id: res._id,
          image: res.serviceWebImage || "",
          name: res.serviceName,
          description: res.serviceDetail,
          price: s.price,
          duration: res.minHours,
          category: res.serviceCategory,
          priceType: res.priceType,
        };
      })
    );

    setServiceDetails(fetchedDetails);
    setOpen(true);
  } catch (error) {
    console.error("Failed to fetch service details", error);
  } finally {
    setLoading(false);
  }
};

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setServiceDetails([]);
    setOpen(false);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleTime) return;
    try {
      await rescheduleBooking(selectedBooking._id, rescheduleDate, rescheduleTime);
      setRescheduleDialogOpen(false);
      setRescheduleDate("");
      setRescheduleTime(" ")
      fetchBookings();
    } catch (error) {
      console.error("Rescheduling failed", error);
    }
  };

  const canReschedule = (date: string, time: string) => {
    const scheduleDateTime = new Date(`${date}T${time}`);
    return isBefore(new Date(), subHours(scheduleDateTime, 24));
  };


  if (loading) return <p className="text-center py-6">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 mt-12">
      <h2 className="text-3xl font-bold mb-6 text-center">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3 text-sm font-medium">#</th>
                <th className="px-4 py-3 text-sm font-medium">Confirmation</th>
                <th className="px-4 py-3 text-sm font-medium">Services</th>
                <th className="px-4 py-3 text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-sm font-medium">Time</th>
                <th className="px-4 py-3 text-sm font-medium">Total (₹)</th>
                <th className="px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {bookings.map((booking, index) => (
                <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">
                    {booking.confirmationStatus || "Pending"}
                  </td>
                  <td className="px-4 py-3">
                    {booking.services.map((s) => s?.serviceCode || "-").join(", ")}
                  </td>
                  <td className="px-4 py-3">
                    {format(new Date(booking.schedule.date), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-3">{booking.schedule.time}</td>
                  <td className="px-4 py-3 font-semibold">₹{booking.grandTotal}</td>
                  <td className="px-4 py-3 space-x-2">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleOpenServiceDetail(booking._id)}
                    >
                      View
                    </Button>
                    {canReschedule(booking.schedule.date, booking.schedule.time) && (
                      <Button
                        size="small"
                        variant="text"
                        color="secondary"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setRescheduleDialogOpen(true);
                        }}
                      >
                        Reschedule
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 📍 View Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Service Details</DialogTitle>
        <DialogContent dividers>
          {loading ? (
            <div className="flex justify-center p-6">
              <CircularProgress />
            </div>
          ) : (
            serviceDetails.map((service) => (
              <div key={service._id} className="mb-5">
                <h3 className="font-semibold text-lg mb-1">{service.name}</h3>
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <p><strong>Category:</strong> {service.category}</p>
                <p><strong>Details:</strong> {service.description}</p>
                <p>
                  <strong>Price:</strong> ₹{service.price} ({service.priceType})
                </p>
                <hr className="my-3" />
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* 📍 Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onClose={() => setRescheduleDialogOpen(false)}>
        <DialogTitle>Reschedule Booking</DialogTitle>
        <DialogContent>
          <TextField
            type="datetime-local"
            label="New Date & Time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={(e) => {setRescheduleDate(e.target.value); setRescheduleTime(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleRescheduleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default MyBookings;
