'use client'
import { ArrowRight, Plus } from 'lucide-react'
import { AnimatePresence, motion } from "motion/react";
import { useState } from 'react';

interface AddCollectionCardProps {
  onClick: () => void
}

export function AddCollectionCard({ onClick }: AddCollectionCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group flex min-h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-transparent p-5 transition-all duration-200 hover:bg-secondary-500/20 hover:border-accent hover:bg-accent/5"
    >
      <div className="mb-3 flex size-12 relative overflow-hidden items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 group-hover:bg-secondary-500 group-hover:text-secondary-100">
        <AnimatePresence>
          {
            hovered ? <motion.span
              key="arrow"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1
              }}
              exit={{
                y: -20,
                opacity: 0
              }}>
              <ArrowRight className="size-6" />
            </motion.span> :
              <motion.span
                key="plus"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                initial={{
                  y: 20,
                  opacity: 0
                }}
                animate={{
                  y: 0,
                  opacity: 1
                }}
                exit={{
                  y: -20,
                  opacity: 0
                }}
              >
                <Plus className="size-6" />
              </motion.span>
          }
        </AnimatePresence>
      </div>
      <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-secondary-500">
        New Collection
      </span>
    </motion.button>
  )
}
