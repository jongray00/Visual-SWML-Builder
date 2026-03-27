import BaseNode from './BaseNode';
import type { AIAgentData, HandleDefinition } from '../types';

export default function AIAgentNode(props: any) {
  const { id, data, selected } = props;
  const d = data as AIAgentData;
  const outputHandles: HandleDefinition[] = [{ id: 'output', label: '', type: 'source' }];
  const summary = d.promptText
    ? d.promptText.substring(0, 40) + (d.promptText.length > 40 ? '...' : '')
    : 'No prompt';

  return (
    <BaseNode
      id={id}
      color="#10b981"
      icon="Bot"
      label={d.label || 'AI Agent'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={outputHandles}
    />
  );
}
