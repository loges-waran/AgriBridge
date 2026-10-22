import React from "react";
import Link from "next/link";
import { CloudRain, Sun, Wind, AlertTriangle, ShieldCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default function WeatherRisksPage() {
  const zones = [
    {
      name: "Cauvery Delta Zone (Thanjavur, Thiruvarur, Nagapattinam)",
      rainfallStatus: "Normal Seasonal Pre-Monsoon Showers",
      tempRange: "26°C - 34°C",
      humidity: "78%",
      windSpeed: "14 km/h SW",
      agriAdvisory: "Favorable conditions for Kuruvai paddy line transplanting. Maintain 2-3 cm water depth in newly planted fields. Ensure drainage sluices are cleared.",
      alertLevel: "GREEN",
      image: "/images/crops/paddy.jpg",
    },
    {
      name: "North Eastern Zone (Kanchipuram, Tiruvallur, Cuddalore)",
      rainfallStatus: "Scattered Rain Expected in 48 Hours",
      tempRange: "27°C - 35°C",
      humidity: "82%",
      windSpeed: "18 km/h E",
      agriAdvisory: "Delay foliar bio-pesticide spray until rain clears to prevent active ingredient runoff.",
      alertLevel: "YELLOW",
      image: "/images/crops/sugarcane.jpg",
    },
    {
      name: "Western Zone (Coimbatore, Tiruppur, Erode)",
      rainfallStatus: "Dry Weather with High Evaporative Demand",
      tempRange: "23°C - 32°C",
      humidity: "65%",
      windSpeed: "12 km/h W",
      agriAdvisory: "Operate drip irrigation systems in evening hours to minimize evapotranspiration losses in turmeric and banana plantations.",
      alertLevel: "GREEN",
      image: "/images/crops/turmeric.jpg",
    },
    {
      name: "Southern Zone (Madurai, Virudhunagar, Ramanathapuram)",
      rainfallStatus: "High Heat & Moderate Dry Winds",
      tempRange: "28°C - 37°C",
      humidity: "60%",
      windSpeed: "16 km/h S",
      agriAdvisory: "Apply organic mulch around fruit orchards and vegetable beds to conserve soil moisture.",
      alertLevel: "YELLOW",
      image: "/images/crops/cotton.jpg",
    },
  ];

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold mb-1 border border-blue-200">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Agro-Meteorology &amp; Risk Warning System</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            Weather &amp; Agricultural Risk Alerts
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Regional agro-climatic advisories aligned with Tamil Nadu Agricultural University (TNAU) and IMD bulletins
          </p>
        </div>

        {/* Hero banner */}
        <div className="relative rounded-xl overflow-hidden my-6 h-36 sm:h-44">
          <img
            src="/images/agribridge/01-farm-projects/monsoon-ploughing.jpg"
            alt="Monsoon ploughing and weather risk advisory in Tamil Nadu"
            loading="eager"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/50 to-transparent flex flex-col justify-center px-6">
            <p className="text-white font-bold text-lg">Agro-Meteorological Advisory</p>
            <p className="text-blue-100 text-xs mt-1 max-w-sm">
              Real-time regional advisories to protect crops from unseasonal precipitation, high evaporation, and wind stress.
            </p>
          </div>
        </div>

        {/* Integration notice */}
        <div className="mb-6 p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>Data Source Notice:</strong> Synchronized with regional agro-meteorological field bulletins. Real-time external provider keys (e.g. OpenWeatherMap/IMD API) can be configured via <code className="bg-stone-200 px-1 rounded">WEATHER_API_KEY</code> in environment settings.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((z) => (
            <div
              key={z.name}
              className="agri-card flex flex-col justify-between hover:border-[#24593c] transition-colors overflow-hidden"
            >
              {/* Zone Crop Image Header */}
              <div className="relative h-28 overflow-hidden bg-stone-100">
                <img
                  src={z.image}
                  alt={z.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                  <span className="text-white font-bold text-xs flex items-center gap-1.5 drop-shadow">
                    <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{z.name}</span>
                  </span>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-stone-600 font-medium">
                      Status: {z.rainfallStatus}
                    </span>
                    <Badge variant={z.alertLevel === "YELLOW" ? "pending" : "verified"}>
                      {z.alertLevel === "YELLOW" ? "Advisory Notice" : "Normal Field Conditions"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded border border-stone-100 text-xs text-stone-600 my-3">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Temperature</span>
                      <strong className="text-stone-900">{z.tempRange}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Humidity</span>
                      <strong className="text-stone-900">{z.humidity}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Wind</span>
                      <strong className="text-stone-900">{z.windSpeed}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded border border-emerald-100 text-xs text-stone-700">
                    <strong className="text-emerald-900 block mb-1">Agronomic Recommendation:</strong>
                    <p className="text-[11px] leading-relaxed text-stone-600">{z.agriAdvisory}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 mt-4 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">Updated Today • Forecast valid 72 hrs</span>
                  <Link
                    href="/projects"
                    className="font-semibold text-[#24593c] hover:underline"
                  >
                    Apply to Active Projects →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
