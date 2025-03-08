import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SubscriptionCheck } from "@/components/subscription-check";


export default function ChatbotsPage() {
  // Sample chatbots data
  const chatbots = [
    {
      id: 1,
      name: "Customer Support",
      description: "Handles customer inquiries and support tickets",
      model: "GPT-4o",
      status: "active",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Sales Assistant",
      description: "Helps with product recommendations and sales inquiries",
      model: "Claude 3 Opus",
      status: "active",
      lastUpdated: "1 day ago",
    },
    {
      id: 3,
      name: "Internal Knowledge Bot",
      description: "Answers questions about company policies and procedures",
      model: "Llama 3.1",
      status: "maintenance",
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      name: "Marketing Assistant",
      description: "Helps generate marketing content and ideas",
      model: "GPT-4o",
      status: "draft",
      lastUpdated: "1 week ago",
    },
  ]

  return (
    <SubscriptionCheck>
      <PageHeader title="Chatbots" breadcrumbs={[{ title: "Platform", href: "/" }, { title: "Chatbots" }]} />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Chatbots</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Chatbot
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search chatbots..." className="w-full pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((chatbot) => (
            <Card key={chatbot.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center">
                    {chatbot.name}
                    <Badge
                      variant={
                        chatbot.status === "active"
                          ? "default"
                          : chatbot.status === "maintenance"
                            ? "outline"
                            : "secondary"
                      }
                      className="ml-2"
                    >
                      {chatbot.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1.5">{chatbot.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Test</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-medium">{chatbot.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated:</span>
                    <span>{chatbot.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">Test Chat</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </SubscriptionCheck>

  )
}

