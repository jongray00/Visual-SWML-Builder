import { useFlowStore } from '../store';
import type { SWMLNodeData, SendSmsData } from '../types';

export default function SendSmsProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as SendSmsData;

  const update = (changes: Partial<SendSmsData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="prop-label">To Number</label>
        <input
          className="prop-input"
          type="text"
          value={d.toNumber}
          placeholder="+15551234567"
          onChange={(e) => update({ toNumber: e.target.value })}
        />
      </div>
      <div>
        <label className="prop-label">From Number</label>
        <input
          className="prop-input"
          type="text"
          value={d.fromNumber}
          placeholder="+15551234567"
          onChange={(e) => update({ fromNumber: e.target.value })}
        />
      </div>
      <div>
        <label className="prop-label">Body</label>
        <textarea
          className="prop-textarea"
          rows={3}
          value={d.body}
          onChange={(e) => update({ body: e.target.value })}
        />
      </div>
    </div>
  );
}
