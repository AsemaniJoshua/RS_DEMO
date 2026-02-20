"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { appointmentService } from "@/services/appointment-service";
import toast from "react-hot-toast";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [types, setTypes] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // Assume user email is available from localStorage or context
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    typeId: "",
    date: "",
    time: "",
    duration: "30 min",
    reason: "",
    notes: "",
  });

  // On mount, extract patientEmail from localStorage (user object or user_email)
  useEffect(() => {
    let patientEmail = "";
    if (typeof window !== "undefined") {
      const userRaw = localStorage.getItem("user");
      if (userRaw) {
        try {
          const parsed = JSON.parse(userRaw);
          patientEmail = parsed.email || parsed.patientEmail || "";
        } catch {
          // fallback: not a JSON object
        }
      }
      if (!patientEmail) {
        patientEmail = localStorage.getItem("user_email") || "";
      }
      if (patientEmail) {
        setFormData((prev) => ({ ...prev, patientEmail }));
      }
    }
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const data = await appointmentService.getAllTypes();
        setTypes(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, typeId: data[0].id }));
        }
      } catch (error) {
        toast.error("Failed to fetch appointment types");
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Show confirmation modal first
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      toast.error("Appointment date must be in the future");
      setShowConfirmModal(false);
      return;
    }
    setIsSubmitting(true);
    try {
      // Get userId from localStorage (string or from user object)
      let userId = "";
      let patientEmail = formData.patientEmail;
      if (typeof window !== "undefined") {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
          try {
            const parsed = JSON.parse(userRaw);
            userId = parsed.id || parsed.userId || "";
            if (!patientEmail) patientEmail = parsed.email || parsed.patientEmail || "";
          } catch {
            userId = userRaw;
          }
        }
        if (!patientEmail) {
          patientEmail = localStorage.getItem("user_email") || "";
        }
      }
      const payload = {
        patientName: formData.patientName,
        patientEmail,
        patientPhone: formData.patientPhone,
        typeId: formData.typeId,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        reason: formData.reason,
        notes: formData.notes,
        userId,
      };
      // Debugging: Log the payload before sending
      console.log("Appointment creation payload:", payload);
      const created = await appointmentService.createMyAppointment(payload);
      if (created && created.id) {
        toast.success("Appointment booked successfully");
        router.push(`/dashboard/appointments/${created.id}`);
      } else {
        toast.error("Appointment creation failed: No appointment returned.");
        console.error("Appointment creation response:", created);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to book appointment");
      console.error("Appointment creation error:", error);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton
          href="/dashboard/appointments"
          label="Back"
          className="mb-0"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book New Appointment
          </h1>
          <p className="text-gray-600">
            Schedule a consultation with Dr. George
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-600">
              <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-1">Important Notice</h3>
            <p className="text-sm text-amber-800">
              Once you create this appointment, you <strong>cannot edit</strong> the details. 
              You can only cancel it and create a new one if needed. Please ensure all information is correct before submitting.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 space-y-6">
          {/* Patient Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Information
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                placeholder="e.g., Sarah Johnson"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  disabled
                  required
                  placeholder="patient@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  value={formData.patientPhone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                />
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200"></div>
          {/* Appointment Details Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Appointment Details
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Appointment Type <span className="text-red-500">*</span>
              </label>
              <select
                name="typeId"
                value={formData.typeId}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900 disabled:bg-gray-50"
              >
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 30 min, 1 hour, 45 min"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: "30 min", "1 hour", etc.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reason of Appointment <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                placeholder="e.g., Discuss new diabetes medication"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-[#00d4aa] focus:outline-none text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Additional Notes
              </label>
              <RichTextEditor
                value={formData.notes}
                onChange={(value) => setFormData({ ...formData, notes: value })}
                placeholder="Add any additional notes about the appointment..."
                minHeight="150px"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </button>
            <BackButton
              href="/dashboard/appointments"
              label="Cancel"
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium mt-6"
            />
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => !isSubmitting && setShowConfirmModal(false)}
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
              {/* Icon */}
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-600">
                  <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Confirm Appointment</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Please confirm that all details are correct. <strong>You will not be able to edit this appointment</strong> after creation. You can only cancel and create a new one.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Review Details
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-[#0066ff] text-white rounded-lg hover:bg-[#0052cc] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm & Book"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
