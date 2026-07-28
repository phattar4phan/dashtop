#!/usr/bin/env bash
set -e

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Dashtop Installer${NC}"
echo

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
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
echo "Host this app locally or remotely?"
select mode in "localhost" "remote"; do
    case $mode in
        localhost)
            read -rp "Port [5173]: " PORT
            PORT="${PORT:-5173}"
            HOST="127.0.0.1"
            break
            ;;
        remote)
            read -rp "URL/IP to bind: " HOST
            read -rp "Port: " PORT
            break
            ;;
    esac
done

DASHTOP_DIR="$HOME/.dashtop"
mkdir -p "$DASHTOP_DIR"

cat > "$DASHTOP_DIR/settings.json" <<EOF
{
    "HOST": "$HOST",
    "PORT": $PORT
}
EOF

if [ "$HOST" = "127.0.0.1" ] || [ "$HOST" = "localhost" ]; then
    if [ ! -d web/node_modules ]; then
        echo "Installing web dependencies..."
        (cd web && npm install --silent)
    fi
    echo "Building web dashboard..."
    (cd web && npm run build --silent)
    cp -r web/dist "$DASHTOP_DIR/dist"
    cat > "$DASHTOP_DIR/dist/package.json" <<PKG
{
    "scripts": {
        "dev": "npx vite preview --port $PORT --host"
    }
}
PKG
fi

chmod +x "$SCRIPT_DIR/install.sh"

echo "Installing systemd user service..."
SERVICE_DIR="$HOME/.config/systemd/user"
mkdir -p "$SERVICE_DIR"
UV_PATH="$(command -v uv)"

sed "s|__WORKDIR__|$SCRIPT_DIR|g; s|__UV__|$UV_PATH|g" \
    "$SCRIPT_DIR/dashtop.service" > "$SERVICE_DIR/dashtop.service"

systemctl --user daemon-reload
systemctl --user enable --now dashtop
loginctl enable-linger "$USER" 2>/dev/null || true
echo "  status: systemctl --user status dashtop"
echo "  logs:   journalctl --user -u dashtop -f"

echo
echo -e "${GREEN}Done.${NC}"
echo "Config: $DASHTOP_DIR/settings.json"
echo "Status: systemctl --user status dashtop"
echo "Run: cd $DASHTOP_DIR/dist && npm run dev"
