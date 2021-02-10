FROM hayd/alpine-deno:1.7.2

EXPOSE 8090

WORKDIR /app

USER deno

COPY . .
RUN deno cache server.ts

CMD ["run", "--allow-net", "server.ts"]