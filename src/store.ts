import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
} from '@xyflow/react';
import type { FlowStore, FlowNode, FlowEdge, SWMLNodeType, SWMLNodeData } from './types';
import { getNodeDefinition } from './constants';

let nodeIdCounter = 0;

function generateNodeId(): string {
  nodeIdCounter++;
  return `node_${nodeIdCounter}`;
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  flowName: 'My Call Flow',

  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes as any) as any });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as FlowEdge[] });
  },

  onConnect: (connection: Connection) => {
    const newEdge = addEdge(
      {
        ...connection,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#64748b', strokeWidth: 2 },
      },
      get().edges
    );
    set({ edges: newEdge as FlowEdge[] });
  },

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
  },

  setFlowName: (name: string) => {
    set({ flowName: name });
  },

  addNode: (type: SWMLNodeType, position: { x: number; y: number }) => {
    const definition = getNodeDefinition(type);
    if (!definition) return;

    const id = generateNodeId();
    const newNode: FlowNode = {
      id,
      type,
      position,
      data: { ...definition.defaultData, label: definition.label },
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId: string, data: Partial<SWMLNodeData>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  clearFlow: () => {
    nodeIdCounter = 0;
    set({ nodes: [], edges: [], selectedNodeId: null });
  },

  loadTemplate: (nodes: FlowNode[], edges: FlowEdge[]) => {
    const maxId = nodes.reduce((max, n) => {
      const num = parseInt(n.id.replace('node_', ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    nodeIdCounter = maxId;
    set({ nodes, edges, selectedNodeId: null });
  },
}));
