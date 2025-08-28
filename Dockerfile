# Small, predictable base with Chromium + deps + pptr already installed
FROM ghcr.io/puppeteer/puppeteer:22

# Use non-root user provided by the image
USER pptruser

# Let Node resolve the bundled puppeteer in /home/pptruser/node_modules
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
ENV NODE_PATH=/home/pptruser/node_modules

# App lives here
WORKDIR /home/pptruser/app

# Copy app files
COPY --chown=pptruser:pptruser . .

# Optional: install CJK fonts for crisp 中文/日本語 text
# RUN sudo apt-get update && sudo apt-get install -y fonts-noto-cjk && sudo rm -rf /var/lib/apt/lists/*

CMD ["node", "my_script.mjs"]

