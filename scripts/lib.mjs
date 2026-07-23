import { readFile } from "node:fs/promises";

export const CODES_FILE = new URL("../data/codes.json", import.meta.url);

export async function loadCodes() {
  const data = JSON.parse(await readFile(CODES_FILE, "utf8"));

  if (!data || !Array.isArray(data.codes)) {
    throw new Error("data/codes.json must contain a codes array");
  }

  const seen = new Set();

  return data.codes.map((entry, index) => {
    if (!entry || typeof entry !== "object") {
      throw new Error(`codes[${index}] must be an object`);
    }

    const { code, addedAt } = entry;

    if (typeof code !== "string" || !/^[a-z0-9]{8}$/i.test(code)) {
      throw new Error(`codes[${index}].code must be an 8-character code`);
    }

    if (seen.has(code.toLowerCase())) {
      throw new Error(`Duplicate code: ${code}`);
    }
    seen.add(code.toLowerCase());

    if (
      typeof addedAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(addedAt) ||
      Number.isNaN(Date.parse(`${addedAt}T00:00:00Z`))
    ) {
      throw new Error(`codes[${index}].addedAt must be a valid YYYY-MM-DD date`);
    }

    return { code, addedAt };
  });
}
