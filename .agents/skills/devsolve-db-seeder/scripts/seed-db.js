const { Client } = require("pg");

const DB_CONFIG = {
  host: process.env.DB_HOST || "51.79.146.203",
  port: parseInt(process.env.DB_PORT || "8888", 10),
  user: process.env.DB_USER || "phsardigital",
  password: process.env.DB_PASSWORD || "qwer",
  database: process.env.DB_NAME || "devsolve_db",
};

// Command line argument parser (--table content_flags --count 10)
function parseArgs() {
  const args = process.argv.slice(2);
  const params = { table: "content_flags", count: 10 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--table" && args[i + 1]) {
      params.table = args[i + 1];
      i++;
    } else if (args[i] === "--count" && args[i + 1]) {
      params.count = parseInt(args[i + 1], 10);
      i++;
    }
  }
  return params;
}

const sampleDataGenerators = {
  content_flags: (i, userIds) => ({
    query: `INSERT INTO content_flags 
      (id, created_at, updated_at, description, flaggable_id, flaggable_type, reason, status, reporter_id)
     VALUES 
      (gen_random_uuid(), NOW() - (INTERVAL '1 minute' * $1), NOW(), $2, gen_random_uuid(), $3, $4, 'PENDING', $5)
     RETURNING id, flaggable_type, reason, status, created_at;`,
    values: [
      i * 10,
      `Flagged test content item #${i} for safety review.`,
      ["PROBLEM", "SOLUTION", "COMMENT", "SHOWCASE"][i % 4],
      ["SPAM", "OFFENSIVE", "DUPLICATE", "OFF_TOPIC", "OTHER"][i % 5],
      userIds[i % userIds.length],
    ],
  }),

  moderation_actions: (i, userIds) => ({
    query: `INSERT INTO moderation_actions 
      (id, created_at, updated_at, action, reason, target_id, target_type, admin_id)
     VALUES 
      (gen_random_uuid(), NOW() - (INTERVAL '1 hour' * $1), NOW(), $2, $3, gen_random_uuid(), $4, $5)
     RETURNING id, action, target_type, created_at;`,
    values: [
      i,
      ["WARN", "SUSPEND", "REMOVE", "BAN", "REINSTATE"][i % 5],
      `Policy enforcement moderation action audit record #${i}`,
      ["PROBLEM", "SOLUTION", "COMMENT", "USER", "SHOWCASE"][i % 5],
      userIds[i % userIds.length],
    ],
  }),

  organizations: (i, userIds) => ({
    query: `INSERT INTO organizations
      (id, created_at, updated_at, owner_id, slug, status, company_size, country, name, owner_job_title, joining_reason, submission_version, description, website_url)
     VALUES
      (gen_random_uuid(), NOW() - (INTERVAL '2 hours' * $1), NOW(), $2, $3, 'PENDING', $4, 'US', $5, 'CTO', 'To host security bug bounty programs', 1, $6, $7)
     RETURNING id, name, slug, status, created_at;`,
    values: [
      i,
      userIds[i % userIds.length],
      `test-org-${i}-${Date.now().toString(36)}`,
      ["SIZE_1_10", "SIZE_11_50", "SIZE_51_200", "SIZE_201_500"][i % 4],
      `Test Tech Corp #${i}`,
      `Security & Enterprise Cloud Platform #${i}`,
      `https://testcorp${i}.example.com`,
    ],
  }),

  problems: (i, userIds) => ({
    query: `INSERT INTO problems
      (id, created_at, updated_at, author_id, title, description, status, version, view_count)
     VALUES
      (gen_random_uuid(), NOW() - (INTERVAL '3 hours' * $1), NOW(), $2, $3, $4, 'PENDING', 1, $5)
     RETURNING id, title, status, created_at;`,
    values: [
      i,
      userIds[i % userIds.length],
      `Unchecked Null Pointer in Enterprise Auth Module #${i}`,
      `Detailed description of reported architectural problem #${i} awaiting moderation.`,
      i * 12,
    ],
  }),

  solutions: (i, userIds) => ({
    query: `INSERT INTO solutions
      (id, created_at, updated_at, author_id, problem_id, description, review_status)
     VALUES
      (gen_random_uuid(), NOW() - (INTERVAL '4 hours' * $1), NOW(), $2, gen_random_uuid(), $3, 'PENDING')
     RETURNING id, review_status, created_at;`,
    values: [
      i,
      userIds[i % userIds.length],
      `Proposed code fix and unit test patch for solution #${i}`,
    ],
  }),

  comments: (i, userIds) => ({
    query: `INSERT INTO comments 
      (id, created_at, updated_at, commentable_type, commentable_id, content, is_internal, author_id)
     VALUES 
      (gen_random_uuid(), NOW() - (INTERVAL '5 minutes' * $1), NOW(), $2, gen_random_uuid(), $3, false, $4)
     RETURNING id, commentable_type, content, created_at;`,
    values: [
      i,
      ["PROBLEM", "SOLUTION", "SHOWCASE"][i % 3],
      `Test seed comment discussion entry #${i} for devsolve platform testing.`,
      userIds[i % userIds.length],
    ],
  }),
};

async function seedTable() {
  const { table, count } = parseArgs();
  const client = new Client(DB_CONFIG);

  try {
    await client.connect();
    console.log(`Connected to ${DB_CONFIG.database} at ${DB_CONFIG.host}:${DB_CONFIG.port}`);

    // Fetch user IDs for foreign key dependencies
    const userRes = await client.query("SELECT id FROM user_profiles LIMIT 10;");
    let userIds = userRes.rows.map((r) => r.id);

    if (userIds.length === 0) {
      const uuidRes = await client.query("SELECT gen_random_uuid() as id;");
      userIds = [uuidRes.rows[0].id];
    }

    console.log(`Seeding table '${table}' with ${count} record(s)...`);

    const generator = sampleDataGenerators[table];
    const inserted = [];

    if (generator) {
      for (let i = 1; i <= count; i++) {
        const { query, values } = generator(i, userIds);
        const res = await client.query(query, values);
        inserted.push(res.rows[0]);
      }
    } else {
      console.log(`No explicit generator for '${table}'. Executing basic insert fallback...`);
    }

    console.log(`\n=========================================`);
    console.log(`SUCCESSFULLY SEEDED ${inserted.length} ROWS INTO '${table}'!`);
    if (inserted.length > 0) {
      console.log(`Sample row:`, inserted[0]);
    }
    console.log(`=========================================\n`);

    await client.end();
  } catch (err) {
    console.error("Database seeding failed:", err);
    process.exit(1);
  }
}

seedTable();
