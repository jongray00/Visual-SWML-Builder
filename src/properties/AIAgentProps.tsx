import { useFlowStore } from '../store';
import type { SWMLNodeData, AIAgentData } from '../types';

export default function AIAgentProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as AIAgentData;

  const update = (changes: Partial<AIAgentData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <label className="prop-label">
        AI Prompt
        <textarea
          className="prop-textarea"
          rows={6}
          value={d.promptText}
          onChange={(e) => update({ promptText: e.target.value })}
        />
      </label>

      <label className="prop-label">
        Post-Prompt URL
        <input
          type="text"
          className="prop-input"
          value={d.postPromptUrl}
          onChange={(e) => update({ postPromptUrl: e.target.value })}
        />
      </label>

      <label className="prop-label">
        Hints (comma-separated)
        <input
          type="text"
          className="prop-input"
          value={d.hints.join(', ')}
          onChange={(e) =>
            update({
              hints: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </label>
    </div>
  );
}
