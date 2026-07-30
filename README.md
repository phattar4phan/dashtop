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
curl -fsSL https://dashtop.phattar4phan.workers.dev/install.sh | sh
```

Installer prompts for localhost or remote host, installs Python + web deps, builds dashboard, creates systemd service.

If could not resolve or install via cURL, run these commands in order:
```bash
git clone https://github.com/phattar4phan/dashtop
cd dashtop
bash ./install.sh
systemctl --user status dashtop
systemctl --user restart dashtop
```

Then answer the prompt and then:
```bash
cd
cd ~/.dashtop/dist/
npm run dev
```

## Usage

Daemon runs automatically via systemd. Start the web dashboard:

```bash
cd ~/.dashtop/dist && npm run dev
```

Open `http://localhost:{PORT}/dashboard`.

## Get URL
To get the URL after daemon restart or whatever caused it to restart, run:
```bash
cd
bash ~/.dashtop/install.sh
```

Go to the tunnel URL while also remove /dashboard, after reaching it. edit the URL and add /dashboard again.

## Stack

- **Backend** — Python, psutil, WebSockets
- **Frontend** — React, TypeScript, Tailwind CSS, Framer Motion
- **Daemon** — systemd user service

## Config (localhost)

`~/.dashtop/settings.json (example)`:
```json
{
    "HOST": "127.0.0.1",
    "PORT": 5173
}
```

## License

MIT
