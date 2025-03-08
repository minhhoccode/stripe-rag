"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ModelCard from "@/components/ModelCard";
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
        const modelsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_AIHUB_URL || "http://localhost:4000"}/models`,
          {
            headers: {
              accept: "application/json",
              "x-goog-api-key": process.env.NEXT_PUBLIC_API_KEY || "sk-1234",
            },
          }
        );

        if (!modelsResponse.ok) {
          throw new Error("Failed to fetch models");
        }

        const modelsData = await modelsResponse.json();

        // Fetch cost map
        const costResponse = await fetch(
          `${process.env.NEXT_PUBLIC_AIHUB_URL || "http://localhost:4000"}/get/litellm_model_cost_map`,
          {
            headers: {
              accept: "application/json",
              "x-goog-api-key": process.env.NEXT_PUBLIC_API_KEY || "sk-1234",
            },
          }
        );

        if (!costResponse.ok) {
          throw new Error("Failed to fetch cost data");
        }

        const costData = await costResponse.json();
        setCostMap(costData);

        // Merge model data with cost data
        const modelsWithCost = modelsData.data.map((model: Model) => ({
          ...model,
          costDetails: costData[model.id] || {},
        }));

        setModels(modelsWithCost);
        setFilteredModels(modelsWithCost);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = models.filter((model) =>
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
      return (
        model.costDetails.litellm_provider.charAt(0).toUpperCase() +
        model.costDetails.litellm_provider.slice(1)
      );
    }

    const id = model.id;
    if (id.includes("gpt") || id.includes("davinci")) return "OpenAI";
    if (id.includes("claude")) return "Anthropic";
    if (id.includes("gemini")) return "Google";
    if (id.includes("llama")) return "Meta";
    if (id.includes("qwen")) return "Alibaba";
    if (id.includes("deepseek")) return "DeepSeek AI";
    if (id.includes("multilingual-e5")) return "Microsoft";
    return "Other";
  };

  // Function to format timestamp to readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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
      <PageHeader
        title="Models"
        breadcrumbs={[{ title: "Platform", href: "/" }, { title: "Models" }]}
      />
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
            Loading models...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-destructive">{error}</p>
          </div>
        ) : filteredModels.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">
              No models found matching your search.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                getProviderFromModel={getProviderFromModel}
                formatDate={formatDate}
                formatCost={formatCost}
              />
            ))}
          </div>
        )}
      </main>
    </SidebarInset>
  );
}
