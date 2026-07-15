#!/usr/bin/env node
/**
 * Seed delle risposte SP in sp_responses.
 *
 * Uso:
 *   1) Metti questo file e i JSON (cubit_responses.json, ecc.) in scripts/seed/ del progetto.
 *   2) Esporta le variabili d'ambiente (NON committarle):
 *        export SUPABASE_URL="https://xxxx.supabase.co"
 *        export SUPABASE_SERVICE_ROLE_KEY="....."   # service role, solo locale
 *   3) DRY RUN (non scrive nulla, stampa cosa farebbe):
 *        node scripts/seed/seed-sp-responses.mjs --token BJXZ-GTMX-775Q --file cubit_responses.json --dry
 *   4) INSERT vero (togli --dry):
 *        node scripts/seed/seed-sp-responses.mjs --token BJXZ-GTMX-775Q --file cubit_responses.json
 *
 * Lo script:
 *   - risolve il public_token nel survey_id (query su sp_surveys)
 *   - legge le risposte dal JSON
 *   - inserisce in sp_responses { survey_id, answers, respondent_fingerprint: null }
 *   - rifiuta di procedere se la survey ha gia' risposte (evita doppioni), a meno di --force
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { argv, env, exit } from "node:process";

// --- parse argomenti minimali ---
function arg(name) {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
}
const hasFlag = (name) => argv.includes(`--${name}`);

const token = arg("token");
const file = arg("file");
const dry = hasFlag("dry");
const force = hasFlag("force");

if (!token || !file) {
  console.error("Mancano argomenti. Uso: --token <PUBLIC_TOKEN> --file <responses.json> [--dry] [--force]");
  exit(1);
}

const SUPABASE_URL = env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Mancano SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY nell'ambiente.");
  exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

// il token nel link e' minuscolo (bjxz-gtmx-775q) ma in DB potrebbe essere
// maiuscolo (BJXZ-GTMX-775Q). Provo prima com'e', poi upper, poi lower.
async function resolveSurvey(tok) {
  const candidates = [tok, tok.toUpperCase(), tok.toLowerCase()];
  for (const c of candidates) {
    const { data, error } = await supabase
      .from("sp_surveys")
      .select("id, public_token, concept_id")
      .eq("public_token", c)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }
  return null;
}

async function main() {
  const responses = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(responses) || responses.length === 0) {
    console.error("Il file JSON non contiene un array di risposte.");
    exit(1);
  }

  const survey = await resolveSurvey(token);
  if (!survey) {
    console.error(`Nessuna survey trovata per token "${token}". Controlla il token.`);
    exit(1);
  }
  console.log(`Survey trovata: id=${survey.id} concept_id=${survey.concept_id} token=${survey.public_token}`);

  // conta risposte esistenti per evitare doppioni
  const { count, error: cErr } = await supabase
    .from("sp_responses")
    .select("*", { count: "exact", head: true })
    .eq("survey_id", survey.id);
  if (cErr) throw cErr;

  if ((count ?? 0) > 0 && !force) {
    console.error(`La survey ha gia' ${count} risposte. Interrompo per non creare doppioni. Usa --force se sei sicuro.`);
    exit(1);
  }

  const rows = responses.map((answers) => ({
    survey_id: survey.id,
    answers,
    respondent_fingerprint: null,
  }));

  console.log(`Righe da inserire: ${rows.length}`);
  console.log("Esempio prima riga:", JSON.stringify(rows[0]));

  if (dry) {
    console.log("\n[DRY RUN] Nessuna scrittura effettuata. Rimuovi --dry per inserire davvero.");
    return;
  }

  const { data, error } = await supabase.from("sp_responses").insert(rows).select("id");
  if (error) throw error;
  console.log(`\nInserite ${data.length} risposte in sp_responses per survey ${survey.id}.`);
}

main().catch((e) => {
  console.error("Errore:", e.message ?? e);
  exit(1);
});
