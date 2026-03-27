import BaseNode from './BaseNode';
import type { StopRecordingData } from '../types';

export default function StopRecordingNode(props: any) {
  const { id, data, selected } = props;
  const d = data as StopRecordingData;
  const summary = d.controlId ? `Control: ${d.controlId}` : 'Stops active recording';

  return (
    <BaseNode
      id={id}
      color="#ef4444"
      icon="Square"
      label={d.label || 'Stop Recording'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[{ id: 'output', label: '', type: 'source' }]}
    />
  );
}
