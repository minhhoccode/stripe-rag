import { SidebarInset } from "@/components/ui/sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export default function KnowledgeBasePage() {
  // Sample knowledge bases data
  const knowledgeBases = [
    {
      id: 1,
      name: "Product Documentation",
      description: "Comprehensive documentation for all products",
      status: "active",
      lastUpdated: "2 hours ago",
      documentCount: 124,
      size: "15.2 MB",
    },
    {
      id: 2,
      name: "FAQ",
      description: "Frequently asked questions and answers",
      status: "active",
      lastUpdated: "1 day ago",
      documentCount: 56,
      size: "3.8 MB",
    },
    {
      id: 3,
      name: "Troubleshooting Guide",
      description: "Solutions for common issues and problems",
      status: "active",
      lastUpdated: "3 days ago",
      documentCount: 78,
      size: "8.5 MB",
    },
    {
      id: 4,
      name: "Company Policies",
      description: "Internal company policies and procedures",
      status: "inactive",
      lastUpdated: "2 weeks ago",
      documentCount: 32,
      size: "4.1 MB",
    },
  ]

  return (
    <SidebarInset>
      <PageHeader
        title="Knowledge Base"
        breadcrumbs={[{ title: "Platform", href: "/" }, { title: "Knowledge Base" }]}
      />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Knowledge Base</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Knowledge Base
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search knowledge bases..." className="w-full pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {knowledgeBases.map((kb) => (
            <Card key={kb.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="flex items-center">
                    {kb.name}
                    <Badge variant={kb.status === "active" ? "default" : "outline"} className="ml-2">
                      {kb.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1.5">{kb.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Refresh</DropdownMenuItem>
                    <DropdownMenuItem>View Documents</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Documents:</span>
                    <span className="font-medium">{kb.documentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium">{kb.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last updated:</span>
                    <span>{kb.lastUpdated}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> View Documents
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Add Documents
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </SidebarInset>
  )
}

