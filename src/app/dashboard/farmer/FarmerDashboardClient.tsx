"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Sprout,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  Users,
  Wrench,
  Coins,
  ShoppingBag,
  Package,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Bot,
  CloudSun,
  Droplet,
  Wind,
  Compass,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tag,
  ShieldCheck,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getProjectCardImage, getCropImage } from "@/lib/imageMap";
import { voicePlayer } from "@/lib/voice/voiceService";

interface FarmerClientProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    district: string | null;
    state: string | null;
    kycStatus: string;
    activeRole: string;
    roles: string[];
  };
  data: {
    farms: any[];
    projects: any[];
    produceListings: any[];
    inputOrders: any[];
    labourJobs: any[];
    machineryBookings: any[];
    investmentProposals: any[];
  };
}

interface AiChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  spokenText?: string;
  topic?: string;
  sources?: any[];
  followUps?: string[];
}

const QUICK_SUGGESTIONS = [
  "🌾 How to control yellow stem borer in paddy?",
  "📋 Uzhavan App machinery subsidy process",
  "💰 Today's paddy MSP procurement rate",
  "🧪 Kuruvai bio-fertilizer dosage per acre",
  "💧 Micro-irrigation subsidy in Tamil Nadu",
];

export function FarmerDashboardClient({ user, data }: FarmerClientProps) {
  const {
    farms,
    projects,
    produceListings,
    inputOrders,
    labourJobs,
    machineryBookings,
    investmentProposals,
  } = data;

  // Real database metrics calculation
  const totalAcres = farms.reduce((acc, f) => acc + (f.totalAcres || 0), 0);
  const totalOpenGaps = projects.reduce(
    (acc, p) => acc + (p.resourceGaps?.filter((g: any) => g.status === "OPEN").length || 0),
    0
  );
  const totalExpenses = projects.reduce(
    (acc, p) => acc + (p.expenses?.reduce((eAcc: number, e: any) => eAcc + (e.amount || 0), 0) || 0),
    0
  );
  const totalOffersCount = produceListings.reduce(
    (acc, l) => acc + (l.offers?.length || 0),
    0
  );
  const totalWorkersHired = labourJobs.reduce(
    (acc, j) => acc + (j.applications?.filter((a: any) => a.status === "ACCEPTED").length || 0),
    0
  );

  // Embedded AgriVoice AI State
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: "initial",
      sender: "assistant",
      text: "வணக்கம்! நான் அக்ரிபிரிட்ஜ் வேளாண்மை உதவியாளர். தமிழ்நாடு வேளாண் பல்கலைக்கழகம் (TNAU) பரிந்துரைக்கும் நெல் சாகுபடி, உழவன் மானியங்கள் அல்லது நேரடி மண்டி கொள்முதல் விலை பற்றி என்னிடம் கேளுங்கள்.",
      spokenText:
        "வணக்கம்! நான் அக்ரிபிரிட்ஜ் வேளாண்மை உதவியாளர். நெல் சாகுபடி அல்லது அரசு மானியங்கள் பற்றி என்ன உதவி வேண்டும்?",
      topic: "TNAU Agronomic Guidance",
      sources: [
        {
          title: "Tamil Nadu Agricultural University Crop Guidelines",
          organization: "TNAU Agritech Portal",
        },
      ],
      followUps: [
        "குறுவை பயிர் உரம் அளவு என்ன?",
        "நெல் தண்டு துளைப்பான் மருந்து என்ன?",
        "உழவன் செயலி மானியம் எவ்வாறு பெறுவது?",
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading]);

  // Handle Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      alert("Speech recognition is not supported in this browser. Please use text input.");
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = "ta-IN"; // Default to Tamil, handles English query context smoothly
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendQuery(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Send query to /api/intelligence/assistant
  const handleSendQuery = async (queryText?: string) => {
    const q = (queryText || inputText).trim();
    if (!q || isAiLoading) return;

    setInputText("");
    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/intelligence/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          locale: "ta",
        }),
      });

      if (!res.ok) throw new Error("Assistant request failed");
      const result = await res.json();

      const botMsg: AiChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: result.answer,
        spokenText: result.spokenText,
        topic: result.topic,
        sources: result.sources,
        followUps: result.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Speak if enabled
      if (autoSpeak && result.spokenText) {
        voicePlayer.play(result.spokenText, { locale: "ta" });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "மன்னிக்கவும், தகவல் பெறுவதில் தாமதம் ஏற்பட்டுள்ளது. சற்று கழித்து முயற்சிக்கவும் அல்லது வட்டார வேளாண் அலுவலகத்தை தொடர்பு கொள்ளவும்.",
          topic: "Network Notice",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const playSpeech = (text: string) => {
    voicePlayer.play(text, { locale: "ta" });
  };

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. AGRICULTURE-THEMED WELCOME BANNER WITH AGRO-MET WEATHER INTEGRATION */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-md border border-stone-200">
          <img
            src="/images/hero/tamilnadu-farmland-hero.jpg"
            alt="Authentic lush farmland and paddy in Tamil Nadu Cauvery Delta"
            loading="eager"
            className="w-full h-52 sm:h-60 object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-[#1e4731]/80 to-transparent" />

          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-semibold mb-2">
                  <Sprout className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tamil Nadu Cultivator Ecosystem</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow tracking-tight">
                  Vanakkam, {user.fullName.split("[")[0]}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
                  District: <span className="font-semibold text-white">{user.district || "Thanjavur, Cauvery Delta"}</span> •
                  Status:{" "}
                  <span className="font-semibold text-emerald-300">
                    {user.kycStatus === "VERIFIED" ? "Patta Verified Cultivator" : "Registration Active"}
                  </span>
                </p>
              </div>

              {/* Weather & Seasonal Agro-Met Block */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-white flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center text-amber-300">
                  <CloudSun className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">29°C</span>
                    <span className="text-[11px] text-emerald-200">Partly Cloudy</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-emerald-100/80 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-cyan-300" /> 74% Humidity
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-stone-200" /> 14 km/h
                    </span>
                  </div>
                  <div className="text-[10px] text-amber-200 font-semibold mt-1">
                    🌾 Season: Kuruvai / Samba Sowing Window
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-emerald-200 hidden md:block">
                TNAU Advisory: Favorable dry spell for line transplanting and drone bio-fertilizer spraying.
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white text-[#1e4731] font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Start Farm Project</span>
                </Link>
                <Link
                  href="/marketplaces/produce"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-xs border border-emerald-600/40 transition-colors shadow-2xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Sell Harvest</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SUMMARY CARDS (5 KEY FARMING METRICS) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
          <StatCard
            label="Active Farm Projects"
            value={projects.length}
            subtext={`${totalOpenGaps} Open Resource Gaps`}
            icon={Sprout}
            trendPositive={totalOpenGaps === 0}
          />
          <StatCard
            label="Farm Labour Gangs"
            value={totalWorkersHired > 0 ? `${totalWorkersHired} Hired` : `${labourJobs.length} Jobs Posted`}
            subtext={labourJobs.length === 0 ? "No active labour postings" : "Transplanting & harvest crews"}
            icon={Users}
          />
          <StatCard
            label="Machinery Bookings"
            value={machineryBookings.length}
            subtext={machineryBookings.length === 0 ? "0 active reservations" : "Tractors & drone sprayers"}
            icon={Wrench}
          />
          <StatCard
            label="Co-Farming Capital"
            value={
              investmentProposals.length > 0
                ? `₹${investmentProposals.reduce((a, p) => a + p.proposedAmount, 0).toLocaleString()}`
                : `₹${totalExpenses.toLocaleString()}`
            }
            subtext={investmentProposals.length > 0 ? "Vetted proposals" : "Cultivation expenses"}
            icon={Coins}
          />
          <StatCard
            label="Crop Advisory & Health"
            value={projects.length > 0 ? `${projects[0].cropName}` : "Kuruvai Active"}
            subtext="TNAU Protocol Grounded"
            icon={ShieldCheck}
            trendPositive={true}
          />
        </div>

        {/* 3. QUICK ACTIONS GRID */}
        <div className="agri-card p-5 bg-white mb-6 border border-stone-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>Cultivation Quick Actions &amp; Service Mobilization</span>
            </h2>
            <span className="text-[11px] text-stone-500">1-Click Direct Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link
              href="/marketplaces/labour"
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-[#24593c] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Hire Labour Gang</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Weeding &amp; Harvest</span>
            </Link>

            <Link
              href="/marketplaces/machinery"
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-blue-50/60 hover:border-blue-300 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Rent Machinery</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Tractor &amp; Drone</span>
            </Link>

            <Link
              href="/marketplaces/inputs"
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-lime-50/60 hover:border-lime-300 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-9 h-9 rounded-lg bg-lime-100 text-lime-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Order Bio-Inputs</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Certified Seeds</span>
            </Link>

            <Link
              href="/marketplaces/produce"
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50/60 hover:border-purple-300 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Sell Produce</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Forward Mandi Sales</span>
            </Link>

            <Link
              href="/marketplaces/transport"
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-indigo-50/60 hover:border-indigo-300 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Book Haulage</span>
              <span className="text-[10px] text-stone-500 mt-0.5">Mini-Truck / Lorry</span>
            </Link>

            <Link
              href="/intelligence/crop-advisory"
              className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50/60 hover:border-amber-300 transition-all text-center flex flex-col items-center justify-center group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-stone-900">Crop Advisory</span>
              <span className="text-[10px] text-stone-500 mt-0.5">TNAU Agronomy</span>
            </Link>
          </div>
        </div>

        {/* 4. MAIN CONTENT SPLIT: MY FARM PROJECTS + AGRIVOICE AI ADVISORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): My Farm Projects & Produce Listings */}
          <div className="lg:col-span-7 space-y-6">
            {/* My Farm Projects Card */}
            <div className="agri-card p-5 bg-white border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#24593c] flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">My Farm Projects</h3>
                    <p className="text-[11px] text-stone-500">
                      Acreage, cultivation progress, and declared missing resource gaps
                    </p>
                  </div>
                </div>

                <Link
                  href="/projects/new"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#24593c] hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </Link>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/60">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#24593c] flex items-center justify-center mx-auto mb-3">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">No Farm Projects Registered</h4>
                  <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                    You have not declared any crop cultivation cycles yet. Create your first project to declare missing labour, machinery, or capital gaps.
                  </p>
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-2 bg-[#24593c] text-white rounded-lg text-xs font-bold hover:bg-[#1a402a] shadow-xs"
                  >
                    <span>Create Your First Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((p) => {
                    const openGaps = p.resourceGaps?.filter((g: any) => g.status === "OPEN") || [];
                    const cropImg = getProjectCardImage(p.cropName, p.id);
                    // Approximate progress based on dates or milestones
                    const harvestDate = p.expectedHarvestDate ? new Date(p.expectedHarvestDate).toLocaleDateString() : "Pending";
                    const sowingDate = p.expectedSowingDate ? new Date(p.expectedSowingDate).toLocaleDateString() : "Pending";

                    return (
                      <div
                        key={p.id}
                        className="rounded-xl border border-stone-200 bg-white hover:border-emerald-300 transition-all overflow-hidden shadow-2xs"
                      >
                        {/* Project Header Banner */}
                        <div className="relative h-20 overflow-hidden">
                          <img
                            src={cropImg.src}
                            alt={cropImg.alt}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-stone-900/50 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-between px-4">
                            <div>
                              <span className="text-sm font-bold text-white drop-shadow">
                                {p.title}
                              </span>
                              <div className="text-[11px] text-emerald-200 font-medium">
                                {p.cropName} ({p.variety || "Local Selection"}) • {p.acresAllotted} Acres ({p.season})
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/90 text-[#1e4731] shadow-2xs">
                              {p.status}
                            </span>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="p-4 text-xs space-y-3">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-stone-600 bg-stone-50 rounded-lg p-2.5 border border-stone-100">
                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Sowing Date:</span>
                              <span className="font-semibold text-stone-800">{sowingDate}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Harvest Date:</span>
                              <span className="font-semibold text-stone-800">{harvestDate}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Budget:</span>
                              <span className="font-semibold text-stone-800">
                                {p.estimatedBudget ? `₹${p.estimatedBudget.toLocaleString()}` : "Not declared"}
                              </span>
                            </div>
                          </div>

                          {/* Open Resource Gaps */}
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wide">
                                Missing Resource Gaps:
                              </span>
                              <span className="text-[11px] text-stone-400">
                                {openGaps.length} unresolved deficit{openGaps.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            {openGaps.length === 0 ? (
                              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>All operational resources (labour, machine, capital) are confirmed!</span>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {openGaps.map((g: any) => (
                                  <span
                                    key={g.id}
                                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 inline-flex items-center gap-1"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span>
                                      {g.category}: {g.quantityNeeded ? `${g.quantityNeeded} ${g.unit || ""}` : g.title}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                            <Link
                              href={`/projects/${p.id}/matches`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <span>Run Gap Engine Matching</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            <Link
                              href={`/projects/${p.id}`}
                              className="text-xs font-semibold text-[#24593c] hover:underline"
                            >
                              Open Workspace &amp; Expenses →
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Produce Listings & Buyer Forward Offers Card */}
            <div className="agri-card p-5 bg-white border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Produce Listings &amp; Mandi Forward Offers
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Pre-harvest forward agreements and wholesale mandi bids
                    </p>
                  </div>
                </div>

                <Link
                  href="/marketplaces/produce"
                  className="text-xs font-bold text-[#24593c] hover:underline"
                >
                  Manage Listings
                </Link>
              </div>

              {produceListings.length === 0 ? (
                <div className="text-center py-6 px-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/60">
                  <p className="text-xs text-stone-500">
                    No active produce lots listed for sale. List your upcoming harvest to receive pre-harvest purchase bids from verified millers and mandi traders.
                  </p>
                  <Link
                    href="/marketplaces/produce"
                    className="inline-flex items-center gap-1 mt-2.5 px-3 py-1.5 bg-[#24593c] text-white rounded text-xs font-semibold"
                  >
                    <span>List Harvest Now</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {produceListings.map((l) => {
                    const cropImg = getCropImage(l.cropName);
                    const offerCount = l.offers?.length || 0;
                    return (
                      <div
                        key={l.id}
                        className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 shrink-0">
                            <img
                              src={cropImg.src}
                              alt={cropImg.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-stone-900">
                              {l.cropName} ({l.grade}) • {l.quantityKg?.toLocaleString()} kg
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              Asking: ₹{l.askingPricePerKg}/kg • Packaging: {l.packagingType}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-[11px]">
                            {offerCount} Buyer Offer{offerCount !== 1 ? "s" : ""}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {l.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (5 cols): Embedded AgriVoice AI Crop Advisory Assistant */}
          <div className="lg:col-span-5 space-y-6">
            <div className="agri-card p-5 bg-white border border-stone-200 shadow-sm rounded-2xl flex flex-col h-[640px]">
              {/* Header */}
              <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#24593c] flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span>AgriVoice AI Crop Advisory</span>
                      <span className="text-[9px] bg-emerald-100 text-[#1e4731] px-1.5 py-0.2 rounded font-bold uppercase">
                        Tamil &amp; EN
                      </span>
                    </h3>
                    <p className="text-[10px] text-stone-400">
                      TNAU agronomy, pest IPM, mandi rates &amp; Uzhavan schemes
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    autoSpeak
                      ? "bg-emerald-50 text-[#24593c] border-emerald-300"
                      : "bg-stone-50 text-stone-400 border-stone-200"
                  }`}
                  title={autoSpeak ? "Audio Auto-Read Enabled" : "Audio Auto-Read Disabled"}
                >
                  {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Chat Message Scroll Area */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                {messages.map((m) => {
                  const isUser = m.sender === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[90%] rounded-xl p-3 ${
                          isUser
                            ? "bg-[#24593c] text-white rounded-br-none"
                            : "bg-stone-50 text-stone-800 border border-stone-200 rounded-bl-none shadow-2xs"
                        }`}
                      >
                        {!isUser && m.topic && (
                          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                            {m.topic}
                          </div>
                        )}
                        <p className="whitespace-pre-line leading-relaxed">{m.text}</p>

                        {!isUser && m.spokenText && (
                          <button
                            type="button"
                            onClick={() => playSpeech(m.spokenText!)}
                            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen in Tamil / குரலில் கேட்க</span>
                          </button>
                        )}

                        {!isUser && m.sources && m.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-stone-200/60 text-[10px] text-stone-500">
                            <span className="font-semibold">Source: </span>
                            {m.sources.map((s: any) => s.title).join(", ")}
                          </div>
                        )}
                      </div>

                      {/* Follow-up question chips */}
                      {!isUser && m.followUps && m.followUps.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5 max-w-[90%]">
                          {m.followUps.map((q, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                setInputText(q);
                                handleSendQuery(q);
                              }}
                              className="text-[10px] font-medium bg-emerald-50 text-[#1e4731] hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition-colors text-left"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isAiLoading && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-500 w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span>Analyzing TNAU agronomic database...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="pt-2 border-t border-stone-100">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                  Frequently Asked Agronomic Topics:
                </div>
                <div className="flex flex-wrap gap-1 mb-2 max-h-16 overflow-y-auto">
                  {QUICK_SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInputText(s);
                        handleSendQuery(s);
                      }}
                      className="text-[10px] font-medium bg-stone-100 hover:bg-emerald-50 hover:text-[#24593c] text-stone-700 px-2 py-1 rounded transition-colors text-left truncate max-w-full"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Input Controls */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendQuery();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-lg border transition-all shrink-0 ${
                      isListening
                        ? "bg-red-50 text-red-600 border-red-300 animate-pulse"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-emerald-50 hover:text-[#24593c]"
                    }`}
                    title={isListening ? "Listening... Click to stop" : "Speak in Tamil or English"}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or speak in Tamil / English..."
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-1 focus:ring-[#24593c] focus:border-[#24593c]"
                  />

                  <Button
                    type="submit"
                    loading={isAiLoading}
                    disabled={!inputText.trim()}
                    className="px-3 py-2 bg-[#24593c] text-white rounded-lg shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboardClient;
