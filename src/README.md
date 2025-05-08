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

## API

| Command | Status | Notes |
|---------|--------|-------|
| [`login`](./commands/login/README.md) | ✅ | Improved DX and credentials storage in ~/.storyblok/credentials.json |
| [`logout`](./commands/logout/README.md) | ✅ | |
| [`user`](./commands/user/README.md) | ✅ | |
| [`languages pull`](./commands/languages/README.md) | ✅ | Replaces previous pull-languages |
| [`components pull`](./commands/components/pull/README.md) | ✅ | Replaces previous pull-components |
| [`components push`](./commands/components/push/README.md) | ✅ | Replaces previous push-components. Also handles dependencies such as groups, tags, presets and whitelists. (Datasources is pending) |
| `components delete` | 📝 | Will replace delete-component and delete-components |
| [`migrations generate`](./commands/migrations/generate/README.md) | ✅ | Replaces previous generate-migrations |
| [`migrations run`](./commands/migrations/run/README.md) | ✅ | Replaces previous run-migrations |
| [`migrations rollback`](./commands/migrations/rollback/README.md) | ✅ | Replaces previous rollback-migrations |
| [`types generate`](./commands/types/generate/README.md) | ✅ | Replaces previous generate-typescript-typedefs |
| `sync` | ⚠️ | |
| `datasources pull` | 📝 | |
| `datasources push` | 📝 | |
| `datasources delete` | 📝 | Will replace delete-datasources |
| `select` | 💬 | To be discussed |
| `quickstart` | 💬 | To be discussed |
| `spaces` | 💬 | To be discussed |
| `import` | 💬 | To be discussed |

### Status Legend
- ✅ Ready: Feature is implemented and ready to use
- 📝 Planned: Feature is planned for future implementation
- ⚠️ v3: Feature is available only in v3
- 💬 TBD: Feature is under discussion

## Global Options

These options are available for all commands:

| Option | Description | Default |
|--------|-------------|---------|
| `-v, --verbose` | Enable verbose output for debugging | `false` |
| `--ci` | Enable CI mode (coming soon) | `false` |

> [!TIP]
> When reporting a bug or opening a support ticket, please run the command with the `--verbose` flag and add the output to it. This will help us better understand and resolve the issue.
