import { useFlowStore } from '../store';
import type { SWMLNodeData, RequestData } from '../types';

export default function RequestProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as RequestData;

  const update = (changes: Partial<RequestData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  const addCondition = () => {
    update({
      conditions: [...d.conditions, { id: Date.now().toString(), when: '', label: '' }],
    });
  };

  const removeCondition = (id: string) => {
    update({ conditions: d.conditions.filter((c) => c.id !== id) });
  };

  const updateCondition = (id: string, changes: Partial<{ when: string; label: string }>) => {
    update({ conditions: d.conditions.map((c) => (c.id === id ? { ...c, ...changes } : c)) });
  };

  return (
    <div className="space-y-3">
      <label className="prop-label">
        URL
        <input
          type="text"
          className="prop-input"
          value={d.url}
          onChange={(e) => update({ url: e.target.value })}
        />
      </label>

      <label className="prop-label">
        Method
        <select
          className="prop-select"
          value={d.method}
          onChange={(e) => update({ method: e.target.value as RequestData['method'] })}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>

      <label className="prop-label">
        Body
        <textarea
          className="prop-textarea"
          rows={4}
          value={d.body}
          onChange={(e) => update({ body: e.target.value })}
        />
      </label>

      <label className="prop-label flex items-center gap-2">
        <input
          type="checkbox"
          checked={d.saveVariables}
          onChange={(e) => update({ saveVariables: e.target.checked })}
        />
        Save response to variables
      </label>

      {/* Conditions */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="prop-label">Conditions</span>
          <button
            type="button"
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={addCondition}
          >
            + Add Condition
          </button>
        </div>

        {d.conditions.map((cond) => (
          <div key={cond.id} className="border border-gray-600 rounded p-2 mb-2 space-y-2">
            <input
              type="text"
              className="prop-input"
              placeholder="When (e.g. response_code == 200)"
              value={cond.when}
              onChange={(e) => updateCondition(cond.id, { when: e.target.value })}
            />
            <input
              type="text"
              className="prop-input"
              placeholder="Label"
              value={cond.label}
              onChange={(e) => updateCondition(cond.id, { label: e.target.value })}
            />
            <button
              type="button"
              className="text-xs text-red-400 hover:text-red-300"
              onClick={() => removeCondition(cond.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
