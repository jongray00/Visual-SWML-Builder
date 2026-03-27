import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import * as LucideIcons from 'lucide-react';
import type { HandleDefinition } from '../types';

function getIcon(iconName: string): React.ComponentType<any> {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
}

interface BaseNodeProps {
  id: string;
  color: string;
  icon: string;
  label: string;
  summary?: string;
  selected?: boolean;
  hasInput?: boolean;
  outputHandles: HandleDefinition[];
}

function BaseNodeComponent({
  color,
  icon,
  label,
  summary,
  selected,
  hasInput = true,
  outputHandles,
}: BaseNodeProps) {
  const Icon = getIcon(icon);

  return (
    <div
      className="min-w-[180px] max-w-[240px] rounded-lg shadow-lg border-2 transition-shadow"
      style={{
        borderColor: selected ? color : 'transparent',
        boxShadow: selected ? `0 0 12px ${color}40` : undefined,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-md"
        style={{ backgroundColor: color }}
      >
        <Icon className="w-4 h-4 text-white" />
        <span className="text-xs font-semibold text-white truncate">{label}</span>
      </div>

      {/* Body */}
      <div className="bg-gray-800 px-3 py-2 rounded-b-md min-h-[28px]">
        {summary && (
          <p className="text-[10px] text-gray-400 leading-tight truncate">{summary}</p>
        )}

        {/* Output handle labels for branching nodes */}
        {outputHandles.length > 1 && (
          <div className="mt-1 space-y-0.5">
            {outputHandles.map((h) => (
              <div key={h.id} className="flex items-center justify-end gap-1">
                <span className="text-[9px] text-gray-500">{h.label}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Handle */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-2.5 !h-2.5 !bg-gray-400 !border-2 !border-gray-600"
        />
      )}

      {/* Output Handles */}
      {outputHandles.length === 1 && (
        <Handle
          type="source"
          position={Position.Right}
          id={outputHandles[0].id}
          className="!w-2.5 !h-2.5 !border-2 !border-gray-600"
          style={{ backgroundColor: color }}
        />
      )}

      {outputHandles.length > 1 &&
        outputHandles.map((handle, index) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Right}
            id={handle.id}
            style={{
              top: `${((index + 1) * 100) / (outputHandles.length + 1)}%`,
              backgroundColor: color,
            }}
            className="!w-2.5 !h-2.5 !border-2 !border-gray-600"
          />
        ))}
    </div>
  );
}

export default memo(BaseNodeComponent);
