import BaseNode from './BaseNode';
import type { RequestData, HandleDefinition } from '../types';

export default function RequestNode(props: any) {
  const { id, data, selected } = props;
  const d = data as RequestData;
  const conditions = d.conditions ?? [];

  const outputHandles: HandleDefinition[] = [
    ...conditions.map((condition) => ({
      id: `cond-${condition.id}`,
      label: condition.label,
      type: 'source' as const,
    })),
    { id: 'else', label: 'Else', type: 'source' },
    { id: 'failure', label: 'Failure', type: 'source' },
  ];

  const methodUrl = `${d.method || 'GET'} ${d.url || ''}`.trim();
  const summary = methodUrl.length > 30 ? methodUrl.substring(0, 30) + '...' : methodUrl;

  return (
    <BaseNode
      id={id}
      color="#10b981"
      icon="Globe"
      label={d.label || 'Request'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
