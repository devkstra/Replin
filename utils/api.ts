import axios from 'axios';
import {
  DocumentUploadResponse,
  ConfigResponse,
  CollectionsResponse,
  AgentConfig,
  AgentResponse,
  AgentsListResponse,
} from '../types';

// Flag to use mock data instead of actual API
const USE_MOCK = false;

// Set up Axios with default error handling
const documentApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOCUMENT_API_URL || 'https://8d6408490cd55458d53886886d7f5902.loophole.site',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 120000 // Increased to 2 minutes to handle larger uploads
});

const agentManagerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AGENT_MANAGER_URL || 'https://6873ce93e018e551c09de53a5bded472.loophole.site',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  timeout: 30000 // 30 second timeout
});

// Prevent Axios from making actual API calls when using mock
if (USE_MOCK) {
  documentApi.interceptors.request.use((config) => {
    return Promise.reject(new Error('Using mock data'));
  });
  
  agentManagerApi.interceptors.request.use((config) => {
    return Promise.reject(new Error('Using mock data'));
  });
}

// Mock implementation (simplified)
const mockCollections = [
  {
    name: 'Default Collection',
    path: '/collections/default',
    is_default: true,
  },
  {
    name: 'Product Documentation',
    path: '/collections/products',
    is_default: false,
  },
  {
    name: 'Customer Support',
    path: '/collections/support',
    is_default: false,
  }
];

const mockAgents: Record<string, {
  user_id: string;
  agent_type: 'voice' | 'web';
  running_time: number;
}> = {};

// Mock config object
const mockConfig: AgentConfig = {
  system_prompt: "You are a helpful AI assistant that provides accurate information based on the provided documents.",
  voice: "alloy",
  model: "gpt-4o-mini",
  agent_name: "Replin AI",
  language: "en",
  openai_api_key: "sk-mock1234567890abcdefghijklmnopqrstuvwxyz",
  deepgram_api_key: "dg-mockapikey123456789",
  livekit_url: "wss://mock-project.livekit.cloud"
};

// Document Upload API
export const uploadDocuments = async (
  userId: string,
  files: FileList,
  collectionName?: string
): Promise<DocumentUploadResponse> => {
  if (USE_MOCK) {
    return Promise.resolve({
      status: 'success',
      message: 'Documents uploaded and processed successfully',
      document_count: files.length,
      index_id: `${userId}_index_123`
    });
  }

  try {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('files', file);
    });
    
    if (collectionName) {
      formData.append('collection_name', collectionName);
    }
    
    const response = await documentApi.post<DocumentUploadResponse>(
      `/upload/${userId}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error uploading documents:', error);
    throw error;
  }
};

export const fetchUserConfig = async (
  userId: string
): Promise<AgentConfig> => {
  if (USE_MOCK) {
    return Promise.resolve(mockConfig);
  }

  try {
    const response = await documentApi.get<AgentConfig>(`/config/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user configuration:', error);
    throw error;
  }
};

export const configureAgent = async (
  userId: string,
  config: AgentConfig
): Promise<ConfigResponse> => {
  if (USE_MOCK) {
    return Promise.resolve({
      status: 'success',
      message: 'Agent configuration updated successfully'
    });
  }

  try {
    const response = await documentApi.post<ConfigResponse>(`/config/${userId}`, config);
    return response.data;
  } catch (error) {
    console.error('Error configuring agent:', error);
    throw error;
  }
};

export const listCollections = async (userId: string): Promise<CollectionsResponse> => {
  if (USE_MOCK) {
    return Promise.resolve({
      collections: mockCollections
    });
  }

  try {
    const response = await documentApi.get<CollectionsResponse>(`/collections/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error listing collections:', error);
    throw error;
  }
};

// Agent Manager API
export const startAgent = async (
  userId: string,
  collectionName?: string | null,
  phoneNumber?: string | null,
  agentType: 'voice' | 'web' = 'voice'
): Promise<AgentResponse> => {
  if (USE_MOCK) {
    // Add mock agent to the list
    mockAgents[userId] = {
      user_id: userId,
      agent_type: agentType,
      running_time: 0
    };

    return Promise.resolve({
      status: 'success',
      user_id: userId,
      container_id: `container_${userId}_${Date.now()}`
    });
  }

  try {
    // Create the request payload with the exact field names and types expected by the backend Pydantic model
    const payload = {
      user_id: userId,
      // Only include fields that have values, avoid sending null/undefined which may cause validation errors
      ...(collectionName ? { collection_name: collectionName } : {}),
      ...(phoneNumber ? { phone_number: phoneNumber } : {}),
      agent_type: agentType
    };
    
    console.log("Making POST request to /start-agent with payload:", JSON.stringify(payload));
    
    const response = await agentManagerApi.post<AgentResponse>('/start-agent', payload);
    
    return response.data;
  } catch (error: any) {
    console.error('Error starting agent:', error);
    
    // Extract more detailed error information if available
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data));
      
      // If it's a validation error, log more details
      if (error.response.status === 422) {
        console.error('Validation error details:', 
          error.response.data?.detail || 'No detail provided');
      }
    }
    
    throw error;
  }
};

export const stopAgent = async (userId: string): Promise<AgentResponse> => {
  if (USE_MOCK) {
    // Remove mock agent from the list
    delete mockAgents[userId];
    
    return Promise.resolve({
      status: 'success',
      user_id: userId
    });
  }

  try {
    const response = await agentManagerApi.post<AgentResponse>(`/stop-agent/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error stopping agent:', error);
    throw error;
  }
};

export const listAgents = async (): Promise<AgentsListResponse> => {
  if (USE_MOCK) {
    return Promise.resolve({
      agents: Object.values(mockAgents)
    });
  }

  try {
    const response = await agentManagerApi.get<AgentsListResponse>('/agents');
    return response.data;
  } catch (error) {
    console.error('Error listing agents:', error);
    throw error;
  }
};

// Test function to try minimal payload
export const testStartAgent = async (userId: string): Promise<any> => {
  try {
    // Try with absolute minimal payload
    const minimalPayload = {
      user_id: userId,
      agent_type: 'web'
    };
    
    console.log("Testing with minimal payload:", JSON.stringify(minimalPayload));
    
    const response = await agentManagerApi.post('/start-agent', minimalPayload);
    return response.data;
  } catch (error: any) {
    console.error('Test start agent error:', error);
    return { error: error.response?.data || error.message };
  }
}; 