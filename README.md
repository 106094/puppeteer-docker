# Puppeteer in Docker (portable)

Chromium + Puppeteer inside Docker, with sane defaults for server/CI and Chromebooks.

# Puppeteer in Docker

Portable Puppeteer + Chromium that saves a **screenshot** and the page’s **text**.

## What this does
- Launches Chromium in a container.
- Visits `TARGET_URL` (default: Google).
- Writes a screenshot and `content.txt` into an **output** directory.

## Prereqs
- **Docker** installed.
- **You do _not_ need Node or npm on the host** for Docker usage.

## Do I need `npm install puppeteer`?
**No for this repo as-is.**  
The Dockerfile uses `ghcr.io/puppeteer/puppeteer:22`, which already includes Puppeteer and all browser deps preinstalled under `/home/pptruser/node_modules`. No extra modules are required.

**Yes only if you change things**, for example:
- You switch to a different base (e.g., plain `node:20`).
- You add more npm dependencies to `package.json`.

In those cases, update `package.json` and modify the Dockerfile to run:
```dockerfile
COPY package.json package-lock.json* ./
RUN npm ci || npm i

## Quick run (no build; once you publish an image)
```bash
mkdir -p output

docker run --rm --shm-size=1g \
  -u "$(id -u):$(id -g)" \
  -e PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome \
  -e TARGET_URL="chrome://version" \
  -e OUTPUT_DIR="/output" \
  -v "$PWD/output:/output" \
  my-pptr

If that path isn’t present in your image, use one of these instead:
/usr/bin/chromium
/usr/bin/chromium-browser
You can check what exists:
docker run --rm my-pptr sh -lc 'which google-chrome || which chromium || which chromium-browser'

