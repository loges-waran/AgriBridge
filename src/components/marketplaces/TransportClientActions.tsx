"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function TransportClientActions({ currentUser }: { currentUser: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    vehicleType: "3_TON_TRUCK",
    capacityTons: 3.5,
    isRefrigerated: false,
    baseDistrict: currentUser?.district || "Thanjavur",
    ratePerKm: 35,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/marketplaces/transport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to add vehicle");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          if (!currentUser) {
            window.location.href = "/login";
            return;
          }
          setModalOpen(true);
        }}
        size="sm"
        className="flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Register Vehicle</span>
      </Button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Commercial Vehicle to Fleet"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Vehicle Registration Number</label>
            <input
              type="text"
              required
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              placeholder="e.g. TN 49 B 9876"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="MINI_TRUCK">Tata Ace / Mini Truck</option>
                <option value="3_TON_TRUCK">3.5 Ton Eicher Truck</option>
                <option value="10_TON_GRAIN_LORRY">10 Ton Heavy Grain Lorry</option>
                <option value="REFRIGERATED_CONTAINER">Refrigerated Container (Cold Chain)</option>
                <option value="TRACTOR_TRAILER">Tractor Heavy Trailer</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Base District</label>
              <select
                value={formData.baseDistrict}
                onChange={(e) => setFormData({ ...formData, baseDistrict: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="Thanjavur">Thanjavur</option>
                <option value="Thiruvarur">Thiruvarur</option>
                <option value="Nagapattinam">Nagapattinam</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
                <option value="Madurai">Madurai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Payload Capacity (Tons)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={formData.capacityTons}
                onChange={(e) => setFormData({ ...formData, capacityTons: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Rate (₹/km)</label>
              <input
                type="number"
                min="10"
                required
                value={formData.ratePerKm}
                onChange={(e) => setFormData({ ...formData, ratePerKm: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isRefrigerated}
              onChange={(e) => setFormData({ ...formData, isRefrigerated: e.target.checked })}
              className="rounded text-[#24593c]"
            />
            <span>Refrigerated / Insulated Temperature Controlled Body</span>
          </label>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Register Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
