'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { N8nWorkflow } from '@/types/n8n';

export default function WorkflowEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [workflow, setWorkflow] = useState<N8nWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'overview' | 'json'>('overview');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNodeExpanded = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">(not set)</span>;
    }
    if (typeof value === 'boolean') {
      return <span className="text-blue-600 dark:text-blue-400">{value ? 'true' : 'false'}</span>;
    }
    if (typeof value === 'number') {
      return <span className="text-green-600 dark:text-green-400">{value}</span>;
    }
    if (typeof value === 'string') {
      if (value.length === 0) {
        return <span className="text-gray-400 italic">(empty)</span>;
      }
      if (value.length > 100 || value.includes('\n')) {
        return (
          <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
            <code className="text-gray-700 dark:text-gray-300">{value}</code>
          </pre>
        );
      }
      return <span className="text-gray-700 dark:text-gray-300">"{value}"</span>;
    }
    if (typeof value === 'object') {
      return (
        <pre className="mt-1 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
          <code className="text-gray-700 dark:text-gray-300">{JSON.stringify(value, null, 2)}</code>
        </pre>
      );
    }
    return <span>{String(value)}</span>;
  };

  useEffect(() => {
    if (id) {
      fetchWorkflow();
    }
  }, [id]);

  const fetchWorkflow = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/workflows/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch workflow');
      }

      setWorkflow(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching workflow:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading workflow...</div>
      </div>
    );
  }

  if (error && !workflow) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h3 className="text-red-800 dark:text-red-200 font-semibold">Error</h3>
        <p className="text-red-600 dark:text-red-300 mt-1">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to Workflows
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push('/')}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          ← Back to Workflows
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Workflow Configuration
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView('overview')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView('json')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'json'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {workflow && view === 'overview' && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white font-medium">{workflow.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    workflow.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {workflow.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                <p className="text-gray-900 dark:text-white font-mono text-sm">{workflow.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nodes</p>
                <p className="text-gray-900 dark:text-white">{workflow.nodes.length} nodes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                <p className="text-gray-900 dark:text-white">{new Date(workflow.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Updated</p>
                <p className="text-gray-900 dark:text-white">{new Date(workflow.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          {workflow.settings && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Settings
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(workflow.settings).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nodes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Nodes ({workflow.nodes.length})
            </h3>
            <div className="space-y-4">
              {workflow.nodes.map((node) => (
                <div
                  key={node.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{node.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{node.type}</p>
                    </div>
                    {node.disabled && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 rounded">
                        Disabled
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Type Version</p>
                      <p className="text-gray-900 dark:text-white">{node.typeVersion}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Position</p>
                      <p className="text-gray-900 dark:text-white">
                        [{node.position[0]}, {node.position[1]}]
                      </p>
                    </div>
                  </div>

                  {/* Parameters Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <button
                      onClick={() => toggleNodeExpanded(node.id)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <span className="text-lg">
                        {expandedNodes.has(node.id) ? '▼' : '▶'}
                      </span>
                      <span>
                        Parameters ({Object.keys(node.parameters).length})
                      </span>
                    </button>

                    {expandedNodes.has(node.id) && (
                      <div className="mt-3 space-y-2 pl-6">
                        {Object.keys(node.parameters).length === 0 ? (
                          <p className="text-sm text-gray-400 italic">(no parameters)</p>
                        ) : (
                          Object.entries(node.parameters).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {key}:
                              </p>
                              <div className="ml-3">{renderValue(value)}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Credentials Section */}
                  {node.credentials && Object.keys(node.credentials).length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                      <button
                        onClick={() => toggleNodeExpanded(`${node.id}-credentials`)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span className="text-lg">
                          {expandedNodes.has(`${node.id}-credentials`) ? '▼' : '▶'}
                        </span>
                        <span>
                          Credentials ({Object.keys(node.credentials).length})
                        </span>
                      </button>

                      {expandedNodes.has(`${node.id}-credentials`) && (
                        <div className="mt-3 space-y-2 pl-6">
                          {Object.entries(node.credentials).map(([key, value]) => (
                            <div key={key} className="text-sm">
                              <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {key}:
                              </p>
                              <div className="ml-3">{renderValue(value)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {node.notes && (
                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes:</p>
                      <p className="text-gray-700 dark:text-gray-300">{node.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connections */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connections
            </h3>
            <div className="space-y-2">
              {Object.entries(workflow.connections).map(([nodeName, outputs]) => (
                <div key={nodeName} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-gray-900 dark:text-white">{nodeName}</p>
                  {Object.entries(outputs).map(([outputType, connections]) => (
                    <div key={outputType} className="ml-4 mt-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{outputType}:</p>
                      {connections.map((connGroup, idx) => (
                        <div key={idx} className="ml-4">
                          {connGroup.map((conn, connIdx) => (
                            <p key={connIdx} className="text-sm text-gray-700 dark:text-gray-300">
                              → {conn.node} ({conn.type}, index: {conn.index})
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {workflow.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {workflow && view === 'json' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Raw JSON Configuration
            </h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(workflow, null, 2));
                alert('JSON copied to clipboard!');
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Copy JSON
            </button>
          </div>
          <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto text-sm">
            <code className="text-gray-800 dark:text-gray-200">
              {JSON.stringify(workflow, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
