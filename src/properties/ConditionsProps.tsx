import { useFlowStore } from '../store';
import type { SWMLNodeData, ConditionsData, ConditionItem } from '../types';

export default function ConditionsProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as ConditionsData;

  const update = (changes: Partial<ConditionsData>) => {
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

  const updateCondition = (id: string, changes: Partial<ConditionItem>) => {
    update({ conditions: d.conditions.map((c) => (c.id === id ? { ...c, ...changes } : c)) });
  };

  return (
    <div className="space-y-3">
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

      <p className="text-xs text-gray-400">
        Each condition creates a dynamic output handle on this node.
      </p>

      {d.conditions.map((cond) => (
        <div key={cond.id} className="border border-gray-600 rounded p-2 space-y-2">
          <input
            type="text"
            className="prop-input"
            placeholder="prompt_value == '1'"
            value={cond.when}
            onChange={(e) => updateCondition(cond.id, { when: e.target.value })}
          />
          <input
            type="text"
            className="prop-input"
            placeholder="Label for this branch"
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
  );
}
