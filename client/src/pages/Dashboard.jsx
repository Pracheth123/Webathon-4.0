import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Shield,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { useAuth } from "../context/AuthContext";
import CivicScoreCard from "../components/dashboard/CivicScoreCard";
import ReliabilityMeter from "../components/dashboard/ReliabilityMeter";
import ContributionTimeline from "../components/dashboard/ContributionTimeline";
import BadgeCollection from "../components/dashboard/BadgeCollection";
import Leaderboard from "../components/dashboard/Leaderboard";
import IssueCard from "../components/common/IssueCard";
import { useIssueStore } from "../store/useIssueStore";
import VolunteerRequests from "../components/head-dashboard/VolunteerRequests";
import useVolunteerStore from "../store/useVolunteerStore";
import MarkerModal from "../components/map/MarkerModal";

export default function Dashboard() {
  const { user, leaderboard, timeline, badges } = useUserStore();
  const { issues, getPrioritySorted } = useIssueStore();
  const { role } = useAuth();
  const navigate = useNavigate();

  const nearbyIssues = issues.slice(0, 3);
  const monitoring = issues.slice(0, 4);
  const reportedIssues = issues.filter((i) => i.reportedBy === user.id);
  const topPriority = getPrioritySorted().slice(0, 4);

  const store = useVolunteerStore();
  const requests = store.requests;

  const handleApprove = (id) => store.approveRequest(id);

  const handleReject = (id) => store.rejectRequest(id);

  const [selectedIssue, setSelectedIssue] = useState(null);

  if (role === "local_head") {
    const openIssues = issues.filter((i) => i.status !== "completed");
    const criticalIssues = issues.filter((i) => i.severity === "critical");
    const inProgress = issues.filter((i) => i.status === "in_progress");

    return (
      <motion.main
        className="container mx-auto px-4 py-8 space-y-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="text-meta text-primary">LOCAL HEAD</span>
            <h1 className="text-heading text-base-content mt-1">
              Command Dashboard
            </h1>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate("/head")}
          >
            Open Issue Queue
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Pending Requests",
              value: requests.length,
              icon: ClipboardList,
              color: "text-warning",
            },
            {
              label: "Open Issues",
              value: openIssues.length,
              icon: Shield,
              color: "text-primary",
            },
            {
              label: "Critical",
              value: criticalIssues.length,
              icon: AlertTriangle,
              color: "text-error",
            },
            {
              label: "In Progress",
              value: inProgress.length,
              icon: CheckCircle2,
              color: "text-success",
            },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-meta text-base-content/40">
                    {s.label}
                  </div>
                  <div className={`text-2xl font-black ${s.color}`}>
                    {s.value}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <s.icon size={18} className={s.color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-meta text-primary">VOLUNTEER APPROVALS</span>
            <span className="badge badge-ghost badge-sm">
              {requests.length} pending
            </span>
          </div>
          <VolunteerRequests
            requests={requests}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-meta text-primary">PRIORITY ISSUES</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topPriority.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => navigate("/head")}
                compact
              />
            ))}
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="container mx-auto px-4 py-8 space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-meta text-primary">YOUR PROFILE</span>
          <h1 className="text-heading text-base-content mt-1">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
        </div>
        <div className="badge badge-ghost badge-sm gap-2">
          <Activity size={12} /> Monitoring Mode
        </div>
      </div>

      {/* Top row: Score + Reliability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <CivicScoreCard user={user} />
        </div>
        <div className="md:col-span-2">
          <ReliabilityMeter score={user.reliabilityScore} />
        </div>
      </div>

      {/* Middle row: Timeline + Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContributionTimeline timeline={timeline} />
        <Leaderboard leaderboard={leaderboard} currentUserId={user.id} />
      </div>

      {/* Badges */}
      <BadgeCollection badges={badges} earnedIds={user.badges} />

      {/* Reported Issues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">YOUR REPORTED ISSUES</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {reportedIssues.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center text-base-content/40">
              You have not reported any issues yet.
            </div>
          ) : (
            reportedIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onClick={() => setSelectedIssue(issue)}
              />
            ))
          )}
        </div>

        {/* Nearby Issues */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-meta text-primary">NEARBY ISSUES</span>
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => navigate("/map")}
          >
            View all →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nearbyIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => setSelectedIssue(issue)}
            />
          ))}

          {selectedIssue && (
            <MarkerModal issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
          )}
        </div>
      </div>

      {/* ACTIVE WORK MONITORING removed per user request */}
    </motion.main>
  );
}
