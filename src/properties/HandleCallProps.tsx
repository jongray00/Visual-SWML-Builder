import type { SWMLNodeData } from '../types';

export default function HandleCallProps({ nodeId: _nodeId, data: _data }: { nodeId: string; data: SWMLNodeData }) {
  return (
    <div className="space-y-3">
      <p className="prop-label" style={{ fontStyle: 'italic', opacity: 0.7 }}>
        Entry point for incoming calls. No configuration needed.
      </p>
    </div>
  );
}
