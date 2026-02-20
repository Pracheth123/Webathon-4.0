import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, ImagePlus, MapPin, Sparkles, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AnimatedButton from '../components/common/AnimatedButton'

export default function ReportIssue() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleSubmit = async () => {
    if (!file) return
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSubmitting(false)
    navigate('/head')
  }

  return (
    <motion.main
      className="container mx-auto px-4 py-8 max-w-3xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <span className="text-meta text-primary">CITIZEN REPORT</span>
        <h1 className="text-heading text-base-content mt-1">Report a Civic Issue</h1>
        <p className="text-base-content/50 mt-2">
          Capture a live photo of the issue. The system will analyze it and generate the issue description for the local head.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="glass rounded-2xl p-5 border border-white/8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-base-content">Upload Problem Image</h3>
              <span className="badge badge-ghost badge-sm">Camera only</span>
            </div>

            <label className="block">
              <div className="glass rounded-2xl border border-dashed border-white/20 h-52 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:border-primary/40 transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <>
                    <Camera size={30} className="text-primary/70" />
                    <p className="text-sm text-base-content/60">Tap to capture a live photo</p>
                    <p className="text-meta text-base-content/30">Camera only • No gallery upload</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <div className="mt-3 flex items-center justify-between text-xs text-base-content/50">
                <span className="truncate">{file.name}</span>
                <span>{Math.round(file.size / 1024)} KB</span>
              </div>
            )}
          </div>

          <div className="glass rounded-2xl p-5 border border-white/8">
            <h3 className="text-sm font-semibold text-base-content mb-3">Location & Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <MapPin size={16} className="text-primary mx-auto mb-1" />
                <div className="text-xs text-base-content/60">GPS Enabled</div>
                <div className="text-data text-xs text-base-content/40">Auto-captured</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <Sparkles size={16} className="text-accent mx-auto mb-1" />
                <div className="text-xs text-base-content/60">AI Analysis</div>
                <div className="text-data text-xs text-base-content/40">Runs on submit</div>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <ImagePlus size={16} className="text-secondary mx-auto mb-1" />
                <div className="text-xs text-base-content/60">Device ID</div>
                <div className="text-data text-xs text-base-content/40">Hashed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-strong rounded-2xl p-5 h-full">
            <h3 className="text-sm font-semibold text-base-content mb-3">Submission Preview</h3>
            <div className="space-y-3 text-xs text-base-content/60">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="badge badge-warning badge-sm">Pending AI</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Description</span>
                <span className="text-base-content/40">Auto-generated</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Severity</span>
                <span className="text-base-content/40">Auto-classified</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Destination</span>
                <span className="text-base-content">Local Head Queue</span>
              </div>
            </div>

            <AnimatedButton
              variant="primary"
              size="lg"
              glow
              block
              className="mt-6"
              disabled={!file || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Send size={16} /> Submit for Analysis
                </>
              )}
            </AnimatedButton>

            <p className="text-meta text-base-content/30 mt-4">
              On submit, AI generates the description and routes it to the local head.
            </p>
          </div>
        </div>
      </div>
    </motion.main>
  )
}
