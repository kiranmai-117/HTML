import { handleConnection } from "../server.js";

const main = async () => {
  const listener = Deno.listen({ port: 8000 });
  
  for await (const conn of listener) {
    handleConnection(conn);
  }
}

await main();