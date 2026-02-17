"use client";

import { Activity, ComponentProps, createContext, useContext, useEffect, useState } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, HTMLMotionProps, Variants } from "motion/react"
import { Portal } from "../portal";
import { useDebounce } from "@/hooks/useDebounce";

interface DialogContextProps extends ComponentProps<typeof DialogPrimitive.Root> {

}

const DialogStateContext = createContext<DialogContextProps>(null as any);

const useDialogState = () => {
  const value = useContext(DialogStateContext);
  if (!value) {
    throw new Error("useDialogContext must be used within a DialogContext");
  }
  return value;
}

function Dialog({
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const [dialogOpen, setDialogOpen] = useState(props.open || props.defaultOpen);

  useEffect(() => {
    if (Object.keys(props).includes("open") && props.open !== dialogOpen) {
      setDialogOpen(props.open);
    }
  }, [props.open, dialogOpen]);

  return <DialogStateContext.Provider value={{ open: dialogOpen }}>
    <DialogPrimitive.Root
      data-slot="dialog"
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  </DialogStateContext.Provider>
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.PropsWithChildren<HTMLMotionProps<"div">> & {
  showCloseButton?: boolean
}) {

  const { open } = useDialogState();

  const overlayVariants: Variants = {
    initial: {
      opacity: 0,
      '--blur-sm': '8px',
      pointerEvents: "none"
    },
    animate: {
      opacity: 1,
      '--blur-sm': '12px',
      pointerEvents: "auto"
    },
    exit: {
      opacity: 0,
      '--blur-sm': '8px',
      pointerEvents: "none"
    }
  }

  const contentVariants: Variants = {
    initial: {
      scale: .6,
      opacity: 0,
      pointerEvents: "none"
    },
    animate: {
      scale: 1,
      opacity: 1,
      pointerEvents: "auto"
    },
    exit: {
      scale: .6,
      opacity: 0,
      pointerEvents: "none"
    }
  }

  const [contentVisible, setContentVisible] = useState(open);

  const { delay } = useDebounce(500);

  useEffect(() => {
    if (open) {
      setContentVisible(true);
    }
    else {
      delay(() => {
        setContentVisible(false);
      })
    }
  }, [open]);

  if (!globalThis.document) {
    return <></>
  }

  return (
    <Portal container={document.body}>
      <AnimatePresence>
        <motion.div
          key="dialog.overlay"
          className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/50 backdrop-blur-sm"
          variants={overlayVariants}
          initial="initial"
          animate={open ? "animate" : "exit"}
        >
        </motion.div>
        <motion.div
          key="dialog.content"
          variants={contentVariants}
          initial="initial"
          animate={open && contentVisible ? "animate" : "exit"}
          {...props}
          layout
          className={cn(
            "bg-background fixed top-[50%] left-[50%] z-50",
            "w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%]",
            "gap-4 rounded-lg border p-6 shadow-lg outline-none sm:max-w-lg",
            className
          )}
        >
          <Activity mode={contentVisible ? "visible" : "hidden"}>
            {children}
          </Activity>
          {showCloseButton && (
            <DialogPrimitive.Close
              data-slot="dialog-close"
              data-state={open ? "open" : "closed"}
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </AnimatePresence>
    </Portal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}


function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}

    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
