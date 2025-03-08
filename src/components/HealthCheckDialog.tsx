import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

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

interface HealthCheckDialogProps {
  healthData: HealthCheckResponse | null;
  healthError: string | null;
  isHealthLoading: boolean;
  checkHealth: () => Promise<void>;
}

const HealthCheckDialog: React.FC<HealthCheckDialogProps> = ({
  healthData,
  healthError,
  isHealthLoading,
  checkHealth,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={checkHealth}>
          {isHealthLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <AlertCircle className="mr-2 h-4 w-4" />
          )}
          Check Health
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Endpoint Health Status</DialogTitle>
          <DialogDescription>Health check for all model endpoints</DialogDescription>
        </DialogHeader>

        {healthError ? (
          <div className="p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
            {healthError}
          </div>
        ) : !healthData ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">{healthData.healthy_count} Healthy</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{healthData.unhealthy_count} Unhealthy</span>
              </div>
            </div>

            {healthData.healthy_endpoints.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Healthy Endpoints
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>API Base</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Rate Limits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthData.healthy_endpoints.map((endpoint, index) => (
                      <TableRow key={`healthy-${index}`}>
                        <TableCell className="font-medium">{endpoint.model}</TableCell>
                        <TableCell>{endpoint.api_base || "Default"}</TableCell>
                        <TableCell>{endpoint["x-ms-region"] || "-"}</TableCell>
                        <TableCell>
                          {endpoint["x-ratelimit-remaining-requests"] && (
                            <div className="text-xs">
                              Requests: {endpoint["x-ratelimit-remaining-requests"]}
                            </div>
                          )}
                          {endpoint["x-ratelimit-remaining-tokens"] && (
                            <div className="text-xs">Tokens: {endpoint["x-ratelimit-remaining-tokens"]}</div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {healthData.unhealthy_endpoints.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Unhealthy Endpoints
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model</TableHead>
                      <TableHead>API Base</TableHead>
                      <TableHead>Error</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthData.unhealthy_endpoints.map((endpoint, index) => (
                      <TableRow key={`unhealthy-${index}`}>
                        <TableCell className="font-medium">{endpoint.model}</TableCell>
                        <TableCell>{endpoint.api_base || "Default"}</TableCell>
                        <TableCell className="text-destructive max-w-md">
                          <div className="truncate max-h-24 overflow-y-auto text-xs">
                            {endpoint.error || "Unknown error"}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HealthCheckDialog;
