import BaseNode from './BaseNode';
import type { StartRecordingData } from '../types';

export default function StartRecordingNode(props: any) {
  const { id, data, selected } = props;
  const d = data as StartRecordingData;
  const format = (d.format ?? 'wav').toUpperCase();
  const stereo = d.stereo ? 'Stereo' : 'Mono';
  const summary = `${format} / ${stereo}`;

  return (
    <BaseNode
      id={id}
      color="#ef4444"
      icon="Circle"
      label={d.label || 'Start Recording'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[{ id: 'output', label: '', type: 'source' }]}
    />
  );
}
