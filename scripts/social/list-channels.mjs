/**
 * List connected Buffer channels and their IDs.
 * Use output to set GitHub Secrets: BUFFER_CHANNEL_INSTAGRAM, etc.
 *
 * Usage: BUFFER_API_KEY=xxx node scripts/social/list-channels.mjs
 */

const BUFFER_API = "https://api.buffer.com";

async function main() {
  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) {
    console.error("Set BUFFER_API_KEY environment variable");
    process.exit(1);
  }

  const query = `
    query {
      channels {
        id
        name
        service
        serviceUsername
      }
    }
  `;

  const res = await fetch(BUFFER_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (!res.ok || json.errors) {
    console.error("Error:", json.errors || res.statusText);
    process.exit(1);
  }

  const channels = json.data?.channels ?? [];
  console.log("Connected Buffer channels:\n");

  for (const ch of channels) {
    console.log(`  ${ch.service} (@${ch.serviceUsername || ch.name})`);
    console.log(`    ID: ${ch.id}`);
    console.log(`    Env: BUFFER_CHANNEL_${ch.service.toUpperCase()}=${ch.id}`);
    console.log();
  }

  if (channels.length === 0) {
    console.log("No channels connected. Add them at https://buffer.com");
  }
}

main();
