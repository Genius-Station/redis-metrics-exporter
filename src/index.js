const { createClient } = require("redis");
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const { match } = require("assert");

dotenv.config({ path: "./.env" });
const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}` });

let rawdata = fs.readFileSync("./config.json");
let config = JSON.parse(rawdata);

const app = express();

const getKeysInstructionFromMathing = (matching) => {
  return matching.replace(/\{[^:]+\}/g, "*");
};

const getParamsFromKey = (matching, key) => {
  let re = new RegExp(matching.replace(/\{([^:]+)\}/, "(?<$1>[^:]+)"));
  let groups = re.exec(key).groups;
  let params = "";
  for (const group in groups) {
    params += `${group}="${groups[group]}"`;
  }
  return `{${params}}`;
};

app.get("/metrics", async (_, res) => {
  const data = config.metrics.map(async (metric) => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    const keys = await redisClient.keys(
      getKeysInstructionFromMathing(metric.matching)
    );

    const values = (
      await Promise.all(
        keys.map(async (key) => {
          const value = await redisClient.get(key);

          const params = getParamsFromKey(metric.matching, key);

          return `${metric.name}${params} ${value}`;
        })
      )
    ).join("\n");

    return `# HELP ${metric.name} ${metric.description}\n# TYPE ${metric.name} ${metric.type}\n${values}`;
  });
  res.contentType("text/plain").send((await Promise.all(data)).join("\n"));
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
