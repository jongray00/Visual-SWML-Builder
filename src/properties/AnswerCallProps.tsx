import { useFlowStore } from '../store';
import type { SWMLNodeData, AnswerCallData } from '../types';

export default function AnswerCallProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as AnswerCallData;

  const update = (changes: Partial<AnswerCallData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="prop-label">Max Duration (seconds)</label>
        <input
          className="prop-input"
          type="number"
          min={1}
          value={d.maxDuration}
          onChange={(e) => update({ maxDuration: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
