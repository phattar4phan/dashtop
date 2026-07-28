#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'
REPO="https://github.com/phattar4phan/dashtop.git"

if [ -f pyproject.toml ] && [ -d web ] && [ -d src ]; then
    SCRIPT_DIR="$(pwd)"
else
    SCRIPT_DIR="$HOME/dashtop"
    if [ -d "$SCRIPT_DIR" ]; then
        echo "Updating existing repo..."
        (cd "$SCRIPT_DIR" && git pull --ff-only)
    else
        echo "Cloning $REPO..."
        git clone "$REPO" "$SCRIPT_DIR"
    fi
fi

cd "$SCRIPT_DIR"

echo "Installing Python dependencies..."
if command -v uv &>/dev/null; then
    uv sync --quiet
elif command -v pip &>/dev/null; then
    pip install -q -e .
else
    echo "Error: uv or pip required (Python 3.12+)"
    exit 1
fi

echo
read -rp "Port [8765]: " PORT </dev/tty
PORT="${PORT:-8765}"
HOST="127.0.0.1"

DASHTOP_DIR="$HOME/.dashtop"
mkdir -p "$DASHTOP_DIR"

cat > "$DASHTOP_DIR/settings.json" <<EOF
{
    "HOST": "$HOST",
    "PORT": $PORT
}
EOF

if [ ! -d web/node_modules ]; then
    echo "Installing web dependencies..."
    (cd web && npm install --silent)
fi
echo "Building web dashboard..."
(cd web && npm run build --silent)
rm -rf "$DASHTOP_DIR/dist"
cp -r web/dist "$DASHTOP_DIR/dist"

echo "Installing systemd user service..."
SERVICE_DIR="$HOME/.config/systemd/user"
mkdir -p "$SERVICE_DIR"
UV_PATH="$(command -v uv)"

sed "s|__WORKDIR__|$SCRIPT_DIR|g; s|__UV__|$UV_PATH|g" \
    "$SCRIPT_DIR/dashtop.service" > "$SERVICE_DIR/dashtop.service"

systemctl --user daemon-reload
systemctl --user enable --now dashtop
loginctl enable-linger "$USER" 2>/dev/null || true

echo
echo -e "${GREEN}Done.${NC}"
echo "Config: $DASHTOP_DIR/settings.json"
echo "Status: systemctl --user status dashtop"
echo "Dashboard: http://$HOST:$PORT/dashboard"
