'use client';

import { N8nNode } from '@/types/n8n';

interface NodeTemplateProps {
  node: N8nNode;
  renderValue: (value: any) => React.ReactNode;
}

// HTTP Request Node Template
export function HttpRequestTemplate({ node }: NodeTemplateProps) {
  const params = node.parameters;
  const method = params.method || 'GET';
  const url = params.url || '';
  const headers = params.headerParameters?.parameters || [];
  const queryParams = params.queryParameters?.parameters || [];
  const body = params.bodyParameters || params.body;

  const methodColors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    POST: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🌐</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">HTTP Request</h4>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded font-semibold text-sm ${methodColors[method] || methodColors.GET}`}>
            {method}
          </span>
          <code className="flex-1 text-sm bg-white dark:bg-gray-900 px-3 py-2 rounded border border-gray-200 dark:border-gray-700">
            {url}
          </code>
        </div>

        {queryParams.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Query Parameters:</p>
            <div className="space-y-1">
              {queryParams.map((param: any, idx: number) => (
                <div key={idx} className="text-sm bg-white dark:bg-gray-900 px-3 py-1 rounded border border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-blue-600 dark:text-blue-400">{param.name}</span>
                  <span className="text-gray-500 mx-1">=</span>
                  <span className="text-gray-700 dark:text-gray-300">{param.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {headers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Headers:</p>
            <div className="space-y-1">
              {headers.map((header: any, idx: number) => (
                <div key={idx} className="text-sm bg-white dark:bg-gray-900 px-3 py-1 rounded border border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-purple-600 dark:text-purple-400">{header.name}</span>
                  <span className="text-gray-500 mx-1">:</span>
                  <span className="text-gray-700 dark:text-gray-300">{header.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {body && (
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Body:</p>
            <pre className="text-xs bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
              <code>{typeof body === 'string' ? body : JSON.stringify(body, null, 2)}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

// Code Node Template
export function CodeTemplate({ node }: NodeTemplateProps) {
  const params = node.parameters;
  const code = params.jsCode || params.code || '';
  const mode = params.mode || 'code';

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💻</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">Code Node</h4>
        <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
          {mode === 'runOnceForAllItems' ? 'Run Once For All Items' : 'Run Once For Each Item'}
        </span>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
        <pre className="text-sm">
          <code className="text-green-400">{code || '// No code'}</code>
        </pre>
      </div>
    </div>
  );
}

// IF Node Template
export function IfTemplate({ node }: NodeTemplateProps) {
  const params = node.parameters;
  const conditions = params.conditions?.conditions || [];
  const combinator = params.conditions?.combinator || 'and';

  const operatorLabels: Record<string, string> = {
    equals: '=',
    notEquals: '≠',
    gt: '>',
    lt: '<',
    gte: '≥',
    lte: '≤',
    contains: '⊃',
    notContains: '⊅',
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔀</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">IF Condition</h4>
      </div>

      {conditions.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No conditions set</p>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition: any, idx: number) => (
            <div key={idx}>
              {idx > 0 && (
                <div className="text-center my-1">
                  <span className="bg-orange-200 dark:bg-orange-800 px-3 py-1 rounded text-xs font-bold uppercase">
                    {combinator}
                  </span>
                </div>
              )}
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-800 dark:text-blue-300">
                    {condition.leftValue || '(empty)'}
                  </code>
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {operatorLabels[condition.operator?.operation] || condition.operator?.operation || '?'}
                  </span>
                  <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-green-800 dark:text-green-300">
                    {condition.rightValue !== undefined ? String(condition.rightValue) : '(empty)'}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Set/Edit Fields Node Template
export function SetTemplate({ node }: NodeTemplateProps) {
  const params = node.parameters;
  const assignments = params.assignments?.assignments || [];
  const includeOtherFields = params.includeOtherFields ?? true;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">✏️</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">Set Fields</h4>
        {includeOtherFields && (
          <span className="ml-auto text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
            + Keep other fields
          </span>
        )}
      </div>

      {assignments.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No field assignments</p>
      ) : (
        <div className="space-y-2">
          {assignments.map((assignment: any, idx: number) => (
            <div key={idx} className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Field:</span>
                    <code className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {assignment.name}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Value:</span>
                    <code className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                      {assignment.value !== undefined ? String(assignment.value) : '(empty)'}
                    </code>
                  </div>
                  {assignment.type && (
                    <div className="mt-1">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                        {assignment.type}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Schedule Trigger Template
export function ScheduleTriggerTemplate({ node }: NodeTemplateProps) {
  const params = node.parameters;
  const rule = params.rule || {};
  const interval = rule.interval?.[0] || {};
  const cronExpression = interval.expression || interval.cronExpression;

  return (
    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">⏰</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">Schedule Trigger</h4>
      </div>

      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Schedule:</span>
          <code className="text-sm bg-cyan-100 dark:bg-cyan-900 px-3 py-1 rounded text-cyan-800 dark:text-cyan-300 font-mono">
            {cronExpression || 'Not configured'}
          </code>
        </div>
      </div>
    </div>
  );
}

// Gmail Node Template
export function GmailTemplate({ node, renderValue }: NodeTemplateProps) {
  const params = node.parameters;
  const operation = params.operation || params.resource;
  const toList = params.toList || params.to || '';
  const subject = params.subject || '';
  const message = params.message || params.body || '';
  const ccList = params.ccList || params.cc || '';
  const bccList = params.bccList || params.bcc || '';
  const attachments = params.attachments || [];
  const labels = params.labelIds || params.labels || [];

  const operationLabels: Record<string, { label: string; icon: string; color: string }> = {
    send: { label: 'Send Email', icon: '📧', color: 'from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800' },
    reply: { label: 'Reply to Email', icon: '↩️', color: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800' },
    get: { label: 'Get Email', icon: '📬', color: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800' },
    getAll: { label: 'Get All Emails', icon: '📬', color: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800' },
    search: { label: 'Search Emails', icon: '🔍', color: 'from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 border-purple-200 dark:border-purple-800' },
    addLabels: { label: 'Add Labels', icon: '🏷️', color: 'from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 border-yellow-200 dark:border-yellow-800' },
    removeLabels: { label: 'Remove Labels', icon: '🏷️', color: 'from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-200 dark:border-orange-800' },
  };

  const opConfig = operationLabels[operation] || { label: operation || 'Gmail', icon: '✉️', color: 'from-gray-50 to-slate-50 dark:from-gray-950 dark:to-slate-950 border-gray-200 dark:border-gray-800' };

  return (
    <div className={`bg-gradient-to-br ${opConfig.color} p-4 rounded-lg border`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{opConfig.icon}</span>
        <h4 className="font-semibold text-gray-900 dark:text-white">{opConfig.label}</h4>
      </div>

      {/* Email envelope style display for send/reply operations */}
      {(operation === 'send' || operation === 'reply') && toList && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm mb-3">
          {/* Email Header */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 space-y-2">
            {toList && (
              <div className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-600 dark:text-gray-400 w-12">To:</span>
                <span className="text-gray-900 dark:text-white flex-1">{toList}</span>
              </div>
            )}
            {ccList && (
              <div className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-600 dark:text-gray-400 w-12">Cc:</span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">{ccList}</span>
              </div>
            )}
            {bccList && (
              <div className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-600 dark:text-gray-400 w-12">Bcc:</span>
                <span className="text-gray-700 dark:text-gray-300 flex-1">{bccList}</span>
              </div>
            )}
            {subject && (
              <div className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-600 dark:text-gray-400 w-12">Subject:</span>
                <span className="text-gray-900 dark:text-white flex-1 font-medium">{subject}</span>
              </div>
            )}
          </div>

          {/* Email Body */}
          {message && (
            <div className="p-4">
              <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {message.length > 500 ? (
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      Click to view message ({message.length} characters)
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      {message}
                    </div>
                  </details>
                ) : (
                  message
                )}
              </div>
            </div>
          )}

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">📎 Attachments:</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{attachments.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {attachments.map((att: any, idx: number) => (
                  <div key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                    {att.name || att.filename || `Attachment ${idx + 1}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Always show all parameters */}
      <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="space-y-3">
          {Object.keys(params).length === 0 ? (
            <p className="text-sm text-gray-400 italic">(no parameters)</p>
          ) : (
            Object.entries(params).map(([key, value]) => (
              <div key={key} className="text-sm">
                <p className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {key}:
                </p>
                <div className="ml-3">{renderValue(value)}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Generic fallback template
export function GenericTemplate({ node, renderValue }: NodeTemplateProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="space-y-2">
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
    </div>
  );
}

// Main template router
export function NodeParameterDisplay({ node, renderValue }: NodeTemplateProps) {
  const templates: Record<string, React.ComponentType<NodeTemplateProps>> = {
    'n8n-nodes-base.httpRequest': HttpRequestTemplate,
    'n8n-nodes-base.code': CodeTemplate,
    'n8n-nodes-base.if': IfTemplate,
    'n8n-nodes-base.set': SetTemplate,
    'n8n-nodes-base.scheduleTrigger': ScheduleTriggerTemplate,
    'n8n-nodes-base.gmail': GmailTemplate,
  };

  const Template = templates[node.type] || GenericTemplate;

  return <Template node={node} renderValue={renderValue} />;
}
