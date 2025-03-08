export interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
  costDetails?: ModelCostDetails;
}

export interface ModelCostDetails {
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
