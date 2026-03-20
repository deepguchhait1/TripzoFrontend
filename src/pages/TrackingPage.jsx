import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PageLoader from "../components/PageLoader";

const TrackingPage = () => {
  const { trackingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/bookings/track/${trackingId}`
        );
        setBooking(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load booking details"
        );
        setBooking(null);
      } finally {
        setLoading(false);
      }
    };

    if (trackingId) {
      fetchTrackingData();
    }
  }, [trackingId]);

  if (loading) return <PageLoader />;

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-50 border-yellow-300 text-yellow-800",
      confirmed: "bg-green-50 border-green-300 text-green-800",
      cancelled: "bg-red-50 border-red-300 text-red-800",
      completed: "bg-blue-50 border-blue-300 text-blue-800",
    };
    return colors[status] || colors.pending;
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4  bg-gray-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Booking Not Found
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 font-serif">
            Travel Booking Ticket
          </h1>
          <p className="text-amber-700">Your Journey Tracker</p>
        </div>

        {/* Main Ticket */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-amber-300">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-8 text-white">
            <div className="text-center mb-4">
              <h2 className="text-5xl font-bold font-serif tracking-widest">
                TICKET
              </h2>
              <p className="text-amber-100 text-sm tracking-widest mt-2">
                YOUR TRUSTED TRAVEL PARTNER
              </p>
            </div>
            <div className="border-t-2 border-amber-400 pt-4 mt-4 text-center">
              <p className="text-amber-100 text-xs font-mono">
                Tracking ID: {booking.trackingId}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`${getStatusColor(
              booking.status
            )} border-l-4 p-4 text-center`}
          >
            <p className="text-xs font-bold tracking-widest mb-1">
              BOOKING STATUS
            </p>
            <p className="text-xl font-bold">{booking.statusLabel}</p>
          </div>

          {/* Main Content */}
          <div className="p-8">
            {/* Traveler Info */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-amber-900 tracking-widest mb-4 pb-2 border-b-2 border-amber-300">
                TRAVELER INFORMATION
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-amber-700 font-semibold">Name:</span>
                  <span className="text-amber-900 font-bold">{booking.name}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-amber-700 font-semibold">Email:</span>
                  <span className="text-amber-900 text-sm">{booking.email}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-amber-700 font-semibold">Phone:</span>
                  <span className="text-amber-900 text-sm">{booking.phone}</span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-amber-900 tracking-widest mb-4 pb-2 border-b-2 border-amber-300">
                TRIP DETAILS
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-amber-700 font-semibold">Trip:</span>
                  <span className="text-amber-900 font-bold">
                    {booking.tripName}
                  </span>
                </div>
                {booking.package && (
                  <div className="flex justify-between items-start">
                    <span className="text-amber-700 font-semibold">
                      Package:
                    </span>
                    <div className="text-amber-900">
                      <p>{booking.package.title}</p>
                      <p className="text-xs text-amber-600">
                        ({booking.package.duration})
                      </p>
                    </div>
                  </div>
                )}
                {booking.destination && (
                  <div className="flex justify-between items-start">
                    <span className="text-amber-700 font-semibold">
                      Destination:
                    </span>
                    <span className="text-amber-900">
                      {booking.destination.title}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <span className="text-amber-700 font-semibold">
                    Travel Date:
                  </span>
                  <span className="text-amber-900">
                    {new Date(booking.travelDate).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-amber-700 font-semibold">
                    Travelers:
                  </span>
                  <span className="text-amber-900">
                    {booking.travelers} person
                    {booking.travelers > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-amber-50 rounded-lg p-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-amber-700 font-bold">Total Price:</span>
                <span className="text-2xl font-bold text-amber-900">
                  ₹{booking.totalPrice?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-amber-900 tracking-widest mb-2 pb-2 border-b-2 border-amber-300">
                  SPECIAL REQUESTS
                </h3>
                <p className="text-amber-800 text-sm italic">
                  {booking.specialRequests}
                </p>
              </div>
            )}

            {/* Booking Timeline */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-amber-900 tracking-widest mb-4 pb-2 border-b-2 border-amber-300">
                BOOKING TIMELINE
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-amber-700">Booking Date:</span>
                  <span className="text-amber-900">
                    {new Date(booking.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white text-center">
            <p className="text-sm mb-2">
              📧 tripzo.india.01@gmail.com | 📞 +91 123 456 7890
            </p>
            <p className="text-xs text-amber-100">
              © {new Date().getFullYear()} Tripzo. All rights reserved.
            </p>
          </div>
        </div>

        {/* Help CTA */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
