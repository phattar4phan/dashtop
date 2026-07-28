# Dashtop

Real-time hardware monitoring dashboard for the modern web.

## Features

- **GPU** — utilization, VRAM usage/total, temperature
- **CPU** — utilization, frequency, per-core frequency, temperature
- **Disk I/O** — read/write throughput
- **Network** — send/receive throughput
- **Sensors** — hardware temperature sensors (k10temp, acpitz, spd5118, etc.)

## Install

```bash
curl -fsSL https://dashtop.phattar4phan.workers.app/install.sh | sh
```

Installer prompts for localhost or remote host, installs Python + web deps, builds dashboard, creates systemd service.

## Usage

Daemon runs automatically via systemd. Start the web dashboard:

```bash
cd ~/.dashtop/dist && npm run dev
```

Open `http://localhost:{PORT}/dashboard`.

## Stack

- **Backend** — Python, psutil, WebSockets
- **Frontend** — React, TypeScript, Tailwind CSS, Framer Motion
- **Daemon** — systemd user service

## Config (localhost)

`~/.dashtop/settings.json`:
```json
{
    "HOST": "127.0.0.1",
    "PORT": 5173
}
```

## License

MIT
