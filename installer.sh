#!/bin/bash

set -e

# ============================================================================
# Minecraft Bedrock Bot Installer
# ============================================================================

# -----------------------------------------------------------------------------
# Constants
# -----------------------------------------------------------------------------
readonly SCRIPT_NAME="Minecraft Bedrock Bot Installer"
readonly NODE_MIN_VERSION=24
readonly NVM_INSTALL_VERSION="v0.40.3"
readonly REPO_URL="https://github.com/cloudy-network/bedrock-bot.git"

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Paths
readonly ACTUAL_USER="$USER"
readonly ACTUAL_HOME="$HOME"
readonly BOT_DIR="$ACTUAL_HOME/bedrock-bot"
NVM_DIR="$ACTUAL_HOME/.nvm"

# -----------------------------------------------------------------------------
# Output Functions
# -----------------------------------------------------------------------------
print_header() {
    echo ""
    echo "=========================================="
    echo "$1"
    echo "=========================================="
    echo ""
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

print_debug() {
    if [ "${DEBUG_MODE:-false}" = true ]; then
        echo -e "${BLUE}[DEBUG]${NC} $1"
    fi
}

# -----------------------------------------------------------------------------
# Error Handling
# -----------------------------------------------------------------------------
error_exit() {
    print_error "$1"
    exit "${2:-1}"
}

# -----------------------------------------------------------------------------
# Validation Functions
# -----------------------------------------------------------------------------
check_sudo() {
    if ! command -v sudo &> /dev/null; then
        error_exit "sudo is not installed. Please install sudo first."
    fi
}

validate_config_inputs() {
    local gamertag="$1"
    local host="$2"
    local port="$3"
    
    if [ -z "$gamertag" ] || [ -z "$host" ] || [ -z "$port" ]; then
        error_exit "Gamertag, Host, and Port are required!"
    fi
    
    if ! [[ "$port" =~ ^[0-9]+$ ]]; then
        error_exit "Port must be a number!"
    fi
}

# -----------------------------------------------------------------------------
# NVM Functions
# -----------------------------------------------------------------------------
load_nvm() {
    export NVM_DIR="$NVM_DIR"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
}

get_node_version() {
    if command -v node &> /dev/null; then
        node -v | cut -d'v' -f2 | cut -d'.' -f1
    else
        echo "0"
    fi
}

check_node_version() {
    local version
    version=$(get_node_version)
    
    if [ "$version" -ge "$NODE_MIN_VERSION" ]; then
        return 0
    else
        return 1
    fi
}

is_node_installed() {
    # Check NVM installation
    if [ -d "$NVM_DIR" ]; then
        load_nvm
        if check_node_version; then
            print_success "Node.js $(node -v) already installed (meets minimum requirement ${NODE_MIN_VERSION}+)"
            return 0
        fi
    fi
    
    # Check system-wide Node.js
    if command -v node &> /dev/null && check_node_version; then
        print_success "Node.js $(node -v) already installed (meets minimum requirement ${NODE_MIN_VERSION}+)"
        return 0
    fi
    
    return 1
}

install_nvm() {
    print_info "Installing NVM ${NVM_INSTALL_VERSION}..."
    curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_INSTALL_VERSION}/install.sh" | bash
    load_nvm
}

install_nodejs() {
    print_info "Installing Node.js ${NODE_MIN_VERSION}..."
    nvm install "$NODE_MIN_VERSION"
    nvm use "$NODE_MIN_VERSION"
    nvm alias default "$NODE_MIN_VERSION"
    npm i -g npm@latest
    print_success "Node.js ${NODE_MIN_VERSION} installed"
}

add_nvm_to_profiles() {
    local profile
    local profiles=("$ACTUAL_HOME/.bashrc" "$ACTUAL_HOME/.bash_profile" "$ACTUAL_HOME/.zshrc")
    
    for profile in "${profiles[@]}"; do
        if [ -f "$profile" ] && ! grep -q 'NVM_DIR' "$profile"; then
            print_info "Adding NVM to $profile"
            cat >> "$profile" << 'EOF'

# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
        fi
    done
}

