'use client';
import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';

const World = memo(dynamic(() => import('../components/globe').then((m) => m.World), {
  ssr: false,
}));

const globeConfig = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
};

const colors = ["#06b6d4", "#3b82f6", "#6366f1"];
const sampleArcs = [
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.2,
    color: colors[0],
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.2,
    color: colors[1],
  },
];

export default function WandererPage() {
  const [showModal, setShowModal] = useState(false);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    locationType: '',
    internet: '',
    budget: '',
    weather: '',
    accommodation: '',
    coworking: false,
    noiseSensitive: false,
    petFriendly: false,
    communityType: '',
    transport: '',
    visaFree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setRecommendation(data.recommendations);
      setShowModal(true);
    } catch (err) {
      console.error("Recommendation Error:", err);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-7xl gap-8 items-center">

        {/* 🧠 FORM SIDE */}
        {/* 🧠 Enhanced Chat Form Side */}
        <motion.div
          className="w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-cyan-400 text-center mb-3">Wanderer.ai</h1>
          <p className="text-center text-sm text-gray-300 mb-6">Plan your perfect nomadic lifestyle 🌍</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <Input label="City Name" name="city" value={formData.city} onChange={handleChange} />
            <Select label="Location Type" name="locationType" value={formData.locationType} onChange={handleChange}
              options={['Peaceful', 'Remote', 'City']} />
            <Select label="Internet" name="internet" value={formData.internet} onChange={handleChange}
              options={['High-Speed', 'Basic', 'Not Required']} />
            <Input label="Budget (USD)" type="number" name="budget" value={formData.budget} onChange={handleChange} />
            <Select label="Weather" name="weather" value={formData.weather} onChange={handleChange}
              options={['Cold', 'Moderate', 'Warm', 'Tropical']} />
            <Select label="Accommodation" name="accommodation" value={formData.accommodation} onChange={handleChange}
              options={['Apartment', 'Co-living', 'Hostel', 'Airbnb', 'Guesthouse']} />
            <Select label="Community" name="communityType" value={formData.communityType} onChange={handleChange}
              options={['Spiritual', 'Artistic', 'Tech', 'Solo']} />
            <Select label="Transport" name="transport" value={formData.transport} onChange={handleChange}
              options={['Public', 'Bike Rental', 'Walkable']} />

            <div className="col-span-2 grid grid-cols-2 gap-4">
              <Checkbox label="Co-working" name="coworking" checked={formData.coworking} onChange={handleChange} />
              <Checkbox label="Noise Sensitive" name="noiseSensitive" checked={formData.noiseSensitive} onChange={handleChange} />
              <Checkbox label="Pet Friendly" name="petFriendly" checked={formData.petFriendly} onChange={handleChange} />
              <Checkbox label="Visa-Free" name="visaFree" checked={formData.visaFree} onChange={handleChange} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`col-span-2 mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-2 rounded-xl transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
                }`}
            >
              {loading && (
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Thinking..." : "Get Recommendation"}
            </button>

          </form>
        </motion.div>

        {/* 🌍 GLOBE SIDE */}
        <div className="h-[500px] md:h-[600px] shrink-0 w-full overflow-hidden rounded-3xl shadow-xl">
          <World data={sampleArcs} globeConfig={globeConfig} />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-6 shadow-2xl text-white">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-white/80 hover:text-white text-xl font-bold"
              aria-label="Close"
            >
              ×
            </button>

            {/* Modal Content */}
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4 text-center">🌍 Suggested Destinations</h2>
            <div className="prose prose-invert max-w-none prose-p:my-2 prose-li:my-1 text-white text-sm leading-relaxed">
              <ReactMarkdown>{recommendation}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
function Input({ label, name, value, onChange, type = 'text' }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-300">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="bg-white/10 border border-white/20 text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-300">{label}</label>
      {/* Updated className for the select element */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-lg outline-none focus:ring-2 focus:ring-cyan-400 appearance-none pr-8 transition-all duration-200" // Added appearance-none and pr-8
      >
        <option value="" disabled>Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()} className="bg-gray-700 text-white"> {/* Styled options */}
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}


function Checkbox({ label, name, checked, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" name={name} checked={checked} onChange={onChange} />
      <label className="text-gray-300">{label}</label>
    </div>
  );
}
