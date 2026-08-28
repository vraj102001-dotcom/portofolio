# Deploying to Vercel

This repo auto-deploys to Vercel on every push to `main` via [.github/workflows/deploy.yml](.github/workflows/deploy.yml). It's a plain static site (no build step), so the workflow just links the repo to a Vercel project and uploads it.

## One-time setup

### 1. Push this repo to GitHub
Once you have push access to `vraj102001-dotcom/portofolio`:
```
git push -u origin main
```

### 2. Create the Vercel project & get its IDs
On a machine where you can log into Vercel (this only needs to happen once):
```
npm install --global vercel
vercel login
cd path/to/this/project
vercel link
```
`vercel link` walks you through picking your Vercel account/team and naming the project, then writes `.vercel/project.json` (already git-ignored — don't commit it). Open that file — it has the two IDs you need next:
```json
{ "orgId": "team_xxxxxxxx", "projectId": "prj_xxxxxxxx" }
```

### 3. Create a Vercel token
Go to [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create Token** → give it a name like `github-actions` → copy the value (shown once).

### 4. Add three GitHub Actions secrets
In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**. Add:

| Secret name | Value |
|---|---|
| `VERCEL_TOKEN` | the token from step 3 |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

### 5. Ship it
Push to `main` (or re-run the workflow from the GitHub Actions tab). The action deploys to production automatically. Check the **Actions** tab for the run, and the deployed URL appears in that job's log (also visible on your Vercel dashboard).

## After that
Every future push to `main` redeploys automatically — no manual steps. Pull requests can optionally get preview deployments too by adding a second job or extending the trigger to `pull_request`, if you want that later.

## Reminder: this site needs `data/work.json` fetched over http(s)
Vercel serves everything over https by default, so the category pages ([category.html](category.html) fetching [data/work.json](data/work.json)) will work correctly once deployed — this only breaks if someone opens the HTML files directly as `file://` paths.
