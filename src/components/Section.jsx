import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Variantes para o container da section (cabeçalho)
const headVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const headItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

// Variantes para o bloco de conteúdo (children)
const bodyVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
}

export { bodyVariants }

export default function Section({ id, eyebrow, title, description, children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px 0px' })

  return (
    <section
      id={id}
      ref={ref}
      className={`section ${className}`.trim()}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <div className="container">
        {(eyebrow || title || description) && (
          <motion.div
            className="section-head"
            variants={headVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {eyebrow && (
              <motion.span className="eyebrow" variants={headItemVariants}>
                {eyebrow}
              </motion.span>
            )}
            {title && (
              <motion.h2 id={`${id}-title`} variants={headItemVariants}>
                {title}
              </motion.h2>
            )}
            {description && (
              <motion.p variants={headItemVariants}>{description}</motion.p>
            )}
          </motion.div>
        )}

        <motion.div
          variants={bodyVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {children}
        </motion.div>
      </div>
    </section>
  )
}
