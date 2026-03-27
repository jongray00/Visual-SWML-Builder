import { useFlowStore } from '../store';
import type { SWMLNodeData, StartRecordingData } from '../types';

export default function StartRecordingProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as StartRecordingData;

  const update = (changes: Partial<StartRecordingData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="prop-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={d.stereo}
            onChange={(e) => update({ stereo: e.target.checked })}
          />
          Stereo
        </label>
      </div>

      <div>
        <label className="prop-label">Format</label>
        <select
          className="prop-select"
          value={d.format}
          onChange={(e) => update({ format: e.target.value as StartRecordingData['format'] })}
        >
          <option value="wav">WAV</option>
          <option value="mp3">MP3</option>
          <option value="mp4">MP4</option>
        </select>
      </div>

      <div>
        <label className="prop-label">Direction</label>
        <select
          className="prop-select"
          value={d.direction}
          onChange={(e) => update({ direction: e.target.value as StartRecordingData['direction'] })}
        >
          <option value="both">Both</option>
          <option value="speak">Speak</option>
          <option value="listen">Listen</option>
        </select>
      </div>

      <div>
        <label className="prop-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="checkbox"
            checked={d.beep}
            onChange={(e) => update({ beep: e.target.checked })}
          />
          Play Beep
        </label>
      </div>
    </div>
  );
}