# -----------------------------------------------------------------------------
# Installation Functions
# -----------------------------------------------------------------------------
install_system_dependencies() {
    print_info "Installing system dependencies (requires sudo)..."
    sudo apt update
    sudo apt upgrade -y
    sudo apt install -y nano build-essential cmake make git
    print_success "System dependencies installed"
}

setup_nodejs() {
    print_info "Checking Node.js version..."
    
    if is_node_installed; then
        # Ensure NVM is loaded if it exists
        [ -d "$NVM_DIR" ] && load_nvm
        return 0
    fi
    
    install_nvm
    install_nodejs
    add_nvm_to_profiles
}

verify_nodejs() {
    print_info "Verifying Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        error_exit "Node.js installation failed or not in PATH"
    fi
    
    if ! command -v npm &> /dev/null; then
        error_exit "npm installation failed or not in PATH"
    fi
    
    print_success "Node.js $(node -v) and npm $(npm -v) are available"
}

clone_repository() {
    print_info "Cloning bedrock-bot repository..."
    cd "$ACTUAL_HOME"
    
    if [ -d "bedrock-bot" ]; then
        print_info "Removing existing bedrock-bot directory..."
        rm -rf bedrock-bot
    fi
    
    git clone "$REPO_URL"
    print_success "Repository cloned"
}

# -----------------------------------------------------------------------------
# Configuration Functions
# -----------------------------------------------------------------------------
prompt_user_config() {
    
    local gamertag host port offline debug
    
    read -p "Enter Bot Gamertag (e.g., Wverrr): " gamertag < /dev/tty
    read -p "Enter Server Host (e.g., laughtale.my.id): " host < /dev/tty
    read -p "Enter Server Port (e.g., 2411): " port < /dev/tty
    read -p "Enable Offline Mode? (true/false, default: false): " offline < /dev/tty
    read -p "Enable Debug Mode? (true/false, default: false): " debug < /dev/tty
    
    # Set defaults
    offline="${offline:-false}"
    debug="${debug:-false}"
    
    # Validate
    validate_config_inputs "$gamertag" "$host" "$port"
    
    # Return values via global variables (or use an associative array if bash 4+)
    CONFIG_GAMERTAG="$gamertag"
    CONFIG_HOST="$host"
    CONFIG_PORT="$port"
    CONFIG_OFFLINE="$offline"
    CONFIG_DEBUG="$debug"
}

create_config_file() {
    print_info "Creating config.json..."
    
    cat > "$BOT_DIR/config.json" << EOL
{ 
  "host":"$CONFIG_HOST",
  "port":$CONFIG_PORT,
  "gamertag":"$CONFIG_GAMERTAG",
  "reconnect":10,
  "offline":$CONFIG_OFFLINE,
  "debug":$CONFIG_DEBUG
}
EOL
    
    print_success "Configuration file created"
}

install_npm_dependencies() {
    print_info "Installing npm dependencies..."
    cd "$BOT_DIR"
    
    # Ensure NVM is loaded
    load_nvm
    
    # Verify npm is available
    if ! command -v npm &> /dev/null; then
        error_exit "npm not found! Please restart your terminal and run 'source ~/.bashrc' or 'source ~/.zshrc'"
    fi
    
    npm install
    
    # Verify installation
    if [ ! -d "$BOT_DIR/node_modules" ]; then
        error_exit "node_modules directory was not created!"
    fi
    
    print_success "npm dependencies installed"
}

# -----------------------------------------------------------------------------
# Main Installation Flow
# -----------------------------------------------------------------------------
print_installation_complete() {
    print_header "Installation Complete!"
    
    echo "Next steps:"
    echo "1. source ~/.bashrc   (or restart terminal)"
    echo "2. cd $BOT_DIR"
    echo "3. npm start          (start the bot)"
    echo ""
    print_info "Configuration saved in config.json"
    print_info "You can edit config.json to change settings later"
}

main() {
    print_header "$SCRIPT_NAME"
    
    # Pre-flight checks
    check_sudo

    # Setup Config
    prompt_user_config
    
    # Installation steps
    install_system_dependencies
    setup_nodejs
    verify_nodejs
    clone_repository
    
    # Create
    create_config_file
    
    # Finalize
    install_npm_dependencies
    print_installation_complete
}

# -----------------------------------------------------------------------------
# Script Entry Point
# -----------------------------------------------------------------------------
main "$@"
