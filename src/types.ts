import type { Edge } from '@xyflow/react';

export type NodeCategory = 'starting' | 'action' | 'forwarding' | 'recording' | 'input' | 'decision';

export type SWMLNodeType =
  | 'handleCall'
  | 'answerCall'
  | 'hangUpCall'
  | 'playAudio'
  | 'sendSms'
  | 'forwardToPhone'
  | 'startRecording'
  | 'stopRecording'
  | 'voicemailRecording'
  | 'aiAgent'
  | 'gatherInput'
  | 'request'
  | 'conditions'
  | 'executeSwml'
  | 'setVariables'
  | 'unsetVariables';

export interface HandleDefinition {
  id: string;
  label: string;
  type: 'source' | 'target';
}

export interface NodeDefinition {
  type: SWMLNodeType;
  label: string;
  category: NodeCategory;
  color: string;
  icon: string;
  swmlMethod: string | null;
  defaultData: Record<string, unknown>;
  outputHandles: HandleDefinition[];
  description: string;
}

// Base interface for node data (label is always present in the flow)
interface BaseNodeData {
  label?: string;
}

// Per-node data interfaces
export interface HandleCallData extends BaseNodeData {
  type: 'handleCall';
}

export interface AnswerCallData extends BaseNodeData {
  type: 'answerCall';
  maxDuration: number;
}

export interface HangUpCallData extends BaseNodeData {
  type: 'hangUpCall';
  reason: 'hangup' | 'busy' | 'decline';
}

export interface PlayAudioData extends BaseNodeData {
  type: 'playAudio';
  mode: 'tts' | 'url';
  text: string;
  url: string;
  voice: string;
  language: string;
  gender: string;
  volume: number;
}

export interface SendSmsData extends BaseNodeData {
  type: 'sendSms';
  toNumber: string;
  fromNumber: string;
  body: string;
}

export interface ForwardToPhoneData extends BaseNodeData {
  type: 'forwardToPhone';
  mode: 'serial' | 'parallel';
  from: string;
  timeout: number;
  numbers: { number: string; timeout: number }[];
}

export interface StartRecordingData extends BaseNodeData {
  type: 'startRecording';
  stereo: boolean;
  format: 'wav' | 'mp3' | 'mp4';
  direction: 'both' | 'speak' | 'listen';
  beep: boolean;
}

export interface StopRecordingData extends BaseNodeData {
  type: 'stopRecording';
  controlId: string;
}

export interface VoicemailRecordingData extends BaseNodeData {
  type: 'voicemailRecording';
  beep: boolean;
  maxLength: number;
  terminators: string;
  playBeforeRecord: string;
}

export interface AIAgentData extends BaseNodeData {
  type: 'aiAgent';
  promptText: string;
  postPromptUrl: string;
  hints: string[];
  params: Record<string, string>;
}

export interface GatherInputOption {
  id: string;
  digits: string;
  speech: string;
  label: string;
}

export interface GatherInputData extends BaseNodeData {
  type: 'gatherInput';
  playText: string;
  playUrl: string;
  playMode: 'tts' | 'url';
  voice: string;
  language: string;
  gender: string;
  maxDigits: number;
  digitTimeout: number;
  initialTimeout: number;
  speechLanguage: string;
  speechHints: string[];
  options: GatherInputOption[];
}

export interface RequestData extends BaseNodeData {
  type: 'request';
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body: string;
  saveVariables: boolean;
  conditions: { id: string; when: string; label: string }[];
}

export interface ConditionItem {
  id: string;
  when: string;
  label: string;
}

export interface ConditionsData extends BaseNodeData {
  type: 'conditions';
  conditions: ConditionItem[];
}

export interface ExecuteSwmlData extends BaseNodeData {
  type: 'executeSwml';
  dest: string;
  params: Record<string, string>;
  conditions: { id: string; when: string; label: string }[];
}

export interface SetVariablesData extends BaseNodeData {
  type: 'setVariables';
  variables: { key: string; value: string }[];
}

export interface UnsetVariablesData extends BaseNodeData {
  type: 'unsetVariables';
  variables: string[];
}

export type SWMLNodeData =
  | HandleCallData
  | AnswerCallData
  | HangUpCallData
  | PlayAudioData
  | SendSmsData
  | ForwardToPhoneData
  | StartRecordingData
  | StopRecordingData
  | VoicemailRecordingData
  | AIAgentData
  | GatherInputData
  | RequestData
  | ConditionsData
  | ExecuteSwmlData
  | SetVariablesData
  | UnsetVariablesData;

// Use a loose node type compatible with React Flow's Record<string, unknown> requirement
export interface FlowNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  selected?: boolean;
  dragging?: boolean;
  width?: number;
  height?: number;
  parentId?: string;
  [key: string]: unknown;
}
export type FlowEdge = Edge;

export interface FlowStore {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  flowName: string;

  onNodesChange: (changes: import('@xyflow/react').NodeChange[]) => void;
  onEdgesChange: (changes: import('@xyflow/react').EdgeChange[]) => void;
  onConnect: (connection: import('@xyflow/react').Connection) => void;

  setSelectedNodeId: (id: string | null) => void;
  setFlowName: (name: string) => void;
  addNode: (type: SWMLNodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<SWMLNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  clearFlow: () => void;
  loadTemplate: (nodes: FlowNode[], edges: FlowEdge[]) => void;
}
