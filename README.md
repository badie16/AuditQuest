# AuditQuest ![License](https://img.shields.io/badge/license-MIT-blue) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)

An immersive **ISO 27001 Information Security Audit Training Simulator** built on a multiplayer virtual office environment. Learn audit methodologies, compliance evaluation, and risk assessment in an interactive gamified experience.

Audit Quest System is a comprehensive training platform that combines:
- Interactive audit missions based on ISO 27002 controls
- Real-time collaborative evidence collection
- Compliance evaluation with automated scoring
- Risk assessment with probability-impact matrices
- Professional audit report generation

Perfect for security professionals, auditors, and compliance teams to practice and master ISO 27001 audit procedures in an engaging virtual environment.

## Key Features

- **Audit Mission System**: 12+ ISO 27002 control-based missions with detailed briefings and requirements
- **Evidence Collection**: Multi-type evidence collection (documents, logs, configurations, interviews, observations)
- **Compliance Evaluation**: Three-state compliance assessment with evidence linking and justifications
- **Risk Assessment**: Interactive probability × impact matrix for risk evaluation and remediation tracking
- **Audit Journal**: Real-time activity tracking with 7 types of audit events
- **Performance Scoring**: Automated audit scoring with grade calculation (A-F) and compliance rates
- **Report Generation**: Professional HTML/CSV audit reports with findings summary and risk distribution
- **Collaborative Environment**: Multiplayer support with proximity chat and video conferencing for interviews
- **Screen Sharing**: Built-in screen sharing for system inspection and evidence verification
- **Whiteboard**: Embedded whiteboard for audit discussion and compliance mapping

## Built with

- [Phaser3](https://github.com/photonstorm/phaser) - Game engine for virtual office environment
- [Colyseus](https://github.com/colyseus/colyseus) - WebSocket-based server framework for multiplayer synchronization
- [React/Redux](https://github.com/facebook/react) - Front-end framework for audit UI components
- [PeerJS](https://github.com/peers/peerjs) - WebRTC for video/screen sharing during interviews
- [TypeScript](https://github.com/microsoft/TypeScript) - For type-safe client and server code
- [Material-UI](https://mui.com/) - UI component library for audit forms and dashboards

## How It Works

### Phase 1: Mission Briefing
Receive detailed ISO 27002 control audit missions with specific requirements, evidence needs, and success criteria. Each mission includes control descriptions and compliance expectations.

### Phase 2: Evidence Collection
Navigate the virtual office to collect evidence supporting control compliance. Evidence types include policy documents, system configurations, logs, interview records, and observations. Use proximity chat to interview colleagues about their security practices.

### Phase 3: Compliance Evaluation
Assess each control as compliant, partially compliant, or non-compliant based on collected evidence. Link evidence to findings with detailed justifications.

### Phase 4: Risk Assessment
Evaluate risks associated with non-compliant findings using an interactive probability × impact matrix. Assign remediation recommendations and timelines.

### Phase 5: Report Generation
Generate professional audit reports with compliance summary, findings, risk distribution, and scoring breakdown. Export as HTML or CSV for stakeholders.

## Controls

- `W, A, S, D, or Arrow Keys` - Move around the virtual office
- `E` - Sit/Stand
- `R` - Use computer (for system inspection and screen sharing)
- `Enter` - Open text chat
- `ESC` - Close dialogs
- Click on audit dashboard tabs to navigate between Overview, Missions, Evidence, Findings, Risks, and Journal

## Prerequisites

You'll need the following installed:
- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [Yarn](https://yarnpkg.com/) or npm package manager

## Installation & Setup

Clone this repository to your local machine:

```bash
git clone https://github.com/badie16/AuditQuest.git
cd AuditQuest
```

**Start the Server:**
```bash
yarn && yarn start
```
The server will run on `http://localhost:2567`

**Start the Client (in a new terminal):**
```bash
cd client
yarn && yarn dev
```
The client will run on `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to access the Audit Quest System.

## Project Structure

```
AuditQuest/
├── server/              # Colyseus game server
│   ├── rooms/          # Room and state management
│   │   ├── schema/     # Colyseus schema definitions (including AuditState.ts)
│   │   └── commands/   # Server commands (audit missions, evidence, compliance)
│   └── index.ts        # Server entry point
├── client/             # React/Phaser game client
│   ├── src/
│   │   ├── components/  # React UI components (audit dialogs, panels)
│   │   ├── stores/      # Redux state management (AuditStore.ts)
│   │   ├── utils/       # Utilities (scoring, report generation)
│   │   ├── scenes/      # Phaser game scenes
│   │   └── App.tsx      # Main app component
├── types/              # Shared TypeScript types (AuditTypes.ts)
└── README.md           # This file
```

## Architecture Overview

**Audit System Components:**
- **Server-Side**: Colyseus schema and commands handle audit state synchronization across players
- **Client-Side**: Redux store manages local audit state with React UI components for dashboard, evidence forms, and reports
- **Game Engine**: Phaser 3 renders the virtual office where audits take place
- **Networking**: Colyseus synchronizes audit data in real-time between multiple auditors

## Development Status

Current Implementation:
- Phase 1-7: Core audit system (types, schema, stores, components)
- Phase 8: NPC interviews and dialogue system
- Phase 9: Advanced scoring and achievements
- Phase 10: Mobile support and optimization

## Credits

Built on the excellent SkyOffice virtual office framework:
- Original SkyOffice - [SkyOffice Repository](https://github.com/kevinshen56714/SkyOffice)
- Phaser3 game engine - [Phaser](https://github.com/photonstorm/phaser)
- Colyseus framework - [Colyseus](https://github.com/colyseus/colyseus)
- Pixel art assets - [LimeZu](https://limezu.itch.io/)
- Whiteboard - [WBO](https://github.com/lovasoa/whitebophir)

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
