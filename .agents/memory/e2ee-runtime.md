---
name: E2EE runtime compatibility
description: Node runtime requirement for the ST-FCA E2EE bridge in this project.
---

The ST-FCA E2EE bridge depends on an `undici` release that requires Node 22.19 or newer.

**Why:** On older Node versions the bridge fails before encrypted messaging starts with a WebIDL compatibility error.

**How to apply:** Keep deployment/runtime metadata on Node 22.19+ whenever E2EE is enabled; verify both E2EE-ready and MQTT-connected startup logs after runtime changes.