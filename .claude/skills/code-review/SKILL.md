---
name: code-review
description: Review a branch of this repository against origin/main for bugs, security problems and breaks of CLAUDE.md and .claude/rules. Takes the branch name as its first argument and never asks questions.
---

# Code review

Review the branch named by the first word of the arguments: $ARGUMENTS

1. Read what the branch changes against the main branch as GitHub has it: `git log --oneline origin/main..<branch>`, then `git diff origin/main...<branch>`. The local `main` may be old; do not compare with it.
2. When the branch has a pull request, `gh pr view <branch>` gives its description and `gh pr diff <branch>` its diff. When it has none, the git diff is enough: do not stop for that.
3. Look for bugs, security problems, and breaks of the rules in CLAUDE.md and .claude/rules/. Leave style and formatting alone.
4. Report only findings you are sure about: for each, the file and line, the problem, and why it matters. Say plainly when you found nothing.

Rules:

- Run only `git diff`, `git log`, `gh pr view` and `gh pr diff`, one command at a time, without `&&`, `;` or `|`.
- Do not ask questions and do not wait for a confirmation: when something is unclear, say so in the report.
- Change no files.
