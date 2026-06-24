/**
 * MdPDev — Buffer API publisher
 *
 * Reads scripts/social/content-queue.json and publishes scheduled posts
 * via Buffer GraphQL API (free tier: 3 channels, 3000 req/month).
 *
 * Env:
 *   BUFFER_API_KEY — API key from Buffer settings
 *   BUFFER_CHANNEL_INSTAGRAM — channel ID (optional, mapped from "instagram")
 *   BUFFER_CHANNEL_X — channel ID
 *   BUFFER_CHANNEL_LINKEDIN — channel ID
 *
 * Usage:
 *   node scripts/social/buffer-publish.mjs
 *   node scripts/social/buffer-publish.mjs --dry-run
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUEUE_PATH = join(__dirname, "content-queue.json");
const BUFFER_API = "https://api.buffer.com";

const CHANNEL_ENV_MAP = {
  instagram: "BUFFER_CHANNEL_INSTAGRAM",
  x: "BUFFER_CHANNEL_X",
  twitter: "BUFFER_CHANNEL_X",
  linkedin: "BUFFER_CHANNEL_LINKEDIN",
};

const dryRun = process.argv.includes("--dry-run");

function loadQueue() {
  const raw = readFileSync(QUEUE_PATH, "utf8");
  return JSON.parse(raw);
}

function saveQueue(queue) {
  writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + "\n", "utf8");
}

function resolveChannelId(channel) {
  const key = CHANNEL_ENV_MAP[channel.toLowerCase()];
  if (!key) throw new Error(`Unknown channel: ${channel}`);
  const id = process.env[key];
  if (!id) throw new Error(`Missing env ${key} for channel ${channel}`);
  return id;
}

async function bufferRequest(query, variables) {
  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) throw new Error("BUFFER_API_KEY is not set");

  const res = await fetch(BUFFER_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    const msg = json.errors?.map((e) => e.message).join("; ") || res.statusText;
    throw new Error(`Buffer API error: ${msg}`);
  }
  return json.data;
}

async function createPost(channelId, text, imageUrl, scheduledAt) {
  const mutation = `
    mutation CreatePost($input: CreatePostInput!) {
      createPost(input: $input) {
        ... on PostActionSuccess {
          post { id }
        }
        ... on MutationError {
          message
        }
      }
    }
  `;

  const input = {
    channelId,
    text,
    mode: scheduledAt ? "customScheduled" : "addToQueue",
    schedulingType: "automatic",
  };

  if (imageUrl) {
    input.media = [{ link: imageUrl }];
  }

  if (scheduledAt) {
    input.scheduledAt = scheduledAt;
  }

  const data = await bufferRequest(mutation, { input });
  const result = data.createPost;

  if (result?.message) {
    throw new Error(result.message);
  }

  return result?.post?.id;
}

async function main() {
  const queue = loadQueue();
  const now = new Date();
  let published = 0;

  for (const post of queue.posts) {
    if (post.status === "published" || post.status === "cancelled") continue;

    const scheduled = new Date(post.scheduledAt);
    if (scheduled > now) continue;

    const channelId = post.channelId || resolveChannelId(post.channel);

    console.log(`[${post.id}] ${post.channel} — ${post.text.slice(0, 60)}...`);

    if (dryRun) {
      console.log("  (dry-run — skipped)");
      continue;
    }

    try {
      const bufferPostId = await createPost(
        channelId,
        post.text,
        post.imageUrl || null,
        post.scheduledAt,
      );
      post.status = "published";
      post.publishedAt = now.toISOString();
      post.bufferPostId = bufferPostId;
      published++;
      console.log(`  → published (Buffer ID: ${bufferPostId})`);
    } catch (err) {
      post.status = "failed";
      post.error = err.message;
      post.failedAt = now.toISOString();
      console.error(`  → FAILED: ${err.message}`);
    }
  }

  if (!dryRun && published > 0) {
    saveQueue(queue);
  }

  console.log(`Done. Published: ${published}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
