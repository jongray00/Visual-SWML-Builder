import HandleCallNode from './HandleCallNode';
import AnswerCallNode from './AnswerCallNode';
import HangUpCallNode from './HangUpCallNode';
import PlayAudioNode from './PlayAudioNode';
import SendSmsNode from './SendSmsNode';
import ForwardToPhoneNode from './ForwardToPhoneNode';
import StartRecordingNode from './StartRecordingNode';
import StopRecordingNode from './StopRecordingNode';
import VoicemailRecordingNode from './VoicemailRecordingNode';
import AIAgentNode from './AIAgentNode';
import GatherInputNode from './GatherInputNode';
import RequestNode from './RequestNode';
import ConditionsNode from './ConditionsNode';
import ExecuteSwmlNode from './ExecuteSwmlNode';
import SetVariablesNode from './SetVariablesNode';
import UnsetVariablesNode from './UnsetVariablesNode';

export const nodeTypes = {
  handleCall: HandleCallNode,
  answerCall: AnswerCallNode,
  hangUpCall: HangUpCallNode,
  playAudio: PlayAudioNode,
  sendSms: SendSmsNode,
  forwardToPhone: ForwardToPhoneNode,
  startRecording: StartRecordingNode,
  stopRecording: StopRecordingNode,
  voicemailRecording: VoicemailRecordingNode,
  aiAgent: AIAgentNode,
  gatherInput: GatherInputNode,
  request: RequestNode,
  conditions: ConditionsNode,
  executeSwml: ExecuteSwmlNode,
  setVariables: SetVariablesNode,
  unsetVariables: UnsetVariablesNode,
};
