FROM node:22-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    openssh-server \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

EXPOSE 3000