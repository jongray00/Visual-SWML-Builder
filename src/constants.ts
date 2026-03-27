import type { NodeDefinition, NodeCategory } from './types';

export const CATEGORY_COLORS: Record<NodeCategory, string> = {
  starting: '#6366f1',
  action: '#3b82f6',
  forwarding: '#f59e0b',
  recording: '#ef4444',
  input: '#10b981',
  decision: '#8b5cf6',
};

export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  starting: 'Starting',
  action: 'Action',
  forwarding: 'Forwarding',
  recording: 'Recording',
  input: 'Input',
  decision: 'Decision',
};

export const NODE_DEFINITIONS: NodeDefinition[] = [
  // Starting
  {
    type: 'handleCall',
    label: 'Handle Call',
    category: 'starting',
    color: CATEGORY_COLORS.starting,
    icon: 'PhoneIncoming',
    swmlMethod: null,
    description: 'Entry point for incoming calls',
    defaultData: { type: 'handleCall' },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },

  // Action
  {
    type: 'answerCall',
    label: 'Answer Call',
    category: 'action',
    color: CATEGORY_COLORS.action,
    icon: 'PhoneCall',
    swmlMethod: 'answer',
    description: 'Answer an incoming call',
    defaultData: { type: 'answerCall', maxDuration: 14400 },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
  {
    type: 'hangUpCall',
    label: 'Hang Up Call',
    category: 'action',
    color: CATEGORY_COLORS.action,
    icon: 'PhoneOff',
    swmlMethod: 'hangup',
    description: 'End the call',
    defaultData: { type: 'hangUpCall', reason: 'hangup' },
    outputHandles: [],
  },
  {
    type: 'playAudio',
    label: 'Play Audio / TTS',
    category: 'action',
    color: CATEGORY_COLORS.action,
    icon: 'Volume2',
    swmlMethod: 'play',
    description: 'Play audio file or text-to-speech',
    defaultData: {
      type: 'playAudio',
      mode: 'tts',
      text: '',
      url: '',
      voice: 'Polly.Joanna',
      language: 'en-US',
      gender: 'female',
      volume: 0,
    },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
  {
    type: 'sendSms',
    label: 'Send SMS',
    category: 'action',
    color: CATEGORY_COLORS.action,
    icon: 'MessageSquare',
    swmlMethod: 'send_sms',
    description: 'Send an SMS message',
    defaultData: { type: 'sendSms', toNumber: '', fromNumber: '', body: '' },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },

  // Forwarding
  {
    type: 'forwardToPhone',
    label: 'Forward to Phone',
    category: 'forwarding',
    color: CATEGORY_COLORS.forwarding,
    icon: 'PhoneForwarded',
    swmlMethod: 'connect',
    description: 'Forward call to phone number(s)',
    defaultData: {
      type: 'forwardToPhone',
      mode: 'serial',
      from: '',
      timeout: 30,
      numbers: [{ number: '', timeout: 30 }],
    },
    outputHandles: [
      { id: 'connected', label: 'Connected', type: 'source' },
      { id: 'noAnswer', label: 'No Answer', type: 'source' },
      { id: 'busy', label: 'Busy', type: 'source' },
      { id: 'declined', label: 'Declined', type: 'source' },
      { id: 'error', label: 'Error', type: 'source' },
    ],
  },

  // Recording
  {
    type: 'startRecording',
    label: 'Start Recording',
    category: 'recording',
    color: CATEGORY_COLORS.recording,
    icon: 'Circle',
    swmlMethod: 'record_call',
    description: 'Start background call recording',
    defaultData: {
      type: 'startRecording',
      stereo: true,
      format: 'wav',
      direction: 'both',
      beep: false,
    },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
  {
    type: 'stopRecording',
    label: 'Stop Recording',
    category: 'recording',
    color: CATEGORY_COLORS.recording,
    icon: 'Square',
    swmlMethod: 'stop_record_call',
    description: 'Stop background recording',
    defaultData: { type: 'stopRecording', controlId: '' },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
  {
    type: 'voicemailRecording',
    label: 'Voicemail Recording',
    category: 'recording',
    color: CATEGORY_COLORS.recording,
    icon: 'Voicemail',
    swmlMethod: 'record',
    description: 'Record a voicemail (foreground)',
    defaultData: {
      type: 'voicemailRecording',
      beep: true,
      maxLength: 60,
      terminators: '#',
      playBeforeRecord: '',
    },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },

  // Input
  {
    type: 'aiAgent',
    label: 'AI Agent',
    category: 'input',
    color: CATEGORY_COLORS.input,
    icon: 'Bot',
    swmlMethod: 'ai',
    description: 'Conversational AI agent',
    defaultData: {
      type: 'aiAgent',
      promptText: '',
      postPromptUrl: '',
      hints: [],
      params: {},
    },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
  {
    type: 'gatherInput',
    label: 'Gather Input',
    category: 'input',
    color: CATEGORY_COLORS.input,
    icon: 'Keyboard',
    swmlMethod: 'prompt',
    description: 'Collect DTMF or speech input',
    defaultData: {
      type: 'gatherInput',
      playText: '',
      playUrl: '',
      playMode: 'tts',
      voice: 'Polly.Joanna',
      language: 'en-US',
      gender: 'female',
      maxDigits: 1,
      digitTimeout: 5,
      initialTimeout: 5,
      speechLanguage: 'en-US',
      speechHints: [],
      options: [],
    },
    outputHandles: [], // Dynamic based on options
  },
  {
    type: 'request',
    label: 'Request',
    category: 'input',
    color: CATEGORY_COLORS.input,
    icon: 'Globe',
    swmlMethod: 'request',
    description: 'Make HTTP request',
    defaultData: {
      type: 'request',
      url: '',
      method: 'POST',
      headers: {},
      body: '',
      saveVariables: true,
      conditions: [],
    },
    outputHandles: [], // Dynamic based on conditions
  },

  // Decision
  {
    type: 'conditions',
    label: 'Conditions',
    category: 'decision',
    color: CATEGORY_COLORS.decision,
    icon: 'GitBranch',
    swmlMethod: 'cond',
    description: 'Branch based on conditions',
    defaultData: {
      type: 'conditions',
      conditions: [],
    },
    outputHandles: [], // Dynamic based on conditions
  },
  {
    type: 'executeSwml',
    label: 'Execute SWML',
    category: 'decision',
    color: CATEGORY_COLORS.decision,
    icon: 'Play',
    swmlMethod: 'execute',
    description: 'Execute a SWML section or URL',
    defaultData: {
      type: 'executeSwml',
      dest: '',
      params: {},
      conditions: [],
    },
    outputHandles: [], // Dynamic based on conditions
  },
  {
    type: 'setVariables',
    label: 'Set Variables',
    category: 'decision',
    color: CATEGORY_COLORS.decision,
    icon: 'Variable',
    swmlMethod: 'set',
    description: 'Set script variables',
    defaultData: {
      type: 'setVariables',
      variables: [{ key: '', value: '' }],
    },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
  {
    type: 'unsetVariables',
    label: 'Unset Variables',
    category: 'decision',
    color: CATEGORY_COLORS.decision,
    icon: 'VariableX',
    swmlMethod: 'unset',
    description: 'Remove script variables',
    defaultData: {
      type: 'unsetVariables',
      variables: [''],
    },
    outputHandles: [{ id: 'output', label: '', type: 'source' }],
  },
];

export const CATEGORY_ORDER: NodeCategory[] = [
  'starting',
  'action',
  'forwarding',
  'recording',
  'input',
  'decision',
];

export function getNodeDefinition(type: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS.find((n) => n.type === type);
}

export const VOICES = [
  'Polly.Joanna',
  'Polly.Matthew',
  'Polly.Salli',
  'Polly.Kimberly',
  'Polly.Joey',
  'Polly.Ivy',
  'Polly.Kendra',
  'Polly.Ruth',
  'Polly.Stephen',
  'Polly.Amy',
  'Polly.Brian',
  'Polly.Emma',
];

export const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'es-MX', label: 'Spanish (Mexico)' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'zh-CN', label: 'Chinese (Mandarin)' },
];
