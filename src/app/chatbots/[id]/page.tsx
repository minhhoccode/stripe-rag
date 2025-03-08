import { SidebarInset } from "@/components/ui/sidebar"
import { SidebarProvider } from '@/components/ui/sidebar';

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Settings, Database, MessageSquare, Save, Plus, User2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function ChatbotDetailPage({ params }: { params: { id: string } }) {
  // This would normally be fetched from an API
  const chatbot = {
    id: params.id,
    name: "Customer Support",
    description: "Handles customer inquiries and support tickets",
    model: "GPT-4o",
    status: "active",
    lastUpdated: "2 hours ago",
    createdAt: "2023-10-15",
    knowledgeBases: ["Product Documentation", "FAQ", "Troubleshooting Guide"],
    systemPrompt:
      "You are a helpful customer support assistant for Acme Inc. You help customers with their questions about our products and services.",
  }

  return (
    <SidebarProvider>
    <SidebarInset>
      <PageHeader
        title={chatbot.name}
        breadcrumbs={[
          { title: "Platform", href: "/" },
          { title: "Chatbots", href: "/chatbots" },
          { title: chatbot.name },
        ]}
      />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{chatbot.name}</h1>
            <Badge variant={chatbot.status === "active" ? "default" : "outline"}>{chatbot.status}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" /> Test Chat
            </Button>
          </div>
        </div>

        <p className="mt-2 text-muted-foreground">{chatbot.description}</p>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chatbot Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Model</p>
                        <p className="font-medium">{chatbot.model}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium capitalize">{chatbot.status}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="font-medium">{chatbot.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{chatbot.lastUpdated}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">System Prompt</p>
                      <p className="mt-1 rounded-md bg-muted p-3 text-sm">{chatbot.systemPrompt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base</CardTitle>
                  <CardDescription>Connected knowledge sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    {chatbot.knowledgeBases.map((kb) => (
                      <li key={kb} className="flex items-center gap-2 rounded-md border p-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span>{kb}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest interactions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">System Prompt Updated</p>
                        <p className="text-xs text-muted-foreground">2 hours ago by Admin</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Knowledge Base Connected: Troubleshooting Guide</p>
                        <p className="text-xs text-muted-foreground">Yesterday by Admin</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Test Chat Session Completed</p>
                        <p className="text-xs text-muted-foreground">3 days ago by Admin</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                  <CardDescription>Configure the LLM settings for this chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Model</label>
                      <select className="rounded-md border p-2">
                        <option>GPT-4o</option>
                        <option>Claude 3 Opus</option>
                        <option>Llama 3.1</option>
                        <option>Mistral Large</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">System Prompt</label>
                      <textarea className="min-h-[100px] rounded-md border p-2" defaultValue={chatbot.systemPrompt} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Temperature</label>
                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" />
                        <div className="flex justify-between text-xs">
                          <span>0.0</span>
                          <span>0.7</span>
                          <span>1.0</span>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Max Tokens</label>
                        <input type="number" className="rounded-md border p-2" defaultValue={1024} />
                      </div>
                    </div>
                    <Button className="mt-2 justify-self-end">
                      <Save className="mr-2 h-4 w-4" /> Save Configuration
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Fine-tune chatbot behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Streaming</p>
                        <p className="text-sm text-muted-foreground">Show responses as they're generated</p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Tool Calling</p>
                        <p className="text-sm text-muted-foreground">Allow chatbot to use external tools</p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enable Logging</p>
                        <p className="text-sm text-muted-foreground">Record all conversations for analysis</p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Knowledge Bases</CardTitle>
                  <CardDescription>Sources of information for this chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {chatbot.knowledgeBases.map((kb) => (
                      <div key={kb} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{kb}</p>
                            <p className="text-sm text-muted-foreground">Last updated: 3 days ago</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    ))}
                    <Button className="mt-2">
                      <Plus className="mr-2 h-4 w-4" /> Connect Knowledge Base
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Settings</CardTitle>
                  <CardDescription>Configure how knowledge is retrieved and used</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Retrieval Strategy</label>
                      <select className="rounded-md border p-2">
                        <option>Semantic Search</option>
                        <option>Hybrid Search</option>
                        <option>Keyword Search</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Top K Results</label>
                        <input type="number" className="rounded-md border p-2" defaultValue={5} />
                      </div>
                      <div className="grid gap-2">
                        <label className="text-sm font-medium">Similarity Threshold</label>
                        <input type="range" min="0" max="1" step="0.05" defaultValue="0.75" />
                        <div className="flex justify-between text-xs">
                          <span>0.0</span>
                          <span>0.75</span>
                          <span>1.0</span>
                        </div>
                      </div>
                    </div>
                    <Button className="mt-2 justify-self-end">
                      <Save className="mr-2 h-4 w-4" /> Save Settings
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Chat Testing</CardTitle>
                  <CardDescription>Test your chatbot's responses in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[400px] flex-col">
                    <div className="flex-1 space-y-4 overflow-auto rounded-md border p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                          <p>Hello! I'm your customer support assistant. How can I help you today?</p>
                        </div>
                      </div>
                      <div className="flex items-start justify-end gap-3">
                        <div className="rounded-lg bg-primary p-3 text-primary-foreground">
                          <p>I'm having trouble with my account login.</p>
                        </div>
                        <div className="rounded-full bg-background p-2 shadow">
                          <User2 className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="rounded-lg bg-muted p-3">
                          <p>
                            I'm sorry to hear you're having trouble logging in. Let me help you with that. Could you
                            please tell me what specific issue you're experiencing? For example:
                          </p>
                          <ul className="ml-4 mt-2 list-disc space-y-1">
                            <li>Forgotten password</li>
                            <li>Account locked</li>
                            <li>Error message when trying to log in</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Cases</CardTitle>
                  <CardDescription>Predefined scenarios to test chatbot responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <div className="rounded-md border p-3">
                      <p className="font-medium">Account Login Issues</p>
                      <p className="text-sm text-muted-foreground">Tests responses to common login problems</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">Run</Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="font-medium">Product Information</p>
                      <p className="text-sm text-muted-foreground">Tests knowledge of product details and features</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">Run</Button>
                      </div>
                    </div>
                    <div className="rounded-md border p-3">
                      <p className="font-medium">Billing Questions</p>
                      <p className="text-sm text-muted-foreground">Tests responses to billing and payment inquiries</p>
                      <div className="mt-2 flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button size="sm">Run</Button>
                      </div>
                    </div>
                    <Button className="mt-2">
                      <Plus className="mr-2 h-4 w-4" /> Create Test Case
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                  <CardDescription>Performance metrics from test runs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Response Accuracy</p>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[85%] rounded-full bg-primary"></div>
                      </div>
                      <div className="mt-1 flex justify-between text-xs">
                        <span>85% accuracy</span>
                        <span>Last tested: Today</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[92%] rounded-full bg-primary"></div>
                      </div>
                      <div className="mt-1 flex justify-between text-xs">
                        <span>1.2s average</span>
                        <span>Last tested: Today</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Knowledge Coverage</p>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-2 w-[78%] rounded-full bg-primary"></div>
                      </div>
                      <div className="mt-1 flex justify-between text-xs">
                        <span>78% coverage</span>
                        <span>Last tested: Today</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Conversation History</CardTitle>
                <CardDescription>Recent interactions with this chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Session #12345</p>
                      <Badge>Completed</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Today at 10:23 AM • 12 messages</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Session #12344</p>
                      <Badge>Completed</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Yesterday at 3:45 PM • 8 messages</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Session #12343</p>
                      <Badge variant="outline">Abandoned</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">2 days ago at 11:12 AM • 3 messages</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
    </SidebarProvider>
  )
}

