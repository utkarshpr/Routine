Build a production-quality, responsive PWA called "Daily OS" — a personal daily routine, habit, study, fitness, and productivity tracker for a working software engineer preparing for senior software engineering interviews.

The application will be deployed on Vercel.

IMPORTANT:
- The app must be fully functional, not a static UI mockup.
- Mobile-first but excellent on desktop.
- PWA installable on iOS, Android, macOS, and supported browsers.
- Offline-first for core functionality.
- Persistent local data using IndexedDB/localStorage.
- No mandatory backend/authentication for v1.
- Architecture should make it easy to add Supabase/backend later.
- Clean, modular, production-quality code.
- TypeScript throughout.
- Use React/Next.js.
- Use Tailwind CSS.
- Use Framer Motion for animations.
- Follow accessibility best practices.
- Do not overuse animations.
- Performance is extremely important.

==================================================
DESIGN DIRECTION
==================================================

Take visual inspiration from Apple's website:

https://www.apple.com/

DO NOT copy Apple's website, branding, assets, layouts, or proprietary design.

Instead take inspiration from:
- extreme minimalism
- generous whitespace
- typography hierarchy
- subtle gradients
- smooth scrolling
- elegant transitions
- large visual sections
- restrained use of color
- premium feel
- very clean cards
- subtle glass/translucent surfaces
- micro-interactions
- smooth spring animations
- cinematic section transitions

The application should feel like:

"Apple Fitness + Things 3 + Linear + a premium personal productivity OS"

Avoid:
- clutter
- excessive cards
- excessive colors
- gamification overload
- childish UI
- unnecessary gradients
- huge dashboards full of numbers
- excessive shadows
- unnecessary borders

Primary visual language:
- white/light theme by default
- beautiful dark mode
- black/white/gray foundation
- one subtle accent color
- large typography
- rounded but not overly rounded components
- extremely clean spacing

==================================================
CORE CONCEPT
==================================================

The application is a "Daily Operating System".

The home screen should answer one question:

"What should I do right now?"

Instead of showing hundreds of statistics, show the current task and the next few important tasks.

Example:

GOOD MORNING, UTKARSH

Monday, August 10

08:00
DSA Deep Work

45 min remaining

[ Start Session ]

Next
09:00 — HLD
18:30 — Gym
20:00 — Golang
21:30 — Personal Time

Today's Progress
████████░░ 78%

==================================================
MAIN FEATURES
==================================================

1. DAILY ROUTINE BUILDER

Allow the user to create recurring routines.

Each routine should contain:

- title
- category
- start time
- end time
- days of week
- priority
- icon
- color/accent
- optional notes
- recurring/non-recurring
- reminder settings
- completion requirement

Example categories:

- Work
- DSA
- Golang
- HLD
- LLD
- Gym
- Cooking
- Personal
- Friends
- Relationship
- Sleep
- Other

Allow drag-and-drop ordering.

Allow users to:
- create
- edit
- duplicate
- delete
- pause
- skip
- reschedule

==================================================
2. DAILY TIMELINE
==================================================

Create a beautiful timeline view.

Example:

06:00
Gym
60 min
○

07:00
Shower + Breakfast
45 min
○

07:45
DSA
75 min
●

10:00
Work
8 hours
○

18:30
Gym
...

The current task should visually stand out.

Automatically calculate:

- current activity
- next activity
- time remaining
- overdue activity
- completed activities

Use subtle Framer Motion transitions when moving between tasks.

==================================================
3. TODAY DASHBOARD
==================================================

Create an Apple-inspired dashboard.

Sections:

Greeting

Current Task

Next Up

Today's Timeline

Progress

Quick Actions

Stats

The dashboard should NOT feel like an analytics dashboard.

It should feel calm.

==================================================
4. FOCUS MODE
==================================================

Add a distraction-free Focus Mode.

When the user starts a task:

Show:

DSA

Two Sum — Hash Map

45:00

[ Pause ]
[ Complete ]
[ Exit ]

Use a beautiful minimal timer.

Support:

- Pomodoro
- custom duration
- short break
- long break
- pause
- resume
- reset

When a focus session completes:

Show a subtle success animation.

==================================================
5. HABIT TRACKER
==================================================

Allow recurring habits.

Examples:

Gym
Study
Read
Meditate
Drink Water
Sleep before 11
Walk
Coding

Display:

