import { readFile, writeFile } from "node:fs/promises";
import { loadCodes } from "./lib.mjs";

const README_FILE = new URL("../README.md", import.meta.url);
const codes = await loadCodes();
const rows =
  codes.length > 0
    ? codes
        .map(
          ({ code, addedAt }, index) =>
            `| ${index + 1} | \`${code}\` | [Claim 30 days free](https://www.raycast.com/hey/${code}) | ${addedAt} |`,
        )
        .join("\n")
    : "| — | — | No active codes right now | — |";

const content = `# Raycast Pro referral codes

Active, one-time Raycast Pro referral codes. A successful referral gives a new user a 30-day Pro trial.

## Active codes

| # | Code | Link | Added |
|---:|---|---|---|
${rows}

Each code can be claimed once. If a link no longer works, please [open an issue](https://github.com/erkcet/RayCast/issues/new).

## What the trial includes

- Raycast AI
- Cloud Sync
- Custom Themes
- Other Raycast Pro features

## Maintaining this list

\`data/codes.json\` is the source of truth. To add or remove a code:

1. Edit \`data/codes.json\`.
2. Run \`npm run readme\`.
3. Run \`npm test\`.
4. Commit both the data and generated README.

GitHub Actions checks data and README consistency on every change. A daily scheduled check also verifies that each listed URL still serves a Raycast referral page.

## Referral disclosure

Raycast states that the person sharing a code may receive a $10 account credit if the referred user finishes the trial and becomes an active Pro subscriber.

## About Raycast

[Raycast](https://www.raycast.com) is a productivity launcher for macOS and Windows. Learn more on the [Raycast Pro page](https://www.raycast.com/pro).
`;

if (process.argv.includes("--check")) {
  const current = await readFile(README_FILE, "utf8");

  if (current !== content) {
    console.error("README.md is out of date. Run: npm run readme");
    process.exit(1);
  }

  console.log("README.md is up to date.");
} else {
  await writeFile(README_FILE, content);
  console.log(`README.md updated with ${codes.length} active code(s).`);
}
