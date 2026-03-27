import { useFlowStore } from '../store';
import { VOICES, LANGUAGES } from '../constants';
import type { SWMLNodeData, PlayAudioData } from '../types';

export default function PlayAudioProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as PlayAudioData;

  const update = (changes: Partial<PlayAudioData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div>
        <label className="prop-label">Source</label>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            className={`prop-input ${d.mode === 'tts' ? 'active' : ''}`}
            style={{
              flex: 1,
              cursor: 'pointer',
              fontWeight: d.mode === 'tts' ? 700 : 400,
              background: d.mode === 'tts' ? '#3b82f6' : undefined,
              color: d.mode === 'tts' ? '#fff' : undefined,
            }}
            onClick={() => update({ mode: 'tts' })}
          >
            Text-to-Speech
          </button>
          <button
            type="button"
            className={`prop-input ${d.mode === 'url' ? 'active' : ''}`}
            style={{
              flex: 1,
              cursor: 'pointer',
              fontWeight: d.mode === 'url' ? 700 : 400,
              background: d.mode === 'url' ? '#3b82f6' : undefined,
              color: d.mode === 'url' ? '#fff' : undefined,
            }}
            onClick={() => update({ mode: 'url' })}
          >
            Audio URL
          </button>
        </div>
      </div>

      {/* TTS Fields */}
      {d.mode === 'tts' && (
        <>
          <div>
            <label className="prop-label">Text</label>
            <textarea
              className="prop-textarea"
              rows={3}
              value={d.text}
              onChange={(e) => update({ text: e.target.value })}
            />
          </div>
          <div>
            <label className="prop-label">Voice</label>
            <select
              className="prop-select"
              value={d.voice}
              onChange={(e) => update({ voice: e.target.value })}
            >
              {VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="prop-label">Language</label>
            <select
              className="prop-select"
              value={d.language}
              onChange={(e) => update({ language: e.target.value })}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="prop-label">Gender</label>
            <select
              className="prop-select"
              value={d.gender}
              onChange={(e) => update({ gender: e.target.value })}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </>
      )}

      {/* URL Field */}
      {d.mode === 'url' && (
        <div>
          <label className="prop-label">Audio URL</label>
          <input
            className="prop-input"
            type="text"
            value={d.url}
            placeholder="https://example.com/audio.mp3"
            onChange={(e) => update({ url: e.target.value })}
          />
        </div>
      )}

      {/* Volume */}
      <div>
        <label className="prop-label">Volume ({d.volume} dB)</label>
        <input
          className="prop-input"
          type="range"
          min={-40}
          max={40}
          value={d.volume}
          onChange={(e) => update({ volume: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
