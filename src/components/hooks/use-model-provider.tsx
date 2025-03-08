import type { Model } from "@/types/model";

const useModelProvider = (model: Model) => {
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

export default useModelProvider;
