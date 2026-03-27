import BaseNode from './BaseNode';
import type { ForwardToPhoneData } from '../types';

export default function ForwardToPhoneNode(props: any) {
  const { id, data, selected } = props;
  const d = data as ForwardToPhoneData;
  const mode = d.mode === 'parallel' ? 'Parallel' : 'Serial';
  const count = d.numbers?.length ?? 0;
  const summary = `${mode}: ${count} number${count !== 1 ? 's' : ''}`;

  return (
    <BaseNode
      id={id}
      color="#f59e0b"
      icon="PhoneForwarded"
      label={d.label || 'Forward to Phone'}
      summary={summary}
      selected={selected}
      hasInput={true}
      outputHandles={[
        { id: 'connected', label: 'Connected', type: 'source' },
        { id: 'noAnswer', label: 'No Answer', type: 'source' },
        { id: 'busy', label: 'Busy', type: 'source' },
        { id: 'declined', label: 'Declined', type: 'source' },
        { id: 'error', label: 'Error', type: 'source' },
      ]}
    />
  );
}
