import { DashboardExperience } from "@/client/components/dashboard/DashboardExperience";
import { getDashboardAnalytics } from "@/server/db/analytics";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const analytics = await getDashboardAnalytics();

  return <DashboardExperience analytics={analytics} />;
}
