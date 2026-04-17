# Graph Report - .  (2026-04-17)

## Corpus Check
- Corpus is ~12,773 words - fits in a single context window. You may not need a graph.

## Summary
- 95 nodes · 62 edges · 40 communities detected
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Route Handlers|API Route Handlers]]
- [[_COMMUNITY_Campaign Management|Campaign Management]]
- [[_COMMUNITY_Email Sending Engine|Email Sending Engine]]
- [[_COMMUNITY_MongoDB Data Models|MongoDB Data Models]]
- [[_COMMUNITY_Recipient Tracking|Recipient Tracking]]
- [[_COMMUNITY_AI Smart Analyzer|AI Smart Analyzer]]
- [[_COMMUNITY_Dashboard & Stats|Dashboard & Stats]]
- [[_COMMUNITY_Authentication & Settings|Authentication & Settings]]
- [[_COMMUNITY_Email Templates|Email Templates]]
- [[_COMMUNITY_Activity Logs|Activity Logs]]
- [[_COMMUNITY_IMAP Sync & Cron|IMAP Sync & Cron]]
- [[_COMMUNITY_UI Components|UI Components]]
- [[_COMMUNITY_Project Documentation|Project Documentation]]
- [[_COMMUNITY_Reports & Analytics|Reports & Analytics]]
- [[_COMMUNITY_React Context & Hooks|React Context & Hooks]]
- [[_COMMUNITY_Next.js Infrastructure|Next.js Infrastructure]]
- [[_COMMUNITY_Module 16|Module 16]]
- [[_COMMUNITY_Module 17|Module 17]]
- [[_COMMUNITY_Module 18|Module 18]]
- [[_COMMUNITY_Module 19|Module 19]]
- [[_COMMUNITY_Module 20|Module 20]]
- [[_COMMUNITY_Module 21|Module 21]]
- [[_COMMUNITY_Module 22|Module 22]]
- [[_COMMUNITY_Module 23|Module 23]]
- [[_COMMUNITY_Module 24|Module 24]]
- [[_COMMUNITY_Module 25|Module 25]]
- [[_COMMUNITY_Module 26|Module 26]]
- [[_COMMUNITY_Module 27|Module 27]]
- [[_COMMUNITY_Module 28|Module 28]]
- [[_COMMUNITY_Module 29|Module 29]]
- [[_COMMUNITY_Module 30|Module 30]]
- [[_COMMUNITY_Module 31|Module 31]]
- [[_COMMUNITY_Module 32|Module 32]]
- [[_COMMUNITY_Module 33|Module 33]]
- [[_COMMUNITY_Module 34|Module 34]]
- [[_COMMUNITY_Module 35|Module 35]]
- [[_COMMUNITY_Module 36|Module 36]]
- [[_COMMUNITY_Module 37|Module 37]]
- [[_COMMUNITY_Module 38|Module 38]]
- [[_COMMUNITY_Module 39|Module 39]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 13 edges
2. `POST()` - 9 edges
3. `dbConnect()` - 5 edges
4. `MailForze` - 5 edges
5. `useSidebar()` - 3 edges
6. `Next.js Agent Rules` - 3 edges
7. `Vercel` - 3 edges
8. `PUT()` - 2 edges
9. `DELETE()` - 2 edges
10. `Poller()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Logo` --conceptually_related_to--> `Next.js 14`  [INFERRED]
  public/next.svg → README.md
- `Vercel Logo` --conceptually_related_to--> `Vercel`  [INFERRED]
  public/vercel.svg → README.md
- `POST()` --calls--> `dbConnect()`  [INFERRED]
  app\api\templates\route.js → lib\mongodb.js
- `GET()` --calls--> `dbConnect()`  [INFERRED]
  app\api\track\route.js → lib\mongodb.js
- `PUT()` --calls--> `dbConnect()`  [INFERRED]
  app\api\campaigns\[id]\route.js → lib\mongodb.js

## Communities

### Community 0 - "API Route Handlers"
Cohesion: 0.17
Nodes (12): Next.js Logo, AI-Powered Analysis, Bulk Email Sending, Vercel Cron Job, Google Gemini AI, imap-simple, MailForze, MongoDB Atlas (+4 more)

### Community 1 - "Campaign Management"
Cohesion: 0.22
Nodes (1): POST()

### Community 2 - "Email Sending Engine"
Cohesion: 0.22
Nodes (1): GET()

### Community 3 - "MongoDB Data Models"
Cohesion: 0.29
Nodes (3): Sidebar(), useSidebar(), Topbar()

### Community 4 - "Recipient Tracking"
Cohesion: 0.5
Nodes (3): dbConnect(), DELETE(), PUT()

### Community 5 - "AI Smart Analyzer"
Cohesion: 0.5
Nodes (2): Poller(), useCampaignPoller()

### Community 6 - "Dashboard & Stats"
Cohesion: 0.5
Nodes (4): Breaking Changes, Next.js Docs Guide, Next.js Agent Rules, @AGENTS.md link

### Community 7 - "Authentication & Settings"
Cohesion: 1.0
Nodes (0): 

### Community 8 - "Email Templates"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Activity Logs"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "IMAP Sync & Cron"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "UI Components"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Project Documentation"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Reports & Analytics"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "React Context & Hooks"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Next.js Infrastructure"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Module 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Module 17"
Cohesion: 1.0
Nodes (0): 

### Community 18 - "Module 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Module 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Module 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Module 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Module 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Module 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Module 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Module 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Module 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Module 27"
Cohesion: 1.0
Nodes (1): Real-time Dashboard

### Community 28 - "Module 28"
Cohesion: 1.0
Nodes (1): Campaign Management

### Community 29 - "Module 29"
Cohesion: 1.0
Nodes (1): Recipients Browser

### Community 30 - "Module 30"
Cohesion: 1.0
Nodes (1): Email Templates

### Community 31 - "Module 31"
Cohesion: 1.0
Nodes (1): Reports & Analytics

### Community 32 - "Module 32"
Cohesion: 1.0
Nodes (1): Activity Logs

### Community 33 - "Module 33"
Cohesion: 1.0
Nodes (1): SMTP/IMAP Settings

### Community 34 - "Module 34"
Cohesion: 1.0
Nodes (1): Fully Responsive Dashboard

### Community 35 - "Module 35"
Cohesion: 1.0
Nodes (1): Client-First Privacy

### Community 36 - "Module 36"
Cohesion: 1.0
Nodes (1): xlsx

### Community 37 - "Module 37"
Cohesion: 1.0
Nodes (1): File Icon

### Community 38 - "Module 38"
Cohesion: 1.0
Nodes (1): Globe Icon

### Community 39 - "Module 39"
Cohesion: 1.0
Nodes (1): Window Icon

## Knowledge Gaps
- **22 isolated node(s):** `Breaking Changes`, `Next.js Docs Guide`, `@AGENTS.md link`, `MongoDB Atlas`, `AI-Powered Analysis` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Authentication & Settings`** (2 nodes): `layout.js`, `RootLayout()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Email Templates`** (2 nodes): `page.js`, `Home()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Activity Logs`** (2 nodes): `page.js`, `AiAssistantPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `IMAP Sync & Cron`** (2 nodes): `page.js`, `CampaignsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UI Components`** (2 nodes): `page.js`, `CampaignDetailsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Project Documentation`** (2 nodes): `page.js`, `ComposePage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Reports & Analytics`** (2 nodes): `page.js`, `DashboardPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `React Context & Hooks`** (2 nodes): `page.js`, `LogsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Infrastructure`** (2 nodes): `page.js`, `RecipientsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 16`** (2 nodes): `page.js`, `ReportsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 17`** (2 nodes): `page.js`, `SettingsPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 18`** (2 nodes): `page.js`, `TemplatesPage()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 19`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 20`** (1 nodes): `next.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 21`** (1 nodes): `postcss.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 22`** (1 nodes): `Campaign.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 23`** (1 nodes): `EmailLog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 24`** (1 nodes): `Recipient.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 25`** (1 nodes): `Settings.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 26`** (1 nodes): `Template.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 27`** (1 nodes): `Real-time Dashboard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 28`** (1 nodes): `Campaign Management`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 29`** (1 nodes): `Recipients Browser`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 30`** (1 nodes): `Email Templates`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 31`** (1 nodes): `Reports & Analytics`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 32`** (1 nodes): `Activity Logs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 33`** (1 nodes): `SMTP/IMAP Settings`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 34`** (1 nodes): `Fully Responsive Dashboard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 35`** (1 nodes): `Client-First Privacy`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 36`** (1 nodes): `xlsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 37`** (1 nodes): `File Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 38`** (1 nodes): `Globe Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Module 39`** (1 nodes): `Window Icon`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GET()` connect `Email Sending Engine` to `Campaign Management`, `Recipient Tracking`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `POST()` connect `Campaign Management` to `Recipient Tracking`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `dbConnect()` connect `Recipient Tracking` to `Campaign Management`, `Email Sending Engine`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `dbConnect()` (e.g. with `GET()` and `POST()`) actually correct?**
  _`dbConnect()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `useSidebar()` (e.g. with `Sidebar()` and `Topbar()`) actually correct?**
  _`useSidebar()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Breaking Changes`, `Next.js Docs Guide`, `@AGENTS.md link` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._