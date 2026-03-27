import BaseNode from './BaseNode';
import type { AnswerCallData } from '../types';

export default function AnswerCallNode(props: any) {
  const { id, data, selected } = props;
  const d = data as AnswerCallData;
  const summary = `Max duration: ${d.maxDuration ?? 0}s`;

  return (
    <BaseNode
      id={id}
      color="#3b82f6"
      icon="PhoneCall"
      label={d.label || 'Answer Call'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[{ id: 'output', label: '', type: 'source' }]}
    />
  );
}
