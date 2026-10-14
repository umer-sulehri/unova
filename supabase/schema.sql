-- ============================================================
-- UNOVA content schema for Supabase
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor).
-- It creates one table per content collection and seeds it with
-- the bundled data from data/content/*.json.
-- ============================================================

-- ------------------------------------------------------------
-- projects
-- ------------------------------------------------------------
create table if not exists projects (
  id bigint primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Locked down by default: no public policies, all access goes through
-- the Next.js server using the service role key (which bypasses RLS).
alter table projects enable row level security;

insert into projects (id, data) values (1, $item${"slug":"cv-builder","title":"CV Builder","description":"cv.toolscase.com is a free online CV builder that lets users create professional resumes using modern templates. With a simple interface, it allows easy editing and instant PDF downloads for quick and polished results.","image":"/img/portfolio/portfolio-9.png","categories":["web"],"liveUrl":"https://cv.toolscase.com/","codeUrl":"#","technologies":["React","JavaScript","Bootstrap","SQL","PHP","Laravel"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (2, $item${"slug":"social-lynx","title":"Social Lynx","description":"Social Lynx is a community connecting creators with real followers. Our service offers access to a network of global followers and subscribers interested in new social media content. Take control of your creator journey and easily grow your audience on YouTube, TikTok, Instagram, Facebook, and more.","image":"/img/portfolio/portfolio-8.png","liveUrl":"https://www.sociallynx.com/home","codeUrl":"#","categories":["web"],"technologies":["Next.js","JavaScript","Bootstrap","SQL","Laravel"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (3, $item${"slug":"unique-hair-barber-shop-website","title":"Unique Hair – Barber Shop Website","description":"A modern, responsive website for a barber shop built with clean UI/UX. It showcases services, and booking options to enhance customer engagement and online presence.","image":"/img/portfolio/portfolio-1.png","liveUrl":"https://unique-hair.netlify.app/","codeUrl":"#","categories":["web"],"technologies":["HTML/CSS","JavaScript","GSAP","Bootstrap"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (4, $item${"slug":"unique-sneakers-shoe-store","title":"Unique Sneakers – Modern Shoe Store Website","description":"A stylish and responsive e-commerce landing page for a sneaker brand. It features product highlights, smooth animations, and a clean layout for an engaging user experience.","image":"/img/portfolio/portfolio-2.png","categories":["web"],"liveUrl":"https://unique-sneakers.netlify.app/","codeUrl":"#","technologies":["HTML/CSS","React","JavaScript","GSAP"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (5, $item${"slug":"restaurant-website-moon-grill","title":"Restaurant Website","description":"At Moon Grill, we're passionate about serving delicious, high-quality food made with fresh ingredients and bold flavors. Our journey began with a love for great taste and a commitment to exceptional dining experiences.","image":"/img/portfolio/portfolio-7.png","liveUrl":"https://moongrill.netlify.app/","codeUrl":"#","categories":["web"],"technologies":["JavaScript","Tailwind CSS","Bootstrap","SQL","Laravel"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (6, $item${"slug":"full-featured-ecommerce-website","title":"Full-Featured E-commerce Website","description":"A complete online shopping platform for sneakers, featuring product listings, filters, cart management, and a checkout system. Designed for a smooth user experience with responsive design and modern UI.","image":"/img/portfolio/portfolio-3.png","categories":["web"],"liveUrl":"https://red-shopping-store.netlify.app","codeUrl":"#","technologies":["Next.js","Bootstrap"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (7, $item${"slug":"renkli-paints","title":"Renkli Paints","description":"Introducing Renkli Paints, a dynamic addition to Pakistan's vibrant market, established in 2024. Committed to bringing innovation and quality to every brushstroke, we're dedicated to adding color and vitality to homes and spaces across the nation.","image":"/img/portfolio/portfolio-4.png","liveUrl":"https://renklipaints.netlify.app/","codeUrl":"#","categories":["web"],"technologies":["Bootstrap","Tailwind CSS"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (8, $item${"slug":"bootstrap-business-website","title":"Bootstrap Business Website","description":"A professional business website template built with Bootstrap, featuring a clean design, responsive layout, and essential business sections like services, testimonials, and contact forms.","image":"/img/portfolio/portfolio-5.png","liveUrl":"https://inspiring-axolotl-775e87.netlify.app","codeUrl":"#","categories":["web"],"technologies":["JavaScript","API","Bootstrap"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into projects (id, data) values (9, $item${"slug":"to-do-list-app","title":"To Do List App","description":"A simple and intuitive To Do List application that allows users to add, edit, and delete tasks. It features a clean interface and local storage for task persistence.","image":"/img/portfolio/portfolio-6.png","categories":["web"],"liveUrl":"https://reminder-todo-work.netlify.app/","codeUrl":"#","technologies":["HTML/CSS","JavaScript","GSAP"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;

-- ------------------------------------------------------------
-- services
-- ------------------------------------------------------------
create table if not exists services (
  id bigint primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Locked down by default: no public policies, all access goes through
-- the Next.js server using the service role key (which bypasses RLS).
alter table services enable row level security;

insert into services (id, data) values (1, $item${"slug":"ui-ux","title":"UI/UX Design","icon":"bi-palette","color":"#0d83fd","tagline":"Crafting intuitive digital experiences users love.","heroTitle":"UI/UX Design Services","heroSubtitle":"User-centered design rooted in research, strategy, and innovation — interfaces that look stunning and work flawlessly.","heroImage":"/img/features-illustration-1.webp","overview":["At UNOVA, we specialize in creating user-centered designs that not only look stunning but also provide seamless functionality.","Our UI/UX design process is grounded in research and strategy: we study your audience, map their journeys, and prototype solutions before a single line of code is written.","The result is a digital product your customers find effortless — and one that moves the needle for your business."],"benefits":[{"icon":"bi-people","title":"Research-Driven","description":"Decisions backed by user interviews, surveys, and analytics — not guesswork."},{"icon":"bi-phone","title":"Mobile-First","description":"Every interface designed responsive-first for flawless experiences on any device."},{"icon":"bi-universal-access","title":"Accessible","description":"WCAG-conscious designs that welcome every user."},{"icon":"bi-layers","title":"Design Systems","description":"Reusable components and style guides that scale with your product."}],"process":[{"title":"Discovery & Research","description":"We learn your business goals and understand your audience through interviews, surveys, and analytics."},{"title":"Wireframing","description":"Structural blueprints are created to define optimal user flows before visual design begins."},{"title":"Prototyping","description":"Interactive models let you test functionality and feel early, reducing costly rework later."},{"title":"UI Design & Handoff","description":"Pixel-perfect, on-brand interfaces delivered with developer-ready specs and assets."}],"deliverables":["Mobile-first responsive designs","Accessibility-compliant interfaces","Design systems & style guides","Interactive prototypes","User testing reports","Ongoing design support"],"tools":["Figma","Adobe XD","Sketch","Adobe Photoshop","Miro","Zeplin"],"packages":[{"name":"Starter Design Sprint","tagline":"Perfect for validating a new product idea","features":["1 key screen or flow designed","Wireframes + clickable prototype","1 round of revisions"],"highlighted":false},{"name":"Full Product Design","tagline":"End-to-end design for web & mobile apps","features":["Complete user research","Design system & style guide","Unlimited revisions during sprint","Developer handoff support"],"highlighted":true}],"faq":[{"question":"How long does a typical UI/UX project take?","answer":"A focused design sprint takes 1–2 weeks; full product design usually runs 4–8 weeks depending on scope."},{"question":"Do you work with existing brand guidelines?","answer":"Absolutely. We can extend an established identity or help you evolve it as part of the project."},{"question":"Will I get source files?","answer":"Yes — you receive full Figma/XD source files along with exported assets and specs."}],"relatedProjects":["cv-builder","unique-hair-barber-shop-website","full-featured-ecommerce-website"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into services (id, data) values (2, $item${"slug":"web-development","title":"Web Development","icon":"bi-code-slash","color":"#198754","tagline":"Scalable, high-performance websites and applications.","heroTitle":"Web Development Services","heroSubtitle":"From brochure sites to complex web applications — digital solutions engineered to perform and built to grow.","heroImage":"/img/services.jpg","overview":["From simple brochure websites to complex web applications, our development team creates digital solutions that drive results.","We combine technical expertise with creative problem-solving to deliver fast, secure, and SEO-friendly products.","Whether you need an online store, a custom platform, or a marketing site, we architect it for performance and long-term growth."],"benefits":[{"icon":"bi-lightning-charge","title":"Performance First","description":"Fast load times and optimized Core Web Vitals out of the box."},{"icon":"bi-phone","title":"Responsive Coding","description":"Mobile-first builds tested across browsers and devices."},{"icon":"bi-shield-check","title":"Secure by Default","description":"Hardened code, safe dependencies, and best-practice deployment."},{"icon":"bi-graph-up-arrow","title":"SEO-Ready","description":"Clean architecture and semantic markup search engines love."}],"process":[{"title":"Planning & Architecture","description":"We define scope, select the right stack, and design the system architecture."},{"title":"Agile Development","description":"Iterative sprints with regular demos keep you in control of progress."},{"title":"Testing & QA","description":"Cross-browser, device, and performance testing before launch."},{"title":"Launch & Support","description":"Smooth deployment plus ongoing maintenance options."}],"deliverables":["Production-ready website or application","Responsive, cross-browser build","SEO-friendly architecture","Admin/CMS where needed","Deployment & documentation","Post-launch support window"],"tools":["HTML5/CSS3","JavaScript","React.js","Next.js","Node.js","PHP","Laravel","WordPress","Shopify"],"packages":[{"name":"Business Website","tagline":"Professional presence for growing companies","features":["Up to 8 custom pages","CMS for easy edits","On-page SEO basics","Contact forms & integrations"],"highlighted":false},{"name":"Web App / E-commerce","tagline":"Custom platforms built around your workflow","features":["Custom functionality & dashboards","Payment gateway integration","API development","Performance & security hardening"],"highlighted":true}],"faq":[{"question":"Which technology stack do you recommend?","answer":"It depends on your goals — we'll propose the simplest stack that meets your performance, budget, and maintenance needs."},{"question":"Can you take over an existing codebase?","answer":"Yes, we regularly audit, refactor, and extend projects started by other teams."},{"question":"Do you provide hosting and domain setup?","answer":"We handle full deployment on your preferred platform and can manage hosting for you."}],"relatedProjects":["cv-builder","social-lynx","restaurant-website-moon-grill","full-featured-ecommerce-website"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into services (id, data) values (3, $item${"slug":"graphic-design","title":"Graphic Design","icon":"bi-brush","color":"#ffc107","tagline":"Visual communication that captivates.","heroTitle":"Graphic Design Services","heroSubtitle":"Compelling visual assets that communicate your brand message effectively — from print to digital.","heroImage":"/img/features-illustration-2.webp","overview":["Our graphic design team creates compelling visual assets that communicate your brand message effectively.","From print to digital, we design with purpose and precision to make your brand stand out in a crowded market.","Every deliverable is crafted to be brand-consistent, attention-grabbing, and production-ready."],"benefits":[{"icon":"bi-bullseye","title":"Strategic Thinking","description":"Design decisions tied to your brand goals and audience."},{"icon":"bi-palette2","title":"Brand-Consistent","description":"Cohesive visuals across every touchpoint."},{"icon":"bi-printer","title":"Print-Ready Files","description":"Correct color profiles, bleeds, and formats for any printer."},{"icon":"bi-lightning","title":"Fast Turnaround","description":"Streamlined process with clear timelines."}],"process":[{"title":"Brief & Discovery","description":"We clarify objectives, audience, and style direction."},{"title":"Concepts","description":"Initial design directions presented for feedback."},{"title":"Refinement","description":"Chosen concept polished through revision rounds."},{"title":"Delivery","description":"Final files delivered in all required formats."}],"deliverables":["Logo design & brand marks","Business cards, brochures & flyers","Social media posts, banners & ads","Product packaging design","Source files & export formats"],"tools":["Adobe Photoshop","Adobe Illustrator","Adobe InDesign","Figma","Canva"],"packages":[{"name":"Essentials Pack","tagline":"Core assets for new brands","features":["Logo design","Business card & letterhead","3 social media templates"],"highlighted":false},{"name":"Brand Studio","tagline":"Full creative support month after month","features":["Unlimited design requests queue","Print + digital collateral","Packaging & merchandise design"],"highlighted":true}],"faq":[{"question":"What file formats will I receive?","answer":"You receive print-ready PDFs plus PNG/JPG exports and editable source files (AI/PSD/Figma)."},{"question":"How many revisions are included?","answer":"Each package includes defined revision rounds — typically enough to land exactly where you want."}],"relatedProjects":["renkli-paints","unique-sneakers-shoe-store","bootstrap-business-website"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into services (id, data) values (4, $item${"slug":"social-media","title":"Social Media Management","icon":"bi-megaphone","color":"#0dcaf0","tagline":"Strategic social media that grows your business.","heroTitle":"Social Media Management","heroSubtitle":"Data-driven strategies that build relationships, increase awareness, and generate leads.","heroImage":"/img/features-illustration-3.webp","overview":["In today's digital landscape, social media is more than just posting content — it's about building relationships and driving engagement.","Our social media experts create data-driven strategies that increase brand awareness and generate leads.","We handle everything from content calendars to community management and paid campaigns."],"benefits":[{"icon":"bi-calendar-week","title":"Consistent Presence","description":"Planned, on-brand content published on schedule."},{"icon":"bi-chat-heart","title":"Community Building","description":"Real engagement that turns followers into customers."},{"icon":"bi-cash-coin","title":"ROI-Focused Ads","description":"Targeted campaigns optimized for measurable returns."},{"icon":"bi-bar-chart-line","title":"Transparent Reporting","description":"Clear monthly reports on growth and performance."}],"process":[{"title":"Audit & Strategy","description":"We review your channels and craft a platform-specific strategy."},{"title":"Content Calendar","description":"A monthly plan of posts, stories, and campaigns for approval."},{"title":"Publishing & Engagement","description":"We publish content and actively engage your community."},{"title":"Analyze & Optimize","description":"Performance reviews steer next month's plan for compounding growth."}],"deliverables":["Monthly content calendar","Designed posts, stories & reels","Community management","Paid ad campaign management","Monthly analytics report"],"tools":["Meta Business Suite","Instagram","LinkedIn","X (Twitter)","TikTok","Buffer"],"packages":[{"name":"Basic Package","tagline":"For startups and small businesses","features":["3 posts per week","Platform management","Monthly analytics report"],"highlighted":false},{"name":"Premium Package","tagline":"For businesses ready to scale","features":["Daily posts & stories","Paid ad management","Weekly strategy calls","Influencer outreach"],"highlighted":true}],"faq":[{"question":"Which platforms should my business be on?","answer":"We recommend based on where your audience actually spends time — most B2C brands start with Instagram/Facebook, B2B with LinkedIn."},{"question":"Do you create the content too?","answer":"Yes — copywriting, graphic design, and short-form video editing are all included."}],"relatedProjects":["social-lynx","unique-hair-barber-shop-website","renkli-paints"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into services (id, data) values (5, $item${"slug":"cms","title":"Custom CMS Solutions","icon":"bi-layout-text-sidebar","color":"#6c757d","tagline":"Tailored content management for your business.","heroTitle":"Custom CMS Solutions","heroSubtitle":"Complete control over your website content — intuitive, secure, and designed specifically for your needs.","heroImage":"/img/illustration-1.webp","overview":["We build custom content management systems that give you complete control over your website without compromising on design or functionality.","Our CMS solutions are intuitive, secure, and designed specifically for your content needs — no bloated plugins or features you'll never use.","Edit pages, publish posts, and manage media with an admin experience your team will actually enjoy."],"benefits":[{"icon":"bi-speedometer2","title":"Tailored Dashboard","description":"Built around your exact workflow, not a generic template."},{"icon":"bi-person-gear","title":"Roles & Permissions","description":"Granular access control for teams of any size."},{"icon":"bi-images","title":"Media Management","description":"Organized, searchable asset libraries."},{"icon":"bi-search","title":"Built-in SEO Tools","description":"Metadata, sitemaps, and redirects managed in one place."}],"process":[{"title":"Content Audit","description":"We map what content you have and how it needs to be structured."},{"title":"System Design","description":"Content models and admin workflows designed for your team."},{"title":"Build & Migrate","description":"Development plus migration of your existing content."},{"title":"Training & Handover","description":"Your team trained with documentation for confident day-one use."}],"deliverables":["Custom admin dashboard","User roles & permissions","Media management module","Content migration","Team training session","Documentation"],"tools":["Laravel","Next.js","WordPress","Strapi","MySQL","PostgreSQL"],"packages":[{"name":"Lightweight CMS","tagline":"Simple editing for brochure sites","features":["Page & post editing","Media library","Basic SEO fields"],"highlighted":false},{"name":"Enterprise CMS","tagline":"Multi-user, multi-language platforms","features":["Custom content models","Workflow approvals","Multi-language support","Integrations & APIs"],"highlighted":true}],"faq":[{"question":"Custom CMS or WordPress?","answer":"WordPress suits many sites; we recommend custom when you need specific workflows, tighter security, or cleaner long-term maintenance."},{"question":"Can non-technical staff use it?","answer":"Yes — usability is a core requirement. We train your team until they're comfortable."}],"relatedProjects":["cv-builder","social-lynx","bootstrap-business-website"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into services (id, data) values (6, $item${"slug":"seo","title":"SEO & Optimization","icon":"bi-search","color":"#212529","tagline":"Increase visibility & drive qualified traffic.","heroTitle":"SEO & Optimization Services","heroSubtitle":"Sustainable, white-hat strategies that improve rankings and turn traffic into revenue.","heroImage":"/img/about-2.webp","overview":["Our SEO services go beyond keywords to deliver comprehensive optimization strategies that improve your search rankings and drive targeted traffic.","We focus on sustainable, white-hat techniques that deliver long-term results instead of risky shortcuts.","From technical audits to conversion optimization, we make sure your site performs at every level."],"benefits":[{"icon":"bi-rocket-takeoff","title":"Faster Load Times","description":"Page speed improvements that boost rankings and UX."},{"icon":"bi-keyword","title":"Right Keywords","description":"Target terms your buyers actually search for."},{"icon":"bi-link-45deg","title":"Quality Backlinks","description":"White-hat link building that compounds over time."},{"icon":"bi-funnel","title":"Higher Conversions","description":"CRO turns the traffic you earn into customers."}],"process":[{"title":"Technical Audit","description":"Full crawl to identify and prioritize website issues."},{"title":"Keyword Strategy","description":"Research mapping search terms to pages and intent."},{"title":"On-Page Optimization","description":"Content, metadata, and structure improvements rolled out."},{"title":"Measure & Iterate","description":"Analytics dashboards track wins and guide ongoing work."}],"deliverables":["Technical SEO audit report","Keyword research document","On-page optimizations","Link building campaign","Analytics setup & dashboard","Monthly performance report"],"tools":["Google Analytics","Google Search Console","Ahrefs","SEMrush","PageSpeed Insights","Screaming Frog"],"packages":[{"name":"SEO Starter","tagline":"Get the fundamentals right","features":["Technical audit + fixes","Keyword research","On-page optimization"],"highlighted":false},{"name":"Growth SEO","tagline":"Ongoing ranking & revenue growth","features":["Everything in Starter","Content strategy & briefs","Link building campaigns","Monthly reporting calls"],"highlighted":true}],"faq":[{"question":"How soon will I see results?","answer":"Technical fixes show impact within weeks; competitive keyword rankings typically improve over 3–6 months."},{"question":"Do you guarantee #1 rankings?","answer":"No honest agency can — we commit to transparent process, measurable growth, and white-hat methods only."}],"relatedProjects":["restaurant-website-moon-grill","unique-hair-barber-shop-website","bootstrap-business-website"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into services (id, data) values (7, $item${"slug":"branding","title":"Brand Identity","icon":"bi-star","color":"#dc3545","tagline":"Create a memorable brand that stands out.","heroTitle":"Brand Identity Services","heroSubtitle":"Comprehensive identities that communicate your values, personality, and promise.","heroImage":"/img/about-5.webp","overview":["Your brand is more than just a logo — it's the entire experience your customers have with your business.","We develop comprehensive brand identities that communicate your values, personality, and promise to your audience.","From strategy through guidelines and collateral, everything is built to make your brand unmistakable."],"benefits":[{"icon":"bi-compass","title":"Clear Positioning","description":"Strategy that defines who you are and why it matters."},{"icon":"bi-eyedropper","title":"Distinctive Visuals","description":"Logos, colors, and typography uniquely yours."},{"icon":"bi-journal-bookmark","title":"Brand Guidelines","description":"Rules that keep every application consistent."},{"icon":"bi-mic","title":"Brand Voice","description":"Messaging frameworks for how you sound everywhere."}],"process":[{"title":"Brand Strategy","description":"Workshops to define mission, values, audience, and positioning."},{"title":"Identity Design","description":"Logo, color palette, and typography exploration and selection."},{"title":"Asset Creation","description":"Stationery, collateral, and templates brought into the system."},{"title":"Guidelines & Rollout","description":"A complete brand book plus launch-ready asset library."}],"deliverables":["Brand strategy document","Logo suite (primary, secondary, icon)","Color palette & typography system","Brand guidelines book","Business stationery set","Marketing collateral templates"],"tools":["Adobe Illustrator","Figma","Adobe InDesign","Notion","Miro"],"packages":[{"name":"Identity Essentials","tagline":"A sharp, professional core identity","features":["Logo suite","Color & typography system","Mini style guide"],"highlighted":false},{"name":"Full Brand System","tagline":"Everything a serious brand needs","features":["Brand strategy workshops","Complete guidelines book","Stationery & collateral kit","Brand voice framework"],"highlighted":true}],"faq":[{"question":"I already have a logo — can you still help?","answer":"Yes. We can refine what exists or expand it into a complete identity system."},{"question":"What's included in brand guidelines?","answer":"Usage rules for logo, colors, type, imagery, voice, and examples across print and digital touchpoints."}],"relatedProjects":["renkli-paints","unique-sneakers-shoe-store","unique-hair-barber-shop-website"]}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;

-- ------------------------------------------------------------
-- gallery
-- ------------------------------------------------------------
create table if not exists gallery (
  id bigint primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Locked down by default: no public policies, all access goes through
-- the Next.js server using the service role key (which bypasses RLS).
alter table gallery enable row level security;

insert into gallery (id, data) values (1, $item${"title":"CV Builder","category":"Web Design","image":"/img/portfolio/portfolio-9.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (2, $item${"title":"Social Lynx","category":"Branding","image":"/img/portfolio/portfolio-8.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (3, $item${"title":"Unique Hair","category":"Web Design","image":"/img/portfolio/portfolio-1.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (4, $item${"title":"Unique Sneakers","category":"E-commerce","image":"/img/portfolio/portfolio-2.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (5, $item${"title":"Full-Featured E-commerce","category":"E-commerce","image":"/img/portfolio/portfolio-3.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (6, $item${"title":"Renkli Paints","category":"Branding","image":"/img/portfolio/portfolio-4.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (7, $item${"title":"Business Website","category":"Web Design","image":"/img/portfolio/portfolio-5.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (8, $item${"title":"To Do List App","category":"UI/UX","image":"/img/portfolio/portfolio-6.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into gallery (id, data) values (9, $item${"title":"Moon Grill Restaurant","category":"Web Design","image":"/img/portfolio/portfolio-7.png"}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;

-- ------------------------------------------------------------
-- brands
-- ------------------------------------------------------------
create table if not exists brands (
  id bigint primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Locked down by default: no public policies, all access goes through
-- the Next.js server using the service role key (which bypasses RLS).
alter table brands enable row level security;

insert into brands (id, data) values (1, $item${"name":"CV Toolscase","logo":"/img/clients/client-1.png","website":"https://cv.toolscase.com/","description":"Free online CV builder with modern templates and instant PDF downloads."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (2, $item${"name":"Social Lynx","logo":"/img/clients/client-2.png","website":"https://www.sociallynx.com/home","description":"A community connecting creators with real, global followers."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (3, $item${"name":"Unique Hair","logo":"/img/clients/client-3.png","website":"https://unique-hair.netlify.app/","description":"Modern barber shop website with online booking."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (4, $item${"name":"Moon Grill","logo":"/img/clients/client-4.png","website":"https://moongrill.netlify.app/","description":"Restaurant brand serving fresh ingredients and bold flavors."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (5, $item${"name":"Renkli Paints","logo":"/img/clients/client-5.png","website":"https://renklipaints.netlify.app/","description":"Adding color and vitality to homes across the nation since 2024."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (6, $item${"name":"Unique Sneakers","logo":"/img/clients/client-6.png","website":"https://unique-sneakers.netlify.app/","description":"Stylish e-commerce experience for a sneaker brand."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (7, $item${"name":"ToolsCase","logo":"/img/clients/client-7.jpg","website":"#","description":"A growing suite of free online tools and utilities."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into brands (id, data) values (8, $item${"name":"Red Shopping Store","logo":"/img/clients/client-8.png","website":"https://red-shopping-store.netlify.app","description":"Full-featured online shopping platform for sneakers."}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;


-- ------------------------------------------------------------
-- team (people shown in the About page team section)
-- ------------------------------------------------------------
create table if not exists team (
  id bigint primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Locked down by default: no public policies, all access goes through
-- the Next.js server using the service role key (which bypasses RLS).
alter table team enable row level security;

insert into team (id, data) values (1, $item${"name": "Umer", "role": "Co-Founder & Creative Director", "image": "/img/co-founder/umer.png", "bio": "Sets the visual direction and keeps every project honest about what it is trying to achieve.", "order": 1}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into team (id, data) values (2, $item${"name": "Design Team", "role": "UI/UX & Brand Design", "image": "/img/avatar-2.webp", "bio": "Interfaces, identity systems, and the documentation that keeps them consistent as you grow.", "order": 2}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into team (id, data) values (3, $item${"name": "Engineering Team", "role": "Web & CMS Development", "image": "/img/avatar-3.webp", "bio": "Front-end craft and back-end plumbing, built to be handed over and still easy to live with.", "order": 3}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;
insert into team (id, data) values (4, $item${"name": "Growth Team", "role": "Social Media & SEO", "image": "/img/avatar-4.webp", "bio": "Content calendars, campaign reporting, and the unglamorous optimisation work that compounds.", "order": 4}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;


-- ------------------------------------------------------------
-- site (single settings record: brand name, logo, contact details)
-- ------------------------------------------------------------
create table if not exists site (
  id bigint primary key,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table site enable row level security;

insert into site (id, data) values (1, $item${"id":1,"siteName":"UNOVA","tagline":"UI/UX design, web development & digital marketing agency in Lahore, Pakistan","description":"UNOVA is a Lahore-based digital agency delivering UI/UX design, web development, graphic design, SEO and social media marketing for brands that want to stand out.","logo":"/img/UNOVA.png","favicon":"/img/favicon.png","appleIcon":"/img/apple-touch-icon.png","ogImage":"/opengraph-image","phone":"+92 309 4785572","whatsapp":"923094785572","email":"connectunova@gmail.com","address":{"street":"Arooj Center, Fareed Kot Road","city":"Lahore","region":"Punjab","postalCode":"54660","country":"Pakistan","countryCode":"PK"},"businessHours":"Mon – Sat, 10:00 AM – 7:00 PM","mapUrl":"","showTeamSection":true,"theme":{"accent":"#0d83fd","heading":"#2d465e","text":"#212529","lightBg":"#f3f9ff"},"socials":{"facebook":"","instagram":"","linkedin":"","youtube":"","behance":"","dribbble":"","x":""}}$item$::jsonb)
  on conflict (id) do update set data = excluded.data;


-- ------------------------------------------------------------
-- media (image uploads from the admin panel)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
)
  on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Uploads are written with the service role key (which bypasses RLS), so the
-- only policy needed is public read access for displaying images.
drop policy if exists "Public read access for media" on storage.objects;
create policy "Public read access for media"
  on storage.objects for select
  using (bucket_id = 'media');

