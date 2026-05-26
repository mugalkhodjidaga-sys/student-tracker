# GitHub Pages not loading after private → public

If https://mugalkhodjidaga-sys.github.io/student-tracker/ shows 404, do these steps **once** on GitHub:

## Step 1 — Re-enable Pages

1. Open https://github.com/mugalkhodjidaga-sys/student-tracker/settings/pages
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from branch”).
3. Save if prompted.

## Step 2 — Workflow permissions

1. https://github.com/mugalkhodjidaga-sys/student-tracker/settings/actions
2. **General** → **Workflow permissions** → select **Read and write permissions**
3. Save.

## Step 3 — Run deploy again

1. https://github.com/mugalkhodjidaga-sys/student-tracker/actions
2. Click **Deploy to GitHub Pages** → **Run workflow** → **Run workflow**
3. Wait until both jobs (build + deploy) show green checkmarks (~2 min).

## Step 4 — Check environment

1. https://github.com/mugalkhodjidaga-sys/student-tracker/settings/environments
2. Open **github-pages** — ensure it is not blocked waiting for approval.

## Correct URL

https://mugalkhodjidaga-sys.github.io/student-tracker/

(Include trailing path `/student-tracker/` — not the repo root only.)
