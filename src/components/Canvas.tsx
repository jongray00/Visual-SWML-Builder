import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import { useFlowStore } from '../store';
import { nodeTypes } from '../nodes/nodeTypes';
import type { SWMLNodeType } from '../types';

export default function Canvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNodeId, deleteNode } =
    useFlowStore();
  const { screenToFlowPosition } = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/swml-node-type') as SWMLNodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      useFlowStore.getState().addNode(type, position);
    },
    [screenToFlowPosition]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: { id: string }) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && event.target === event.currentTarget) {
        const selectedId = useFlowStore.getState().selectedNodeId;
        if (selectedId) {
          deleteNode(selectedId);
        }
      }
    },
    [deleteNode]
  );

  return (
    <div className="flex-1" onKeyDown={onKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes as any}
        edges={edges}
        onNodesChange={onNodesChange as any}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick as any}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes as any}
        snapToGrid
        snapGrid={[16, 16]}
        fitView
        deleteKeyCode={['Delete', 'Backspace']}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#64748b', strokeWidth: 2 },
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#374151" />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-700 [&>button]:!border-gray-600 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-600" />
        <MiniMap
          className="!bg-gray-800 !border-gray-700"
          maskColor="rgba(0, 0, 0, 0.6)"
          nodeColor={(node: any) => {
            const colors: Record<string, string> = {
              handleCall: '#6366f1',
              answerCall: '#3b82f6',
              hangUpCall: '#3b82f6',
              playAudio: '#3b82f6',
              sendSms: '#3b82f6',
              forwardToPhone: '#f59e0b',
              startRecording: '#ef4444',
              stopRecording: '#ef4444',
              voicemailRecording: '#ef4444',
              aiAgent: '#10b981',
              gatherInput: '#10b981',
              request: '#10b981',
              conditions: '#8b5cf6',
              executeSwml: '#8b5cf6',
              setVariables: '#8b5cf6',
              unsetVariables: '#8b5cf6',
            };
            return colors[node.type || ''] || '#64748b';
          }}
        />
      </ReactFlow>
    </div>
  );
}
