import type { SWMLNodeData, FlowNode } from '../types';

// Maps a single node's data to its SWML method object(s)
export function mapNodeToMethods(node: FlowNode): Record<string, unknown>[] {
  const data = node.data as unknown as SWMLNodeData;

  switch (data.type) {
    case 'handleCall':
      return []; // Entry point, no method

    case 'answerCall':
      return [{ answer: data.maxDuration !== 14400 ? { max_duration: data.maxDuration } : {} }];

    case 'hangUpCall':
      return [{ hangup: data.reason !== 'hangup' ? { reason: data.reason } : {} }];

    case 'playAudio': {
      if (data.mode === 'tts' && data.text) {
        const play: Record<string, unknown> = { url: `say:${data.text}` };
        if (data.voice) play.say_voice = data.voice;
        if (data.language) play.say_language = data.language;
        if (data.gender) play.say_gender = data.gender;
        if (data.volume !== 0) play.volume = data.volume;
        return [{ play }];
      }
      if (data.mode === 'url' && data.url) {
        const play: Record<string, unknown> = { url: data.url };
        if (data.volume !== 0) play.volume = data.volume;
        return [{ play }];
      }
      return [{ play: { url: 'say:' } }];
    }

    case 'sendSms':
      return [
        {
          send_sms: {
            to_number: data.toNumber,
            from_number: data.fromNumber,
            body: data.body,
          },
        },
      ];

    case 'forwardToPhone': {
      const connect: Record<string, unknown> = {};
      if (data.from) connect.from = data.from;
      if (data.timeout) connect.timeout = data.timeout;

      if (data.numbers.length === 1) {
        connect.to = data.numbers[0].number;
      } else if (data.mode === 'serial') {
        connect.serial = data.numbers.map((n) => ({
          to: n.number,
          timeout: n.timeout,
        }));
      } else {
        connect.parallel = data.numbers.map((n) => ({
          to: n.number,
        }));
      }

      return [{ connect }];
    }

    case 'startRecording': {
      const rec: Record<string, unknown> = {};
      if (data.stereo) rec.stereo = true;
      if (data.format !== 'wav') rec.format = data.format;
      if (data.direction !== 'both') rec.direction = data.direction;
      if (data.beep) rec.beep = true;
      return [{ record_call: Object.keys(rec).length ? rec : {} }];
    }

    case 'stopRecording': {
      if (data.controlId) {
        return [{ stop_record_call: { control_id: data.controlId } }];
      }
      return [{ stop_record_call: {} }];
    }

    case 'voicemailRecording': {
      const rec: Record<string, unknown> = {};
      if (data.beep) rec.beep = true;
      if (data.maxLength) rec.max_length = data.maxLength;
      if (data.terminators) rec.terminators = data.terminators;
      return [{ record: Object.keys(rec).length ? rec : {} }];
    }

    case 'aiAgent': {
      const ai: Record<string, unknown> = {};
      if (data.promptText) {
        ai.prompt = { text: data.promptText };
      }
      if (data.postPromptUrl) ai.post_prompt_url = data.postPromptUrl;
      if (data.hints && data.hints.length) ai.hints = data.hints;
      return [{ ai }];
    }

    case 'gatherInput': {
      // Build prompt method
      const prompt: Record<string, unknown> = {};
      if (data.playMode === 'tts' && data.playText) {
        prompt.play = `say:${data.playText}`;
        if (data.voice) prompt.say_voice = data.voice;
        if (data.language) prompt.say_language = data.language;
      } else if (data.playMode === 'url' && data.playUrl) {
        prompt.play = data.playUrl;
      } else {
        prompt.play = 'say:';
      }
      if (data.maxDigits) prompt.max_digits = data.maxDigits;
      if (data.digitTimeout) prompt.digit_timeout = data.digitTimeout;
      if (data.initialTimeout) prompt.initial_timeout = data.initialTimeout;
      if (data.speechLanguage) prompt.speech_language = data.speechLanguage;
      if (data.speechHints && data.speechHints.length) {
        prompt.speech_hints = data.speechHints;
      }
      return [{ prompt }];
      // Note: the switch/cond for routing is handled by sectionBuilder
    }

    case 'request': {
      const req: Record<string, unknown> = {
        url: data.url,
        method: data.method,
      };
      if (data.body) req.body = data.body;
      if (data.saveVariables) req.save_variables = true;
      if (data.headers && Object.keys(data.headers).length) req.headers = data.headers;
      return [{ request: req }];
    }

    case 'conditions':
      // Handled by sectionBuilder (cond block)
      return [];

    case 'executeSwml': {
      const exec: Record<string, unknown> = { dest: data.dest };
      if (data.params && Object.keys(data.params).length) exec.params = data.params;
      return [{ execute: exec }];
    }

    case 'setVariables': {
      const vars: Record<string, string> = {};
      data.variables.forEach((v) => {
        if (v.key) vars[v.key] = v.value;
      });
      return [{ set: vars }];
    }

    case 'unsetVariables':
      return [{ unset: data.variables.filter(Boolean) }];

    default:
      return [];
  }
}
