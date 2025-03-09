"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Send, RotateCcw, Bot, ChevronRight, ChevronLeft, AlertCircle, Loader2, Sparkles, Zap, Gauge, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Message } from "@/components/message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/hooks/use-toast";
import { useMediaQuery } from "@/components/hooks/use-media-query";

const DEFAULT_SYSTEM_PROMPT = "You are a helpful AI assistant.";
const DEFAULT_ASSISTANT_MESSAGE = "Hello! How can I help you today?";
const DEFAULT_CONFIG = {
  temperature: 0.7,
};
const API_URL = process.env.AIHUB_URL || "http://localhost:4000";

// Configuration presets
const CONFIG_PRESETS = {
  balanced: {
    name: "Balanced",
    icon: <Gauge className="h-4 w-4 mr-2" />,
    config: {
      temperature: 0.7,
      
    },
    systemPrompt: "You are a helpful AI assistant.",
  },
  creative: {
    name: "Creative",
    icon: <Sparkles className="h-4 w-4 mr-2" />,
    config: {
      temperature: 0.9,
      
    },
    systemPrompt: "You are a creative AI assistant. Think outside the box and provide imaginative responses.",
  },
  precise: {
    name: "Precise",
    icon: <Zap className="h-4 w-4 mr-2" />,
    config: {
      temperature: 0.3,
      
    },
    systemPrompt: "You are a precise AI assistant. Provide accurate, factual, and concise responses.",
  },
};

// Example prompts for users to try
const EXAMPLE_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a short poem about technology",
  "What are the best practices for React development?",
  "Help me debug this error: TypeError: Cannot read property 'map' of undefined",
];

interface ModelOption {
  value: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: { title: string; href: string; }[];
}

interface ScrollAreaRef {
  scrollTo: (options: { top: number; behavior: ScrollBehavior }) => void;
  scrollHeight: number;
}

type PresetKey = keyof typeof CONFIG_PRESETS;

interface ApiError extends Error {
  message: string;
}

interface PlaygroundPageProps {
  params: {
    id: string;
  };
}

