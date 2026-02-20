import { motion } from 'framer-motion'

export default function TaskStepper({ steps, currentStep }) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hidden">
      <ul className="steps steps-horizontal w-full min-w-max">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            className={`step text-xs ${i <= currentStep ? 'step-primary' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {step}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