Current streak
Weekly completion
Monthly completion

Keep this extremely minimal.

==================================================
6. WEEKLY PLANNER
==================================================

Create a beautiful weekly calendar.

Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday

Show:

- scheduled routines
- completed routines
- missed routines
- focus sessions
- gym
- personal activities

Allow drag/drop rescheduling.

==================================================
7. WEEKLY REVIEW
==================================================

Every Sunday show a Weekly Review.

Example:

WEEK 32

Study
32h 20m

DSA
12 problems

HLD
3 designs

LLD
2 designs

Golang
7h

Gym
5 / 6

Routine completion
87%

Then provide:

"What went well?"

"What needs improvement?"

"Next week's focus"

Allow user to write notes.

==================================================
8. GOALS
==================================================

Create long-term goals.

Example:

₹1 Cr SSE Preparation

Target date:
31 December 2026

Areas:

DSA
HLD
LLD
Golang
System Design
Projects
Interview Preparation

Each goal should have:

- target
- progress
- deadline
- milestones

Show progress elegantly.

==================================================
9. REMINDERS / ALERTS
==================================================

Implement reminders.

Examples:

07:45
"DSA session starts in 15 minutes"

18:30
"Gym time"

20:00
"Golang deep dive"

22:30
"Start winding down"

Support:

- enable/disable reminders
- reminder offset
- notification sound
- browser notifications
- PWA notifications where supported

IMPORTANT:

Explain browser/PWA notification limitations clearly.

Implement graceful fallback if notifications are unavailable.

Do not pretend notifications work when browser permission/API support is unavailable.

==================================================
10. SMART SCHEDULING
==================================================

Allow user to quickly modify today's schedule.

Example:

User clicks:

"Move DSA"

Then select:

15 min
30 min
1 hour
Tomorrow

Automatically adjust subsequent tasks where possible.

If tasks overlap:

Show:

Schedule conflict

DSA
08:00–09:00

HLD
08:30–09:30

[Resolve automatically]

The scheduling engine should shift flexible tasks while protecting fixed tasks.

Allow task types:

FIXED
FLEXIBLE

Example:

Work = FIXED

Gym = FLEXIBLE

Me Time = FLEXIBLE

==================================================
11. QUICK ADD
==================================================

Create a global quick-add button.

Examples:

"+ Gym 6 PM"

"+ DSA 1 hour"

"+ Call friend 9 PM"

"+ Cooking 30 min"

Parse basic natural language locally if possible.

If parsing is uncertain, show confirmation.

==================================================
12. SETTINGS
==================================================

Settings should include:

Appearance
- Light
- Dark
- System

Accent color

Start of day

Default work hours

Default focus duration

Default break duration

Timezone

Notifications

Sound

Week starts on

Data management

Export data

Import data

Reset data

==================================================
13. DATA EXPORT
==================================================

Allow:

Export JSON

Import JSON

Export CSV

This is important because the app should not lock the user's data.

==================================================
14. PWA
==================================================

Implement a complete PWA.

Requirements:

- manifest.json
- service worker
- install prompt
- offline support
- app icons
- splash screen
- standalone display
- cached app shell
- offline routine access
- offline completion tracking
- sync when online

Show an unobtrusive:

"Install Daily OS"

prompt.

For iOS:

Provide instructions for:

Share → Add to Home Screen

==================================================
15. RESPONSIVE DESIGN
==================================================

Desktop:

Sidebar navigation.

Mobile:

Bottom navigation.

Navigation:

Today
Schedule
Focus
Habits
Goals
Review
Settings

Mobile should feel like a native application.

Do not simply shrink the desktop UI.

==================================================
16. ANIMATIONS
==================================================

Use Framer Motion.

Animations should feel inspired by Apple's attention to motion.

Examples:

Page transitions:
fade + subtle vertical movement

Cards:
small spring movement

Task completion:
smooth check animation

Timer:
subtle number transitions

Weekly navigation:
horizontal slide

Modal:
scale + fade

Progress:
smooth interpolation

Avoid:
- bouncing everything
- excessive parallax
- constant motion
- distracting effects

Animation principles:

- 150–250ms micro interactions
- 300–500ms meaningful transitions
- spring physics where appropriate
- respect prefers-reduced-motion

==================================================
17. COMMAND CENTER
==================================================

Add keyboard shortcuts.

Examples:

N → New task

F → Focus mode

