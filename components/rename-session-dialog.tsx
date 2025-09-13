"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface RenameSessionDialogProps {
  isOpen: boolean
  onClose: () => void
  onRename: (newTitle: string) => void
  currentTitle: string
}

export function RenameSessionDialog({
  isOpen,
  onClose,
  onRename,
  currentTitle,
}: RenameSessionDialogProps) {
  const [newTitle, setNewTitle] = useState(currentTitle)

  // Update the title when the dialog opens or currentTitle changes
  React.useEffect(() => {
    if (isOpen) {
      setNewTitle(currentTitle)
    }
  }, [isOpen, currentTitle])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTitle.trim() && newTitle !== currentTitle) {
      onRename(newTitle.trim())
      onClose()
    }
  }

  const handleClose = () => {
    setNewTitle(currentTitle)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3"
                placeholder="Enter session title..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newTitle.trim() || newTitle === currentTitle}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}