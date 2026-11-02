# PROMPT 07 — FINAL QA: VERIFY THE WEBSITE MATCHES THE BRIEF

Audit the finished website against the master prompt.

Critical checks:
1. Does the homepage use the user's actual video-derived sequence?
2. Has the source subject, clothing, studio/environment and footage character been preserved?
3. Is this still the same website direction, rather than a newly invented concept?
4. Are all eight navigation tabs present and functional?
5. Is all supplied business content represented accurately?
6. Are there any invented credentials, clients, investor names, results, numbers, testimonials, regulatory claims or links? Remove them.
7. Does Canvas scrub smoothly forward and backward?
8. Does it avoid blank frames and loading flashes?
9. Does it crop correctly on desktop and mobile?
10. Is there a reduced-motion and WebGL fallback?
11. Are buttons, links and forms functional or clearly marked as awaiting real configuration?
12. Are there console errors, TypeScript errors, broken routes or production build failures?

Test the actual implementation. Run lint/type checks and production build where configured. Fix reproducible issues.

Deliver a concise report listing:
- completed features
- source video and sequence paths
- routes implemented
- performance considerations
- missing real content or links
- remaining bugs, if any

Do not add new sections or redesign the site during QA. Fix the implementation against the agreed brief.
