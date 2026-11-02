# MASTER PROMPT — BUILD THE ANUVAMSHI SHETTY WEBSITE AROUND MY VIDEO

## Role
Act as a senior creative developer and interaction designer specialising in Next.js, TypeScript, Canvas image sequences, WebGL/Three.js, Framer Motion and GSAP ScrollTrigger.

## Non-negotiable instruction
I already have a specific video and a specific website direction. Do NOT create a different website concept. Do NOT replace my visual direction with a generic finance template, SaaS dashboard, agency template, stock-photo site or unrelated futuristic 3D experience.

Use my supplied original video as the primary visual source for the website. Build the website around the footage by extracting frames and creating a scroll-linked cinematic experience. The video should determine the visual mood, subject, composition, lighting and overall visual identity. Preserve the footage's actual subject, clothing, environment and visual character. Do not fabricate a different scene.

Use only the business information in this prompt. Do not invent missing facts.

## Existing project first
Before changing anything:
- Inspect the current repository, existing design, components, routes, installed dependencies and assets.
- Identify the supplied original video and any existing image sequences.
- Reuse useful existing code and visual assets.
- Do not delete or overwrite existing work without a clear technical reason.
- Do not scaffold a competing website beside the existing one.
- Do not replace working project architecture just because you prefer another stack.

## Required stack
Use the existing project where possible. Target:
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger where needed
- HTML Canvas for the video-derived image sequence
- Three.js / React Three Fiber only for genuine additional depth or spatial effects that support the supplied footage.

Do not add WebGL just for decoration. I have not built a WebGL scene yet; implement it only where useful and make the Canvas experience work independently.

## Video-first implementation
The supplied video is the central visual asset. Locate it before designing the page.

Inspect:
- duration
- source resolution
- aspect ratio
- frame rate
- camera movement
- subject movement
- lighting and colour
- visual continuity

Create a reproducible FFmpeg extraction pipeline. Extract chronological frames from the actual video. Use WebP or AVIF derivatives for browser delivery. Preserve the original video unchanged. Do not upscale and claim native 4K. Create a contact sheet for review.

Build a Canvas image-sequence component:
- sticky full-screen canvas inside a scroll section
- scroll progress maps to sequence frame index
- bidirectional scrubbing
- progressive preloading and decode
- initial poster/first-frame fallback
- no white flash or blank canvas
- correct cover cropping on desktop and mobile
- resize handling
- capped device pixel ratio
- memory-conscious loading; do not blindly load all full-resolution frames into RAM
- reduced-motion and low-power fallback
- graceful failure handling

Use the actual footage's frame sequence. Do not substitute stock imagery or generate a different person/environment.

## Visual direction
Derive the design from the supplied video, not from a newly invented art direction. Match its dominant colours, lighting, contrast, atmosphere and photographic character.

Make the site modern, darkish, cinematic, premium and editorial. Use restrained typography and polished layout. The website should feel like a bespoke presentation of this person and their work, not a generic AI-generated template.

PeachWeb is an inspiration for the quality of storytelling, interaction and scroll experience only. Do not copy its page, assets, layout, 3D objects or branding. Do not let inspiration override the supplied video.

Do not add arbitrary 3D spheres, floating financial symbols, stock trading charts, random particles, unrelated abstract scenes, or visual effects that distract from the video.

## Website structure and toolbar tabs
Create a clear, functional toolbar/navigation with these tabs:
1. Home
2. Private Markets
3. Capital & Advisory
4. Insights
5. Watch & Learn
6. AccelRevenue
7. About
8. Contact

Keep navigation accessible while scrolling. Use a refined desktop navigation and a polished mobile menu. Links must navigate to the correct page or section.

The homepage should use the video as its central cinematic opening and storytelling sequence. Place the supplied content around that sequence in a coherent way. Do not make a separate unrelated homepage.

## Supplied business content — use accurately

Anuvamshi Shetty is a finance professional, entrepreneur and founder who works across:

1. Capital Raising: Helps businesses and startups connect with potential investors and explore fundraising opportunities.
2. Investment Banking: Provides capital-related guidance, deal sourcing and investment facilitation.
3. Strategic Advisory: Helps founders refine business strategy, positioning and fundraising presentations.
4. Compliance Navigation: Helps businesses understand fundraising-related compliance and documentation requirements.
5. Investor Connections: Connects founders with investors, industry professionals and relevant business networks.
6. Private Markets Research: Explores private markets and studies different industries, business models, investment trends and opportunities.
7. Equity Research & Financial Analysis: Analyses companies, financial performance, industries and market developments.
8. AccelRevenue: Founded an initiative focused on connecting women entrepreneurs with investors.
9. Financial Education: Creates educational finance content through YouTube, covering financial markets and investment-related topics.
10. CFA Education: Shares CFA preparation resources and learning material with students through a WhatsApp community.

Core positioning:
Anuvamshi works at the intersection of investment banking, fundraising, private-market research, business advisory, investor networking and financial education.

Do not change the meaning of this content. You may edit for concise website copy, but do not add unsupported claims.

## Suggested content mapping
- Private Markets: Private Markets Research; Equity Research & Financial Analysis.
- Capital & Advisory: Capital Raising; Investment Banking; Strategic Advisory; Compliance Navigation; Investor Connections.
- Insights: Research and analysis content based only on supplied or subsequently provided material. Do not fabricate reports or market data.
- Watch & Learn: YouTube financial education; CFA preparation resources; WhatsApp learning community.
- AccelRevenue: Dedicated section/page explaining its focus on connecting women entrepreneurs with investors.
- About: The supplied founder/professional description only. Do not invent a biography, qualifications or employment history.
- Contact: Clear enquiry pathways for founders, investors, students and general enquiries. Do not invent contact details. If no real endpoint exists, create a clearly marked configuration placeholder, not a fake working form.

## Homepage narrative
Create one coherent scroll story:
1. Video-led opening / introduction.
2. Capital and fundraising.
3. Private markets and research.
4. Strategic advisory and investor connections.
5. AccelRevenue.
6. Financial education and CFA learning.
7. About and contact.

The precise order and transitions should be chosen to fit the footage and content. Do not force a section if it disrupts the video narrative.

## Motion
Use purposeful motion:
- scroll-scrubbed video frame sequence
- controlled text reveals
- restrained parallax
- section transitions tied to narrative
- subtle hover states
- refined navigation transitions

No excessive motion, scroll hijacking, random floating objects or unreadable text. Native scrolling must remain usable.

## Responsive and performance
- Desktop and mobile experiences must both work.
- Use smaller image derivatives / lower frame density on mobile when appropriate.
- Respect prefers-reduced-motion.
- Provide a static fallback if Canvas/WebGL is unavailable.
- Lazy-load below-the-fold content.
- Prevent layout shifts.
- Keep the page accessible and keyboard navigable.
- Test actual performance rather than assuming it is fast.

## Implementation discipline
Work in phases. First audit and propose the plan. Then implement the video pipeline, canvas sequence, homepage, navigation and content pages. Keep code modular and typed. Do not leave broken links, dead buttons, fake forms, TODO sections or dummy business facts.

At the end, run the production build and report what works, what needs real user-provided links/content, and any remaining issues.

## Final acceptance test
The finished site must visibly use my actual video as its central visual foundation. It must preserve the video’s subject and scene. It must present the business content I supplied. It must not become a different website concept.
