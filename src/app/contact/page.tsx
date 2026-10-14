"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    district: "Thanjavur",
    category: "GENERAL",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20 bg-[#fbfbfa]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-[#24593c] uppercase tracking-wider">
            Farmer Support & Grievance Cell
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 mt-2">
            Contact AgriBridge Platform Support
          </h1>
          <p className="mt-2 text-stone-600 text-sm">
            Have a question regarding project coordination, KYC documentation, or dispute mediation? Our regional coordinators are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Direct channels */}
          <div className="space-y-4">
            <div className="agri-card p-5">
              <div className="flex items-center gap-3 mb-2 text-[#24593c]">
                <Phone className="w-5 h-5" />
                <h4 className="text-sm font-bold text-stone-900">Farmer Toll-Free Helpline</h4>
              </div>
              <p className="text-xs text-stone-600">+91 (04362) 284 910</p>
              <p className="text-[11px] text-stone-400 mt-1">Mon - Sat: 6:00 AM - 8:00 PM</p>
            </div>

            <div className="agri-card p-5">
              <div className="flex items-center gap-3 mb-2 text-[#24593c]">
                <Mail className="w-5 h-5" />
                <h4 className="text-sm font-bold text-stone-900">Grievance & Support Email</h4>
              </div>
              <p className="text-xs text-stone-600">support@agribridge.org</p>
              <p className="text-[11px] text-stone-400 mt-1">Avg response time: &lt; 4 hours</p>
            </div>

            <div className="agri-card p-5">
              <div className="flex items-center gap-3 mb-2 text-[#24593c]">
                <MapPin className="w-5 h-5" />
                <h4 className="text-sm font-bold text-stone-900">Cauvery Delta Hub</h4>
              </div>
              <p className="text-xs text-stone-600">
                14 Court Road, Near Collectorate, Thanjavur, Tamil Nadu 613001
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="agri-card p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-[#24593c] mx-auto mb-3" />
                  <h3 className="text-base font-bold text-stone-900">Message Received</h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                    Thank you. Ticket #AGRI-{(Math.random() * 89999 + 10000).toFixed(0)} has been logged in our dispute/support queue. A regional field officer will contact you.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                        placeholder="e.g. Senthil Kumar"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Phone / Email
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                        placeholder="+91 98400 00000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        District
                      </label>
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                      >
                        <option value="Thanjavur">Thanjavur</option>
                        <option value="Thiruvarur">Thiruvarur</option>
                        <option value="Nagapattinam">Nagapattinam</option>
                        <option value="Tiruchirappalli">Tiruchirappalli</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Other">Other District</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                      >
                        <option value="GENERAL">General Query</option>
                        <option value="KYC">KYC & Document Verification</option>
                        <option value="DISPUTE">Dispute / Payment Mediation</option>
                        <option value="TECH">Technical Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Message / Grievance Details
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                      placeholder="Describe your query or reference project/order number..."
                    />
                  </div>

                  <Button type="submit" size="sm" className="w-full sm:w-auto">
                    Submit Support Request
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
