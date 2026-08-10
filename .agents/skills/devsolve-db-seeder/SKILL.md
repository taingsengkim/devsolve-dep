---
name: devsolve-db-seeder
description: Utility skill for seeding test data into PostgreSQL database (devsolve_db on 51.79.146.203:8888) across various feature tables (content_flags, moderation_actions, organizations, problems, solutions, comments, reports) without modifying or dropping database schemas.
---

# Devsolve DB Test Data Seeder

This skill provides workflow instructions, database connection parameters, and automated Node.js scripts for seeding high-quality test data into `devsolve_db` (`51.79.146.203:8888`).

## Database Connection Specification

- **Host**: `51.79.146.203`
- **Port**: `8888`
- **Database Name**: `devsolve_db`
- **User**: `phsardigital`
- **Password**: `qwer`
- **SSL**: No (plain connection)

## Core Database Tables Supported

1. `content_flags`: Community reports for `PROBLEM`, `SOLUTION`, `COMMENT`, and `SHOWCASE` items (`SPAM`, `OFFENSIVE`, `DUPLICATE`, `OFF_TOPIC`, `OTHER`).
2. `moderation_actions`: Audit logs of admin actions (`WARN`, `SUSPEND`, `REMOVE`, `BAN`, `REINSTATE`).
3. `organizations`: Corporate KYB verification requests (`PENDING`, `APPROVED`, `REJECTED`).
4. `problems`: Problem submissions pending moderation review.
5. `solutions`: Solution code submissions pending admin review.
6. `comments`: Discussions on problems, solutions, and showcases.

## Usage Commands

Run the helper script from the workspace directory:

### Seed Content Flags:
```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table content_flags --count 20
```

### Seed Moderation History Logs:
```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table moderation_actions --count 15
```

### Seed Pending Organizations:
```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table organizations --count 10
```

### Seed Problems Pending Moderation:
```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table problems --count 10
```

### Seed Solutions Pending Review:
```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table solutions --count 10
```
