import { Filter } from "bad-words";

/**
 * A profanity check for the text people publish here.
 *
 * It is a deterrent, not a wall. The matcher works on whole words, so it is
 * trivially evaded — `fuuuck` and `$hit` both pass — and anything that gets
 * through is still the moderation queue's problem. What it does buy is that
 * nobody publishes an obscenity into a title by accident, and that the person
 * who tries is told at the keyboard instead of after the fact.
 *
 * Whole-word matching is also what makes it safe here: `analysis`,
 * `assessment`, `class` and `password` are left alone, so the Scunthorpe
 * problem does not bite a platform whose vocabulary is full of them.
 */

/**
 * Words the default list blocks that this platform has to allow.
 *
 * Two kinds. Some are ordinary technical vocabulary — a *god object* is a real
 * design smell, a *knob* is a UI control, code gets *screwed* up — and
 * blocking them would refuse legitimate writing about software. The rest is
 * mild frustration: someone reporting that an endpoint is *crap* or asking
 * what the *hell* a stack trace means is not abusing anyone, and a bug tracker
 * that refuses the sentence reads as prissy rather than safe.
 *
 * Everything genuinely abusive — slurs, obscenity, sexual language — stays on
 * the list.
 */
const ALLOWED_WORDS = [
  "god",
  "hell",
  "damn",
  "damned",
  "crap",
  "bloody",
  "screw",
  "screwed",
  "screwing",
  "knob",
  "balls",
  "prick",
  "tit",
  "tits",
  "willy",
  "willies",
  "bugger",
  "sod",
  "piss",
  "pissed",
];

/* One instance for the process. Building a `Filter` compiles a list of nearly
   900 words, and both the browser bundle and the API routes hit this on every
   keystroke-triggered validation. */
let filter: Filter | null = null;

function profanityFilter(): Filter {
  if (!filter) {
    filter = new Filter();
    filter.removeWords(...ALLOWED_WORDS);
  }
  return filter;
}

/**
 * The offending words in a piece of text, in the order they appear.
 *
 * Returned rather than a bare boolean so the message can name them — "remove
 * the word X" is something a writer can act on, where "contains profanity"
 * sends them hunting through their own paragraph.
 */
export function findProfanity(value: string | null | undefined): string[] {
  if (!value) return [];

  const instance = profanityFilter();
  const seen = new Set<string>();

  /* Split the way the filter matches: on anything that is not part of a word.
     Testing the whole string would only answer yes or no. */
  for (const word of value.split(/[^\p{L}\p{N}'*]+/u)) {
    if (!word) continue;
    if (instance.isProfane(word) && !seen.has(word.toLowerCase())) {
      seen.add(word.toLowerCase());
    }
  }

  return [...seen];
}

export function containsProfanity(value: string | null | undefined): boolean {
  return Boolean(value) && profanityFilter().isProfane(value as string);
}

/**
 * Zod predicate. Non-strings pass, so it can be dropped onto an optional field
 * without having to guard the undefined case at every call site.
 */
export function isCleanText(value: unknown): boolean {
  return typeof value !== "string" || !containsProfanity(value);
}

/**
 * Zod `refine` params that name the offending words back to the writer.
 *
 * Built as params rather than a plain string so the message can be composed
 * from the value being rejected — "remove the word X" is something a writer
 * can act on, where "contains profanity" sends them hunting through their own
 * paragraph. At most three are listed; past that the point is made.
 */
export function profanityMessage(label: string) {
  return {
    error: (issue: { input: unknown }) => {
      const found =
        typeof issue.input === "string" ? findProfanity(issue.input) : [];
      const listed = found.slice(0, 3).join(", ");

      return listed
        ? `${label} contains language that is not allowed here: ${listed}. Please reword it.`
        : `${label} contains language that is not allowed here. Please reword it.`;
    },
  };
}
