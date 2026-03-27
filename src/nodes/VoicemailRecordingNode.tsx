import BaseNode from './BaseNode';
import type { VoicemailRecordingData, HandleDefinition } from '../types';

export default function VoicemailRecordingNode(props: any) {
  const { id, data, selected } = props;
  const d = data as VoicemailRecordingData;
  const outputHandles: HandleDefinition[] = [{ id: 'output', label: '', type: 'source' }];
  const summary = `Max: ${d.maxLength ?? 60}s`;

  return (
    <BaseNode
      id={id}
      color="#ef4444"
      icon="Voicemail"
      label={d.label || 'Voicemail Recording'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
