import { useFlowStore } from '../store';
import type { SWMLNodeData, SetVariablesData } from '../types';

export default function SetVariablesProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as SetVariablesData;

  const update = (changes: Partial<SetVariablesData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  const addVariable = () => {
    update({ variables: [...d.variables, { key: '', value: '' }] });
  };

  const removeVariable = (index: number) => {
    update({ variables: d.variables.filter((_, i) => i !== index) });
  };

  const updateVariable = (index: number, changes: Partial<{ key: string; value: string }>) => {
    update({
      variables: d.variables.map((v, i) => (i === index ? { ...v, ...changes } : v)),
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="prop-label">Variables</span>
        <button
          type="button"
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addVariable}
        >
          + Add Variable
        </button>
      </div>

      {d.variables.map((v, i) => (
        <div key={i} className="border border-gray-600 rounded p-2 space-y-2">
          <input
            type="text"
            className="prop-input"
            placeholder="Variable name"
            value={v.key}
            onChange={(e) => updateVariable(i, { key: e.target.value })}
          />
          <input
            type="text"
            className="prop-input"
            placeholder="Value"
            value={v.value}
            onChange={(e) => updateVariable(i, { value: e.target.value })}
          />
          <button
            type="button"
            className="text-xs text-red-400 hover:text-red-300"
            onClick={() => removeVariable(i)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
