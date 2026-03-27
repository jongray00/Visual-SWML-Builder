import BaseNode from './BaseNode';
import type { HandleCallData } from '../types';

export default function HandleCallNode(props: any) {
  const { id, data, selected } = props;
  const d = data as HandleCallData;
  const summary = 'Entry point';

  return (
    <BaseNode
      id={id}
      color="#6366f1"
      icon="PhoneIncoming"
      label={d.label || 'Handle Call'}
      summary={summary}
      selected={selected}
      hasInput={false}
      outputHandles={[{ id: 'output', label: '', type: 'source' }]}
    />
  );
}
