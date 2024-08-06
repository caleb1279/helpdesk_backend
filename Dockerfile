FROM denoland/deno:latest
WORKDIR .
COPY . .
EXPOSE ${PORT}
cmd ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "index.ts"]