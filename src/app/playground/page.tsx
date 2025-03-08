"use client"

import { useState } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Send, Save, Copy, Download, RotateCcw } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function PlaygroundPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful AI assistant." },
    { role: "assistant", content: "Hello! How can I help you today?" },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I received your message: "${input}". This is a simulated response in the playground environment.`,
        },
      ])
    }, 1000)

    setInput("")
  }

  return (
    <SidebarInset>
      <PageHeader title="Playground" breadcrumbs={[{ title: "Platform", href: "/" }, { title: "Playground" }]} />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Playground</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <p className="mt-2 text-muted-foreground">Test and experiment with different models and configurations</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat</CardTitle>
                <CardDescription>Interact with the AI model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] space-y-4 overflow-y-auto rounded-md border p-4">
                  {messages.map((message, index) => {
                    if (message.role === "system") return null

                    return message.role === "assistant" ? (
                      <div key={index} className="flex items-start gap-3">
                        <Avatar className="mt-0.5 h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg bg-muted p-3">
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div key={index} className="flex items-start justify-end gap-3">
                        <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                          <p>{message.content}</p>
                        </div>
                        <Avatar className="mt-0.5 h-8 w-8">
                          <AvatarFallback>You</AvatarFallback>
                        </Avatar>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    className="flex-1"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
                <Button variant="outline">
                  <Copy className="mr-2 h-4 w-4" /> Copy Conversation
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Analysis</CardTitle>
                <CardDescription>Evaluate the model's performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span>1.2s</span>
                      <span>Fast</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Token Usage</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[40%] rounded-full bg-primary"></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span>245 tokens</span>
                      <span>Efficient</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Relevance Score</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[92%] rounded-full bg-primary"></div>
                    </div>
                    <div className="mt-1 flex justify-between text-xs">
                      <span>92%</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Configuration</CardTitle>
                <CardDescription>Adjust model settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Select defaultValue="gpt-4o">
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="llama-3.1">Llama 3.1</SelectItem>
                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Temperature: 0.7</label>
                    <Slider defaultValue={[0.7]} max={1} step={0.1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Tokens</label>
                    <Select defaultValue="1024">
                      <SelectTrigger>
                        <SelectValue placeholder="Select max tokens" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="256">256</SelectItem>
                        <SelectItem value="512">512</SelectItem>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="2048">2048</SelectItem>
                        <SelectItem value="4096">4096</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">System Prompt</label>
                    <Textarea defaultValue="You are a helpful AI assistant." className="min-h-[100px]" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Add context from knowledge bases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="kb1" />
                    <label htmlFor="kb1" className="text-sm">
                      Product Documentation
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="kb2" />
                    <label htmlFor="kb2" className="text-sm">
                      FAQ
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="kb3" />
                    <label htmlFor="kb3" className="text-sm">
                      Troubleshooting Guide
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="kb4" />
                    <label htmlFor="kb4" className="text-sm">
                      Company Policies
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Update Context
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </SidebarInset>
  )
}

