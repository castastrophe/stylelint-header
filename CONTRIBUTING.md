# Contributing to stylelint-header

Contributions of all kinds are welcome: bug fixes, new features, documentation improvements, and test coverage. If you're unsure whether your idea fits the project, open an issue first and we'll figure it out together.

## Before you start

1. **Search existing issues** before opening a new one — your bug or idea may already be in progress.
2. **Open an issue** to discuss non-trivial changes before writing code. This saves everyone time and avoids PRs that can't be merged.
3. **Fork the repository** and clone your fork locally:
   ```sh
   git clone https://github.com/<your-username>/stylelint-header.git
   cd stylelint-header
   yarn install
   ```

## Development workflow

### Branching

Create a branch from `main` that describes your change:

```sh
git checkout -b fix/header-comparison-tolerance
git checkout -b feat/multi-header-support
```

### Running tests

This project uses [Jest](https://jestjs.io/) with [`jest-preset-stylelint`](https://www.npmjs.com/package/jest-preset-stylelint):

```sh
yarn test           # run the full test suite
yarn watch          # re-run tests on file change
yarn coverage       # run tests with coverage report
```

All new functionality must be accompanied by tests. Look through `test/stylelint-header.test.js` and the fixture files alongside it to get a feel for the conventions. When you add a behavior, add a fixture pair (a `.css` file that should pass and one that should reject) so the rule's contract stays observable from the fixtures alone.

### Linting and formatting

Code style is enforced by ESLint and Prettier. Both run automatically on staged files before every commit via `lint-staged`. You can also run them manually:

```sh
yarn eslint .
yarn prettier --check .
```

If Prettier flags a file, run `yarn prettier --write .` to fix it automatically.

### Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are linted automatically on every commit — a malformed message will be rejected. The format is:

```md
<type>(<optional scope>): <short description>

[optional body]

[optional footer(s)]
```

Common types:

| Type       | When to use                                 |
| ---------- | ------------------------------------------- |
| `feat`     | A new feature (triggers a minor release)    |
| `fix`      | A bug fix (triggers a patch release)        |
| `docs`     | Documentation changes only                  |
| `test`     | Adding or updating tests                    |
| `refactor` | Code restructuring without behaviour change |
| `chore`    | Tooling, config, dependency updates         |

A `BREAKING CHANGE:` footer or a `!` after the type (e.g. `feat!:`) triggers a major release.

### Pull requests

- Keep PRs focused — one logical change per PR
- Update or add tests for every changed behaviour
- The PR title should follow the same Conventional Commits format as your commit messages, since it becomes the squash commit message on merge
- Fill out the PR description — explain what changed and why, not just what the diff shows

## Project structure

```md
stylelint-header/
├── index.js # the rule (createPlugin + ruleFunction)
├── COPYRIGHT # default header template used in tests
├── test/
│ ├── stylelint-header.test.js # Jest test suite
│ └── \*.css / input.txt # accept/reject fixtures
└── .github/
└── workflows/ # CI and release automation
```

Type annotations are written as JSDoc rather than TypeScript — please keep annotations up to date for any functions you add or modify.

## Release process

Releases are fully automated via [semantic-release](https://semantic-release.gitbook.io/semantic-release/) — no manual versioning or changelog editing required. Merging to `main` triggers the release workflow, which analyses commit messages since the last release, bumps the version, generates the changelog entry, tags the commit, and publishes to npm.

You do not need to update `package.json` version or `CHANGELOG.md` by hand.

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct. By participating you agree to uphold a welcoming and respectful environment for everyone. Harassment, discrimination, or exclusionary behaviour of any kind will not be tolerated.

If you experience or witness unacceptable behaviour, please report it by opening a private issue or emailing [castastrophe@users.noreply.github.com](mailto:castastrophe@users.noreply.github.com). All reports will be handled with discretion.
