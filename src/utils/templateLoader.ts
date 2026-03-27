import type { FlowNode, FlowEdge } from '../types';

export function loadSampleIVRTemplate(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const nodes: FlowNode[] = [
    // Main flow
    {
      id: 'node_1',
      type: 'handleCall',
      position: { x: 50, y: 300 },
      data: { type: 'handleCall', label: 'Handle Call' },
    },
    {
      id: 'node_2',
      type: 'answerCall',
      position: { x: 300, y: 300 },
      data: { type: 'answerCall', maxDuration: 14400, label: 'Answer Call' },
    },
    {
      id: 'node_3',
      type: 'startRecording',
      position: { x: 530, y: 300 },
      data: {
        type: 'startRecording',
        stereo: true,
        format: 'wav',
        direction: 'both',
        beep: false,
        label: 'Start Recording',
      },
    },
    {
      id: 'node_4',
      type: 'setVariables',
      position: { x: 760, y: 300 },
      data: {
        type: 'setVariables',
        variables: [
          { key: 'company_name', value: 'My Company' },
          { key: 'sales_number', value: '+1XXXXXXXXXX' },
          { key: 'support_number', value: '+1XXXXXXXXXX' },
        ],
        label: 'Set Variables',
      },
    },
    {
      id: 'node_5',
      type: 'playAudio',
      position: { x: 990, y: 300 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: "Thank you for calling ${company_name}. We're glad you reached out.",
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Welcome Message',
      },
    },
    {
      id: 'node_6',
      type: 'gatherInput',
      position: { x: 1220, y: 250 },
      data: {
        type: 'gatherInput',
        playText:
          'Press 1 or say Sales to speak with our sales team. Press 2 or say Support to reach our support team. Press 3 or say Voicemail to leave a message.',
        playUrl: '',
        playMode: 'tts',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        maxDigits: 1,
        digitTimeout: 5,
        initialTimeout: 5,
        speechLanguage: 'en-US',
        speechHints: ['sales', 'support', 'voicemail', 'one', 'two', 'three'],
        options: [
          { id: 'opt1', digits: '1', speech: 'sales', label: 'Sales' },
          { id: 'opt2', digits: '2', speech: 'support', label: 'Support' },
          { id: 'opt3', digits: '3', speech: 'voicemail', label: 'Voicemail' },
        ],
        label: 'IVR Menu',
      },
    },

    // Sales path
    {
      id: 'node_7',
      type: 'playAudio',
      position: { x: 1550, y: 100 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: 'Great choice. Connecting you to our sales team now. Please hold.',
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Sales Greeting',
      },
    },
    {
      id: 'node_8',
      type: 'forwardToPhone',
      position: { x: 1780, y: 100 },
      data: {
        type: 'forwardToPhone',
        mode: 'serial',
        from: '',
        timeout: 20,
        numbers: [{ number: '${sales_number}', timeout: 20 }],
        label: 'Call Sales',
      },
    },

    // Support path
    {
      id: 'node_9',
      type: 'playAudio',
      position: { x: 1550, y: 300 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: 'Connecting you to our support team now. Please hold.',
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Support Greeting',
      },
    },
    {
      id: 'node_10',
      type: 'forwardToPhone',
      position: { x: 1780, y: 300 },
      data: {
        type: 'forwardToPhone',
        mode: 'serial',
        from: '',
        timeout: 20,
        numbers: [{ number: '${support_number}', timeout: 20 }],
        label: 'Call Support',
      },
    },

    // Voicemail section
    {
      id: 'node_11',
      type: 'playAudio',
      position: { x: 1550, y: 520 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: "You've reached the voicemail for ${company_name}. Please leave your name, number, and a brief message after the beep. Press pound when you're finished.",
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Voicemail Prompt',
      },
    },
    {
      id: 'node_12',
      type: 'voicemailRecording',
      position: { x: 1780, y: 520 },
      data: {
        type: 'voicemailRecording',
        beep: true,
        maxLength: 60,
        terminators: '#',
        playBeforeRecord: '',
        label: 'Record Voicemail',
      },
    },
    {
      id: 'node_13',
      type: 'playAudio',
      position: { x: 2010, y: 520 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: 'Thank you for your message. A member of our team will get back to you shortly. Goodbye.',
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Thank You',
      },
    },
    {
      id: 'node_14',
      type: 'hangUpCall',
      position: { x: 2240, y: 520 },
      data: { type: 'hangUpCall', reason: 'hangup', label: 'Hang Up' },
    },

    // Sales unavailable message
    {
      id: 'node_15',
      type: 'playAudio',
      position: { x: 2060, y: 100 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: 'Our sales team is currently unavailable.',
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Sales Unavailable',
      },
    },

    // Support unavailable message
    {
      id: 'node_16',
      type: 'playAudio',
      position: { x: 2060, y: 300 },
      data: {
        type: 'playAudio',
        mode: 'tts',
        text: 'Our support team is currently unavailable.',
        url: '',
        voice: 'Polly.Joanna',
        language: 'en-US',
        gender: 'female',
        volume: 0,
        label: 'Support Unavailable',
      },
    },
  ];

  const edges: FlowEdge[] = [
    // Main chain
    { id: 'e1-2', source: 'node_1', target: 'node_2', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e2-3', source: 'node_2', target: 'node_3', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e3-4', source: 'node_3', target: 'node_4', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e4-5', source: 'node_4', target: 'node_5', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e5-6', source: 'node_5', target: 'node_6', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },

    // IVR branches
    { id: 'e6-7', source: 'node_6', target: 'node_7', sourceHandle: 'option-opt1', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e6-9', source: 'node_6', target: 'node_9', sourceHandle: 'option-opt2', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e6-11', source: 'node_6', target: 'node_11', sourceHandle: 'option-opt3', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },

    // Sales path
    { id: 'e7-8', source: 'node_7', target: 'node_8', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e8-15', source: 'node_8', target: 'node_15', sourceHandle: 'noAnswer', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e15-11', source: 'node_15', target: 'node_11', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },

    // Support path
    { id: 'e9-10', source: 'node_9', target: 'node_10', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e10-16', source: 'node_10', target: 'node_16', sourceHandle: 'noAnswer', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e16-11', source: 'node_16', target: 'node_11', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },

    // Voicemail path
    { id: 'e11-12', source: 'node_11', target: 'node_12', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e12-13', source: 'node_12', target: 'node_13', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
    { id: 'e13-14', source: 'node_13', target: 'node_14', sourceHandle: 'output', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },

    // No input -> voicemail
    { id: 'e6-11-noinput', source: 'node_6', target: 'node_11', sourceHandle: 'noInput', type: 'smoothstep', style: { stroke: '#64748b', strokeWidth: 2 } },
  ];

  return { nodes: nodes as FlowNode[], edges };
}
