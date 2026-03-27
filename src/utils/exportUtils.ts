import yaml from 'js-yaml';
import type { SWMLDocument } from '../engine/swmlGenerator';

export function toYaml(swml: SWMLDocument): string {
  return yaml.dump(swml, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
    sortKeys: false,
  });
}

export function toJson(swml: SWMLDocument): string {
  return JSON.stringify(swml, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportYaml(swml: SWMLDocument, flowName: string): void {
  const content = toYaml(swml);
  const slug = flowName.toLowerCase().replace(/\s+/g, '-');
  downloadFile(content, `${slug}.yaml`, 'text/yaml');
}

export function exportJson(swml: SWMLDocument, flowName: string): void {
  const content = toJson(swml);
  const slug = flowName.toLowerCase().replace(/\s+/g, '-');
  downloadFile(content, `${slug}.json`, 'application/json');
}
