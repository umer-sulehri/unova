"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteSettings } from "@/components/SiteSettingsProvider";

export type ServiceId =
  | "ui-ux"
  | "web-development"
  | "graphic-design"
  | "social-media"
  | "cms"
  | "seo"
  | "branding";

const servicesNav: { id: ServiceId; icon: string; label: string }[] = [
  { id: "ui-ux", icon: "bi-palette", label: "UI/UX Design" },
  { id: "web-development", icon: "bi-code-slash", label: "Web Development" },
  { id: "graphic-design", icon: "bi-brush", label: "Graphic Design" },
  { id: "social-media", icon: "bi-megaphone", label: "Social Media Management" },
  { id: "cms", icon: "bi-layout-text-sidebar", label: "Custom CMS Solutions" },
  { id: "seo", icon: "bi-search", label: "SEO & Optimization" },
  { id: "branding", icon: "bi-star", label: "Brand Identity" },
];

function PanelHeader({
  icon,
  bg,
  title,
}: {
  icon: string;
  bg: string;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center">
      <div
        className={`mr-3 flex h-[60px] w-[60px] items-center justify-center rounded-full text-white ${bg}`}
      >
        <i className={`bi ${icon} text-2xl`}></i>
      </div>
      <h2 className="mb-0">{title}</h2>
    </div>
  );
}

