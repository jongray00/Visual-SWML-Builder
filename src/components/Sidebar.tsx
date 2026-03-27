import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { NODE_DEFINITIONS, CATEGORY_ORDER, CATEGORY_LABELS, CATEGORY_COLORS } from '../constants';
import type { NodeCategory } from '../types';

function getIcon(iconName: string): React.ComponentType<any> {
  const Icon = (LucideIcons as any)[iconName];
  return Icon || LucideIcons.Circle;
}

export default function Sidebar() {
  const [expanded, setExpanded] = useState<Record<NodeCategory, boolean>>({
    starting: true,
    action: true,
    forwarding: true,
    recording: true,
    input: true,
    decision: true,
  });

  const toggleCategory = (cat: NodeCategory) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData('application/swml-node-type', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-60 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0">
      <div className="px-3 py-2 border-b border-gray-700">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nodes</h2>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const nodesInCategory = NODE_DEFINITIONS.filter((n) => n.category === category);
        const isExpanded = expanded[category];
        const color = CATEGORY_COLORS[category];

        return (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {CATEGORY_LABELS[category]}
            </button>

            {isExpanded && (
              <div className="pb-1">
                {nodesInCategory.map((nodeDef) => {
                  const Icon = getIcon(nodeDef.icon);
                  return (
                    <div
                      key={nodeDef.type}
                      draggable
                      onDragStart={(e) => onDragStart(e, nodeDef.type)}
                      className="sidebar-node flex items-center gap-2 mx-2 px-2 py-1.5 rounded text-xs text-gray-300 hover:bg-gray-700/70"
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color }} />
                      <span>{nodeDef.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
