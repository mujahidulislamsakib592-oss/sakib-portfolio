import { Mail, Phone, Send } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Project, Service, SiteSettings } from "../lib/types";

async function getData() {
  try {
    const [settingsRes, projectsRes, servicesRes] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("created_at", { ascending: false })
    ]);

    return {
      settings: settingsRes.data as SiteSettings | null,
      projects: (projectsRes.data || []) as Project[],
      services: (servicesRes.data || []) as Service[]
    };
  } catch {
    return {
      settings: null,
      projects: [] as Project[],
      services: [] as Service[]
    };
  }
}

export default async function HomePage() {
  const { settings, projects, services } = await getData();
  const site = settings || {
    site_name: "sakib Portfolio",
    owner_name: "Sakib",
    hero_title: "Designing bold visual stories for brands.",
    hero_subtitle: "Premium graphic design, video editing, motion graphics, UI/UX, and creative portfolio work.",
    bio: "Creative designer, editor, and visual storyteller based in Bangladesh.",
    email: "mujahidulislamsakib592@gamil.com",
    phone: "01902913410",
    whatsapp: "01902913410",
    facebook: "",
    instagram: "",
    linkedin: "",
    github: "",
    photo_url: ""
  } as SiteSettings;

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="#home"><span className="mark">SP</span><span>{site.site_name}</span></a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
            <a href="/admin">Admin</a>
          </div>
          <a className="btn primary" href="#contact">Hire Me</a>
        </div>
      </nav>

      <main id="home">
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>{site.hero_title}</h1>
              <p className="lead">{site.hero_subtitle}</p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
                <a className="btn primary" href="#portfolio">View Portfolio</a>
                <a className="btn" href="#contact">Contact</a>
              </div>
            </div>
            <div
              className="panel portrait"
              style={site.photo_url ? ({ "--photo": `url(${site.photo_url})` } as React.CSSProperties) : undefined}
            />
          </div>
        </section>

        <section className="section" id="about">
          <div className="wrap section-head">
            <div>
              <h2>About {site.owner_name}</h2>
              <p className="lead">{site.bio}</p>
            </div>
            <div className="panel">
              <p className="muted"><Mail size={16} /> {site.email}</p>
              <p className="muted"><Phone size={16} /> {site.phone}</p>
              <p className="muted"><Send size={16} /> WhatsApp: {site.whatsapp}</p>
            </div>
          </div>
        </section>

        <section className="section" id="portfolio">
          <div className="wrap">
            <div className="section-head">
              <h2>Portfolio</h2>
              <p className="muted">Projects added from the admin dashboard appear here automatically.</p>
            </div>
            <div className="grid">
              {projects.map((project) => (
                <article className="card" key={project.id}>
                  <div
                    className="project-image"
                    style={project.image_url ? { backgroundImage: `url(${project.image_url})` } : undefined}
                  />
                  <div className="card-body">
                    <h3>{project.title}</h3>
                    <p className="muted">{project.description}</p>
                    <span className="btn">{project.category}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="wrap">
            <div className="section-head">
              <h2>Services</h2>
              <p className="muted">Services can be edited from admin.</p>
            </div>
            <div className="grid">
              {services.map((service) => (
                <article className="card panel" key={service.id}>
                  <h3>{service.title}</h3>
                  <p className="muted">{service.description}</p>
                  <p>{service.price || "Custom"}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <div className="wrap">
            <div className="panel">
              <h2>Contact</h2>
              <p className="lead">Email: {site.email}</p>
              <p className="lead">Phone: {site.phone}</p>
              <p className="lead">WhatsApp: {site.whatsapp}</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">© {new Date().getFullYear()} {site.site_name}. All rights reserved.</div>
      </footer>
    </>
  );
}
