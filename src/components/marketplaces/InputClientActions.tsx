"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function InputClientActions({ currentUser }: { currentUser: any }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "SEED",
    brand: "TNAU Certified",
    packageSize: "25 kg bag",
    unitPrice: 1650,
    stockQuantity: 100,
    isOrganic: true,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/marketplaces/inputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setModalOpen(false);
        window.location.reload();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to add product");
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
        <span>List Agricultural Input</span>
      </Button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Input Product to Catalog"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              placeholder="e.g. Certified CR 1009 Sub-1 Flood Resistant Seeds"
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
                <option value="SEED">Certified Seeds</option>
                <option value="FERTILIZER">Bio-NPK Fertilizer</option>
                <option value="ORGANIC_PESTICIDE">Organic Bio-Shield</option>
                <option value="IRRIGATION">Drip / Irrigation Kit</option>
                <option value="TOOL">Farm Tools & Equipment</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand / Source</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                placeholder="e.g. TNAU Certified / DeltaBio"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Package Size</label>
              <input
                type="text"
                required
                value={formData.packageSize}
                onChange={(e) => setFormData({ ...formData, packageSize: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
                placeholder="50 kg bag"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Unit Price (₹)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Stock Units</label>
              <input
                type="number"
                min="1"
                required
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Product Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded"
              placeholder="Dosage, germination percentage, certification numbers..."
            />
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.isOrganic}
              onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
              className="rounded text-[#24593c]"
            />
            <span>Certified Organic / Zero Synthetic Chemical</span>
          </label>

          <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Save to Catalog
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
