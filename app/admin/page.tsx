"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Project, Service, SiteSettings } from "../../lib/types";

type Tab = "settings" | "projects" | "services";

const emptyProject = { title: "", category: "Graphic Design", description: "", image_url: "", featured: false };
const emptyService = { title: "", description: "", price: "" };

export default function AdminPage() {
  const [email, setEmail] = useState("mujahidulislamsakib592@gamil.com");
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [tab, setTab] = useState<Tab>("settings");
  const [message, setMessage] = useState("");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [serviceForm, setServiceForm] = useState(emptyService);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionReady(Boolean(data.session));
      if (data.session) loadData();
    });
  }, []);

  async function login() {
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setSessionReady(true);
    await loadData();
  }

  async function logout() {
    await supabase.auth.signOut();
    setSessionReady(false);
  }

  async function loadData() {
    const [settingsRes, projectsRes, servicesRes] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("created_at", { ascending: false })
    ]);
    setSettings(settingsRes.data as SiteSettings);
    setProjects((projectsRes.data || []) as Project[]);
    setServices((servicesRes.data || []) as Service[]);
  }

  async function saveSettings() {
    if (!settings) return;
    const { error } = await supabase.from("site_settings").update(settings).eq("id", 1);
    setMessage(error ? error.message : "Settings saved.");
  }

  async function uploadImage(file: File) {
    const extension = file.name.split(".").pop();
    const fileName = `${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("portfolio-media").upload(fileName, file, { upsert: true });
    if (error) {
      setMessage(error.message);
      return "";
    }
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function saveProject() {
    const { error } = await supabase.from("projects").insert(projectForm);
    setMessage(error ? error.message : "Project added.");
    setProjectForm(emptyProject);
    await loadData();
  }

  async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    setMessage(error ? error.message : "Project deleted.");
    await loadData();
  }

  async function saveService() {
    const { error } = await supabase.from("services").insert(serviceForm);
    setMessage(error ? error.message : "Service added.");
    setServiceForm(emptyService);
    await loadData();
  }

  async function deleteService(id: string) {
    const { error } = await supabase.from("services").delete().eq("id", id);
    setMessage(error ? error.message : "Service deleted.");
    await loadData();
  }

  if (!sessionReady) {
    return (
      <main className="wrap" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div className="panel" style={{ width: "min(460px, 100%)" }}>
          <h1 style={{ fontSize: 42 }}>Admin Login</h1>
          <p className="muted">Log in to edit sakib Portfolio.</p>
          <div className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field" style={{ marginTop: 12 }}>
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <button className="btn primary" style={{ width: "100%", marginTop: 16 }} onClick={login}>Login</button>
          {message && <p className="muted">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <>
      <nav className="nav">
        <div className="wrap nav-inner">
          <a className="brand" href="/"><span className="mark">SP</span><span>sakib Portfolio Admin</span></a>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </nav>
      <main className="wrap admin-shell">
        <aside className="admin-menu">
          <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Website Info</button>
          <button className={tab === "projects" ? "active" : ""} onClick={() => setTab("projects")}>Portfolio Projects</button>
          <button className={tab === "services" ? "active" : ""} onClick={() => setTab("services")}>Services</button>
        </aside>

        <section className="panel">
          {message && <p className="muted">{message}</p>}

          {tab === "settings" && settings && (
            <>
              <h1 style={{ fontSize: 42 }}>Website Info</h1>
              <div className="form-grid">
                <label className="field"><span>Website Name</span><input value={settings.site_name} onChange={(e) => setSettings({ ...settings, site_name: e.target.value })} /></label>
                <label className="field"><span>Your Name</span><input value={settings.owner_name} onChange={(e) => setSettings({ ...settings, owner_name: e.target.value })} /></label>
                <label className="field full"><span>Hero Title</span><input value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} /></label>
                <label className="field full"><span>Hero Subtitle</span><textarea value={settings.hero_subtitle} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} /></label>
                <label className="field full"><span>Bio</span><textarea value={settings.bio} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} /></label>
                <label className="field"><span>Email</span><input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} /></label>
                <label className="field"><span>Phone</span><input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} /></label>
                <label className="field"><span>WhatsApp</span><input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} /></label>
                <label className="field"><span>Photo URL</span><input value={settings.photo_url || ""} onChange={(e) => setSettings({ ...settings, photo_url: e.target.value })} /></label>
                <label className="field full"><span>Upload Photo</span><input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setSettings({ ...settings, photo_url: url });
                }} /></label>
              </div>
              <button className="btn primary" style={{ marginTop: 16 }} onClick={saveSettings}>Save Website Info</button>
            </>
          )}

          {tab === "projects" && (
            <>
              <h1 style={{ fontSize: 42 }}>Portfolio Projects</h1>
              <div className="form-grid">
                <label className="field"><span>Title</span><input value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} /></label>
                <label className="field"><span>Category</span><input value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} /></label>
                <label className="field full"><span>Description</span><textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} /></label>
                <label className="field"><span>Image URL</span><input value={projectForm.image_url} onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })} /></label>
                <label className="field"><span>Upload Image</span><input type="file" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setProjectForm({ ...projectForm, image_url: url });
                }} /></label>
              </div>
              <button className="btn primary" style={{ marginTop: 16 }} onClick={saveProject}>Add Project</button>
              <div className="table">
                {projects.map((project) => (
                  <div className="row" key={project.id}>
                    <span>{project.title}</span>
                    <span className="muted">{project.category}</span>
                    <button className="btn" onClick={() => deleteProject(project.id)}>Delete</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === "services" && (
            <>
              <h1 style={{ fontSize: 42 }}>Services</h1>
              <div className="form-grid">
                <label className="field"><span>Title</span><input value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} /></label>
                <label className="field"><span>Price</span><input value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} /></label>
                <label className="field full"><span>Description</span><textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} /></label>
              </div>
              <button className="btn primary" style={{ marginTop: 16 }} onClick={saveService}>Add Service</button>
              <div className="table">
                {services.map((service) => (
                  <div className="row" key={service.id}>
                    <span>{service.title}</span>
                    <span className="muted">{service.price || "Custom"}</span>
                    <button className="btn" onClick={() => deleteService(service.id)}>Delete</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}
