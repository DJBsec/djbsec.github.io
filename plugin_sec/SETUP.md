# Setup Guide — Claude Code Radar in Claude Cowork

A daily agent that finds popular Claude Code repos, categorizes and summarizes
them, scores them for risk, and builds an interactive HTML page.

## What's in this folder

| File | Purpose |
|---|---|
| `scan.py` | Discovers repos via the GitHub Search API, classifies them, scores risk, writes `data-YYYY-MM-DD.json` |
| `build_html.py` | Turns the latest JSON into a self-contained interactive HTML page |
| `COWORK_TASK_PROMPT.md` | The standing instructions you paste into the Cowork scheduled task |
| `SETUP.md` | This file |

## One-time setup

### 1. Put the folder where Cowork can reach it
Copy this whole folder to your home directory, e.g. `~/claude-code-radar/`.
Cowork needs file-system access granted to that location.

### 2. Get a GitHub token (read-only)
- GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new.
- Repository access: **Public repositories (read-only)**. No account scopes needed.
- Copy the token (starts with `github_pat_...`).
- This lifts your API rate limit from 60 to 5,000 requests/hour. The scan stays
  well under that.

### 3. Make the token available to the script
The script reads `GITHUB_TOKEN` from the environment. Two safe options:

**Option A — shell profile (simplest on a personal Mac):**
Add to `~/.zshrc`:
```
export GITHUB_TOKEN="github_pat_xxx"
```
Then `source ~/.zshrc`. Cowork's terminal sessions inherit this.

**Option B — a local env file the task sources:**
Create `~/claude-code-radar/.env` containing `GITHUB_TOKEN=github_pat_xxx`,
add `.env` to `.gitignore`, and have the task run
`set -a; source .env; set +a; python3 scan.py`.

Do not paste the token into the Cowork prompt itself — keep it in the
environment so it doesn't get stored in the task's standing instructions.

### 4. Install the one dependency
```
cd ~/claude-code-radar
pip3 install requests --user
```

### 5. Test it manually once
```
python3 scan.py        # writes data-<today>.json
python3 build_html.py  # writes claude-code-radar-<today>.html
```
Open the HTML in a browser. Confirm it looks right before scheduling.

## Schedule it in Cowork

1. Open **Claude Desktop** → **Cowork** tab. (Make sure the app is up to date;
   scheduled tasks shipped Feb 2026 and need a current build.)
2. Click **+ New task**, paste the contents of `COWORK_TASK_PROMPT.md`, and run
   it once with **Let's go** to confirm it behaves.
3. In that same task, type **`/schedule`** in the chat input.
4. In the modal: keep the prompt, set frequency to **Daily**, pick a time, name
   it something like `claude-code-radar`, and **Save**.
5. It now appears under **Scheduled** in the left sidebar, where you can edit
   the prompt, change cadence, or delete it.

## Important runtime limits (from Anthropic's docs)

- **Cowork scheduled tasks run locally**, only while your computer is awake and
  Claude Desktop is open. If the machine is asleep at the scheduled time, the
  task is skipped and runs on next wake (you get a notification). Enable
  **Keep awake** in Cowork or set your energy settings to wake before the run.
- Each run is a **fresh Cowork session**, so everything it needs (the folder,
  the token, the scripts) must persist on disk — which is why this is built as
  standalone scripts plus a prompt, not as in-session state.
- If you need it to run when your machine is off, the cloud-based **Claude
  Routines** surface is the alternative, but it won't have your local folder
  unless that's committed to a repo it can reach.

## How the security score works (so you can defend it)

It is a **heuristic risk indicator from 0–100, not an audit.** It starts at a
neutral 50 and adjusts on observable public signals:

- **Raises score (lower risk):** high stars, clear license, recent activity,
  forks, CI workflows present, a SECURITY.md.
- **Lowers score (higher risk):** no license, staleness, archived status,
  possible hardcoded secrets detected in the README, `curl | bash` style
  install instructions, presence of install/shell scripts.

Bands: 75+ Lower risk · 55–74 Moderate · 35–54 Elevated · <35 Higher risk.

The page shows every contributing factor per repo so a human can judge. The
agent is instructed never to clone, install, or run any discovered code.

## Publishing to the website

After a scan + review run, fold the latest data into the Jekyll site:

```
python3 export_site_data.py   # writes ../_data/plugins.json (trimmed, no review_inputs)
```

Then commit `_data/plugins.json`. The site renders it at `/plugins/` via
`_includes/plugin_radar.html` (search, filters, sortable table, expandable
reviews). `export_site_data.py` reads the newest `json/data-*.json` +
`json/reviews-*.json` and does not modify `scan.py` or `build_html.py`.

## Extending it later

- Wire in real CVE data by querying the **OSV.dev** API or the GitHub Advisory
  Database against parsed dependency manifests.
- Add a diff view comparing today vs. yesterday directly in the HTML.
- Add an email/Slack step at the end of the Cowork prompt to push the daily
  summary to you (Cowork can use those connectors if you've granted them).
