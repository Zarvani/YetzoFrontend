"use client"

import * as React from "react"
import { Send, User } from "lucide-react"

export interface ChatProps {
  bookingId: string;
  recipientName: string;
}

export function ChatBox({ bookingId, recipientName }: ChatProps) {
  const [messages, setMessages] = React.useState<{ text: string; sender: "me" | "them" }[]>([])
  const [input, setInput] = React.useState("")
  const ws = React.useRef<WebSocket | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const token = localStorage.getItem("yetzo_access_token")
    if (!token) return

    // Connect to WebSocket Server
    const wsUrl = "wss://sak.yetzo.com/ws"
    ws.current = new WebSocket(`${wsUrl}/chat/${bookingId}/?token=${token}`)

    ws.current.onopen = () => {
      console.log("Connected to chat server")
    }

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMessages((prev) => [...prev, { text: data.message, sender: "them" }])
      } catch (e) {
        console.error("Failed to parse message", e)
      }
    }

    return () => {
      ws.current?.close()
    }
  }, [bookingId])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !ws.current) return

    // Send to WebSocket
    ws.current.send(JSON.stringify({
      message: input
    }))

    // Optimistically update UI
    setMessages((prev) => [...prev, { text: input, sender: "me" }])
    setInput("")
  }

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md border border-slate-200 rounded-[12px] bg-white shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center gap-3 bg-[#0B2D8F] p-4 text-white">
        <div className="h-10 w-10 rounded-full bg-blue-800 flex items-center justify-center">
          <User className="h-5 w-5 text-blue-100" />
        </div>
        <div>
          <h3 className="font-semibold text-[15px]">{recipientName}</h3>
          <p className="text-[12px] text-blue-200 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-400"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm mt-10">
            Start the conversation...
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] p-3 rounded-[12px] text-[14px] ${msg.sender === "me"
                  ? "bg-[#2563EB] text-white self-end rounded-br-[4px]"
                  : "bg-white border border-slate-200 text-slate-800 self-start rounded-bl-[4px]"
                }`}
            >
              {msg.text}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="h-10 w-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white disabled:opacity-50 disabled:bg-slate-300 transition-colors"
        >
          <Send className="h-4 w-4 ml-0.5" />
        </button>
      </form>
    </div>
  )
}
