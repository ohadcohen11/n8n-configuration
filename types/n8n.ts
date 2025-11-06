export interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  nodes: N8nNode[];
  connections: N8nConnections;
  settings?: {
    saveDataErrorExecution?: string;
    saveDataSuccessExecution?: string;
    saveManualExecutions?: boolean;
    callerPolicy?: string;
    executionOrder?: string;
  };
  staticData?: any;
  tags?: Array<{ id: string; name: string }>;
  versionId?: string;
}

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, any>;
  disabled?: boolean;
  notes?: string;
  notesInFlow?: boolean;
}

export interface N8nConnections {
  [key: string]: {
    [key: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}

export interface N8nWorkflowsResponse {
  data: N8nWorkflow[];
  nextCursor?: string;
}

export interface N8nError {
  message: string;
  code?: number;
}
