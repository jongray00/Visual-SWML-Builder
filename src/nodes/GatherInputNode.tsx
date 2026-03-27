import BaseNode from './BaseNode';
import type { GatherInputData, HandleDefinition } from '../types';

export default function GatherInputNode(props: any) {
  const { id, data, selected } = props;
  const d = data as GatherInputData;
  const options = d.options ?? [];

  const outputHandles: HandleDefinition[] = [
    ...options.map((option) => ({
      id: `option-${option.id}`,
      label: option.label || option.digits || option.speech,
      type: 'source' as const,
    })),
    { id: 'noInput', label: 'No Input', type: 'source' },
    { id: 'unknown', label: 'Unknown', type: 'source' },
  ];

  const summary = options.length > 0 ? `${options.length} options` : 'No options';

  return (
    <BaseNode
      id={id}
      color="#10b981"
      icon="Keyboard"
      label={d.label || 'Gather Input'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
