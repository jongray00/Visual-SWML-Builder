import { useFlowStore } from '../store';
import type { SWMLNodeData, VoicemailRecordingData } from '../types';

export default function VoicemailRecordingProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as VoicemailRecordingData;

  const update = (changes: Partial<VoicemailRecordingData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <label className="prop-label flex items-center gap-2">
        <input
          type="checkbox"
          checked={d.beep}
          onChange={(e) => update({ beep: e.target.checked })}
        />
        Beep before recording
      </label>

      <label className="prop-label">
        Max Length (seconds)
        <input
          type="number"
          className="prop-input"
          value={d.maxLength}
          min={1}
          onChange={(e) => update({ maxLength: Number(e.target.value) })}
        />
      </label>

      <label className="prop-label">
        Terminators
        <input
          type="text"
          className="prop-input"
          value={d.terminators}
          placeholder="#"
          onChange={(e) => update({ terminators: e.target.value })}
        />
      </label>

      <label className="prop-label">
        Prompt before recording
        <textarea
          className="prop-textarea"
          rows={3}
          value={d.playBeforeRecord}
          onChange={(e) => update({ playBeforeRecord: e.target.value })}
        />
      </label>
    </div>
  );
}
