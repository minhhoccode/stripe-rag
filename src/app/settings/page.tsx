"use client"

import { useState } from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Settings saved successfully")
    }, 1000)
  }

  return (
    <SidebarInset>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ title: "Platform", href: "/" }, { title: "Settings" }]}
      />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="mt-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" placeholder="Email" defaultValue="john.doe@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company" defaultValue="Acme Inc" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" placeholder="Role" defaultValue="Administrator" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="block">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="usage-alerts" className="block">Usage Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you approach usage limits
                    </p>
                  </div>
                  <Switch id="usage-alerts" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails" className="block">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive newsletters and promotional emails
                    </p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for accessing the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Primary API Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" value="sk_live_xxxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1" />
                    <Button variant="outline">Show</Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created on May 15, 2023 · Never expires
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label>Development API Key</Label>
                  <div className="flex gap-2">
                    <Input type="password" value="sk_test_xxxxxxxxxxxxxxxxxxxxx" readOnly className="flex-1" />
                    <Button variant="outline">Show</Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created on June 3, 2023 · Never expires
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Generate New API Key</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Rate Limits</CardTitle>
                <CardDescription>Configure API access limits and throttling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="requests-per-minute">Requests Per Minute</Label>
                  <Input
                    id="requests-per-minute"
                    type="number"
                    defaultValue="60"
                    min="1"
                    max="1000"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of API requests allowed per minute
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="requests-per-day">Requests Per Day</Label>
                  <Input
                    id="requests-per-day"
                    type="number"
                    defaultValue="10000"
                    min="1"
                    max="100000"
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of API requests allowed per day
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Preferences</CardTitle>
                <CardDescription>
                  Configure default model settings for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="default-model">Default Model</Label>
                  <select 
                    id="default-model" 
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  </select>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label htmlFor="temperature">Default Temperature</Label>
                  <Input
                    id="temperature"
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0.0 - Deterministic</span>
                    <span>1.0 - Creative</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid gap-2">
                  <Label htmlFor="max-tokens">Default Max Tokens</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    defaultValue="1024"
                    min="1"
                    max="8192"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider Configuration</CardTitle>
                <CardDescription>Configure API providers and credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block font-medium">OpenAI</Label>
                    <p className="text-sm text-muted-foreground">
                      Use OpenAI models (GPT-3.5, GPT-4)
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="openai-api-key">OpenAI API Key</Label>
                  <Input id="openai-api-key" type="password" defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block font-medium">Anthropic</Label>
                    <p className="text-sm text-muted-foreground">
                      Use Anthropic models (Claude 3)
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="anthropic-api-key">Anthropic API Key</Label>
                  <Input id="anthropic-api-key" type="password" defaultValue="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage third-party service integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="block font-medium">Slack</Label>
                    <p className="text-sm text-muted-foreground">
                      Connect to Slack workspaces
                    </p>
                  </div>

                    <Switch defaultChecked />
                    </div>
                    <div className="grid gap-2">
                      <Button variant="outline">Connect Slack Workspace</Button>
                    </div>
                    
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="block font-medium">Google Drive</Label>
                        <p className="text-sm text-muted-foreground">
                          Connect to Google Drive accounts
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="grid gap-2">
                      <Button variant="outline">Connect Google Drive</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      )
    }