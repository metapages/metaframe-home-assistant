set shell                     := ["bash", "-c"]
set dotenv-load               := true
set export                    := true
PORT_HOME_ASSISTANT           := env_var_or_default("PORT_HOME_ASSISTANT", "8123")
ADDRESS_HOME_ASSISTANT        := env_var_or_default("ADDRESS_HOME_ASSISTANT", "localhost")
# minimal formatting, bold is very useful
bold                          := '\033[1m'
normal                        := '\033[0m'
green                         := "\\e[32m"
yellow                        := "\\e[33m"
blue                          := "\\e[34m"
magenta                       := "\\e[35m"
grey                          := "\\e[90m"

# If not in docker, 🚪 get inside 🚪
_help:
    #!/usr/bin/env bash
    echo -e ""
    just --list --unsorted --list-heading $'🏡 home-assistant 🔗 {{green}}https://www.home-assistant.io/{{normal}}:\n\n'
    echo -e ""

# Start the home-assistant server, mounting in local config
dev:
    docker compose build && docker compose up

# Start the home-assistant server, mounting in local config
run:
    docker compose build && docker compose up -d

# Stop and remove the home-assistant stack
down:
    docker compose down

# Open home-assistant in browser
console:
    open http://{{ADDRESS_HOME_ASSISTANT}}:{{PORT_HOME_ASSISTANT}}
