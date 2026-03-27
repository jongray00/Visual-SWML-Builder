import BaseNode from './BaseNode';
import type { UnsetVariablesData, HandleDefinition } from '../types';

export default function UnsetVariablesNode(props: any) {
  const { id, data, selected } = props;
  const d = data as UnsetVariablesData;
  const outputHandles: HandleDefinition[] = [{ id: 'output', label: '', type: 'source' }];
  const count = d.variables?.length ?? 0;
  const summary = `${count} variable${count !== 1 ? 's' : ''}`;

  return (
    <BaseNode
      id={id}
      color="#8b5cf6"
      icon="XCircle"
      label={d.label || 'Unset Variables'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
