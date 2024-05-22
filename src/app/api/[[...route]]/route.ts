import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { Result } from "postcss";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type Envconfig = {
  UPSATASH_TOKEN: string;
  UPSATASH_URL: string;
};

app.use("/*", cors());

app.get("/gettoken", async (c) => {
  try {
    console.log("123");

    return c.json("hello word");
  } catch (error) {
    console.log(error);

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

app.get("/search", async (c) => {
  try {
    const { UPSATASH_TOKEN, UPSATASH_URL } = env<Envconfig>(c);

    const start = performance.now();
    const redis = new Redis({ token: UPSATASH_TOKEN, url: UPSATASH_URL });

    const query = c.req.query("q")?.toUpperCase();

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
    console.log(error);

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
