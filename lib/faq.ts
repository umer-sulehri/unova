export type FaqEntry = { q: string; a: string };

/**
 * Shared by the homepage accordion and the homepage FAQPage JSON-LD.
 * The brand name is injected so copy always follows the admin-managed site name.
 */
export function getHomeFaqs(siteName: string): FaqEntry[] {
  return [
    {
      q: "What services do you offer as a digital agency?",
      a: "We offer a complete range of digital solutions, including Graphic Design, Web & App Development, UI/UX Design, Social Media Management, and overall Digital Branding. Whether you're starting from scratch or want to scale, we've got you covered.",
    },
    {
      q: "How do I get started with your agency?",
      a: "It's simple! Just fill out our contact form or message us directly. We'll schedule a discovery call to understand your goals, suggest a strategy, and share a custom quote or proposal tailored to your needs.",
    },
    {
      q: "How long does a typical project take?",
      a: "Timelines vary depending on the scope. A branding or website design may take 1-3 weeks, while full development projects can range from 4-8 weeks. We always provide clear timelines before starting and keep you updated throughout the process.",
    },
    {
      q: "Can you manage everything for my brand, or do I need to hire multiple teams?",
      a: `Yes! ${siteName} is your one-stop solution. From visual identity and website/app development to social media content and UI/UX optimization, we handle everything in-house so you don't have to juggle multiple teams.`,
    },
  ];
}

/**
 * FAQ shown on the dedicated /contact page. Same shape as `getHomeFaqs` so the
 * page can reuse the accordion markup and the FAQPage JSON-LD builder.
 */
export function getContactFaqs(siteName: string): FaqEntry[] {
  return [
    {
      q: `How quickly will ${siteName} reply?`,
      a: "We answer every enquiry within one business day. If you send something over WhatsApp during our working hours you will usually hear back the same afternoon.",
    },
    {
      q: "What should I include in my first message?",
      a: "The short version: what you need built, who it is for, and roughly when you need it live. A rough budget range helps us reply with something realistic instead of a vague estimate.",
    },
    {
      q: "Do you work with clients outside Pakistan?",
      a: `Yes. ${siteName} works remotely with clients across time zones, and every project runs on shared tools, regular demos and written updates so distance never becomes a problem.`,
    },
    {
      q: "Is the first conversation free?",
      a: "Always. The discovery call and the written summary of what we heard are free, with no obligation. You only commit once the scope and price feel right to you.",
    },
    {
      q: "Can you take over work started by another agency?",
      a: "That happens often. Send over the current site, repository or design files and we will audit what is there, flag the risks and tell you honestly whether it is worth continuing or rebuilding.",
    },
  ];
}
