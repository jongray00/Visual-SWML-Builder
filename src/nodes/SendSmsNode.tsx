import BaseNode from './BaseNode';
import type { SendSmsData } from '../types';

export default function SendSmsNode(props: any) {
  const { id, data, selected } = props;
  const d = data as SendSmsData;
  const summary = `To: ${d.toNumber || 'Not set'}`;

  return (
    <BaseNode
      id={id}
      color="#3b82f6"
      icon="MessageSquare"
      label={d.label || 'Send SMS'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[{ id: 'output', label: '', type: 'source' }]}
    />
  );
}
