---
name: devsolve-db-seeder
description: Utility skill for seeding test data into PostgreSQL database (devsolve_db on 51.79.146.203:8888) across various feature tables (content_flags, moderation_actions, comments, reports, users) without modifying or dropping database schemas.
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

## Core Database Tables

1. `content_flags`: Community reports for `PROBLEM`, `SOLUTION`, `COMMENT`, and `SHOWCASE` items (`SPAM`, `OFFENSIVE`, `DUPLICATE`, `OFF_TOPIC`, `OTHER`).
2. `moderation_actions`: Audit logs of admin actions (`WARN`, `SUSPEND`, `REMOVE`, `BAN`, `REINSTATE`).
3. `comments`: Discussions on problems, solutions, and showcases.
4. `reports`: Vulnerability disclosure and triage reports.
5. `user_profiles`: User accounts and profiles.
6. `problems` / `solutions` / `showcases`: Platform content submissions.

## Rules & Safety Guidelines

1. **NEVER** execute `DROP TABLE`, `TRUNCATE`, or `ALTER TABLE`.
2. **ONLY** execute safe `INSERT INTO` statements.
3. Preserve foreign keys by selecting valid `reporter_id` / `user_id` values from existing records in `user_profiles`.

## Usage Instructions

### Seeding via Helper Script

Run the helper script from the workspace directory:

```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table content_flags --count 50
```

To seed moderation history logs:

```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table moderation_actions --count 20
```

To seed comments:

```powershell
$env:NODE_PATH="c:\Users\tolsa\Documents\My project\devsolve-frontend\node_modules"; node ".agents/skills/devsolve-db-seeder/scripts/seed-db.js" --table comments --count 15
```

### SQL Direct Insertion Reference

```sql
INSERT INTO content_flags 
  (id, created_at, updated_at, description, flaggable_id, flaggable_type, reason, status, reporter_id)
VALUES 
  (gen_random_uuid(), NOW(), NOW(), 'Test flagged content item', gen_random_uuid(), 'PROBLEM', 'SPAM', 'PENDING', (SELECT id FROM user_profiles LIMIT 1));
```
