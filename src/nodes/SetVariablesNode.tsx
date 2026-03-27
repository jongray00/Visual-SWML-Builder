import BaseNode from './BaseNode';
import type { SetVariablesData, HandleDefinition } from '../types';

export default function SetVariablesNode(props: any) {
  const { id, data, selected } = props;
  const d = data as SetVariablesData;
  const outputHandles: HandleDefinition[] = [{ id: 'output', label: '', type: 'source' }];
  const count = d.variables?.length ?? 0;
  const summary = `${count} variable${count !== 1 ? 's' : ''}`;

  return (
    <BaseNode
      id={id}
      color="#8b5cf6"
      icon="Variable"
      label={d.label || 'Set Variables'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
