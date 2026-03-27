import type { FlowNode, FlowEdge } from '../types';

export interface TraversalNode {
  node: FlowNode;
  children: Map<string, TraversalNode>; // handleId -> child TraversalNode
}

// Find the starting node (Handle Call)
export function findStartNode(nodes: FlowNode[]): FlowNode | undefined {
  return nodes.find((n) => n.type === 'handleCall');
}

// Get edges going out of a node, optionally from a specific handle
function getOutEdges(edges: FlowEdge[], nodeId: string, handleId?: string): FlowEdge[] {
  return edges.filter(
    (e) => e.source === nodeId && (handleId === undefined || e.sourceHandle === handleId)
  );
}

// Get the node targeted by an edge
function getTargetNode(nodes: FlowNode[], edge: FlowEdge): FlowNode | undefined {
  return nodes.find((n) => n.id === edge.target);
}

// Build a traversal tree from the flow graph using DFS
export function buildTraversalTree(
  nodes: FlowNode[],
  edges: FlowEdge[],
  startNode: FlowNode,
  visited: Set<string> = new Set()
): TraversalNode {
  visited.add(startNode.id);

  const tree: TraversalNode = {
    node: startNode,
    children: new Map(),
  };

  // Get all output handles for this node
  const outEdges = getOutEdges(edges, startNode.id);

  for (const edge of outEdges) {
    const targetNode = getTargetNode(nodes, edge);
    if (!targetNode) continue;

    const handleId = edge.sourceHandle || 'output';

    if (visited.has(targetNode.id)) {
      // Loop detected - store reference but don't recurse
      tree.children.set(handleId, {
        node: targetNode,
        children: new Map(), // Empty - indicates loop/convergence
      });
      continue;
    }

    const childTree = buildTraversalTree(nodes, edges, targetNode, new Set(visited));
    tree.children.set(handleId, childTree);
  }

  return tree;
}

// Collect all unique linear chains and branch points
export interface SectionInfo {
  name: string;
  nodes: FlowNode[];
  isMain: boolean;
}

// Slugify a label for section naming
export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 30);
}
