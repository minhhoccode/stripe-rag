"use client"

import React, { useState, useCallback } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"

interface MessageProps {
  message: {
    role: string
    content: string
  }
  onCopy: () => void
}

export const Message = React.memo(({ message, onCopy }: MessageProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 2000)
  }, [message.content, onCopy])

  if (message.role === "system") return null

  return (
    <div className={`flex items-start gap-3 ${message.role === "assistant" ? "" : "justify-end"}`}>
      {message.role === "assistant" && (
        <Avatar className="mt-0.5 h-9 w-9 border border-primary/10 shadow-sm">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="AI" />
          <AvatarFallback className="bg-primary/5 text-primary">AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`group relative rounded-lg px-3 shadow-sm max-w-[85%] ${
          message.role === "assistant" ? "bg-card border border-border/50" : "bg-primary text-primary-foreground"
        }`}
      >
        <div className="text-sm leading-relaxed">
          <MarkdownRenderer content={message.content} className={message.role === "user" ? "prose-invert" : ""} />
        </div>

        {message.role === "assistant" && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy message"}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        )}
      </div>
      {message.role === "user" && (
        <Avatar className="mt-0.5 h-9 w-9 border border-primary/10 shadow-sm">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
          <AvatarFallback>You</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
})

Message.displayName = "Message"

