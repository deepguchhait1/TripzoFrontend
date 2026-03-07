import { useState } from "react";
import { FaStar, FaPaperPlane, FaCheckCircle, FaTimes, FaPen } from "react-icons/fa";
import { submitReview } from "../../services/api";
import toast from "react-hot-toast";

const ReviewForm = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    tour: "",
    rating: 0,
    text: "",
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetAndClose = () => {
    setOpen(false);
    setSubmitted(false);
    setForm({ name: "", location: "", tour: "", rating: 0, text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim() || !form.tour.trim() || !form.text.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (form.text.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }
    setSubmitting(true);
    try {
      await submitReview({ ...form, rating: Number(form.rating) });
      setSubmitted(true);
      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Review Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white pl-5 pr-6 py-3.5 rounded-full font-semibold text-sm shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95"
      >
        <FaPen className="text-xs" /> Write a Review
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {submitted ? (
              /* Success State */
              <div className="p-10 text-center">
                <button
                  onClick={resetAndClose}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes />
                </button>
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-emerald-600 text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Thank You!
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  Your review has been submitted and will appear after approval by our team.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={resetAndClose}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", location: "", tour: "", rating: 0, text: "" });
                    }}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Write Another
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <FaStar className="text-amber-400" /> Write a Review
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Share your travel experience with others
                    </p>
                  </div>
                  <button
                    onClick={resetAndClose}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  {/* Name & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Priya Sharma"
                        maxLength={100}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai, India"
                        maxLength={100}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Tour */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Tour / Package Name
                    </label>
                    <input
                      type="text"
                      name="tour"
                      value={form.tour}
                      onChange={handleChange}
                      placeholder="e.g. Goa Beach Getaway"
                      maxLength={200}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm transition-colors"
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <FaStar
                            className={`text-2xl transition-colors ${
                              star <= (hoveredStar || form.rating)
                                ? "text-amber-400"
                                : "text-gray-200"
                            }`}
                          />
                        </button>
                      ))}
                      {form.rating > 0 && (
                        <span className="ml-2 text-sm text-gray-500 font-medium">
                          {form.rating}.0 / 5.0
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Your Review
                    </label>
                    <textarea
                      name="text"
                      value={form.text}
                      onChange={handleChange}
                      placeholder="Tell us about your experience — what did you enjoy most?"
                      rows={4}
                      maxLength={1000}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-y leading-relaxed transition-colors"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      {form.text.length}/1000
                    </p>
                  </div>

                  {/* Note */}
                  <div className="bg-emerald-50 rounded-xl p-3.5 text-sm text-emerald-700 flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>
                      Your review will be published after approval by our team.
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetAndClose}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane /> Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
