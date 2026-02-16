"use client";

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, HTMLMotionProps, Variants } from "motion/react"
import { Portal } from "../portal";

interface DialogContextProps extends React.ComponentProps<typeof DialogPrimitive.Root> {

}

const DialogContext = React.createContext<DialogContextProps>(null as any);

const useDialogContext = () => {
  const value = React.useContext(DialogContext);
  if (!value) {
    throw new Error("useDialogContext must be used within a DialogContext");
  }
  return value;
}

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogContext.Provider value={{ ...props }}>
    <DialogPrimitive.Root data-slot="dialog" {...props} />
  </DialogContext.Provider>
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

/**
 * 
 * <DialogOverlay className="bg-red-500 fixed w-full" />
    <AnimatePresence>
      <motion.div
        variants={motionVariants}
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        )}
        key="motion-content"
        initial={"initial"}
        animate={"animate"}
        exit={"exit"}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </motion.div>
    </AnimatePresence>
 */

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.PropsWithChildren<HTMLMotionProps<"div">> & {
  showCloseButton?: boolean
}) {

  const { open, defaultOpen } = useDialogContext();

  const overlayVariants: Variants = {
    initial: {
      scale: .6,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1
    },
    exit: {
      scale: .6,
      opacity: 0
    }
  }

  const motionVariants: Variants = {
    initial: {
      scale: 60,
      opacity: 0
    },
    animate: {
      scale: 100,
      opacity: 1
    },
    exit: {
      scale: 60,
      opacity: 0
    }
  }

  if (!globalThis.document) {
    return null;
  }

  return (
    <Portal container={document.body} data-slot="dialog-portal">
      <AnimatePresence>
        {
          open && <motion.div
            key="overlay"
            className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial={"initial"}
            animate={"animate"}
            exit={"exit"}
          >
          </motion.div>
        }
        {
          open && <motion.div
            variants={motionVariants}
            className={cn(
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
              className
            )}
            key="content"
            initial={"initial"}
            animate={"animate"}
            exit={"exit"}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogPrimitive.Close
                data-slot="dialog-close"
                className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            )}
          </motion.div>
        }
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
