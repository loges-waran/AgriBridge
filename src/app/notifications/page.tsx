import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Bell, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="py-8 bg-[#fbfbfa] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-stone-200">
          <h1 className="text-2xl font-bold text-stone-900">Notification Center</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time updates regarding resource gap matches, buyer offers, and milestone activities
          </p>
        </div>

        <div className="space-y-3 my-6">
          {notifications.length === 0 ? (
            <div className="agri-card p-12 text-center text-xs text-stone-500">
              <Bell className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <p className="font-semibold text-stone-700">No New Notifications</p>
              <p className="mt-1">
                You will be notified whenever a farmer, buyer, worker, or investor requests a match.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`agri-card p-4 flex items-start justify-between gap-4 text-xs ${
                  n.isRead ? "bg-white" : "bg-emerald-50/40 border-emerald-200"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="verified">{n.type}</Badge>
                    <h3 className="font-bold text-stone-900">{n.title}</h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>

                {n.linkUrl && (
                  <Link
                    href={n.linkUrl}
                    className="shrink-0 text-xs font-semibold text-[#24593c] hover:underline"
                  >
                    View Details →
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
