import type { FlowNode, FlowEdge, GatherInputData, ConditionsData, RequestData, ExecuteSwmlData, ForwardToPhoneData } from '../types';
import { mapNodeToMethods } from './methodMapper';
import { slugify } from './graphTraverser';

interface SWMLSections {
  [key: string]: Record<string, unknown>[];
}

// Tracks named sections to avoid duplicates
let sectionCounter = 0;
const sectionNameMap = new Map<string, string>();

function getSectionName(node: FlowNode): string {
  if (sectionNameMap.has(node.id)) {
    return sectionNameMap.get(node.id)!;
  }
  const label = (node.data as { label?: string }).label || node.type || 'section';
  let name = slugify(label);
  // Ensure uniqueness
  if (name === 'main') name = 'section_main';
  const existingNames = new Set(sectionNameMap.values());
  if (existingNames.has(name)) {
    sectionCounter++;
    name = `${name}_${sectionCounter}`;
  }
  sectionNameMap.set(node.id, name);
  return name;
}

function getOutEdges(edges: FlowEdge[], nodeId: string, handleId?: string): FlowEdge[] {
  return edges.filter(
    (e) => e.source === nodeId && (handleId === undefined || e.sourceHandle === handleId)
  );
}

function getTargetNode(nodes: FlowNode[], edge: FlowEdge): FlowNode | undefined {
  return nodes.find((n) => n.id === edge.target);
}

function followPath(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  if (visited.has(node.id)) {
    // Convergence or loop: transfer to existing section
    const sectionName = getSectionName(node);
    currentMethods.push({ transfer: { dest: sectionName } });
    return;
  }

  visited.add(node.id);
  const data = node.data as Record<string, unknown>;
  const nodeType = data.type as string;

  // Check if this is a branching node
  const isBranching =
    nodeType === 'gatherInput' ||
    nodeType === 'conditions' ||
    nodeType === 'forwardToPhone' ||
    nodeType === 'request' ||
    nodeType === 'executeSwml';

  if (isBranching) {
    handleBranchingNode(node, nodes, edges, visited, sections, currentMethods);
    return;
  }

  // Linear node: add methods
  const methods = mapNodeToMethods(node);
  currentMethods.push(...methods);

  // Follow the output edge
  const outEdges = getOutEdges(edges, node.id, 'output');
  if (outEdges.length === 0) {
    // Check for edges without specific handle id
    const anyOutEdges = getOutEdges(edges, node.id);
    if (anyOutEdges.length > 0) {
      const nextNode = getTargetNode(nodes, anyOutEdges[0]);
      if (nextNode) {
        followPath(nextNode, nodes, edges, visited, sections, currentMethods);
      }
    }
    return;
  }

  const nextNode = getTargetNode(nodes, outEdges[0]);
  if (nextNode) {
    followPath(nextNode, nodes, edges, visited, sections, currentMethods);
  }
}

function handleBranchingNode(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  const data = node.data as Record<string, unknown>;
  const nodeType = data.type as string;

  switch (nodeType) {
    case 'gatherInput':
      handleGatherInput(node, nodes, edges, visited, sections, currentMethods);
      break;
    case 'conditions':
      handleConditions(node, nodes, edges, visited, sections, currentMethods);
      break;
    case 'forwardToPhone':
      handleForwardToPhone(node, nodes, edges, visited, sections, currentMethods);
      break;
    case 'request':
      handleRequest(node, nodes, edges, visited, sections, currentMethods);
      break;
    case 'executeSwml':
      handleExecuteSwml(node, nodes, edges, visited, sections, currentMethods);
      break;
  }
}

function buildBranchSection(
  targetNode: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections
): string {
  const sectionName = getSectionName(targetNode);
  if (sections[sectionName]) return sectionName; // Already built

  const sectionMethods: Record<string, unknown>[] = [];
  sections[sectionName] = sectionMethods;
  followPath(targetNode, nodes, edges, new Set(visited), sections, sectionMethods);
  return sectionName;
}

