import type { FlowNode, FlowEdge } from '../types';
import { findStartNode } from './graphTraverser';
import { buildSections } from './sectionBuilder';

export interface SWMLDocument {
  version: string;
  sections: Record<string, Record<string, unknown>[]>;
}

export function generateSWML(nodes: FlowNode[], edges: FlowEdge[]): SWMLDocument {
  const startNode = findStartNode(nodes);

  if (!startNode) {
    return {
      version: '1.0.0',
      sections: {
        main: [{ answer: {} }, { play: { url: 'say:No call flow defined.' } }, { hangup: {} }],
      },
    };
  }

  const sections = buildSections(nodes, edges, startNode);

  // Clean up empty sections
  for (const key of Object.keys(sections)) {
    if (sections[key].length === 0 && key !== 'main') {
      delete sections[key];
    }
  }

  return {
    version: '1.0.0',
    sections,
  };
}