export default function PlaygroundPage({ params }: PlaygroundPageProps) {
  const [messages, setMessages] = useState([
    { role: "system", content: DEFAULT_SYSTEM_PROMPT },
    { role: "assistant", content: DEFAULT_ASSISTANT_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(params.id);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [configText, setConfigText] = useState(JSON.stringify(DEFAULT_CONFIG, null, 2));
  const [jsonError, setJsonError] = useState("");
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [availableModels, setAvailableModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("balanced");
  const [showExamples, setShowExamples] = useState(false);
  const scrollAreaRef = useRef<ScrollAreaRef>(null);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Memoized config text update
  useEffect(() => {
    setConfigText(JSON.stringify(config, null, 2));
  }, [config]);

  // Update char count when input changes
  useEffect(() => {
    setCharCount(input.length);
  }, [input]);

  // Fetch models
  const fetchModels = useCallback(async (): Promise<void> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const apiUrl = `${API_URL}/models?return_wildcard_routes=false`;

      const response = await fetch(apiUrl, { 
        method: "GET",
        headers: {
          accept: "application/json",
          "x-goog-api-key": apiKey || "",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAvailableModels(
        data.data.map((model: { id: string }) => ({ value: model.id, label: model.id }))
      );
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        title: "Error fetching models",
        description: "Could not load available models. Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    setModel(params.id);
    fetchModels();
  }, [fetchModels, params.id]);

  // Handle config text change
  const handleConfigTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setConfigText(text);
    try {
      setConfig(JSON.parse(text));
      setJsonError("");
    } catch (error) {
      setJsonError("Invalid JSON format");
    }
  }, []);

  // Apply preset configuration
  const applyPreset = useCallback((presetKey: keyof typeof CONFIG_PRESETS) => {
    const preset = CONFIG_PRESETS[presetKey];
    setConfig(preset.config);
    setSystemPrompt(preset.systemPrompt);
    setSelectedPreset(presetKey);
    toast({
      title: `Applied ${preset.name} preset`,
      description: "Configuration and system prompt updated.",
    });
  }, [toast]);

  // Handle sending messages
  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);
    setProgress(0);

    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      const apiUrl = `${API_URL}/v1/chat/completions`;

      const requestBody = {
        model,
        messages: [...messages, userMessage],
        ...config,
        stream: true,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedResponse = "";

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 - prev) * 0.1;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          clearInterval(progressInterval);
          setProgress(100);
          break;
        }

        const chunk = decoder.decode(value);
        const jsonObjects = chunk
          .split(/data:\s*/)
          .filter((str) => str.trim() !== "" && str.trim() !== "[DONE]")
          .map((str) => {
            try {
              return JSON.parse(str.trim());
            } catch (e) {
              console.error("JSON parsing error:", e, "Chunk:", str);
              return null;
            }
          })
          .filter((obj) => obj !== null);

        for (const obj of jsonObjects) {
          if (obj?.choices?.[0]?.delta?.content) {
            accumulatedResponse += obj.choices[0].delta.content;
            setMessages((prevMessages) => {
              const lastIndex = prevMessages.length - 1;
              const updatedMessages = [...prevMessages];
              updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                content: accumulatedResponse,
              };
              return updatedMessages;
            });
          }
        }
      }
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${errorMessage}` },
      ]);
      toast({
        title: "Error sending message",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [input, loading, messages, model, config, toast]);

  const handleApplySettings = useCallback(() => {
    setMessages((prevMessages) => [
      { role: "system", content: systemPrompt },
      ...prevMessages.slice(1),
    ]);
    toast({
      title: "Settings applied",
      description: "Your configuration has been updated.",
    });
  }, [systemPrompt, toast]);

  const handleResetChat = useCallback(() => {
    setMessages([
      { role: "system", content: systemPrompt },
      { role: "assistant", content: DEFAULT_ASSISTANT_MESSAGE },
    ]);
    setLoading(false);
    toast({
      title: "Chat reset",
      description: "The conversation has been reset.",
    });
  }, [systemPrompt, toast]);

  const handleCopyMessage = useCallback(() => {
    // This is handled in the Message component
  }, []);

  const handleUseExample = useCallback((example: string) => {
    setInput(example);
    setShowExamples(false);
    document.querySelector('textarea')?.focus();
  }, []);

  // Scroll to bottom
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messagesLength]);

  // Input handling
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setCharCount(e.target.value.length);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const estimatedTokens = useMemo(() => {
    return Math.ceil(charCount / 4);
  }, [charCount]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b">
        <PageHeader
          title="Playground"
          breadcrumbs={[
            { title: "Platform", href: "/" },
            { title: "models",  href: "/models"  },
            { title: "LLM Playground", href: "/" },
          ]}
        />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-3">
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      aria-label={sidebarOpen ? "Hide settings" : "Show settings"}
                    >
                      {sidebarOpen ? (
                        <ChevronLeft className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {sidebarOpen ? "Hide settings" : "Show settings"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {decodeURIComponent(model)}
                </span>
              </div>

              <Badge variant="outline" className="bg-background">
                {jsonError ? "Error" : `${config.temperature.toFixed(1)} temp`}
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset conversation
            </Button>
          </div>

          {loading && (
            <div className="px-6 py-1 bg-background border-b">
              <Progress value={progress} className="h-1" />
            </div>
          )}

          <ScrollArea 
            ref={scrollAreaRef as any}
            className="flex-1 px-4 py-6"
            aria-label="Chat messages"
            role="log"
          >
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message, index) => (
                <Message 
                  key={index} 
                  message={message} 
                  onCopy={handleCopyMessage}
                />
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <Avatar className="mt-0.5 h-9 w-9 border border-primary/10 shadow-sm">
                    <AvatarImage
                      src="/placeholder.svg?height=36&width=36"
                      alt="AI"
                    />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg border border-border/50 bg-card p-4 shadow-sm max-w-[85%]">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <p className="text-sm">Generating response...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t bg-background/80 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                {showExamples && (
                  <div className="absolute bottom-full mb-2 w-full bg-card rounded-lg border shadow-lg p-2 z-10">
                    <div className="flex justify-between items-center mb-2 px-2">
                      <h3 className="text-sm font-medium">Example prompts</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => setShowExamples(false)}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="grid gap-1">
                      {EXAMPLE_PROMPTS.map((example, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          className="justify-start h-auto py-1.5 px-2 text-sm"
                          onClick={() => handleUseExample(example)}
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-[80px] resize-none rounded-lg border-muted-foreground/20 pr-12 focus-visible:ring-primary"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  aria-label="Message input"
                />
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => setShowExamples(!showExamples)}
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Example prompts</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    className="h-9 w-9 rounded-full p-0 shadow-sm"
                    size="icon"
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between pt-2 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>{charCount} chars (~{estimatedTokens} tokens)</span>
              </div>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div className={`${isMobile ? 'absolute inset-0 z-50' : 'w-[380px]'} overflow-y-auto border-l bg-background/95 backdrop-blur-sm`}>
            {isMobile && (
              <div className="flex justify-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <Card className="border-0 rounded-none shadow-none">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">Configuration</h3>

                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6">
                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium" htmlFor="model-select">Model</Label>
                      <Select 
                        value={model} 
                        onValueChange={setModel}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((option: ModelOption) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex justify-between">
                        <Label className="text-sm font-medium" htmlFor="temperature-slider">
                          Temperature: {config.temperature.toFixed(1)}
                        </Label>
                      </div>
                      <Slider
                        id="temperature-slider"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[config.temperature]}
                        onValueChange={(value) => setConfig({...config, temperature: value[0]})}
                        aria-label="Temperature"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium" htmlFor="system-prompt">
                        System Prompt
                      </Label>
                      <Textarea
                        id="system-prompt"
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        className="min-h-[120px] resize-none focus-visible:ring-primary"
                        placeholder="Set instructions for the AI assistant..."
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium">Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(CONFIG_PRESETS).map(([key, preset]) => (
                          <Button
                            key={key}
                            variant={selectedPreset === key ? "default" : "outline"}
                            className="justify-start"
                            onClick={() => applyPreset(key as PresetKey)}
                          >
                            {preset.icon}
                            <span className="truncate">{preset.name}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <Button className="w-full" onClick={handleApplySettings}>
                      Apply Settings
                    </Button>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-2.5">
                      <Label className="text-sm font-medium" htmlFor="advanced-config">
                        Advanced Configuration (JSON)
                      </Label>
                      <Textarea
                        id="advanced-config"
                        className="min-h-[280px] resize-none text-sm font-mono focus-visible:ring-primary"
                        value={configText}
                        onChange={handleConfigTextChange}
                      />
                      {jsonError && (
                        <Alert variant="destructive" className="mt-2 py-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="ml-2 text-xs">
                            {jsonError}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <Button className="w-full" onClick={handleApplySettings}>
                      Apply Settings
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
