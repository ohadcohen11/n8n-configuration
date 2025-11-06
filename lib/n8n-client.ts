import { N8nWorkflow, N8nWorkflowsResponse } from '@/types/n8n';

const N8N_BASE_URL = process.env.N8N_BASE_URL || process.env.NEXT_PUBLIC_N8N_BASE_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_BASE_URL) {
  throw new Error('N8N_BASE_URL is not defined in environment variables');
}

class N8nClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey || '';
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': this.apiKey,
    };
  }

  async getWorkflows(): Promise<N8nWorkflow[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch workflows: ${response.status} - ${error}`);
    }

    const data: N8nWorkflowsResponse = await response.json();
    return data.data || [];
  }

  async getWorkflow(id: string): Promise<N8nWorkflow> {
    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch workflow: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async updateWorkflow(id: string, workflow: Partial<N8nWorkflow>): Promise<N8nWorkflow> {
    // Only send fields that n8n API accepts for updates
    const allowedFields: (keyof N8nWorkflow)[] = [
      'name',
      'nodes',
      'connections',
      'settings',
      'staticData',
      'active',
      'tags',
    ];

    const updateData: any = {};
    for (const field of allowedFields) {
      if (field in workflow) {
        updateData[field] = (workflow as any)[field];
      }
    }

    const response = await fetch(`${this.baseUrl}/api/v1/workflows/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update workflow: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async activateWorkflow(id: string): Promise<N8nWorkflow> {
    // Get the workflow first, then update with active: true
    const workflow = await this.getWorkflow(id);
    return this.updateWorkflow(id, { ...workflow, active: true });
  }

  async deactivateWorkflow(id: string): Promise<N8nWorkflow> {
    // Get the workflow first, then update with active: false
    const workflow = await this.getWorkflow(id);
    return this.updateWorkflow(id, { ...workflow, active: false });
  }
}

// Create singleton instance for server-side use
export const n8nClient = new N8nClient(N8N_BASE_URL!, N8N_API_KEY);

// Export class for custom instances if needed
export default N8nClient;