function handleGatherInput(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  const d = node.data as unknown as GatherInputData;

  // Add the prompt method
  const methods = mapNodeToMethods(node as FlowNode);
  currentMethods.push(...methods);

  // Build switch cases from options
  const switchCases: Record<string, Record<string, unknown>[]> = {};
  let defaultActions: Record<string, unknown>[] | undefined;

  for (const option of d.options || []) {
    const handleId = `option-${option.id}`;
    const outEdges = getOutEdges(edges, node.id, handleId);
    if (outEdges.length === 0) continue;

    const targetNode = getTargetNode(nodes, outEdges[0]);
    if (!targetNode) continue;

    const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);

    // Add digit case
    if (option.digits) {
      switchCases[option.digits] = [{ transfer: { dest: sectionName } }];
    }
    // Add speech case
    if (option.speech) {
      switchCases[option.speech] = [{ transfer: { dest: sectionName } }];
    }
  }

  // Handle 'noInput' handle
  const noInputEdges = getOutEdges(edges, node.id, 'noInput');
  if (noInputEdges.length > 0) {
    const targetNode = getTargetNode(nodes, noInputEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      defaultActions = [{ transfer: { dest: sectionName } }];
    }
  }

  // Handle 'unknown' handle
  const unknownEdges = getOutEdges(edges, node.id, 'unknown');
  if (unknownEdges.length > 0 && !defaultActions) {
    const targetNode = getTargetNode(nodes, unknownEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      defaultActions = [{ transfer: { dest: sectionName } }];
    }
  }

  if (Object.keys(switchCases).length > 0) {
    const sw: Record<string, unknown> = {
      variable: 'prompt_value',
      case: switchCases,
    };
    if (defaultActions) sw.default = defaultActions;
    currentMethods.push({ switch: sw });
  }
}

function handleConditions(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  const d = node.data as unknown as ConditionsData;
  const condArray: Record<string, unknown>[] = [];

  for (const cond of d.conditions || []) {
    const handleId = `cond-${cond.id}`;
    const outEdges = getOutEdges(edges, node.id, handleId);
    if (outEdges.length === 0) continue;

    const targetNode = getTargetNode(nodes, outEdges[0]);
    if (!targetNode) continue;

    const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
    condArray.push({
      when: cond.when,
      then: [{ transfer: { dest: sectionName } }],
    });
  }

  // Handle else
  const elseEdges = getOutEdges(edges, node.id, 'else');
  if (elseEdges.length > 0) {
    const targetNode = getTargetNode(nodes, elseEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      condArray.push({
        else: [{ transfer: { dest: sectionName } }],
      });
    }
  }

  if (condArray.length > 0) {
    currentMethods.push({ cond: condArray });
  }
}

function handleForwardToPhone(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  // Add connect method
  const methods = mapNodeToMethods(node as FlowNode);
  currentMethods.push(...methods);

  // Build result handling
  const resultHandlers: Record<string, unknown>[] = [];

  const handleMap: Record<string, string> = {
    noAnswer: 'no_answer',
    busy: 'busy',
    declined: 'decline',
    error: 'failed',
  };

  for (const [handleId, failReason] of Object.entries(handleMap)) {
    const outEdges = getOutEdges(edges, node.id, handleId);
    if (outEdges.length === 0) continue;

    const targetNode = getTargetNode(nodes, outEdges[0]);
    if (!targetNode) continue;

    const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
    resultHandlers.push({
      when: `connect_failed_reason == '${failReason}'`,
      then: [{ transfer: { dest: sectionName } }],
    });
  }

  // Handle the connected path
  const connectedEdges = getOutEdges(edges, node.id, 'connected');
  if (connectedEdges.length > 0) {
    const targetNode = getTargetNode(nodes, connectedEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      // After connect succeeds, execution falls through
      currentMethods.push({ transfer: { dest: sectionName } });
    }
  }

  // If there are failure handlers, wrap the connect result
  if (resultHandlers.length > 0) {
    // Modify the last connect to include result
    const lastMethod = currentMethods[currentMethods.length - 1];
    if (lastMethod && 'connect' in lastMethod) {
      // Connect already added, now handle failures after it
      currentMethods.push({ cond: resultHandlers });
    } else {
      currentMethods.push({ cond: resultHandlers });
    }
  }
}