function CheckList({
  color,
  items,
}: {
  color: string;
  items: React.ReactNode[];
}) {
  return (
    <ul className="m-0 p-0">
      {items.map((item, idx) => (
        <li key={idx} className="mb-3 flex">
          <i
            className="bi bi-check-circle-fill mr-2 mt-1 shrink-0"
            style={{ color }}
          ></i>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TechStack({ items }: { items: string[] }) {
  return (
    <div className="mb-4">
      {items.map((item) => (
        <span key={item} className="badge bg-[#f8f9fa] text-[#212529]">
          {item}
        </span>
      ))}
    </div>
  );
}

function Platform({
  icon,
  color,
  name,
  desc,
  last,
}: {
  icon: string;
  color: string;
  name: string;
  desc: string;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center ${last ? "" : "mb-3"}`}>
      <i className={`bi ${icon} mr-3 text-2xl`} style={{ color }}></i>
      <div>
        <h5 className="mb-0">{name}</h5>
        <small className="text-[#6c757d]">{desc}</small>
      </div>
    </div>
  );
}

function PackageCard({
  title,
  desc,
  items,
}: {
  title: string;
  desc: string;
  items: string[];
}) {
  return (
    <div className="service-package mb-4 rounded-md border-0 bg-white shadow-[0_.125rem_.25rem_rgba(0,0,0,.075)]">
      <div className="p-4">
        <h5>{title}</h5>
        <p className="mb-[1rem] text-[15px]">{desc}</p>
        <ul className="mb-3">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href="/contact" className="btn btn-outline-info btn-sm">
          Learn More
        </Link>
      </div>
    </div>
  );
}

export default function ServiceDetails() {
  const { settings } = useSiteSettings();
  const [active, setActive] = useState<ServiceId>("ui-ux");

  useEffect(() => {
    // Restore panel from URL hash on load (accepts "#ui-ux" or "#ui-ux-content")
    const hash = window.location.hash.replace("#", "").replace("-content", "");
    if (!servicesNav.some((s) => s.id === hash)) return;
    const t = window.setTimeout(() => setActive(hash as ServiceId), 0);
    return () => window.clearTimeout(t);
  }, []);

  const selectService = (id: ServiceId) => {
    setActive(id);
    window.history.pushState(null, "", `#${id}`);
  };

  return (
    <section id="service-details" className="service-details section">
      <div className="bt-container">
        <div className="grid gap-y-8 gap-x-6 lg:grid-cols-12">
          {/* Left Side Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-[120px] max-lg:static max-lg:mb-[30px]">
              <div className="rounded-md border-0 bg-white shadow-[0_.125rem_.25rem_rgba(0,0,0,.075)]">
                <h5 className="m-0 rounded-t-md border-b border-black/10 bg-[#f8f9fa] px-4 py-2 font-heading text-xl font-medium">
                  Our Services
                </h5>
                <nav className="flex flex-col py-3">
                  {servicesNav.map((service) => (
                    <a
                      key={service.id}
                      href={`#${service.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        selectService(service.id);
                      }}
                      className={`flex items-center border-l-[3px] px-[15px] py-3 font-medium transition-all duration-300 ${
                        active === service.id
                          ? "border-accent bg-accent/5 text-accent"
                          : "border-transparent text-default hover:border-accent hover:bg-accent/5 hover:text-accent"
                      }`}
                    >
                      <i className={`bi ${service.icon} mr-2.5 text-lg`}></i>{" "}
                      {service.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-4 rounded-md border-0 bg-white p-4 text-center shadow-[0_.125rem_.25rem_rgba(0,0,0,.075)]">
                <i className="bi bi-headset mb-3 block text-[2.5rem] leading-none text-[#0d6efd]"></i>
                <h5>Need Help Choosing?</h5>
                <p className="mb-3">
                  Not sure which service is right for your business? Let&apos;s
                  discuss your needs.
                </p>
                <Link href="/contact" className="btn btn-primary w-100">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="lg:col-span-8">
            {active === "graphic-design" && (
              <div key="graphic-design" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-brush" bg="bg-[#ffc107]" title="Graphic Design Services" />
                <h3 className="mb-3">Visual Communication That Captivates</h3>
                <p>
                  Our graphic design team creates compelling visual assets that
                  communicate your brand message effectively. From print to
                  digital, we design with purpose and precision to make your
                  brand stand out.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Our Design Services</h4>
                    <CheckList
                      color="#ffc107"
                      items={[
                        <>
                          <strong>Logo Design</strong> - Unique brand identities
                          that make an impact
                        </>,
                        <>
                          <strong>Print Design</strong> - Business cards,
                          brochures, flyers, and more
                        </>,
                        <>
                          <strong>Digital Graphics</strong> - Social media
                          posts, banners, and ads
                        </>,
                        <>
                          <strong>Packaging Design</strong> - Eye-catching
                          product packaging
                        </>,
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">Design Tools</h4>
                    <TechStack
                      items={[
                        "Adobe Photoshop",
                        "Adobe Illustrator",
                        "Adobe InDesign",
                        "Figma",
                        "Canva",
                      ]}
                    />
                    <h4 className="mb-3">Our Approach</h4>
                    <CheckList
                      color="#ffc107"
                      items={[
                        "Strategic design thinking",
                        "Brand-consistent visuals",
                        "Print-ready file preparation",
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-warning mr-2">
                    Discuss Your Project
                  </Link>
                  <a
                    href="https://drive.google.com/drive/folders/11uLoLC0BhyygYcBDFZRKWCrFnfxptyYH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-warning"
                  >
                    View Design Portfolio
                  </a>
                </div>
              </div>
            )}

            {active === "web-development" && (
              <div key="web-development" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-code-slash" bg="bg-[#198754]" title="Web Development Services" />
                <h3 className="mb-3">Building Scalable, High-Performance Websites</h3>
                <p>
                  From simple brochure websites to complex web applications,
                  our development team creates digital solutions that drive
                  results. We combine technical expertise with creative
                  problem-solving to deliver websites that perform.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Development Stack</h4>
                    <TechStack
                      items={[
                        "HTML5/CSS3",
                        "JavaScript",
                        "React.js",
                        "Vue.js",
                        "Node.js",
                        "PHP",
                        "Laravel",
                        "WordPress",
                        "Shopify",
                      ]}
                    />
                    <h4 className="mb-3">Our Approach</h4>
                    <CheckList
                      color="#198754"
                      items={[
                        "Agile development methodology",
                        "Mobile-first responsive coding",
                        "SEO-friendly architecture",
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">Development Services</h4>
                    <CheckList
                      color="#198754"
                      items={[
                        <>
                          <strong>Custom Website Development</strong> - Tailored
                          solutions for your business needs
                        </>,
                        <>
                          <strong>E-Commerce Solutions</strong> - Online stores
                          that convert visitors to customers
                        </>,
                        <>
                          <strong>Web Applications</strong> - Custom business
                          applications and SaaS platforms
                        </>,
                        <>
                          <strong>CMS Development</strong> - Easy-to-update
                          content management systems
                        </>,
                        <>
                          <strong>API Integrations</strong> - Connecting your
                          systems seamlessly
                        </>,
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-success mr-2">
                    Discuss Your Project
                  </Link>
                  <Link href="/projects" className="btn btn-outline-success">
                    View Development Portfolio
                  </Link>
                </div>
              </div>
            )}

            {active === "ui-ux" && (
              <div key="ui-ux" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-palette" bg="bg-[#0d6efd]" title="UI/UX Design Services" />
                <h3 className="mb-3">Crafting Intuitive Digital Experiences</h3>
                <p>
                  At {settings.siteName}, we specialize in creating
                  user-centered designs that not only look stunning but also
                  provide seamless functionality. Our UI/UX design process is
                  rooted in research, strategy, and innovation to deliver
                  interfaces that users love.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Our UI/UX Process</h4>
                    <CheckList
                      color="#0d6efd"
                      items={[
                        <>
                          <strong>User Research</strong> - Understanding your
                          audience through interviews, surveys, and analytics
                        </>,
                        <>
                          <strong>Wireframing</strong> - Creating structural
                          blueprints for optimal user flow
                        </>,
                        <>
                          <strong>Prototyping</strong> - Interactive models to
                          test functionality before development
                        </>,
                        <>
                          <strong>UI Design</strong> - Beautiful, on-brand
                          visual interfaces with pixel-perfect precision
                        </>,
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">What You Get</h4>
                    <CheckList
                      color="#0d6efd"
                      items={[
                        "Mobile-first responsive designs",
                        "Accessibility-compliant interfaces",
                        "Design systems & style guides",
                        "User testing reports",
                        "Ongoing design support",
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-primary mr-2">
                    Get a Free Consultation
                  </Link>
                  <a
                    href="https://drive.google.com/drive/folders/11uLoLC0BhyygYcBDFZRKWCrFnfxptyYH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    View UI/UX Portfolio
                  </a>
                </div>
              </div>
            )}

            {active === "social-media" && (
              <div key="social-media" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-megaphone" bg="bg-[#0dcaf0]" title="Social Media Management" />
                <h3 className="mb-3">Strategic Social Media That Grows Your Business</h3>
                <p>
                  In today&apos;s digital landscape, social media is more than
                  just posting content&mdash;it&apos;s about building
                  relationships and driving engagement. Our social media
                  experts create data-driven strategies that increase brand
                  awareness and generate leads.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Our Social Media Services</h4>
                    <CheckList
                      color="#0dcaf0"
                      items={[
                        <>
                          <strong>Content Strategy</strong> - Planning engaging,
                          platform-specific content
                        </>,
                        <>
                          <strong>Community Management</strong> - Building
                          relationships with your audience
                        </>,
                        <>
                          <strong>Paid Advertising</strong> - Targeted campaigns
                          that deliver ROI
                        </>,
                        <>
                          <strong>Influencer Collaborations</strong> -
                          Partnering with relevant voices in your industry
                        </>,
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">Platforms We Specialize In</h4>
                    <div className="mb-4">
                      <Platform icon="bi-facebook" color="#0d6efd" name="Facebook" desc="Community building & targeted ads" />
                      <Platform icon="bi-instagram" color="#dc3545" name="Instagram" desc="Visual storytelling & influencer marketing" />
                      <Platform icon="bi-linkedin" color="#0d6efd" name="LinkedIn" desc="B2B marketing & professional networking" />
                      <Platform icon="bi-twitter-x" color="#212529" name="Twitter/X" desc="Real-time engagement & thought leadership" last />
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-x-6 md:grid-cols-2">
                  <PackageCard
                    title="Basic Package"
                    desc="Perfect for startups and small businesses"
                    items={[
                      "3 posts per week",
                      "Platform management",
                      "Monthly analytics report",
                    ]}
                  />
                  <PackageCard
                    title="Premium Package"
                    desc="For businesses ready to scale"
                    items={[
                      "Daily posts & stories",
                      "Paid ad management",
                      "Weekly strategy calls",
                      "Influencer outreach",
                    ]}
                  />
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-info mr-2">
                    Get a Social Media Audit
                  </Link>
                </div>
              </div>
            )}

            {active === "cms" && (
              <div key="cms" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-layout-text-sidebar" bg="bg-[#6c757d]" title="Custom CMS Solutions" />
                <h3 className="mb-3">Tailored Content Management for Your Business</h3>
                <p>
                  We build custom content management systems that give you
                  complete control over your website without compromising on
                  design or functionality. Our CMS solutions are intuitive,
                  secure, and designed specifically for your content needs.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">CMS Features</h4>
                    <CheckList
                      color="#6c757d"
                      items={[
                        <>
                          <strong>Custom Dashboard</strong> - Tailored to your
                          workflow
                        </>,
                        <>
                          <strong>User Roles &amp; Permissions</strong> -
                          Control access levels
                        </>,
                        <>
                          <strong>Media Management</strong> - Easy file
                          organization
                        </>,
                        <>
                          <strong>SEO Tools</strong> - Built-in optimization
                          features
                        </>,
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">Why Custom CMS?</h4>
                    <CheckList
                      color="#6c757d"
                      items={[
                        "No unnecessary features or bloat",
                        "Complete ownership of your content",
                        "Scalable as your business grows",
                        "Enhanced security tailored to your needs",
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-secondary mr-2">
                    Discuss Your CMS Needs
                  </Link>
                </div>
              </div>
            )}

            {active === "seo" && (
              <div key="seo" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-search" bg="bg-[#212529]" title="SEO & Optimization Services" />
                <h3 className="mb-3">Increase Visibility & Drive Qualified Traffic</h3>
                <p>
                  Our SEO services go beyond keywords to deliver comprehensive
                  optimization strategies that improve your search rankings and
                  drive targeted traffic to your website. We focus on
                  sustainable, white-hat techniques that deliver long-term
                  results.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Our SEO Services</h4>
                    <CheckList
                      color="#212529"
                      items={[
                        <>
                          <strong>Technical SEO Audit</strong> - Identify and
                          fix website issues
                        </>,
                        <>
                          <strong>Keyword Research</strong> - Target the right
                          search terms
                        </>,
                        <>
                          <strong>On-Page Optimization</strong> - Content and
                          structure improvements
                        </>,
                        <>
                          <strong>Link Building</strong> - Quality backlink
                          acquisition
                        </>,
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">Performance Optimization</h4>
                    <CheckList
                      color="#212529"
                      items={[
                        <>
                          <strong>Page Speed Optimization</strong> - Faster
                          loading times
                        </>,
                        <>
                          <strong>Mobile Optimization</strong> - Better mobile
                          experience
                        </>,
                        <>
                          <strong>Conversion Rate Optimization</strong> - Turn
                          visitors into customers
                        </>,
                        <>
                          <strong>Analytics Setup</strong> - Track and measure
                          performance
                        </>,
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-dark mr-2">
                    Get a Free SEO Audit
                  </Link>
                </div>
              </div>
            )}

            {active === "branding" && (
              <div key="branding" className="animate-[fade-in_0.5s_ease-in-out]">
                <PanelHeader icon="bi-star" bg="bg-[#dc3545]" title="Brand Identity Services" />
                <h3 className="mb-3">Create a Memorable Brand That Stands Out</h3>
                <p>
                  Your brand is more than just a logo&mdash;it&apos;s the
                  entire experience your customers have with your business. We
                  develop comprehensive brand identities that communicate your
                  values, personality, and promise to your audience.
                </p>

                <div className="mt-4 grid gap-x-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Branding Services</h4>
                    <CheckList
                      color="#dc3545"
                      items={[
                        <>
                          <strong>Brand Strategy</strong> - Define your
                          brand&apos;s core identity
                        </>,
                        <>
                          <strong>Logo Design</strong> - Distinctive visual
                          identity
                        </>,
                        <>
                          <strong>Color Palette</strong> - Strategic color
                          selection
                        </>,
                        <>
                          <strong>Typography</strong> - Font system that
                          reflects your brand
                        </>,
                      ]}
                    />
                  </div>
                  <div>
                    <h4 className="mb-3">Brand Assets</h4>
                    <CheckList
                      color="#dc3545"
                      items={[
                        <>
                          <strong>Brand Guidelines</strong> - Rules for
                          consistent application
                        </>,
                        <>
                          <strong>Business Stationery</strong> - Business cards,
                          letterheads
                        </>,
                        <>
                          <strong>Marketing Collateral</strong> - Brochures,
                          flyers, presentations
                        </>,
                        <>
                          <strong>Brand Voice</strong> - Tone and messaging
                          guidelines
                        </>,
                      ]}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Link href="/contact" className="btn btn-danger mr-2">
                    Start Your Branding Project
                  </Link>
                  <a
                    href="https://drive.google.com/drive/folders/11uLoLC0BhyygYcBDFZRKWCrFnfxptyYH"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-danger"
                  >
                    View Branding Portfolio
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
