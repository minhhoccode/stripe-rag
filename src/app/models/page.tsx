"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarInset } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, MoreHorizontal, Loader2, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HealthCheckDialog from "@/components/HealthCheckDialog";
import ModelSearchFilter from "@/components/ModelSearchFilter";
import type { Model, ModelCostDetails } from "@/types/model";

interface CostMap {
  [modelId: string]: ModelCostDetails;
}

interface HealthCheckResponse {
  healthy_endpoints: EndpointHealth[];
  unhealthy_endpoints: EndpointHealth[];
  healthy_count: number;
  unhealthy_count: number;
}

interface EndpointHealth {
  model: string;
  api_base?: string;
  api_version?: string;
  cache?: {
    "no-cache": boolean;
  };
  error?: string;
  "x-ratelimit-remaining-requests"?: string;
  "x-ratelimit-remaining-tokens"?: string;
  "x-ms-region"?: string;
}

export default function ModelsPage() {
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [costMap, setCostMap] = useState<CostMap>({});
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch models
        const modelsResponse = await fetch(`${process.env.NEXT_PUBLIC_AIHUB_URL || 'http://localhost:4000'}/models`, {
          headers: {
            'accept': 'application/json',
            'x-goog-api-key': process.env.NEXT_PUBLIC_API_KEY || 'sk-1234'
          }
        });
        
        if (!modelsResponse.ok) {
          throw new Error('Failed to fetch models');
        }
        
        const modelsData = await modelsResponse.json();
        
        // Fetch cost map
        const costResponse = await fetch(`${process.env.NEXT_PUBLIC_AIHUB_URL || 'http://localhost:4000'}/get/litellm_model_cost_map`, {
          headers: {
            'accept': 'application/json',
            'x-goog-api-key': process.env.NEXT_PUBLIC_API_KEY || 'sk-1234'
          }
        });
        
        if (!costResponse.ok) {
          throw new Error('Failed to fetch cost data');
        }
        
        const costData = await costResponse.json();
        setCostMap(costData);
        
        // Merge model data with cost data
        const modelsWithCost = modelsData.data.map((model: Model) => ({
          ...model,
          costDetails: costData[model.id] || {}
        }));
        
        setModels(modelsWithCost);
        setFilteredModels(modelsWithCost);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = models.filter(model => 
        model.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredModels(filtered);
    } else {
      setFilteredModels(models);
    }
  }, [searchTerm, models]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Function to determine model provider based on ID pattern or costDetails
  const getProviderFromModel = (model: Model) => {
    if (model.costDetails?.litellm_provider) {
      // Capitalize first letter
      return model.costDetails.litellm_provider.charAt(0).toUpperCase() + 
        model.costDetails.litellm_provider.slice(1);
    }
    
    const id = model.id;
    if (id.includes('gpt') || id.includes('davinci')) return 'OpenAI';
    if (id.includes('claude')) return 'Anthropic';
    if (id.includes('gemini')) return 'Google';
    if (id.includes('llama')) return 'Meta';
    if (id.includes('qwen')) return 'Alibaba';
    if (id.includes('deepseek')) return 'DeepSeek AI';
    if (id.includes('multilingual-e5')) return 'Microsoft';
    return 'Other';
  };

  // Function to format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to format cost as string with proper units
  const formatCost = (cost?: number) => {
    if (cost === undefined || cost === null) return "N/A";
    if (cost === 0) return "Free";
    
    return `$${(cost * 1000000).toFixed(2)}`;
  };

  const checkHealth = async () => {
    try {
      setIsHealthLoading(true);
      setHealthError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AIHUB_URL || "http://localhost:4000"}/health`,
        {
          headers: {
            accept: "application/json",
            "x-goog-api-key": process.env.NEXT_PUBLIC_API_KEY || "sk-1234",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch health data: ${response.status}`);
      }

      const data = await response.json();
      setHealthData(data);
    } catch (error) {
      console.error("Error checking health:", error);
      setHealthError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsHealthLoading(false);
    }
  };

  return (
    <SidebarInset>
      <PageHeader title="Models" breadcrumbs={[{ title: "Platform", href: "/" }, { title: "Models" }]} />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">LLM Models</h1>
          <div className="flex gap-2">
            <HealthCheckDialog
              healthData={healthData}
              healthError={healthError}
              isHealthLoading={isHealthLoading}
              checkHealth={checkHealth}
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Model
            </Button>
          </div>
        </div>
        <ModelSearchFilter searchTerm={searchTerm} handleSearch={handleSearch} />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading models...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">{error}</p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No models found matching your search.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <Card key={model.id} className="flex flex-col justify-between h-full">
                <div>
                  <CardHeader className="flex flex-col items-start space-y-1">
                    <CardTitle className="text-lg font-semibold">{model.id}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {getProviderFromModel(model)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Added:</span>
                        <span className="font-medium">{formatDate(model.created)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">{model.object}</span>
                      </div>
                      {model.costDetails?.max_tokens && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Tokens Output:</span>
                          <span>{model.costDetails.max_tokens.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Input Price /1M Tokens:</span>
                        <div className="flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium text-green-600">
                                  {formatCost(model.costDetails?.input_cost_per_token)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Input Price /1M Tokens: {formatCost(model.costDetails?.input_cost_per_token)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Output Price /1M Tokens:</span>
                        <div className="flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium text-green-600">
                                  {formatCost(model.costDetails?.output_cost_per_token)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Output Price /1M Tokens: {formatCost(model.costDetails?.output_cost_per_token)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    
                    {model.costDetails && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {model.costDetails.supports_vision && (
                          <Badge variant="secondary">Vision</Badge>
                        )}
                        {model.costDetails.supports_function_calling && (
                          <Badge variant="secondary">Function Calling</Badge>
                        )}
                        {model.costDetails.supports_audio_input && (
                          <Badge variant="secondary">Audio Input</Badge>
                        )}
                        {model.costDetails.supports_audio_output && (
                          <Badge variant="secondary">Audio Output</Badge>
                        )}
                        {model.costDetails.mode && (
                          <Badge variant="secondary">{model.costDetails.mode}</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </div>
                <CardFooter className="flex justify-between p-4">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => router.push(`/models/${model.id}`)}
                  >
                    Test Model
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </SidebarInset>
  )
}
