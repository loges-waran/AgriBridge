"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function MachineryClientActions({ currentUser }: { currentUser: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "TRACTOR",
    modelYear: 2024,
    specs: "",
    rateType: "HOURLY" as "HOURLY" | "DAILY" | "PER_ACRE",
    rentalRate: 950,
    district: currentUser?.district || "Thanjavur",
    serviceRadiusKm: 30,
    providesOperator: true,
    fuelIncluded: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/marketplaces/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to list machinery");
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
        <span>List Agricultural Machinery</span>
      </Button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="List Machinery for Rental"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Equipment Name & Model</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              placeholder="e.g. Mahindra 575 DI 45HP Tractor + Rotavator"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="TRACTOR">Tractor</option>
                <option value="HARVESTER">Combine Harvester</option>
                <option value="DRONE">Drone Sprayer</option>
                <option value="TILLER">Power Tiller</option>
                <option value="SPRAYER">Boom Sprayer</option>
                <option value="PUMP">Solar / Diesel Pump</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="Thanjavur">Thanjavur</option>
                <option value="Thiruvarur">Thiruvarur</option>
                <option value="Nagapattinam">Nagapattinam</option>
                <option value="Tiruchirappalli">Tiruchirappalli</option>
                <option value="Madurai">Madurai</option>
                <option value="Coimbatore">Coimbatore</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Rate Type</label>
              <select
                value={formData.rateType}
                onChange={(e) => setFormData({ ...formData, rateType: e.target.value as any })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="HOURLY">Hourly Rate</option>
                <option value="PER_ACRE">Per Acre Rate</option>
                <option value="DAILY">Daily Rate</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Rental Price (₹)</label>
              <input
                type="number"
                min="100"
                required
                value={formData.rentalRate}
                onChange={(e) => setFormData({ ...formData, rentalRate: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Specifications</label>
            <textarea
              rows={2}
              value={formData.specs}
              onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              placeholder="e.g. 45 HP, 4-wheel drive, includes heavy duty multi-speed rotavator"
            />
          </div>

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.providesOperator}
                onChange={(e) => setFormData({ ...formData, providesOperator: e.target.checked })}
                className="rounded text-[#24593c]"
              />
              <span>Includes Trained Driver / Operator</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.fuelIncluded}
                onChange={(e) => setFormData({ ...formData, fuelIncluded: e.target.checked })}
                className="rounded text-[#24593c]"
              />
              <span>Fuel (Diesel) Included</span>
            </label>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Publish Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
