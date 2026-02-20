import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Zap, Camera, Upload, CheckCircle2, ChevronLeft, AlertTriangle } from 'lucide-react'
import { api } from '../services/api'
import { mockTasks } from '../data/mockData'
import TaskStepper from '../components/volunteer/TaskStepper'
import BeforeAfterPreview from '../components/volunteer/BeforeAfterPreview'
import SubmissionCelebration from '../components/volunteer/SubmissionCelebration'
import AnimatedButton from '../components/common/AnimatedButton'

export default function VolunteerTask() {
  const { taskId } = useParams()
  const navigate = useNavigate()

  // Resolve task — fallback to first task for demo
  const task = mockTasks.find((t) => t.id === taskId) || mockTasks[0]

  const [currentStep, setCurrentStep] = useState(0)
  const [photoTaken, setPhotoTaken] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)

  const totalSteps = task.steps.length

  const handleNext = () => {
    if (currentStep === 2 && !photoTaken) return
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1)
  }

  const handlePhotoCapture = () => {
    setPhotoTaken(true)
    if (currentStep === 2) setCurrentStep(3)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const res = await api.tasks.submit(task.id, { photoTaken })
    setResult(res)
    setSubmitting(false)
    setSubmitted(true)
  }

  const stepContent = [
    /* Step 0 — Navigate */
    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-base-content mb-3">Navigate to Location</h3>
        <div className="flex items-center gap-2 text-base-content/60 mb-4">
          <MapPin size={16} className="text-primary" />
          <span className="text-sm">{task.location}</span>
        </div>
        <div className="glass rounded-xl overflow-hidden h-40 flex items-center justify-center border border-white/10">
          <div className="text-center text-base-content/30">
            <MapPin size={32} className="mx-auto mb-2 text-primary/50" />
            <p className="text-sm">Map view — navigate to the pinned location</p>
          </div>
        </div>
      </div>
      <AnimatedButton variant="primary" block onClick={handleNext}>
        I've Arrived <CheckCircle2 size={16} />
      </AnimatedButton>
    </motion.div>,

    /* Step 1 — Assess */
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-base-content mb-2">Assess the Situation</h3>
        <p className="text-sm text-base-content/60 mb-4">{task.description}</p>
        <div className="alert alert-warning alert-soft rounded-xl text-sm">
          <AlertTriangle size={15} />
          <span>Ensure your safety before proceeding. Do not put yourself at risk.</span>
        </div>
      </div>
      <BeforeAfterPreview beforeUrl={task.beforeImageUrl} showAfter={false} />
      <AnimatedButton variant="primary" block onClick={handleNext}>
        Situation Assessed <CheckCircle2 size={16} />
      </AnimatedButton>
    </motion.div>,

    /* Step 2 — Capture before photo */
    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-base-content mb-2">Capture Before Photo</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Take a clear photo of the issue before any work begins. Ensure good lighting.
        </p>
        <motion.button
          className={`w-full h-36 glass border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
            photoTaken ? 'border-success/40 bg-success/10' : 'border-dashed border-white/20 hover:border-primary/40'
          }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handlePhotoCapture}
        >
          {photoTaken ? (
            <>
              <CheckCircle2 size={28} className="text-success" />
              <span className="text-success text-sm font-semibold">Photo Captured ✓</span>
            </>
          ) : (
            <>
              <Camera size={28} className="text-base-content/40" />
              <span className="text-base-content/50 text-sm">Tap to capture photo</span>
              <span className="text-meta text-base-content/30">Simulated for demo</span>
            </>
          )}
        </motion.button>
      </div>
      <AnimatedButton variant="primary" block disabled={!photoTaken} onClick={handleNext}>
        Continue <CheckCircle2 size={16} />
      </AnimatedButton>
    </motion.div>,

    /* Step 3 — Complete task */
    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-base-content mb-2">Complete the Task</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Perform the required action as described. Take your time and do it properly.
        </p>
        <div className="space-y-2">
          {task.steps.slice(1, 4).map((s, i) => (
            <div key={i} className="flex items-center gap-2 glass rounded-xl p-2.5">
              <CheckCircle2 size={14} className="text-success" />
              <span className="text-xs text-base-content/70">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <AnimatedButton variant="primary" block onClick={handleNext}>
        Task Done — Upload After Photo <Upload size={16} />
      </AnimatedButton>
    </motion.div>,

    /* Step 4 — Upload & Submit */
    <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
      <BeforeAfterPreview
        beforeUrl={task.beforeImageUrl}
        afterUrl={task.afterImageUrl}
        showAfter
      />
      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold text-base-content mb-2">Ready to Submit</h3>
        <p className="text-sm text-base-content/60 mb-3">
          Your before/after comparison looks good. Submit to earn your credits.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 glass border border-primary/20 rounded-xl p-3 text-center">
            <div className="text-data font-black text-lg text-primary">+{task.credits}</div>
            <div className="text-meta text-base-content/40 text-[0.6rem]">CREDITS</div>
          </div>
          <div className="flex-1 glass border border-accent/20 rounded-xl p-3 text-center">
            <div className="text-data font-black text-lg text-accent">+200</div>
            <div className="text-meta text-base-content/40 text-[0.6rem]">XP</div>
          </div>
          <div className="flex-1 glass border border-success/20 rounded-xl p-3 text-center">
            <div className="text-data font-black text-lg text-success">{task.difficulty}</div>
            <div className="text-meta text-base-content/40 text-[0.6rem]">DIFFICULTY</div>
          </div>
        </div>
      </div>
      <AnimatedButton
        variant="primary"
        size="lg"
        glow
        block
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? (
          <>
            <span className="loading loading-spinner loading-sm" />
            Submitting…
          </>
        ) : (
          <>
            <Zap size={18} /> Submit & Claim Credits
          </>
        )}
      </AnimatedButton>
    </motion.div>,
  ]

  return (
    <motion.main
      className="container mx-auto px-4 py-8 max-w-2xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button className="btn btn-ghost btn-sm btn-square" onClick={() => navigate(-1)}>
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <span className="text-meta text-primary">MICRO-TASK</span>
          <h1 className="text-base font-bold text-base-content truncate">{task.title}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-xs text-base-content/50">
            <Clock size={12} /> {task.estimatedTime}
          </span>
          <span className="badge badge-primary badge-sm">+{task.credits} pts</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <TaskStepper steps={task.steps} currentStep={currentStep} />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {stepContent[currentStep]}
      </AnimatePresence>

      {/* Celebration overlay */}
      <AnimatePresence>
        {submitted && result && (
          <SubmissionCelebration credits={result.credits} xp={result.xp} />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
