import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardRoleSelector from "./DashboardRoleSelector";

export const dynamic = "force-dynamic";

export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // If user has only one role, immediately route to that dashboard
  if (user.roles.length === 1) {
    const singleRole = user.roles[0].toLowerCase();
    redirect(`/dashboard/${singleRole}`);
  }

  // If user has an activeRole and it's valid, but they navigated directly to /dashboard,
  // we render the workspace selection screen to let them pick or switch freely.
  return <DashboardRoleSelector user={user} />;
}
