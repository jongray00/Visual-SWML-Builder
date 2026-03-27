import BaseNode from './BaseNode';
import type { PlayAudioData } from '../types';

export default function PlayAudioNode(props: any) {
  const { id, data, selected } = props;
  const d = data as PlayAudioData;

  let summary: string;
  if (d.mode === 'tts') {
    const text = d.text || '';
    summary = text.length > 40 ? text.slice(0, 40) + '...' : text || 'No text set';
  } else {
    const url = d.url || '';
    summary = url ? 'Audio: ' + (url.length > 30 ? url.slice(0, 30) + '...' : url) : 'No URL set';
  }

  return (
    <BaseNode
      id={id}
      color="#3b82f6"
      icon="Volume2"
      label={d.label || 'Play Audio'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[{ id: 'output', label: '', type: 'source' }]}
    />
  );
}
