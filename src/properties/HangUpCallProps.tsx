import { useFlowStore } from '../store';
import type { SWMLNodeData, HangUpCallData } from '../types';

export default function HangUpCallProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as HangUpCallData;

  const update = (changes: Partial<HangUpCallData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="prop-label">Reason</label>
        <select
          className="prop-select"
          value={d.reason}
          onChange={(e) => update({ reason: e.target.value as HangUpCallData['reason'] })}
        >
          <option value="hangup">Hangup</option>
          <option value="busy">Busy</option>
          <option value="decline">Decline</option>
        </select>
      </div>
    </div>
  );
}
