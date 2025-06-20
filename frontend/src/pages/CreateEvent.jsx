import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, Plus, X, User, Mail } from "lucide-react";
import { eventAPI } from "../api";
import { localToUTC, getTimezoneAbbr } from "../utils/dateUtils";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    creator_name: "",
    creator_email: "",
    time_slots: [],
  });

  const [newSlot, setNewSlot] = useState({
    start_time: "",
    end_time: "",
    max_bookings: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addTimeSlot = () => {
    if (!newSlot.start_time || !newSlot.end_time) {
      toast.error("Please fill in both start and end times");
      return;
    }

    if (new Date(newSlot.end_time) <= new Date(newSlot.start_time)) {
      toast.error("End time must be after start time");
      return;
    }

    const slot = {
      start_time: localToUTC(newSlot.start_time),
      end_time: localToUTC(newSlot.end_time),
      max_bookings: parseInt(newSlot.max_bookings),
    };

    setFormData((prev) => ({
      ...prev,
      time_slots: [...prev.time_slots, slot],
    }));

    setNewSlot({
      start_time: "",
      end_time: "",
      max_bookings: 1,
    });

    toast.success("Time slot added");
  };

  const removeTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      time_slots: prev.time_slots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.creator_name || !formData.creator_email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.time_slots.length === 0) {
      toast.error("Please add at least one time slot");
      return;
    }

    try {
      setLoading(true);
      await eventAPI.createEvent(formData);
      toast.success("Event created successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const formatSlotTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600">
          Set up your event with available time slots
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Event Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter event title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
                placeholder="Enter event description (optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="creator_name"
                  value={formData.creator_name}
                  onChange={handleInputChange}
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
                  name="creator_email"
                  value={formData.creator_email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Time Slots</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add available time slots for your event (Timezone:{" "}
            {getTimezoneAbbr()})
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={newSlot.start_time}
                  onChange={handleSlotChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={newSlot.end_time}
                  onChange={handleSlotChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Bookings
                </label>
                <input
                  type="number"
                  name="max_bookings"
                  value={newSlot.max_bookings}
                  onChange={handleSlotChange}
                  className="input-field"
                  min="1"
                  max="10"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addTimeSlot}
              className="btn-secondary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </button>
          </div>

          {formData.time_slots.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Added Time Slots</h3>
              <div className="space-y-2">
                {formData.time_slots.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-medium">
                          {formatSlotTime(slot.start_time)} -{" "}
                          {formatSlotTime(slot.end_time)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Max bookings: {slot.max_bookings}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTimeSlot(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
