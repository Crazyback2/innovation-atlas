import { generateSPToken } from "./sp-token";

const SP_TOKEN_REGEX =
  /^[abcdefghjkmnpqrstuvwxyz23456789]{4}-[abcdefghjkmnpqrstuvwxyz23456789]{4}-[abcdefghjkmnpqrstuvwxyz23456789]{4}$/;

const tokens = Array.from({ length: 5 }, () => generateSPToken());

console.log("Generated tokens:");
tokens.forEach((token, index) => {
  console.log(`  ${index + 1}. ${token}`);
});

const allMatchFormat = tokens.every((token) => SP_TOKEN_REGEX.test(token));
const allUnique = new Set(tokens).size === tokens.length;

console.log(`\nFormat check: ${allMatchFormat ? "PASS" : "FAIL"}`);
console.log(`Uniqueness check: ${allUnique ? "PASS" : "FAIL"}`);

if (!allMatchFormat || !allUnique) {
  process.exit(1);
}
