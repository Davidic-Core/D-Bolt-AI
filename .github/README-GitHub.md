# D-Bolt-AI GitHub Configuration Documentation

This README explains the purpose of the `.github/` folder and the automated workflows for the D-Bolt-AI repository.

## Folder Purpose

The `.github/` folder contains configuration files for:

- **Dependabot**: automatic dependency updates
- **GitHub Actions workflows**: CI, tests, and optional deployment
- **Issue templates and pull request templates** (optional)
- **Other GitHub-specific repository settings**

> This folder is **not meant for project source code**. The main project README.md remains in the root of the repository.

---

## Dependabot Configuration (`dependabot.yml`)

Dependabot is configured to:

- Track `npm` dependencies for updates
- Send pull requests to the `primary` branch
- Schedule updates weekly for regular dependencies and daily for security updates
- Limit open PRs to 5
- Automatically label PRs as `dependencies` or `security`
- Use commit message prefix `deps`

This ensures that D-Bolt-AI dependencies are always **up-to-date and secure**.

---

## GitHub Actions Workflows

Workflows are stored in `.github/workflows/` and include:

1. **CI / Build Workflow (`ci.yml`)**
   - Triggered on `push` to `primary` and pull requests to `main`
   - Installs dependencies
   - Runs TypeScript type checking
   - Builds the project
   - Optional deployment steps can be added later

2. **Test Workflow (optional)**
   - Add unit or integration tests
   - Fail CI if tests do not pass

> These workflows enforce **continuous integration**, ensuring that code pushed to GitHub is always validated and ready for deployment.

---

## Best Practices

- **Do not edit files in `.github/` unless you are updating workflow or configuration settings.**
- Always keep project documentation in the **root README.md**.
- Use branches (like `primary`) for development, PRs, and CI validation before merging into `main`.
- Dependabot PRs should be reviewed and merged to keep dependencies secure.

---

## References

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Dependabot Docs](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically)
