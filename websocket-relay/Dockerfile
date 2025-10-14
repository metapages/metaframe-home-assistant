FROM node:24-alpine3.22

RUN apk --no-cache --update add \
    bash \
    curl

# Needs edge repo
RUN apk add --no-cache -X http://dl-cdn.alpinelinux.org/alpine/edge/community \
    sd just watchexec
# just tweak: unify the just binary location on host and container platforms because otherwise the shebang doesn't work properly due to no string token parsing (it gets one giant string)
ENV PATH=$PATH:/usr/local/bin
# alias "j" to just, it's just right there index finger
RUN printf '#!/bin/bash\njust "$@"' > /usr/bin/j && \
    chmod +x /usr/bin/j
ENV JUST_SUPPRESS_DOTENV_LOAD_WARNING=1

# Newer version of npm
RUN npm i -g npm@11.2.0

# /repo is also hard-coded in the justfile
WORKDIR /repo
# Install cached modules
COPY package.json ./
COPY package-lock.json ./
RUN npm i

COPY index.js ./
COPY justfile ./

CMD [ "just", "dev"]
