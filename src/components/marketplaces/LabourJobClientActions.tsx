"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function LabourJobClientActions({ currentUser }: { currentUser: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    workType: "Transplanting",
    location: currentUser?.district || "Thanjavur",
    district: currentUser?.district || "Thanjavur",
    workersNeeded: 6,
    wagePerDay: 650,
    startDate: "2026-06-20",
    endDate: "2026-06-23",
    workingHours: "8 hours / day (7 AM - 3 PM)",
    providesFood: true,
    providesTransport: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/marketplaces/labour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to post job requirement");
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
        <span>Post Work Requirement</span>
      </Button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Post Farm Labour Requirement"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              placeholder="e.g. SRI Method Paddy Line Transplanting"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Work Type</label>
              <select
                value={formData.workType}
                onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              >
                <option value="Transplanting">Transplanting</option>
                <option value="Weeding">Weeding</option>
                <option value="Spraying">Spraying</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Threshing">Threshing</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">District</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value, location: e.target.value })}
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
              <label className="block font-semibold text-stone-700 mb-1">Workers Needed</label>
              <input
                type="number"
                min="1"
                required
                value={formData.workersNeeded}
                onChange={(e) => setFormData({ ...formData, workersNeeded: parseInt(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Daily Wage (₹/worker)</label>
              <input
                type="number"
                min="300"
                required
                value={formData.wagePerDay}
                onChange={(e) => setFormData({ ...formData, wagePerDay: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.providesFood}
                onChange={(e) => setFormData({ ...formData, providesFood: e.target.checked })}
                className="rounded text-[#24593c]"
              />
              <span>Provides Lunch/Tea</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.providesTransport}
                onChange={(e) => setFormData({ ...formData, providesTransport: e.target.checked })}
                className="rounded text-[#24593c]"
              />
              <span>Provides Pickup Transport</span>
            </label>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Publish Job Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
