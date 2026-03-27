import { useFlowStore } from '../store';
import type { SWMLNodeData, UnsetVariablesData } from '../types';

export default function UnsetVariablesProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as UnsetVariablesData;

  const update = (changes: Partial<UnsetVariablesData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  const addVariable = () => {
    update({ variables: [...d.variables, ''] });
  };

  const removeVariable = (index: number) => {
    update({ variables: d.variables.filter((_, i) => i !== index) });
  };

  const updateVariable = (index: number, value: string) => {
    update({ variables: d.variables.map((v, i) => (i === index ? value : v)) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <span className="prop-label">Variables to Unset</span>
        <button
          type="button"
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addVariable}
        >
          + Add Variable
        </button>
      </div>

      {d.variables.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            className="prop-input flex-1"
            placeholder="Variable name"
            value={v}
            onChange={(e) => updateVariable(i, e.target.value)}
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
