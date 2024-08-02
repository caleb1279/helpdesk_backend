FROM denoland/deno:latest

WORKDIR .

COPY . .

EXPOSE 8080

cmd ["deno", "run", "--allow-net", "--allow-read", "--allow-write", "index.ts"]

