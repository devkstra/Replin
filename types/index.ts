// Collection types
export interface Collection {
  name: string;
  path: string;
  is_default: boolean;
}

export interface CollectionsResponse {
  collections: Collection[];
}

// Document upload types
export interface DocumentUploadResponse {
  status: string;
  message: string;
  document_count: number;
  index_id?: string;
}

// Agent configuration types
export interface AgentConfig {
  system_prompt: string;
  voice: string;
  model: string;
  agent_name?: string;
  language?: string;
  openai_api_key?: string;
  deepgram_api_key?: string;
  cartesia_api_key?: string;
  livekit_url?: string;
  livekit_api_key?: string;
  livekit_api_secret?: string;
  sip_trunk_id?: string;
}

export interface ConfigResponse {
  status: string;
  message: string;
}

// Agent control types
export interface AgentRequest {
  user_id: string;
  collection_name?: string | null;
  phone_number?: string | null;
  agent_type?: 'voice' | 'web';
}

export interface AgentResponse {
  status: string;
  user_id: string;
  container_id?: string;
}

export interface Agent {
  user_id: string;
  agent_type: string;
  running_time: number;
}

export interface AgentsListResponse {
  agents: Agent[];
}

// Form types
export interface DocumentUploadFormData {
  collectionName?: string;
  documents: FileList;
}

export interface AgentConfigFormData extends AgentConfig {}

export interface AgentControlFormData {
  collection_name?: string;
  phone_number?: string;
  agent_type: 'dialer' | 'web';
}

// Component props
export interface UserIdProps {
  userId: string;
} 