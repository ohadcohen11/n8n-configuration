'use client';

import { N8nWorkflow } from '@/types/n8n';
import Link from 'next/link';

interface WorkflowCardProps {
  workflow: N8nWorkflow;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
}

export default function WorkflowCard({ workflow, onToggleActive }: WorkflowCardProps) {
  const handleToggle = async () => {
    await onToggleActive(workflow.id, !workflow.active);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/workflows/${workflow.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {workflow.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {workflow.nodes.length} nodes
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Updated: {new Date(workflow.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              workflow.active
                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {workflow.active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>
      {workflow.tags && workflow.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {workflow.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-300"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
