![Storyblok ImagoType](https://raw.githubusercontent.com/storyblok/.github/refs/heads/main/profile/public/github-banner.png)

# Storyblok CLI Package Reference

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
| `user` | ✅ Ready | |
| [`languages pull`](./commands/languages/README.md) | ✅ Ready | Replaces previous pull-languages |
| `components pull` | ✅ Ready | Replaces previous pull-components |
| `components push` | ✅ Ready | Replaces previous push-components. Also handles dependencies such as groups, tags, presets and whitelists. (Datasources is pending) |
| `components delete` | 📝 Planned | Will replace delete-component and delete-components |
| `migrations generate` | ✅ Ready | Replaces previous generate-migrations |
| `migrations run` | ✅ Ready | Replaces previous run-migrations |
| `migrations rollback` | ✅ Ready | Replaces previous rollback-migrations |
| `types generate` | ✅ Ready | Replaces previous generate-typescript-typedefs |
| `sync` | ⚠️ v3 | |
| `datasources pull` | 📝 Planned | |
| `datasources push` | 📝 Planned | |
| `datasources delete` | 📝 Planned | Will replace delete-datasources |
| `select` | 💬 TBD | To be discussed |
| `quickstart` | 💬 TBD | To be discussed |
| `spaces` | 💬 TBD | To be discussed |
| `import` | 💬 TBD | To be discussed |