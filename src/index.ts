import buildApp from "./app";

async function server() {
  const app = await buildApp();
  try {
    app.listen({ port: 5000 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

server();
