import { useFlowStore } from '../store';
import type { SWMLNodeData, StopRecordingData } from '../types';

export default function StopRecordingProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as StopRecordingData;

  const update = (changes: Partial<StopRecordingData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="prop-label">Control ID</label>
        <input
          className="prop-input"
          type="text"
          value={d.controlId}
          placeholder="Leave empty for last recording"
          onChange={(e) => update({ controlId: e.target.value })}
        />
      </div>
    </div>
  );
}
