import { useState, useEffect } from "react";
import { Calendar, Clock, User, Mail, Search } from "lucide-react";
import { bookingAPI } from "../api";
import { formatDateTime } from "../utils/dateUtils";
import toast from "react-hot-toast";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setLoading(true);
      const data = await bookingAPI.getUserBookings(email.trim());
      setBookings(data);
      setSearched(true);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (searched) {
      setSearched(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">
          View all your event bookings by entering your email address
        </p>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="input-field"
              placeholder="Enter your email to view bookings"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {!loading && searched && (
        <div>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-600">
                No bookings found for {email}. Make sure you've entered the
                correct email address.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Your Bookings ({bookings.length})
              </h2>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.time_slot.event?.title || "Event"}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{booking.attendee_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            <span>{booking.attendee_email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Booked on {formatDateTime(booking.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {formatDateTime(booking.time_slot.start_time)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              Duration:{" "}
                              {
                                formatDateTime(booking.time_slot.end_time)
                                  .split(" ")
                                  .slice(-1)[0]
                              }
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Slot: {booking.time_slot.current_bookings}/
                          {booking.time_slot.max_bookings} booked
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Search for your bookings
          </h3>
          <p className="text-gray-600">
            Enter your email address above to view all your event bookings.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
