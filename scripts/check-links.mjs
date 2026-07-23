import { loadCodes } from "./lib.mjs";

const codes = await loadCodes();
const failures = [];

for (const { code } of codes) {
  const url = `https://www.raycast.com/hey/${code}`;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "erkcet/RayCast link checker" },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    const isReferralPage =
      response.ok &&
      /sent you one month free of Raycast Pro/i.test(body);

    if (!isReferralPage) {
      failures.push(`${code}: HTTP ${response.status}, active referral marker missing`);
      console.error(`✗ ${code}`);
    } else {
      console.log(`✓ ${code}`);
    }
  } catch (error) {
    failures.push(`${code}: ${error.message}`);
    console.error(`✗ ${code}`);
  }
}

if (failures.length > 0) {
  console.error("\nInvalid or unavailable referral links:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`\nChecked ${codes.length} active referral link(s).`);
