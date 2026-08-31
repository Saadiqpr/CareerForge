"use client";

import React, { useState } from "react";
import AppShell from "@/components/AppShell";
import { Briefcase, Building2, MapPin, Plus, Trash2, Zap, DollarSign, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobApplication {
  id: string;
  role: string;
  company: string;
  location: string;
  stage: "Saved" | "Applied" | "Interviewing" | "Offer" | "Archived";
  salary: string;
  dateAdded: string;
}

const INITIAL_JOBS: JobApplication[] = [
  {
    id: "j1",
    role: "Senior Frontend AI Engineer",
    company: "Anthropic Ecosystem / Partner",
    location: "Remote / San Francisco",
    stage: "Interviewing",
    salary: "$165k - $195k",
    dateAdded: "Aug 2026",
  },
  {
    id: "j2",
    role: "Fullstack AI UI Architect",
    company: "Vercel Ecosystem",
    location: "Remote",
    stage: "Applied",
    salary: "$150k - $180k",
    dateAdded: "Aug 2026",
  },
  {
    id: "j3",
    role: "Lead Frontend Engineer (Design Systems)",
    company: "Linear / Modern DevTools",
    location: "Remote",
    stage: "Offer",
    salary: "$160k - $185k",
    dateAdded: "Jul 2026",
  },
];

const STAGES: JobApplication["stage"][] = [
  "Saved",
  "Applied",
  "Interviewing",
  "Offer",
  "Archived",
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [filterStage, setFilterStage] = useState<string>("All");

  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Remote");
  const [stage, setStage] = useState<JobApplication["stage"]>("Saved");
  const [salary, setSalary] = useState("$150k - $180k");

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;

    const newJob: JobApplication = {
      id: `j-${Date.now()}`,
      role: role.trim(),
      company: company.trim(),
      location: location.trim() || "Remote",
      stage,
      salary: salary.trim() || "Negotiable",
      dateAdded: "Just now",
    };

    setJobs([newJob, ...jobs]);
    setRole("");
    setCompany("");
  };

  const handleStageChange = (id: string, newStage: JobApplication["stage"]) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, stage: newStage } : j)));
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const filteredJobs = filterStage === "All" ? jobs : jobs.filter((j) => j.stage === filterStage);

  const getStageBadge = (stg: JobApplication["stage"]) => {
    switch (stg) {
      case "Offer":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20";
      case "Interviewing":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20";
      case "Applied":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20";
      case "Saved":
        return "bg-purple-500/20 text-purple-300 border-purple-500/40";
      case "Archived":
        return "bg-slate-500/20 text-slate-400 border-slate-500/40";
    }
  };

  return (
    <AppShell>
      <section className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
              <Briefcase className="h-3 w-3" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Active Job Pipeline
            </p>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Keep every high-leverage <span className="gradient-text-vibrant">opportunity moving</span>.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Track active interview processes, compensation bands, and target technical roles in one unified board.
          </p>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4">
          {["All", ...STAGES].map((s) => {
            const count = s === "All" ? jobs.length : jobs.filter((j) => j.stage === s).length;
            const isSelected = filterStage === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStage(s)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md shadow-cyan-500/25 font-extrabold"
                    : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Add Job Application Form */}
        <div className="rounded-3xl border border-white/[0.1] bg-[#0c1322]/80 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
          <h2 className="font-[var(--font-space-grotesk)] text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Add New Target Application
          </h2>
          <form onSubmit={handleAddJob} className="grid gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Target Role (e.g. Lead Frontend AI Engineer)"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <div>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company Name"
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
            <div>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as JobApplication["stage"])}
                className="w-full rounded-xl border border-white/[0.1] bg-slate-900/80 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s} className="bg-slate-900 text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button
                type="submit"
                disabled={!role.trim() || !company.trim()}
                className="gradient-btn w-full gap-1.5 rounded-xl text-xs h-10 font-bold"
              >
                <Plus className="h-3.5 w-3.5" />
                Track Role
              </Button>
            </div>
          </form>
        </div>

        {/* Applications List */}
        <div className="space-y-3.5">
          {filteredJobs.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c1322]/60 p-10 text-center text-sm text-slate-400">
              No applications currently tracked in the &ldquo;{filterStage}&rdquo; stage.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 shadow-lg gap-4 hover:border-cyan-500/40 hover:bg-slate-900/90 transition duration-300"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="font-[var(--font-space-grotesk)] text-base font-bold text-white">
                      {job.role}
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getStageBadge(
                        job.stage
                      )}`}
                    >
                      {job.stage}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-semibold text-cyan-300">
                      <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {job.location}
                    </span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <select
                    value={job.stage}
                    onChange={(e) => handleStageChange(job.id, e.target.value as JobApplication["stage"])}
                    className="rounded-xl border border-white/[0.1] bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-cyan-300 focus:border-cyan-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s} className="bg-slate-900 text-white">
                        Move to: {s}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteJob(job.id)}
                    aria-label={`Delete job application: ${job.role} at ${job.company}`}
                    className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 h-8 px-2.5 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AppShell>
  );
}