![Storyblok ImagoType](https://raw.githubusercontent.com/storyblok/.github/refs/heads/main/profile/public/github-banner.png)

# Storyblok CLI

## Installation

For the latest beta version, install the package using the following command:

```bash
npm install storyblok@beta
```

Or for an specific beta version:

```bash
npm install storyblok@4.0.0-beta.<version>
```

## Command Reference

| Command | Status | Notes |
|---------|--------|-------|
| [`login`](./commands/login/README.md) | ✅ Ready | Improved DX and credentials storage in ~/.storyblok/credentials.json |
| [`logout`](./commands/logout/README.md) | ✅ Ready | |
| [`user`](./commands/user/README.md) | ✅ Ready | |
| [`languages pull`](./commands/languages/README.md) | ✅ Ready | Replaces previous pull-languages |
| [`components pull`](./commands/components/pull/README.md) | ✅ Ready | Replaces previous pull-components |
| [`components push`](./commands/components/push/README.md) | ✅ Ready | Replaces previous push-components. Also handles dependencies such as groups, tags, presets and whitelists. (Datasources is pending) |
| `components delete` | 📝 Planned | Will replace delete-component and delete-components |
| [`migrations generate`](./commands/migrations/generate/README.md) | ✅ Ready | Replaces previous generate-migrations |
| [`migrations run`](./commands/migrations/run/README.md) | ✅ Ready | Replaces previous run-migrations |
| [`migrations rollback`](./commands/migrations/rollback/README.md) | ✅ Ready | Replaces previous rollback-migrations |
| [`types generate`](./commands/types/generate/README.md) | ✅ Ready | Replaces previous generate-typescript-typedefs |
| `sync` | ⚠️ v3 | |
| `datasources pull` | 📝 Planned | |
| `datasources push` | 📝 Planned | |
| `datasources delete` | 📝 Planned | Will replace delete-datasources |
| `select` | 💬 TBD | To be discussed |
| `quickstart` | 💬 TBD | To be discussed |
| `spaces` | 💬 TBD | To be discussed |
| `import` | 💬 TBD | To be discussed |

## Global Options

These options are available for all commands:

| Option | Description | Default |
|--------|-------------|---------|
| `-v, --verbose` | Enable verbose output for debugging | `false` |
| `--ci` | Enable CI mode (coming soon) | `false` |

> [!TIP]
> When reporting a bug or opening a support ticket, please run the command with the `--verbose` flag and add the output to it. This will help us better understand and resolve the issue.
