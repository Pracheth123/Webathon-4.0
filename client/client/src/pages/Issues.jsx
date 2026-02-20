import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Filter } from 'lucide-react'
import { useIssueStore } from '../store/useIssueStore'
import IssueMarker from '../components/map/IssueMarker'
import MarkerModal from '../components/map/MarkerModal'

const FILTERS = [
  { value: 'all', label: 'All Issues', color: 'btn-ghost' },
  { value: 'critical', label: 'Critical', color: 'btn-error' },
  { value: 'high', label: 'High', color: 'btn-warning' },
  { value: 'medium', label: 'Medium', color: 'btn-accent' },
  { value: 'low', label: 'Low', color: 'btn-info' },
  { value: 'completed', label: 'Completed', color: 'btn-success' },
]

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

export default function Issues() {
  const { issues, filter, setFilter, getFilteredIssues } = useIssueStore()
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: 77.62,
    latitude: 12.95,
    zoom: 11.5,
  })

  const filtered = getFilteredIssues()

  const STATS = [
    { label: 'Total', value: issues.length, color: 'text-base-content' },
    { label: 'Critical', value: issues.filter((i) => i.severity === 'critical').length, color: 'text-error' },
    { label: 'In Progress', value: issues.filter((i) => i.status === 'in_progress').length, color: 'text-warning' },
    { label: 'Resolved', value: issues.filter((i) => i.status === 'completed').length, color: 'text-success' },
  ]

  return (
    <motion.div
      className="relative"
      style={{ height: 'calc(100vh - 64px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Map */}
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        onClick={() => setSelectedIssue(null)}
      >
        <NavigationControl position="top-right" />

        {filtered.map((issue) => (
          <Marker
            key={issue.id}
            longitude={issue.lng}
            latitude={issue.lat}
            anchor="center"
          >
            <IssueMarker
              issue={issue}
              onClick={setSelectedIssue}
              isSelected={selectedIssue?.id === issue.id}
            />
          </Marker>
        ))}
      </Map>

      {/* Top stats overlay */}
      <motion.div
        className="absolute top-4 left-4 z-10 glass-strong rounded-2xl px-4 py-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-5">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className={`text-data font-black text-xl ${s.color}`}>{s.value}</div>
              <div className="text-meta text-base-content/40 text-[0.6rem]">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter panel */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="glass-strong rounded-2xl px-3 py-2 flex items-center gap-2 flex-wrap justify-center">
          <Filter size={14} className="text-base-content/40 shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`btn btn-xs ${filter === f.value ? f.color : 'btn-ghost opacity-60'}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="absolute bottom-4 right-4 z-10 glass-strong rounded-2xl p-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-meta text-base-content/40 mb-2">SEVERITY</p>
        {[
          { label: 'Critical', color: '#f87171' },
          { label: 'High', color: '#fb923c' },
          { label: 'Medium', color: '#fbbf24' },
          { label: 'Low', color: '#60a5fa' },
          { label: 'Completed', color: '#34d399' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 mb-1.5">
            <div className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: l.color }} />
            <span className="text-xs text-base-content/60">{l.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Issue modal */}
      <AnimatePresence>
        {selectedIssue && (
          <MarkerModal
            issue={selectedIssue}
            onClose={() => setSelectedIssue(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
