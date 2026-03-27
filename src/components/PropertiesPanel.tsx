import { useFlowStore } from '../store';
import { getNodeDefinition } from '../constants';
import ExportPanel from './ExportPanel';
import HandleCallProps from '../properties/HandleCallProps';
import AnswerCallProps from '../properties/AnswerCallProps';
import HangUpCallProps from '../properties/HangUpCallProps';
import PlayAudioProps from '../properties/PlayAudioProps';
import SendSmsProps from '../properties/SendSmsProps';
import ForwardToPhoneProps from '../properties/ForwardToPhoneProps';
import StartRecordingProps from '../properties/StartRecordingProps';
import StopRecordingProps from '../properties/StopRecordingProps';
import VoicemailRecordingProps from '../properties/VoicemailRecordingProps';
import AIAgentProps from '../properties/AIAgentProps';
import GatherInputProps from '../properties/GatherInputProps';
import RequestProps from '../properties/RequestProps';
import ConditionsProps from '../properties/ConditionsProps';
import ExecuteSwmlProps from '../properties/ExecuteSwmlProps';
import SetVariablesProps from '../properties/SetVariablesProps';
import UnsetVariablesProps from '../properties/UnsetVariablesProps';
import type { SWMLNodeData } from '../types';

const PROP_PANELS: Record<string, React.ComponentType<{ nodeId: string; data: SWMLNodeData }>> = {
  handleCall: HandleCallProps,
  answerCall: AnswerCallProps,
  hangUpCall: HangUpCallProps,
  playAudio: PlayAudioProps,
  sendSms: SendSmsProps,
  forwardToPhone: ForwardToPhoneProps,
  startRecording: StartRecordingProps,
  stopRecording: StopRecordingProps,
  voicemailRecording: VoicemailRecordingProps,
  aiAgent: AIAgentProps,
  gatherInput: GatherInputProps,
  request: RequestProps,
  conditions: ConditionsProps,
  executeSwml: ExecuteSwmlProps,
  setVariables: SetVariablesProps,
  unsetVariables: UnsetVariablesProps,
};

export default function PropertiesPanel() {
  const { selectedNodeId, nodes, deleteNode } = useFlowStore();

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto flex-shrink-0">
        <ExportPanel />
      </div>
    );
  }

  const nodeType = selectedNode.type || '';
  const definition = getNodeDefinition(nodeType);
  const PropsComponent = PROP_PANELS[nodeType];

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto flex-shrink-0">
      <div className="border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              {definition?.label || nodeType}
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">{definition?.description}</p>
          </div>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-900/20"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="p-4">
        {PropsComponent && (
          <PropsComponent
            nodeId={selectedNode.id}
            data={selectedNode.data as unknown as SWMLNodeData}
          />
        )}
      </div>
    </div>
  );
}
