import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  costDetails?: ModelCostDetails;
}

interface ModelCostDetails {
  max_tokens?: number;
  max_input_tokens?: number;
  max_output_tokens?: number;
  input_cost_per_token?: number;
  output_cost_per_token?: number;
  litellm_provider?: string;
  mode?: string;
  supports_function_calling?: boolean;
  supports_vision?: boolean;
  supports_audio_input?: boolean;
  supports_audio_output?: boolean;
}

interface ModelCardProps {
  model: Model;
  getProviderFromModel: (model: Model) => string;
  formatDate: (timestamp: number) => string;
  formatCost: (cost?: number) => string;
}

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  getProviderFromModel,
  formatDate,
  formatCost,
}) => {
  return (
    <Card className="flex flex-col justify-between h-full">
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
              {model.costDetails.supports_vision && <Badge variant="secondary">Vision</Badge>}
              {model.costDetails.supports_function_calling && (
                <Badge variant="secondary">Function Calling</Badge>
              )}
              {model.costDetails.supports_audio_input && <Badge variant="secondary">Audio Input</Badge>}
              {model.costDetails.supports_audio_output && <Badge variant="secondary">Audio Output</Badge>}
              {model.costDetails.mode && <Badge variant="secondary">{model.costDetails.mode}</Badge>}
            </div>
          )}
        </CardContent>
      </div>
      <CardFooter className="flex justify-between p-4">
        <Button variant="outline" size="sm">
          Configure
        </Button>
        <Button size="sm">Test Model</Button>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
