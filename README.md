# Visual SWML Call Flow Builder

A drag-and-drop GUI for building SignalWire SWML call flows. Create, connect, and configure SWML method nodes on a visual canvas, then export deployable SWML as YAML or JSON.

## Quick Start

```bash
npm install
npm run dev
```

Opens at http://localhost:3000

## Features

- **16 SWML node types** across 6 categories (Starting, Action, Forwarding, Recording, Input, Decision)
- **Drag-and-drop** nodes from sidebar onto canvas
- **Visual connections** between nodes with branching support
- **Properties panel** for configuring each node's parameters
- **Live SWML preview** in YAML or JSON format
- **Export** — download YAML/JSON or copy to clipboard
- **Sample IVR template** — pre-built IVR flow with sales/support routing and voicemail
- **Zoom, pan, minimap** via React Flow

## Node Types

| Node | Category | SWML Method |
|------|----------|-------------|
| Handle Call | Starting | *(entry point)* |
| Answer Call | Action | `answer` |
| Hang Up Call | Action | `hangup` |
| Play Audio/TTS | Action | `play` |
| Send SMS | Action | `send_sms` |
| Forward to Phone | Forwarding | `connect` |
| Start Recording | Recording | `record_call` |
| Stop Recording | Recording | `stop_record_call` |
| Voicemail Recording | Recording | `record` |
| AI Agent | Input | `ai` |
| Gather Input | Input | `prompt` + `switch` |
| Request | Input | `request` + `cond` |
| Conditions | Decision | `cond` |
| Execute SWML | Decision | `execute` |
| Set Variables | Decision | `set` |
| Unset Variables | Decision | `unset` |

## Tech Stack

- React 18 + Vite + TypeScript
- @xyflow/react (React Flow v12)
- Zustand (state management)
- Tailwind CSS
- js-yaml
- lucide-react (icons)

## Files

| File | Purpose |
|------|---------|
| `sample-ivr-flow.yaml` | Reference SWML output (sample IVR) |
| `call-flow-description.md` | Plain-language flow description |
| `src/` | Application source code |
