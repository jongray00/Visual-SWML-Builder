import BaseNode from './BaseNode';
import type { HangUpCallData } from '../types';

export default function HangUpCallNode(props: any) {
  const { id, data, selected } = props;
  const d = data as HangUpCallData;
  const summary = `Reason: ${d.reason ?? 'hangup'}`;

  return (
    <BaseNode
      id={id}
      color="#3b82f6"
      icon="PhoneOff"
      label={d.label || 'Hang Up'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[]}
    />
  );
}
