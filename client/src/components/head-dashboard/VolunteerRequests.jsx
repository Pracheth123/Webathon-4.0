import { motion } from "framer-motion";
import { CheckCircle2, XCircle, User, Camera } from "lucide-react";
import useVolunteerStore from "../../store/useVolunteerStore";

export default function VolunteerRequests({
  requests: propRequests,
  onApprove,
  onReject,
}) {
  const store = useVolunteerStore();
  const requests = propRequests ?? store.requests;
  const approve = onApprove ?? store.approveRequest;
  const reject = onReject ?? store.rejectRequest;

  if (!requests || requests.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-base-content/40">
        No pending volunteer requests
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {requests.map((req, i) => (
        <motion.div
          key={req.id}
          className="glass border border-white/8 rounded-2xl p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-base-content line-clamp-1">
                {req.taskTitle}
              </p>
              <p className="text-xs text-base-content/50 line-clamp-1">
                {req.issueTitle}
              </p>
            </div>
            <span className="badge badge-ghost badge-xs">
              {req.estimatedTime}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-base-content/50 mb-3">
            <span className="flex items-center gap-1">
              <User size={11} /> {req.volunteer}
            </span>
            <span className="flex items-center gap-1">
              <Camera size={11} /> Proof req.
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-success btn-xs flex-1 gap-1"
              onClick={() => approve(req.id)}
            >
              <CheckCircle2 size={11} /> Approve
            </button>
            <button
              className="btn btn-error btn-outline btn-xs flex-1 gap-1"
              onClick={() => reject(req.id)}
            >
              <XCircle size={11} /> Reject
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
