import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { eventAPI, bookingAPI } from "../api";
import { formatDateTime, getTimezoneAbbr } from "../utils/dateUtils";
import toast from "react-hot-toast";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    attendee_name: "",
    attendee_email: "",
  });

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventAPI.getEvent(id);
      setEvent(data);
    } catch (error) {
      toast.error("Failed to load event details");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBookSlot = async (e) => {
    e.preventDefault();

    if (!bookingForm.attendee_name || !bookingForm.attendee_email) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setBookingLoading(true);
      await bookingAPI.createBooking(id, selectedSlot.id, bookingForm);
      toast.success("Booking successful!");
      setSelectedSlot(null);
      setBookingForm({ attendee_name: "", attendee_email: "" });
      fetchEvent(); // Refresh event data
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to book slot");
    } finally {
      setBookingLoading(false);
    }
  };

  const openBookingModal = (slot) => {
    setSelectedSlot(slot);
  };

  const closeBookingModal = () => {
    setSelectedSlot(null);
    setBookingForm({ attendee_name: "", attendee_email: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Event not found</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Back to Events
        </button>
      </div>
    );
  }

  const availableSlots = event.time_slots.filter((slot) => slot.is_available);
  const bookedSlots = event.time_slots.filter((slot) => !slot.is_available);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
        >
          ← Back to Events
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {event.event.title}
        </h1>
        {event.event.description && (
          <p className="text-gray-600 mb-4">{event.event.description}</p>
        )}

        <div className="flex items-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>Created by {event.event.creator_name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created {formatDateTime(event.event.created_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>Timezone: {getTimezoneAbbr()}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available Slots */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Available Time Slots
          </h2>

          {availableSlots.length === 0 ? (
            <p className="text-gray-600">No available slots for this event.</p>
          ) : (
            <div className="space-y-3">
              {availableSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(slot.start_time)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration:{" "}
                        {formatDateTime(slot.end_time).split(" ").slice(-1)[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {slot.current_bookings}/{slot.max_bookings} booked
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openBookingModal(slot)}
                    className="btn-primary w-full"
                  >
                    Book This Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booked Slots */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <XCircle className="h-5 w-5 text-red-600 mr-2" />
            Booked Time Slots
          </h2>

          {bookedSlots.length === 0 ? (
            <p className="text-gray-600">No slots have been booked yet.</p>
          ) : (
            <div className="space-y-3">
              {bookedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatDateTime(slot.start_time)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration:{" "}
                        {formatDateTime(slot.end_time).split(" ").slice(-1)[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">
                        Fully Booked
                      </p>
                      <p className="text-sm text-gray-600">
                        {slot.current_bookings}/{slot.max_bookings} booked
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Book Time Slot</h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">
                {formatDateTime(selectedSlot.start_time)}
              </p>
              <p className="text-sm text-gray-600">
                Duration:{" "}
                {formatDateTime(selectedSlot.end_time).split(" ").slice(-1)[0]}
              </p>
            </div>

            <form onSubmit={handleBookSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="attendee_name"
                  value={bookingForm.attendee_name}
                  onChange={handleBookingFormChange}
                  className="input-field"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="attendee_email"
                  value={bookingForm.attendee_email}
                  onChange={handleBookingFormChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
