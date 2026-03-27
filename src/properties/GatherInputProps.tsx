import { useFlowStore } from '../store';
import { VOICES, LANGUAGES } from '../constants';
import type { SWMLNodeData, GatherInputData, GatherInputOption } from '../types';

export default function GatherInputProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as GatherInputData;

  const update = (changes: Partial<GatherInputData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  const addOption = () => {
    update({
      options: [...d.options, { id: Date.now().toString(), digits: '', speech: '', label: '' }],
    });
  };

  const removeOption = (id: string) => {
    update({ options: d.options.filter((o) => o.id !== id) });
  };

  const updateOption = (id: string, changes: Partial<GatherInputOption>) => {
    update({ options: d.options.map((o) => (o.id === id ? { ...o, ...changes } : o)) });
  };

  return (
    <div className="space-y-3">
      {/* Play Mode Toggle */}
      <label className="prop-label">
        Play Mode
        <select
          className="prop-select"
          value={d.playMode}
          onChange={(e) => update({ playMode: e.target.value as 'tts' | 'url' })}
        >
          <option value="tts">Text-to-Speech</option>
          <option value="url">Audio URL</option>
        </select>
      </label>

      {d.playMode === 'tts' ? (
        <>
          <label className="prop-label">
            Text
            <textarea
              className="prop-textarea"
              rows={3}
              value={d.playText}
              onChange={(e) => update({ playText: e.target.value })}
            />
          </label>

          <label className="prop-label">
            Voice
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
          </label>

          <label className="prop-label">
            Language
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
          </label>
        </>
      ) : (
        <label className="prop-label">
          Audio URL
          <input
            type="text"
            className="prop-input"
            value={d.playUrl}
            onChange={(e) => update({ playUrl: e.target.value })}
          />
        </label>
      )}

      {/* DTMF Settings */}
      <label className="prop-label">
        Max Digits
        <input
          type="number"
          className="prop-input"
          value={d.maxDigits}
          min={1}
          onChange={(e) => update({ maxDigits: Number(e.target.value) })}
        />
      </label>

      <label className="prop-label">
        Digit Timeout (seconds)
        <input
          type="number"
          className="prop-input"
          value={d.digitTimeout}
          min={1}
          onChange={(e) => update({ digitTimeout: Number(e.target.value) })}
        />
      </label>

      <label className="prop-label">
        Initial Timeout (seconds)
        <input
          type="number"
          className="prop-input"
          value={d.initialTimeout}
          min={1}
          onChange={(e) => update({ initialTimeout: Number(e.target.value) })}
        />
      </label>

      {/* Speech Settings */}
      <label className="prop-label">
        Speech Language
        <select
          className="prop-select"
          value={d.speechLanguage}
          onChange={(e) => update({ speechLanguage: e.target.value })}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </label>

      <label className="prop-label">
        Speech Hints (comma-separated)
        <input
          type="text"
          className="prop-input"
          value={d.speechHints.join(', ')}
          onChange={(e) =>
            update({
              speechHints: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </label>

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="prop-label">Options</span>
          <button
            type="button"
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={addOption}
          >
            + Add Option
          </button>
        </div>

        {d.options.map((opt) => (
          <div key={opt.id} className="border border-gray-600 rounded p-2 mb-2 space-y-2">
            <input
              type="text"
              className="prop-input"
              placeholder="Digits (e.g. 1)"
              value={opt.digits}
              onChange={(e) => updateOption(opt.id, { digits: e.target.value })}
            />
            <input
              type="text"
              className="prop-input"
              placeholder="Speech (e.g. sales)"
              value={opt.speech}
              onChange={(e) => updateOption(opt.id, { speech: e.target.value })}
            />
            <input
              type="text"
              className="prop-input"
              placeholder="Label"
              value={opt.label}
              onChange={(e) => updateOption(opt.id, { label: e.target.value })}
            />
            <button
              type="button"
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() => removeOption(opt.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
