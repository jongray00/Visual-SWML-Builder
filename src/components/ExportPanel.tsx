import { useState, useMemo } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { useFlowStore } from '../store';
import { generateSWML } from '../engine/swmlGenerator';
import { toYaml, toJson, downloadFile } from '../utils/exportUtils';

export default function ExportPanel() {
  const { nodes, edges, flowName } = useFlowStore();
  const [format, setFormat] = useState<'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState(false);

  const swml = useMemo(() => generateSWML(nodes, edges), [nodes, edges]);
  const output = useMemo(
    () => (format === 'yaml' ? toYaml(swml) : toJson(swml)),
    [swml, format]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'yaml' ? 'yaml' : 'json';
    const slug = flowName.toLowerCase().replace(/\s+/g, '-');
    downloadFile(output, `${slug}.${ext}`, format === 'yaml' ? 'text/yaml' : 'application/json');
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-white mb-3">SWML Preview</h3>

      {/* Format toggle */}
      <div className="flex gap-1 mb-3 bg-gray-900 rounded p-0.5">
        <button
          onClick={() => setFormat('yaml')}
          className={`flex-1 text-xs py-1.5 rounded transition-colors ${
            format === 'yaml'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          YAML
        </button>
        <button
          onClick={() => setFormat('json')}
          className={`flex-1 text-xs py-1.5 rounded transition-colors ${
            format === 'json'
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          JSON
        </button>
      </div>

      {/* Preview */}
      <pre className="bg-gray-900 border border-gray-700 rounded p-3 text-[10px] text-gray-300 overflow-auto max-h-[60vh] leading-relaxed font-mono whitespace-pre">
        {output}
      </pre>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 flex-1 justify-center px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>

      {/* Node count */}
      <p className="text-[10px] text-gray-500 mt-3">
        {nodes.length} nodes, {edges.length} connections
      </p>
    </div>
  );
}
