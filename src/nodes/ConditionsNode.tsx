import BaseNode from './BaseNode';
import type { ConditionsData, HandleDefinition } from '../types';

export default function ConditionsNode(props: any) {
  const { id, data, selected } = props;
  const d = data as ConditionsData;
  const conditions = d.conditions ?? [];

  const outputHandles: HandleDefinition[] = [
    ...conditions.map((condition) => ({
      id: `cond-${condition.id}`,
      label: condition.label,
      type: 'source' as const,
    })),
    { id: 'else', label: 'Else', type: 'source' },
  ];

  const summary = `${conditions.length} condition${conditions.length !== 1 ? 's' : ''}`;

  return (
    <BaseNode
      id={id}
      color="#8b5cf6"
      icon="GitBranch"
      label={d.label || 'Conditions'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
