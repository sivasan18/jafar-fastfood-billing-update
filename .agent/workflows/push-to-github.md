---
description: Push changes to GitHub repository
---

# Push Changes to GitHub

This workflow will automatically commit and push all changes to the GitHub repository.

## Steps

1. **Check current status**
```bash
git status
```

2. **Add all changes**
// turbo
```bash
git add .
```

3. **Commit changes with a descriptive message**
```bash
git commit -m "Update: [describe your changes here]"
```

4. **Push to GitHub**
// turbo
```bash
git push origin main
```

5. **Verify push was successful**
// turbo
```bash
git log -1
```

## Quick Push (All Steps Combined)

For quick updates, you can use this single command:
```bash
git add . && git commit -m "Update: changes" && git push origin main
```

## Notes
- Always provide a meaningful commit message describing what changed
- The repository is connected to: https://github.com/sivasan18/jafar-fastfood-billing-update
- After any file changes, use this workflow to sync with GitHub
