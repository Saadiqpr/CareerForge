"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { User, Github, Linkedin, Save, Check, Sparkles, ShieldCheck, Mail, Globe, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [name, setName] = useState("Saad");
  const [title, setTitle] = useState("Frontend AI Engineer & Fullstack Developer");
  const [email, setEmail] = useState("saad@example.com");
  const [github, setGithub] = useState("https://github.com/Saadiqpr");
  const [linkedin, setLinkedin] = useState("https://linkedin.com/in/saad-ai");
  const [bio, setBio] = useState(
    "Frontend AI Engineer specializing in Next.js 16, React 19, TypeScript, LLM streaming interfaces, and WCAG 2.1 AA accessible design systems. Building production-grade AI career tools."
  );
  const [targetLevel, setTargetLevel] = useState("Senior / L5");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AppShell>
      <section className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
              <User className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
              Engineer Profile & Portfolio Identity
            </p>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Keep your career story <span className="gradient-text-vibrant">ready to share</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Define your technical specialty, target seniority level, and portfolio identity used across CareerForge.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Identity Card */}
          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 text-slate-950 font-black text-base shadow-lg shadow-cyan-500/30">
                  {name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-[var(--font-space-grotesk)] text-base sm:text-lg font-bold text-white">
                    {name}
                  </h2>
                  <p className="text-xs text-cyan-300 font-medium">
                    {title}
                  </p>
                </div>
              </div>

              <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Active Capstone Identity
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Professional Title / Specialization
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Email Contact
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Target Seniority Level
                </label>
                <input
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Elevator Pitch / Professional Summary
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] p-4 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition leading-relaxed"
              />
            </div>
          </div>

          {/* Social & Portfolio Links */}
          <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl space-y-5">
            <h2 className="font-[var(--font-space-grotesk)] text-base font-bold text-white border-b border-white/[0.08] pb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <span>Portfolio & Engineering Links</span>
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <Github className="h-4 w-4 text-cyan-400" /> GitHub Profile
                </label>
                <input
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <Linkedin className="h-4 w-4 text-cyan-400" /> LinkedIn Profile
                </label>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-400">
              Settings persist locally across your CareerForge browser session.
            </p>
            <Button
              type="submit"
              className="gradient-btn gap-2 rounded-xl px-7 h-11 font-bold shadow-lg shadow-indigo-500/25"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}