function handleRequest(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  const d = node.data as unknown as RequestData;

  // Add the request method
  const methods = mapNodeToMethods(node as FlowNode);
  currentMethods.push(...methods);

  // Build conditions for result handling
  const condArray: Record<string, unknown>[] = [];

  for (const cond of d.conditions || []) {
    const handleId = `cond-${cond.id}`;
    const outEdges = getOutEdges(edges, node.id, handleId);
    if (outEdges.length === 0) continue;

    const targetNode = getTargetNode(nodes, outEdges[0]);
    if (!targetNode) continue;

    const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
    condArray.push({
      when: cond.when,
      then: [{ transfer: { dest: sectionName } }],
    });
  }

  // Handle else
  const elseEdges = getOutEdges(edges, node.id, 'else');
  if (elseEdges.length > 0) {
    const targetNode = getTargetNode(nodes, elseEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      condArray.push({ else: [{ transfer: { dest: sectionName } }] });
    }
  }

  // Handle failure
  const failureEdges = getOutEdges(edges, node.id, 'failure');
  if (failureEdges.length > 0 && condArray.length === 0) {
    const targetNode = getTargetNode(nodes, failureEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      condArray.push({
        when: "request_result == 'failed'",
        then: [{ transfer: { dest: sectionName } }],
      });
    }
  }

  if (condArray.length > 0) {
    currentMethods.push({ cond: condArray });
  }
}

function handleExecuteSwml(
  node: FlowNode,
  nodes: FlowNode[],
  edges: FlowEdge[],
  visited: Set<string>,
  sections: SWMLSections,
  currentMethods: Record<string, unknown>[]
): void {
  const d = node.data as unknown as ExecuteSwmlData;

  // Add the execute method
  const methods = mapNodeToMethods(node as FlowNode);
  currentMethods.push(...methods);

  // Build conditions for result handling
  const condArray: Record<string, unknown>[] = [];

  for (const cond of d.conditions || []) {
    const handleId = `cond-${cond.id}`;
    const outEdges = getOutEdges(edges, node.id, handleId);
    if (outEdges.length === 0) continue;

    const targetNode = getTargetNode(nodes, outEdges[0]);
    if (!targetNode) continue;

    const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
    condArray.push({
      when: cond.when,
      then: [{ transfer: { dest: sectionName } }],
    });
  }

  // Handle else
  const elseEdges = getOutEdges(edges, node.id, 'else');
  if (elseEdges.length > 0) {
    const targetNode = getTargetNode(nodes, elseEdges[0]);
    if (targetNode) {
      const sectionName = buildBranchSection(targetNode, nodes, edges, visited, sections);
      condArray.push({ else: [{ transfer: { dest: sectionName } }] });
    }
  }

  if (condArray.length > 0) {
    currentMethods.push({ cond: condArray });
  }
}

export function buildSections(
  nodes: FlowNode[],
  edges: FlowEdge[],
  startNode: FlowNode
): SWMLSections {
  // Reset state
  sectionCounter = 0;
  sectionNameMap.clear();

  const sections: SWMLSections = {};
  const mainMethods: Record<string, unknown>[] = [];
  sections.main = mainMethods;

  const visited = new Set<string>();

  // Follow path from start node
  const outEdges = getOutEdges(edges, startNode.id, 'output').length
    ? getOutEdges(edges, startNode.id, 'output')
    : getOutEdges(edges, startNode.id);

  if (outEdges.length > 0) {
    const firstNode = getTargetNode(nodes, outEdges[0]);
    if (firstNode) {
      visited.add(startNode.id);
      followPath(firstNode, nodes, edges, visited, sections, mainMethods);
    }
  }

  return sections;
}
