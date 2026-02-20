import { motion } from "framer-motion";
import { MapPin, ThumbsUp, Clock, CheckSquare, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useVolunteerStore from "../../store/useVolunteerStore";
import SeverityBadge from "./SeverityBadge";
import PriorityScore from "./PriorityScore";
import AnimatedButton from "./AnimatedButton";

const CATEGORY_EMOJI = {
  road: "🛣️",
  electricity: "⚡",
  sanitation: "🗑️",
  water: "💧",
  traffic: "🚦",
  drainage: "🌊",
  infrastructure: "🏗️",
  encroachment: "⚠️",
  construction: "🔨",
};

export default function IssueCard({ issue, onClick, compact = false }) {
  const progress =
    issue.taskCount > 0
      ? Math.round((issue.completedTasks / issue.taskCount) * 100)
      : 0;

  const navigate = useNavigate();
  const { user, role } = useAuth();
  const isReporter = user && issue.reportedBy === user.id;
  const canVolunteer =
    role === "citizen" &&
    ["medium", "low"].includes(issue.severity) &&
    issue.status !== "completed";
  const addRequest = useVolunteerStore((s) => s.addRequest);

  const borderColor =
    {
      critical: "border-error/30",
      high: "border-warning/30",
      medium: "border-accent/20",
      low: "border-info/20",
      completed: "border-success/30",
    }[issue.severity] || "border-white/10";

  return (
    <motion.div
      className={`card glass border ${borderColor} cursor-pointer overflow-hidden`}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => onClick && onClick(issue)}
    >
      {!compact && issue.imageUrl && (
        <figure className="h-36 overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}

      <div className="card-body p-4 gap-3">
        {isReporter && (
          <div className="mb-2">
            <span className="badge badge-ghost badge-sm">Your Report</span>
          </div>
        )}
        {/* Title + severity */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-base-content leading-snug line-clamp-2 flex-1">
            <span className="mr-1">
              {CATEGORY_EMOJI[issue.category] || "📍"}
            </span>
            {issue.title}
          </h3>
          <SeverityBadge severity={issue.severity} size="xs" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-base-content/50">
          <MapPin size={11} />
          <span className="text-meta text-[0.65rem]">{issue.location}</span>
        </div>

        {!compact && (
          <p className="text-xs text-base-content/60 line-clamp-2">
            {issue.description}
          </p>
        )}

        {/* Progress bar */}
        {issue.taskCount > 0 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-meta text-base-content/40">Tasks</span>
              <span className="text-meta text-base-content/50">
                {issue.completedTasks}/{issue.taskCount}
              </span>
            </div>
            <progress
              className="progress progress-primary h-1 w-full"
              value={progress}
              max="100"
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 text-base-content/40">
            <span className="flex items-center gap-1 text-xs">
              <ThumbsUp size={11} /> {issue.upvotes}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <CheckSquare size={11} /> {issue.completedTasks}/{issue.taskCount}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <PriorityScore score={issue.priority} size="sm" />

            {!compact && canVolunteer && (
              <AnimatedButton
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addRequest({
                    taskTitle: `Volunteer for: ${issue.title}`,
                    issueTitle: issue.title,
                    estimatedTime: "30 min",
                    volunteer: user?.name || "Anonymous",
                    issueId: issue.id,
                  });
                  alert("Volunteer request submitted to your local head");
                }}
              >
                <Zap size={12} /> Volunteer
              </AnimatedButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
