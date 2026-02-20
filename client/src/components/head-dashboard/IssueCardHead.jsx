import { MapPin, ThumbsUp, CheckSquare } from 'lucide-react'
import SeverityBadge from '../common/SeverityBadge'
import PriorityScore from '../common/PriorityScore'
import DeadlineCountdown from './DeadlineCountdown'

export default function IssueCardHead({ issue, selected = false, onSelect }) {
  return (
    <div
      className={`glass border rounded-2xl p-4 cursor-pointer transition-all ${
        selected ? 'border-primary/40 bg-primary/5' : 'border-white/8 hover:border-white/20'
      }`}
      onClick={() => onSelect(issue)}
    >
      <div className="flex items-start gap-3">
        <PriorityScore score={issue.priority} size="sm" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-base-content line-clamp-1">{issue.title}</p>
            <SeverityBadge severity={issue.severity} size="xs" />
          </div>

          <div className="flex items-center gap-1 text-base-content/50 mb-2">
            <MapPin size={10} />
            <span className="text-meta text-[0.6rem]">{issue.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <DeadlineCountdown deadline={issue.deadline} />
            <div className="flex items-center gap-2 text-xs text-base-content/40">
              <span className="flex items-center gap-0.5">
                <ThumbsUp size={10} />{issue.upvotes}
              </span>
              <span className="flex items-center gap-0.5">
                <CheckSquare size={10} />{issue.completedTasks}/{issue.taskCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
