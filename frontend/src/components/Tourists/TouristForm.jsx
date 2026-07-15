import React, { useState } from "react";
import { registerTourist } from "../../services/touristService";

function TouristForm({ onRegister }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    emergencyContact: "",
    zone: "Pilot Tourist Safety Zone",
    hotel: "",
    visitPurpose: "",
    visitDate: "",
    trackingConsent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerTourist(formData);

      alert("Tourist Registered Successfully");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        emergencyContact: "",
        zone: "Pilot Tourist Safety Zone",
        hotel: "",
        visitPurpose: "",
        visitDate: "",
        trackingConsent: false,
      });

      if (onRegister) onRegister();
    } catch (err) {
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-semibold">
        Register Tourist
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-5"
      >
        <input
          className="border rounded-lg p-3"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          className="border rounded-lg p-3"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="border rounded-lg p-3"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          className="border rounded-lg p-3"
          name="country"
          placeholder="Country / State"
          value={formData.country}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          name="emergencyContact"
          placeholder="Emergency Contact"
          value={formData.emergencyContact}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          name="hotel"
          placeholder="Hotel"
          value={formData.hotel}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          name="zone"
          value={formData.zone}
          onChange={handleChange}
        />

        <input
          className="border rounded-lg p-3"
          name="visitPurpose"
          placeholder="Visit Purpose"
          value={formData.visitPurpose}
          onChange={handleChange}
        />

        <input
          type="date"
          className="border rounded-lg p-3"
          name="visitDate"
          value={formData.visitDate}
          onChange={handleChange}
        />

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="trackingConsent"
            checked={formData.trackingConsent}
            onChange={handleChange}
          />
          Tracking Consent
        </label>

        <button
          className="col-span-2 rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Register Tourist
        </button>
      </form>
    </div>
  );
}

export default TouristForm;