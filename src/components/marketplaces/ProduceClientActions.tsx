"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function ProduceClientActions({ currentUser }: { currentUser: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cropName: "Paddy",
    variety: "Deluxe Ponni (BPT 5204)",
    grade: "GRADE_A",
    quantityKg: 10000,
    minimumOrderKg: 1000,
    expectedHarvestDate: "2026-10-25",
    isPreHarvestListing: true,
    askingPricePerKg: 31.5,
    packagingType: "75 kg Jute Bags",
    locationDistrict: currentUser?.district || "Thanjavur",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/marketplaces/produce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to list produce");
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
        <span>List Farm Harvest</span>
      </Button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="List Produce for Mandi / Pre-Harvest Sale"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Crop Name</label>
              <select
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="Paddy">Paddy (Rice)</option>
                <option value="Turmeric">Turmeric</option>
                <option value="Tomato">Tomato</option>
                <option value="Banana">Banana</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Groundnut">Groundnut</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Variety</label>
              <input
                type="text"
                value={formData.variety}
                onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                placeholder="e.g. Deluxe Ponni"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Quality Grade</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="GRADE_A">Grade A (Export / Premium)</option>
                <option value="GRADE_B">Grade B (Standard Mandi)</option>
                <option value="ORGANIC_CERTIFIED">Certified Organic</option>
                <option value="UNGRADED">Ungraded Field Run</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">District</label>
              <select
                value={formData.locationDistrict}
                onChange={(e) => setFormData({ ...formData, locationDistrict: e.target.value })}
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

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Total Quantity (Kg)</label>
              <input
                type="number"
                min="100"
                required
                value={formData.quantityKg}
                onChange={(e) => setFormData({ ...formData, quantityKg: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Min Order (Kg)</label>
              <input
                type="number"
                min="50"
                required
                value={formData.minimumOrderKg}
                onChange={(e) => setFormData({ ...formData, minimumOrderKg: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Asking (₹/kg)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={formData.askingPricePerKg}
                onChange={(e) => setFormData({ ...formData, askingPricePerKg: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Expected Harvest Date</label>
              <input
                type="date"
                required
                value={formData.expectedHarvestDate}
                onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Packaging Type</label>
              <input
                type="text"
                value={formData.packagingType}
                onChange={(e) => setFormData({ ...formData, packagingType: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                placeholder="75 kg Jute Bags"
              />
            </div>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isPreHarvestListing}
              onChange={(e) => setFormData({ ...formData, isPreHarvestListing: e.target.checked })}
              className="rounded text-[#24593c]"
            />
            <span>Pre-Harvest Advance Booking (Negotiate forward contract before cutting)</span>
          </label>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Publish Harvest Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
