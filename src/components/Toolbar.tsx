import { Workflow, Trash2, Download, FileJson, Upload } from 'lucide-react';
import { useFlowStore } from '../store';
import { loadSampleIVRTemplate } from '../utils/templateLoader';
import { exportYaml, exportJson } from '../utils/exportUtils';
import { generateSWML } from '../engine/swmlGenerator';

export default function Toolbar() {
  const { flowName, setFlowName, clearFlow, loadTemplate, nodes, edges } = useFlowStore();

  const handleExportYaml = () => {
    const swml = generateSWML(nodes, edges);
    exportYaml(swml, flowName);
  };

  const handleExportJson = () => {
    const swml = generateSWML(nodes, edges);
    exportJson(swml, flowName);
  };

  const handleLoadTemplate = () => {
    const { nodes: tNodes, edges: tEdges } = loadSampleIVRTemplate();
    loadTemplate(tNodes, tEdges);
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <Workflow className="w-5 h-5 text-indigo-400" />
        <input
          type="text"
          value={flowName}
          onChange={(e) => setFlowName(e.target.value)}
          className="bg-transparent text-white text-sm font-semibold border-b border-transparent hover:border-gray-500 focus:border-indigo-400 focus:outline-none px-1 py-0.5"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleLoadTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Sample IVR
        </button>
        <button
          onClick={handleExportYaml}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          YAML
        </button>
        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          <FileJson className="w-3.5 h-3.5" />
          JSON
        </button>
        <button
          onClick={clearFlow}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-gray-700 hover:bg-red-900/30 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>
    </div>
  );
}
