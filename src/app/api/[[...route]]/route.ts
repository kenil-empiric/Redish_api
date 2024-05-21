import { Redis } from "@upstash/redis";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { handle } from "hono/vercel";
import { Result } from "postcss";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type Envconfig = {
  UPSATASH_TOKEN: string;
  UPSATASH_URL: string;
};

app.get("/search", async (c) => {
  try {
    const { UPSATASH_TOKEN, UPSATASH_URL } = env<Envconfig>(c);
    const start = performance.now();
    const redis = new Redis({ token: UPSATASH_TOKEN, url: UPSATASH_URL });

    const query = c.req.query("q");

    if (!query) {
      return c.json({ message: "Invalid search query" }, { status: 400 });
    }

    const res = [];
    const rank = await redis.zrank("terms", query);

    if (rank != null && rank !== undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 200);

      for (const el of temp) {
        if (!el.startsWith(query)) {
          break;
        }

        if (el.endsWith("*")) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }

    const end = performance.now();

    return c.json({
      results: res,
      duration: end - start,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        results: [],
        message: " Somthing went to wrong",
      },
      {
        status: 500,
      }
    );
  }
});

export const GET = handle(app);
// export const POST = handle(app)
export default app as never;