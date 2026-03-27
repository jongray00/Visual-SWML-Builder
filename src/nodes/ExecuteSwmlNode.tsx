import BaseNode from './BaseNode';
import type { ExecuteSwmlData, HandleDefinition } from '../types';

export default function ExecuteSwmlNode(props: any) {
  const { id, data, selected } = props;
  const d = data as ExecuteSwmlData;
  const conditions = d.conditions ?? [];

  const outputHandles: HandleDefinition[] = [
    ...conditions.map((condition) => ({
      id: `cond-${condition.id}`,
      label: condition.label,
      type: 'source' as const,
    })),
    { id: 'else', label: 'Else', type: 'source' },
  ];

  const dest = d.dest ? `dest: ${d.dest}` : 'No destination';
  const summary = dest.length > 30 ? dest.substring(0, 30) + '...' : dest;

  return (
    <BaseNode
      id={id}
      color="#8b5cf6"
      icon="Play"
      label={d.label || 'Execute SWML'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