T → Today

W → Week

H → Habits

G → Goals

Space → Start/Pause timer

Esc → Close modal

Show:

Press ? for shortcuts

==================================================
18. SEARCH
==================================================

Global search.

Search:

tasks
habits
goals
notes
weekly reviews

Keyboard shortcut:

Cmd/Ctrl + K

Create a beautiful command palette similar in spirit to Linear/Raycast.

==================================================
19. DAILY ROUTINE PRESET
==================================================

Include a default routine optimized for a working software engineer preparing for a ₹1 Cr SSE role.

Default:

06:00–07:00
Gym

07:00–07:30
Shower + refresh

07:30–08:45
DSA

08:45–09:15
Breakfast

09:15–10:00
HLD / LLD

10:00–18:00
Work

18:00–19:00
Break / commute / decompress

19:00–20:00
Cooking + dinner

20:00–21:30
Golang / project

21:30–22:30
Me time / girlfriend / friends

22:30–23:00
Planning + wind down

23:00
Sleep

IMPORTANT:

Make this fully editable.

The user should be able to change every block.

==================================================
20. STUDY INTEGRATIONS
==================================================

The user already has these personal applications:

DSA Tracker:
https://dsa-tracker-wine.vercel.app/dsa

System Design:
https://system-desgin-mu.vercel.app/

Daily Pulse:
https://daily-pulse-gtat.vercel.app/

Add an "External Tools" section.

Cards:

DSA Tracker
Open →

System Design
Open →

Daily Pulse
Open →

Do NOT require authentication for these links.

Open external tools in a new tab.

Future architecture should allow APIs/integration later.

==================================================
21. ANALYTICS
==================================================

Keep analytics simple.

Show:

Today:
completion %

This week:
study hours

This month:
habit completion

Current streak

Focus time

Do not create an overwhelming analytics page.

==================================================
22. ARCHITECTURE
==================================================

Use a clean architecture.

Suggested structure:

app/
components/
features/
  routine/
  focus/
  habits/
  goals/
  review/
  notifications/
  settings/
lib/
hooks/
stores/
types/
utils/

Use Zustand or another lightweight state manager.

Use IndexedDB for persistent structured data.

Create clear domain types:

Routine
Task
Habit
Goal
FocusSession
WeeklyReview
Notification
Settings

Keep business logic separate from UI.

==================================================
23. QUALITY
==================================================

The app must:

- work without console errors
- work on mobile
- work on desktop
- pass TypeScript checks
- have proper loading states
- have empty states
- have error states
- support keyboard navigation
- support reduced motion
- avoid layout shifts
- have semantic HTML
- have accessible buttons
- have proper focus states

No fake functionality.

Every visible button must actually work.

==================================================
24. LANDING / FIRST EXPERIENCE
==================================================

When opening the app for the first time:

Show:

"Build your day."

Subtitle:

"One calm place for your work, health, learning and life."

Then:

[ Build My Routine ]

Ask:

Wake-up time
Work start
Work end
Sleep time

Primary goals:

□ DSA
□ Golang
□ HLD
□ LLD
□ Fitness
□ Personal time

Then generate a suggested routine.

Allow:

[ Use this routine ]

[ Customize ]

==================================================
25. MICROCOPY
==================================================

Keep text minimal and premium.

Examples:

"Good morning."

"One thing at a time."

"You're on track."

"Next up."

"Take a break."

"Day complete."

"Nice work."

"Tomorrow is another day."

Avoid productivity clichés and excessive motivational text.

==================================================
26. FINAL REQUIREMENT
==================================================

Build the entire application end-to-end.

Do not stop at creating components.

Implement:

- pages
- routing
- state management
- persistence
- PWA
- notifications
- timers
- routines
- habits
- goals
- weekly review
- responsive navigation
- animations
- dark mode
- export/import
- keyboard shortcuts
- command palette
- external tool links

Seed the application with realistic sample data based on the default software-engineer routine.

Before finishing:

1. Run TypeScript checks.
2. Run lint.
3. Run production build.
4. Fix all build errors.
5. Test mobile layout.
6. Test desktop layout.
7. Test offline behavior.
8. Test PWA manifest.
9. Test notification permission handling.
10. Verify every button/action works.

The final result should feel like a polished product that could genuinely be shipped, not an AI-generated dashboard.

Name the application:

"Daily OS"

Tagline:

"Build your day."