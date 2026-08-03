import { ProblemDetail } from "./types";



export const MOCK_PROBLEM_DETAIL: Record<string, ProblemDetail> = {
  // --------------------------------------------------------------------------
  // PROBLEM 1: 3 Detailed Solutions
  // --------------------------------------------------------------------------
  "1": {
    id: "1",
    title: "JWT token leaks via Referer header on OAuth redirect",
    status: "Solved",
    sdlcPhase: "Authentication",
    category: "Authentication",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    votes: 142,
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN, and 3rd-party widgets.",
    codeSnippet: `// Reproducing the token leak in Referer header
// Run in Burp Suite or via Node fetch:

const params = new URLSearchParams({
  response_type: "token",
  client_id: "CLIENT_ID",
  redirect_uri: "https://app.example.com/callback",
  scope: "read:profile",
});

// After redirect, token appears in:
// Referer: https://app.example.com/callback?access_token=eyJ...&token_type=Bearer
// Observed in: POST /analytics/track HTTP/1.1
// Host: analytics.third-party.com`,
    postedBy: {
      name: "Alex Mercer",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
      reputation: 4200,
    },
    postedDate: "Jun 12, 2025",
    viewsCount: 2841,
    solutions: [
      {
        id: "1-sol-1",
        type: "rich",
        isAccepted: true,
        votes: 94,
        createdAt: "Jun 13, 2025",
        author: {
          name: "Sengkim Hout",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Hout",
          reputation: 9310,
        },
        explanation:
          "Yes — this is a real and commonly overlooked High-severity vector. When the browser navigates away from your OAuth callback URL, the full URL including query params is sent as the Referer header. Here are 3 ways to fix it permanently.",
        stepByStep: [
          "Open Burp Suite and enable intercept on your browser proxy.",
          "Trigger the OAuth login flow and observe the redirect to /callback?token=eyJ...",
          "Let the callback page load. Filter requests to third-party domains (analytics, fonts, Sentry).",
          "Inspect those outbound request headers. Look for Referer: https://app.example.com/callback?token=eyJ...",
          "Apply the fix: migrate to URL fragment (#) or httpOnly cookie, then re-verify in Burp.",
        ],
        codeFix: `// ❌ INSECURE - token exposed in Referer header
window.location.href = \`/callback?access_token=\${jwt}\`;

// ✅ FIX 1 - Fragment identifier: browsers never include # in Referer
window.location.href = \`/callback#access_token=\${jwt}\`;

// ✅ FIX 2 (BEST) - Server sets httpOnly cookie, zero client-side leakage
// Set-Cookie: session=<opaque_id>; HttpOnly; Secure; SameSite=Lax

// ✅ FIX 3 - Referrer-Policy header (defense-in-depth)
// Add header: Referrer-Policy: no-referrer`,
        hasDiagram: true,
        hasVideo: false,
        comments: [
          {
            id: "c-1",
            author: {
              name: "nullbyte",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=nullbyte",
            },
            content: "Does this also work for mobile OAuth flows?",
            createdAt: "2 days ago",
          },
          {
            id: "c-2",
            author: {
              name: "ghostkode",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ghost",
            },
            content: "Yes — replace redirect_uri with a fragment `#` on both web and deep links.",
            createdAt: "1 day ago",
          },
        ],
      },
      {
        id: "1-sol-2",
        type: "rich",
        isAccepted: false,
        votes: 31,
        createdAt: "Jun 14, 2025",
        author: {
          name: "Taing Sengkim",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sengkim",
          reputation: 6120,
        },
        explanation:
          "If you are stuck using URL query parameters for legacy backend support, you can strip the query parameters immediately using `window.history.replaceState` before any third-party scripts load.",
        stepByStep: [
          "Execute inline JavaScript in the absolute `<head>` before any external JS tags.",
          "Extract `access_token` from `window.location.search`.",
          "Store token in short-lived memory variable or Secure Cookie.",
          "Call `window.history.replaceState({}, document.title, window.location.pathname);` to strip URL parameters.",
        ],
        codeFix: `// Place inside <head> before analytics/Sentry script loading
<script>
  (function() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    if (token) {
      sessionStorage.setItem('access_token', token);
      // Strip token immediately from address bar
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  })();
</script>`,
        hasDiagram: false,
        hasVideo: false,
        comments: [
          {
            id: "c-3",
            author: {
              name: "Alex Mercer",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
            },
            content: "Nice mitigation! Though keep in mind synchronous CSS/font fetches can still race before script execution.",
            createdAt: "12 hours ago",
          },
        ],
      },
      {
        id: "1-sol-3",
        type: "basic",
        isAccepted: false,
        votes: 12,
        createdAt: "Jun 15, 2025",
        author: {
          name: "DevSecOps_pro",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=devsec",
          reputation: 2100,
        },
        explanation:
          "You can enforce `Referrer-Policy: strict-origin-when-cross-origin` or `no-referrer` globally via Nginx or Cloudflare edge headers. This completely blocks query params from sending on cross-site requests.",
        comments: [],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PROBLEM 2: 2 Detailed Solutions
  // --------------------------------------------------------------------------
  "2": {
    id: "2",
    title: "Is prototype pollution still exploitable in lodash ≥ 4.17.21?",
    status: "Open",
    sdlcPhase: "JavaScript",
    category: "JavaScript",
    tags: ["#lodash", "#javascript", "#cve", "#prototype-pollution"],
    votes: 212,
    description:
      "The target app uses lodash merge with user-controlled keys. Lodash 4.17.21 patched CVE-2020-8203 but the app passes unsanitized input through a custom recursive wrapper. Am I missing something or is this already unexploitable on the patched version?",
    codeSnippet: `const _ = require("lodash");

// Custom wrapper in app code:
function mergeUserInput(target, userInput) {
  return _.merge(target, JSON.parse(userInput));
}

// Payload test:
const payload = '{"__proto__": {"polluted": true}}';
mergeUserInput({}, payload);

console.log({}.polluted); // undefined on 4.17.21?`,
    postedBy: {
      name: "Taing Sengkim",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sengkim",
      reputation: 6120,
    },
    postedDate: "May 28, 2025",
    viewsCount: 5503,
    solutions: [
      {
        id: "2-sol-1",
        type: "rich",
        isAccepted: false,
        votes: 58,
        createdAt: "May 29, 2025",
        author: {
          name: "Alex Mercer",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
          reputation: 4200,
        },
        explanation:
          "Lodash 4.17.21 patches direct `__proto__` injection inside `_.merge`. However, if your wrapper uses custom object traversal, `constructor.prototype` or recursive object spread before passing to lodash, pollution can still be triggered upstream.",
        stepByStep: [
          "Check if custom wrapper code calls `Object.assign()` or deep clone prior to `_.merge`.",
          "Try alternative bypass vector using `constructor.prototype` nested key path.",
          "Freeze Object prototype using `Object.freeze(Object.prototype)` in test environment to verify execution depth.",
        ],
        codeFix: `// Safe key validation helper before passing to merge
function sanitizeInput(obj) {
  for (let key in obj) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeInput(obj[key]);
    }
  }
  return obj;
}

// Usage:
mergeUserInput({}, JSON.parse(sanitizeInput(payload)));`,
        hasDiagram: false,
        hasVideo: false,
        comments: [
          {
            id: "c-201",
            author: {
              name: "Sengkim Hout",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Hout",
            },
            content: "Tested `constructor.prototype` on 4.17.21, lodash blocks that key too! Upstream wrapper issue is key here.",
            createdAt: " May 30, 2025",
          },
        ],
      },
      {
        id: "2-sol-2",
        type: "basic",
        isAccepted: false,
        votes: 24,
        createdAt: "May 30, 2025",
        author: {
          name: "SecurityNinja",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ninja",
          reputation: 3410,
        },
        explanation:
          "Instead of relying on library patches, consider using `Object.create(null)` for state objects or modern `Map` structures for dynamic user-controlled keys. That makes prototype pollution fundamentally impossible.",
        comments: [],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PROBLEM 3: 2 Detailed Solutions
  // --------------------------------------------------------------------------
  "3": {
    id: "3",
    title: "Bypassing WAF rate limits with X-Forwarded-For headers in GraphQL",
    status: "Solved",
    sdlcPhase: "API Security",
    category: "API Security",
    tags: ["#graphql", "#rate-limit", "#waf", "#bypass"],
    votes: 98,
    description:
      "Observed an issue where cloud gateway respects client-supplied X-Forwarded-For headers over socket origin during batch GraphQL queries, allowing full rate-limit bypass during brute force tests.",
    codeSnippet: `POST /graphql HTTP/1.1
Host: api.example.com
X-Forwarded-For: 1.2.3.4
Content-Type: application/json

[
  {"query": "mutation { login(user: \\"admin\\", pass: \\"123\\") { token } }"},
  {"query": "mutation { login(user: \\"admin\\", pass: \\"456\\") { token } }"}
]`,
    postedBy: {
      name: "Sengkim Hout",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Hout",
      reputation: 9310,
    },
    postedDate: "May 15, 2025",
    viewsCount: 1920,
    solutions: [
      {
        id: "3-sol-1",
        type: "rich",
        isAccepted: true,
        votes: 52,
        createdAt: "May 16, 2025",
        author: {
          name: "Alex Mercer",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
          reputation: 4200,
        },
        explanation:
          "This occurs when reverse proxies (Nginx / HAProxy / Cloudflare) trust client-sent `X-Forwarded-For` headers instead of overwriting them at the edge ingress node.",
        stepByStep: [
          "Configure cloud reverse proxy / WAF to strip incoming client X-Forwarded-For headers.",
          "Ensure application framework trusts proxy hops strictly by count, not arbitrary header values.",
          "Implement GraphQL query batching depth limiters on backend server.",
        ],
        codeFix: `// Express.js proxy config fix
// ❌ Dangerous: Trusting arbitrary client header
app.set('trust proxy', true);

// ✅ SAFE: Only trust immediate load balancer IP / hop count
app.set('trust proxy', 1); // Exact count of trusted reverse proxies`,
        hasDiagram: true,
        hasVideo: false,
        comments: [],
      },
      {
        id: "3-sol-2",
        type: "rich",
        isAccepted: false,
        votes: 19,
        createdAt: "May 17, 2025",
        author: {
          name: "GraphQL_Architect",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=graphql",
          reputation: 5120,
        },
        explanation:
          "Header spoofing aside, GraphQL batching bypasses traditional REST rate limiters because 100 operations count as 1 HTTP request. You must rate limit by Query Complexity / Field Cost.",
        stepByStep: [
          "Disable query batching if frontend does not strictly require it.",
          "Integrate `graphql-query-complexity` middleware to limit max complexity per request.",
        ],
        codeFix: `import { createComplexityLimitRule } from 'graphql-validation-complexity';

const ComplexityLimitRule = createComplexityLimitRule(1000, {
  onCost: (cost) => console.log('Query cost:', cost),
});`,
        hasDiagram: false,
        hasVideo: false,
        comments: [],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // SHOWCASE 4: Full Showcase Data (Diagrams, Code, Videos & Comments)
  // --------------------------------------------------------------------------
  "4": {
    id: "4",
    title: "Interactive OAuth Security Architecture Flow & POC Playground",
    status: "Solved",
    sdlcPhase: "Program Design",
    category: "Showcase",
    tags: ["#oauth", "#security-architecture", "#showcase", "#pkce"],
    votes: 320,
    description:
      "Built an interactive browser sandbox comparing OAuth 2.0 PKCE flow vs Implicit grant token leaks! Features live token state inspection, PKCE verifier generation, and visual attack vector simulations for junior security engineers.",
    codeSnippet: `// PKCE Code Challenge Generator implementation in React Sandbox
async function generatePKCE() {
  const verifier = generateRandomString(128);
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  return { verifier, challenge };
}`,
    postedBy: {
      name: "Alex Mercer",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
      reputation: 4200,
    },
    postedDate: "Apr 02, 2025",
    viewsCount: 8410,
    solutions: [
      {
        id: "4-sol-1",
        type: "rich",
        isAccepted: true,
        votes: 112,
        createdAt: "Apr 03, 2025",
        author: {
          name: "Taing Sengkim",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Sengkim",
          reputation: 6120,
        },
        explanation:
          "Awesome showcase project! The visual step-by-step breakdown of how authorization codes are swapped for tokens with PKCE verifiers is super clean and easy to follow.",
        stepByStep: [
          "Launch demo app in browser sandbox.",
          "Select 'PKCE Flow' mode and click 'Simulate Authorization Request'.",
          "Inspect generated `code_challenge` and `code_verifier` pairing in live console.",
          "Observe code exchange phase where verifier is validated on server.",
        ],
        codeFix: `// Recommended OAuth 2.1 Standard Integration
const authUrl = \`https://auth.server.com/authorize?\` + 
  \`response_type=code&\` +
  \`client_id=\${clientId}&\` +
  \`code_challenge=\${challenge}&\` +
  \`code_challenge_method=S256\`;`,
        hasDiagram: true,
        hasVideo: true,
        comments: [
          {
            id: "c-401",
            author: {
              name: "Sengkim Hout",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Hout",
            },
            content: "Super helpful visualization for junior devs working on auth!",
            createdAt: "3 weeks ago",
          },
          {
            id: "c-402",
            author: {
              name: "Lor Vengroth",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Lor",
            },
            content: "Can you add Spring Boot backend integration code snippets to the playground?",
            createdAt: "1 week ago",
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------------------------
  // PROBLEM 5: 3 Detailed Solutions
  // --------------------------------------------------------------------------
  "5": {
    id: "5",
    title: "SSRF via PDF generation — can I escalate to RCE from AWS metadata?",
    status: "Open",
    sdlcPhase: "Server-Side",
    category: "Server-Side",
    tags: ["#ssrf", "#aws", "#metadata", "#pdf"],
    votes: 176,
    description:
      "HTML to PDF renderer (Puppeteer/wkhtmltopdf) executing internal fetch. IMDSv1 is enabled. Documenting IAM role permissions for PoC submission.",
    codeSnippet: `<!-- HTML Payload passed to Puppeteer / wkhtmltopdf -->
<iframe src="http://169.254.169.254/latest/meta-data/iam/security-credentials/"></iframe>

<!-- Or fetch via JS inside PDF context -->
<script>
  fetch('http://169.254.169.254/latest/meta-data/iam/security-credentials/')
    .then(res => res.text())
    .then(data => { document.body.innerHTML = data; });
</script>`,
    postedBy: {
      name: "ghostkode",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ghost",
      reputation: 1540,
    },
    postedDate: "Mar 20, 2025",
    viewsCount: 3100,
    solutions: [
      {
        id: "5-sol-1",
        type: "rich",
        isAccepted: false,
        votes: 84,
        createdAt: "Mar 21, 2025",
        author: {
          name: "Sengkim Hout",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Hout",
          reputation: 9310,
        },
        explanation:
          "From our experience running bug bounty programs: with IMDSv1 credentials, RCE depends entirely on IAM policies assigned to the EC2 instance role. If permissions include `ssm:SendCommand` or `ec2-instance-connect`, direct command execution is possible.",
        stepByStep: [
          "Exfiltrate AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN from metadata response.",
          "Configure AWS CLI locally using exfiltrated temporary credentials.",
          "Run `aws sts get-caller-identity` to confirm assumed role name.",
          "Run `aws iam list-attached-role-policies` or test SSM access.",
        ],
        codeFix: `# Enforce AWS IMDSv2 strictly via AWS CLI:
aws ec2 modify-instance-metadata-options \\
    --instance-id i-1234567890abcdef0 \\
    --http-tokens required \\
    --http-endpoint enabled`,
        hasDiagram: true,
        hasVideo: false,
        comments: [
          {
            id: "c-501",
            author: {
              name: "ghostkode",
              avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ghost",
            },
            content: "Verified sts caller identity! IAM role turned out to have full S3 read permissions.",
            createdAt: "Mar 22, 2025",
          },
        ],
      },
      {
        id: "5-sol-2",
        type: "rich",
        isAccepted: false,
        votes: 42,
        createdAt: "Mar 22, 2025",
        author: {
          name: "CloudShield",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=cloud",
          reputation: 5400,
        },
        explanation:
          "To fix PDF rendering SSRF entirely, run Puppeteer in an isolated network sandbox without local loopback access, or disable JS execution if only rendering HTML tags.",
        stepByStep: [
          "Launch Puppeteer with `--disable-setuid-sandbox` and custom `--proxy-server` routing.",
          "Block request routes matching internal IP ranges (`169.254.169.254`, `127.0.0.1`, `10.0.0.0/8`).",
        ],
        codeFix: `// Puppeteer request interception fix
await page.setRequestInterception(true);
page.on('request', request => {
  const url = request.url();
  if (url.includes('169.254.169.254') || url.includes('localhost')) {
    request.abort();
  } else {
    request.continue();
  }
});`,
        hasDiagram: false,
        hasVideo: false,
        comments: [],
      },
      {
        id: "5-sol-3",
        type: "basic",
        isAccepted: false,
        votes: 18,
        createdAt: "Mar 23, 2025",
        author: {
          name: "Alex Mercer",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
          reputation: 4200,
        },
        explanation:
          "Also ensure `http-put-response-hop-limit` is set to `1` so containers (Docker/Kubernetes) cannot reach host metadata IP even if IMDSv2 is enforced.",
        comments: [],
      },
    ],
  },
};

/**
 * Retrieves problem or showcase details by ID with safe fallback
 */
export function getProblemDetailById(id: string): ProblemDetail | undefined {
  if (MOCK_PROBLEM_DETAIL[id]) {
    return MOCK_PROBLEM_DETAIL[id];
  }

  // Safe fallback to prevent runtime crashes on unmapped dynamic IDs
  return {
    ...MOCK_PROBLEM_DETAIL["1"],
    id,
  };
}