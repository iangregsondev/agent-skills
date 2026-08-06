---
name: us-english-spelling-sweep
description: >
  Sweep a repository to US English, sized by blast radius — every finding reported before anything changes, and
  identifier renames and string edits confirmed one at a time.
disable-model-invocation: true
---

# Sweep to US English

The same misspelled word carries a different **blast radius** depending on where it sits, and find-and-replace treats
them all alike — which is how a spelling fix becomes an outage. Every step below sorts findings by that radius.

**Report only.** Nothing changes until it has been confirmed.

## 1. Agree the scope before reading anything

Ask which of these the sweep covers, in ascending blast radius:

- **Prose** — documentation and other free text a reader sees. Nothing downstream depends on it.
- **Comments** — same radius as prose, but inside source files, so the diff lands in code a reviewer must read.
- **Strings** — literal text in source. Safe when it renders to a person; dangerous when it is a key, a stored value,
  or anything matched by something outside this repository.
- **Identifiers** — names of symbols, files, and fields. A rename is a refactor: every reference follows, or it breaks.

A finding outside the agreed scope is still reported — dropping it silently means the next sweep rediscovers it — but
listed as out of scope and not offered for fixing.

**Settled when** the user has named the scope explicitly, rather than it being inferred from how the request was worded.

## 2. Sweep for spelling

Spelling is the mechanical pass and most of the volume, so it goes first — settling it leaves attention for the
judgment calls in step 3.

Work the regular families:

| Family              | Variant → US                                                     |
| ------------------- | ---------------------------------------------------------------- |
| `-ise` / `-isation` | organise → organize, initialisation → initialization             |
| `-yse`              | analyse → analyze                                                |
| `-our`              | colour → color, behaviour → behavior                             |
| `-re`               | centre → center, metre → meter                                   |
| doubled `l`         | cancelled → canceled, modelling → modeling, traveller → traveler |
| `-ogue`             | catalogue → catalog, dialogue → dialog                           |
| `ae` / `oe`         | encyclopaedia → encyclopedia, manoeuvre → maneuver               |

Then the irregulars, which no pattern catches: grey, kerb, tyre, storey, cheque, aluminium, artefact, enquiry, defence,
offence, licence, practise, programme, speciality.

A few belong here despite not being spellings, because the fix is the same move — swap the word, no sentence to read.
_Learnt_, _spelt_ and _burnt_ are variant inflections where US English takes the regular _-ed_. _Whilst_, _amongst_,
_towards_ and _forwards_ are not misspellings at all — US English leans to _while_, _among_, _toward_ and _forward_,
but none of the longer forms is wrong — so report those as a register call rather than a correction.

**Settled when** every family above has been swept across the whole scope, not only the files the user mentioned.

## 3. Then read for grammar, where there is grammar to read

Grammar has no families to search for, so this pass is a read rather than a match, over wording step 2 has settled.

It also covers less of the scope. Grammar exists in text written to be read: documentation, comments, and strings that
render to a person. An identifier has no grammar, and a string that is a key or a stored value is not a sentence
however much it reads like one. Skip those rather than inventing findings there.

Two kinds surface, and they are worth keeping apart:

- **Variant** — the same house-style question as spelling: collective nouns taking a plural verb (_the team are_),
  _different to_ where US English writes _different from_, _got_ where the US past participle is _gotten_,
  day-before-month dates, and punctuation outside a closing quotation mark where US convention puts it inside.
- **Plain error** — agreement, tense drift, a doubled word, a missing article. Not variant issues, but found on the way
  past, and leaving them unmentioned only means the next reader finds them instead.

Style stays out: passive voice, sentence length, comma preference and word choice are opinions about someone's writing
rather than corrections to it, and quietly restyling prose produces a diff nobody can review against what they asked
for. If the writing needs work, say so and let the user ask for that separately.

**Settled when** the readable part of the scope has been read, and every grammar finding is marked variant or plain
error.

## 4. Rule out the false positives before reporting

Over-correction is the failure mode of this skill, and it is invisible in a diff full of legitimate fixes. Each of these
looks like a hit and is not:

- **Words that never take `-ize`** — advertise, advise, arise, chastise, comprise, compromise, despise, devise,
  disguise, enterprise, exercise, franchise, improvise, merchandise, premise, revise, supervise, surprise, televise.
  The `-ise` there is not a suffix.
- **Words that keep `-re` and `-our`** — acre, massacre, mediocre, ogre; contour, detour, velour, glamour.
- **Proper nouns** — organization names, place names, product names, and people's names keep their own spelling
  whatever the house style is. So does anything inside a quotation attributed to someone else.
- **Fixed external text** — license and legal wording, quoted specifications, and anything reproduced verbatim from
  another source is not this repository's prose to correct.
- **Specimens** — a word quoted as an example of itself: a table of variant→US mappings, a style guide, a linter's word
  list, a test fixture, sample output. Correcting a specimen destroys the thing it was demonstrating.
- **Deliberate non-US content** — translation and locale resources, and text written for a non-US audience, are correct
  as they stand. Confirm rather than assume when a file's purpose is unclear.
- **Text this repository does not own** — generated output, vendored copies, and third-party field names arriving from
  elsewhere. Fixing generated text lasts until the next regeneration; fixing a foreign field name breaks the contract.
- **History** — release notes, changelog entries, and commit messages record what was written at the time.

**Settled when** every remaining finding has survived this list, and the ones it removed are still reportable as
considered-and-rejected if the user asks why a word they expected went unmentioned.

## 5. Report

Spelling first, then grammar; within each, one line per finding, widest blast radius last:

```
SPELLING
text     docs/guide.md:14        colour → color
comment  src/parser.ext:88       normalisation → normalization
string   src/ui.ext:31           "Cancelled" → "Canceled"        user-facing label
string   src/api.ext:52          "colour" → "color"              request field — external contract?
code     src/theme.ext:9         defaultColour → defaultColor    7 references across 4 files

GRAMMAR
text     docs/guide.md:22        the team are → the team is      variant
text     README.md:8             different to → different from   variant
comment  src/parser.ext:40       the the parser → the parser     plain error
```

Beyond the kind, location, text and replacement the block shows, give anything past prose what makes it risky: how many
references a rename touches, or what a string appears to be used for. A reviewer approving a rename is approving the
references too, and can only do that with the count in front of them.

State the totals per kind, and list what step 1 put out of scope and what step 4 removed. Then stop.

## 6. Apply only what was confirmed

Confirmation granularity follows blast radius:

- **Prose and comments** confirm as a batch — the diff is the review.
- **Strings** confirm individually. Ask what the string is for whenever the surrounding code does not make it obvious;
  the cost of asking is a question, and the cost of guessing is a value that no longer matches.
- **Identifiers** confirm individually, and each rename lands with every reference in the same change. Find the
  references before proposing the rename, not after: discovering a caller mid-edit means the repository was briefly
  broken and the review is now partial.

Grammar sorts the same way — a rewording inside a string is still a string edit — and adds one split: offer variant and
plain error as separate batches, since wanting the house style without a copy-edit of the prose is a reasonable
position.

Verify with whatever checks the project already defines, and report anything the sweep broke rather than repairing it
silently — a pass that also quietly fixed something else is a pass nobody can review.

**Settled when** every applied change traces to a confirmation, and everything reported but not confirmed is listed as
deliberately left alone.
