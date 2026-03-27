import { useFlowStore } from '../store';
import type { SWMLNodeData, ForwardToPhoneData } from '../types';

export default function ForwardToPhoneProps({ nodeId, data }: { nodeId: string; data: SWMLNodeData }) {
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const d = data as ForwardToPhoneData;

  const update = (changes: Partial<ForwardToPhoneData>) => {
    updateNodeData(nodeId, changes as Partial<SWMLNodeData>);
  };

  const updateNumber = (index: number, field: 'number' | 'timeout', value: string | number) => {
    const numbers = [...d.numbers];
    numbers[index] = { ...numbers[index], [field]: value };
    update({ numbers });
  };

  const addNumber = () => {
    update({ numbers: [...d.numbers, { number: '', timeout: 30 }] });
  };

  const removeNumber = (index: number) => {
    const numbers = d.numbers.filter((_, i) => i !== index);
    if (numbers.length === 0) {
      update({ numbers: [{ number: '', timeout: 30 }] });
    } else {
      update({ numbers });
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="prop-label">Caller ID</label>
        <input
          className="prop-input"
          type="text"
          value={d.from}
          placeholder="+15551234567"
          onChange={(e) => update({ from: e.target.value })}
        />
      </div>

      <div>
        <label className="prop-label">Timeout (seconds)</label>
        <input
          className="prop-input"
          type="number"
          min={1}
          value={d.timeout}
          onChange={(e) => update({ timeout: Number(e.target.value) })}
        />
      </div>

      {/* Mode Toggle */}
      <div>
        <label className="prop-label">Dial Mode</label>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            type="button"
            className={`prop-input ${d.mode === 'serial' ? 'active' : ''}`}
            style={{
              flex: 1,
              cursor: 'pointer',
              fontWeight: d.mode === 'serial' ? 700 : 400,
              background: d.mode === 'serial' ? '#f59e0b' : undefined,
              color: d.mode === 'serial' ? '#fff' : undefined,
            }}
            onClick={() => update({ mode: 'serial' })}
          >
            Serial
          </button>
          <button
            type="button"
            className={`prop-input ${d.mode === 'parallel' ? 'active' : ''}`}
            style={{
              flex: 1,
              cursor: 'pointer',
              fontWeight: d.mode === 'parallel' ? 700 : 400,
              background: d.mode === 'parallel' ? '#f59e0b' : undefined,
              color: d.mode === 'parallel' ? '#fff' : undefined,
            }}
            onClick={() => update({ mode: 'parallel' })}
          >
            Parallel
          </button>
        </div>
      </div>

      {/* Dynamic Phone Numbers */}
      <div>
        <label className="prop-label">Phone Numbers</label>
        {d.numbers.map((entry, index) => (
          <div key={index} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
            <input
              className="prop-input"
              type="text"
              style={{ flex: 2 }}
              value={entry.number}
              placeholder="+15551234567"
              onChange={(e) => updateNumber(index, 'number', e.target.value)}
            />
            <input
              className="prop-input"
              type="number"
              style={{ flex: 1 }}
              min={1}
              value={entry.timeout}
              placeholder="Timeout"
              onChange={(e) => updateNumber(index, 'timeout', Number(e.target.value))}
            />
            <button
              type="button"
              className="prop-input"
              style={{ cursor: 'pointer', padding: '4px 8px', flexShrink: 0 }}
              onClick={() => removeNumber(index)}
              title="Remove number"
            >
              &times;
            </button>
          </div>
        ))}
        <button
          type="button"
          className="prop-input"
          style={{ cursor: 'pointer', width: '100%', marginTop: 4 }}
          onClick={addNumber}
        >
          + Add Number
        </button>
      </div>
    </div>
  );
}
