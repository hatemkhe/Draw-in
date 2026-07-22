/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Gamepad2, 
  Code2, 
  Instagram, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Lock, 
  ArrowUpRight, 
  Cpu, 
  Heart, 
  Monitor,
  Terminal,
  Calendar,
  Layers3,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Single translation dictionary for English (LTR)
const t = {
  navHome: "Home",
  navProjects: "Projects",
  navContact: "Connect & Support",
  heroName: "Khemamssa Hatem 🇩🇿",
  heroTitle: "Freelance Programmer & Game Developer",
  heroBio: "I specialize in developing immersive, highly interactive video games using Godot and Unity, and engineering clean, optimized logic across various languages including C++, C#, GDScript, and Python.",
  skillsTitle: "Core Skills & Technologies",
  engineTitle: "Game Engines",
  languagesTitle: "Programming Languages",
  ctaProjects: "Explore My Projects",
  projectsTitle: "My Projects",
  projectsSubtitle: "A curated showcase of active games, production tools, and scheduled releases for 2026 and 2027.",
  liveProjectBadge: "Live Project",
  upcoming2026Badge: "Roadmap 2026",
  upcoming2027Badge: "Pipeline 2027",
  actionPlay: "Play / View Project",
  actionInDev: "In Development",
  mcCommandsTitle: "MC Commands - Minecraft",
  mcCommandsDesc: "An advanced, interactive command-helper utility and reference companion for Minecraft players. Seamlessly construct, test, and copy command strings to automate and shape massive worlds.",
  todoTitle: "To Do List",
  todoDesc: "A sleek, highly interactive task management and scheduling web app optimized for daily freelance and developer tasks.",
  drawInTitle: "Draw In",
  drawInDesc: "An intuitive web-based drawing and digital canvas application built for creative sketching, canvas manipulation, and artwork export.",
  placeholderTitle2026: "Roadmap 2026 Project",
  placeholderDesc2026: "An independent gameplay system or tool currently in concept phase. Slated for design and release later this year.",
  placeholderTitle2027: "Pipeline 2027 Prototype",
  placeholderDesc2027: "Conceptual system architecture, graphics rendering pipeline, or gameplay prototype slated for early 2027.",
  connectTitle: "Connect & Support",
  connectSubtitle: "Follow my official Instagram feed or support my independent development projects directly.",
  instagramLabel: "My Instagram",
  supportLabel: "Support Me - Free",
  copyright: "© 2026 Khemamssa Hatem. All rights reserved. Designed with precision.",
  activeProjectsTitle: "Active Projects",
  openProject: "Play / View Project",
  future2026Title: "Roadmap 2026",
  future2026Subtitle: "upcoming games & engines",
  future2027Title: "Pipeline 2027",
  future2027Subtitle: "prototypes & systems"
};

export default function App() {
  return (
    <div 
      dir="ltr" 
      className="min-h-screen bg-[#020617] dot-grid text-slate-100 selection:bg-blue-600 selection:text-white overflow-x-hidden font-['Inter']"
      id="portfolio-root"
    >
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-1/4 w-[500px] h-[500px] bg-indigo-950/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-10 w-[350px] h-[350px] bg-blue-950/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Modern Frosted Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/40 border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Gamepad2 className="w-5 h-5 text-blue-100" />
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-black animate-pulse" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white tracking-wider block leading-tight">
                Khemamssa Hatem 🇩🇿
              </span>
              <span className="text-xs text-blue-400 font-mono block">
                Game Dev & Freelance
              </span>
            </div>
          </div>

          {/* Nav & Language Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#hero" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200">
                {t.navHome}
              </a>
              <a href="#projects" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200">
                {t.navProjects}
              </a>
              <a href="#connect" className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200">
                {t.navContact}
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center max-w-3xl">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass text-blue-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroTitle}</span>
          </div>

          {/* Display Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-white">
              {t.heroName}
            </span>
          </h1>

          {/* Subheading bio */}
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
            {t.heroBio}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#projects" 
              id="cta-projects-btn"
              className="btn-primary w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold tracking-wide transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 card-hover"
            >
              <span>{t.ctaProjects}</span>
              <ChevronDown className="w-4 h-4" />
            </a>
            
            <a 
              href="#connect" 
              className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 card-hover"
            >
              <span>{t.navContact}</span>
            </a>
          </div>
        </div>

        {/* Skills Section Inside Hero */}
        <div className="w-full mt-20 max-w-5xl">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-500 font-mono">
              {t.skillsTitle}
            </h3>
            <div className="w-16 h-1 bg-blue-500/30 mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engines Card */}
            <div className="glass p-6 rounded-2xl shadow-md card-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/30 text-blue-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{t.engineTitle}</h4>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-semibold text-blue-200 hover:text-white hover:border-white/20 transition-all">
                  Godot Engine (GDScript)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-semibold text-blue-200 hover:text-white hover:border-white/20 transition-all">
                  Unity Engine (C#)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-semibold text-blue-200 hover:text-white hover:border-white/20 transition-all">
                  2D & 3D Gameplay Programming
                </span>
              </div>
            </div>

            {/* Programming Languages Card */}
            <div className="glass p-6 rounded-2xl shadow-md card-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-900/30 text-blue-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">{t.languagesTitle}</h4>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all">
                  C++
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all">
                  C#
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all">
                  GDScript
                </span>
                <span className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-white/5 text-sm font-mono text-slate-300 hover:text-white hover:border-white/20 transition-all">
                  Python
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 md:py-28 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {t.projectsTitle}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {t.projectsSubtitle}
            </p>
            <div className="w-20 h-1 bg-blue-500/30 mx-auto mt-4 rounded-full" />
          </div>

          {/* Part 1: Featured Active Projects */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">
                {t.activeProjectsTitle}
              </h3>
            </div>

            {/* Grid of Active Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Project 1: MC Commands - Minecraft */}
              <div 
                id="project-mc-commands"
                className="glass p-6 rounded-2xl flex flex-col justify-between card-hover border-blue-500/30 overflow-hidden relative"
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 left-0 h-[3px] bg-blue-500" />
                
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-blue-950/40 text-blue-400 border border-blue-900/30">
                      {t.liveProjectBadge}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">2026</span>
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-3">
                    {t.mcCommandsTitle}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.mcCommandsDesc}
                  </p>

                  {/* Built with badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Minecraft UI</span>
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Command Parser</span>
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Web App</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <a 
                    href="https://wunxrvqhoxb8yfdqkti4gi1h4.bolt.host" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-3 px-4 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-2 card-hover"
                  >
                    <span>{t.openProject}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Part 2: Future Roadmap Slots 2026 */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6 border-t border-white/5 pt-8">
              <Lock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                {t.future2026Title} — <span className="text-xs text-slate-500 lowercase normal-case font-normal">{t.future2026Subtitle}</span>
              </h3>
            </div>

            {/* Grid of 3 upcoming slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do List - Live Project in 2026 */}
              <div 
                id="project-todo-list"
                className="glass p-6 rounded-2xl flex flex-col justify-between card-hover border-emerald-500/30 overflow-hidden relative"
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 left-0 h-[3px] bg-emerald-500" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                      {t.liveProjectBadge}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">2026</span>
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-200 mb-3">
                    {t.todoTitle}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.todoDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">React</span>
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Tailwind CSS</span>
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Task Manager</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <a 
                    href="https://tubular-longma-305ef9.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-3 px-4 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-2 card-hover"
                  >
                    <span>{t.openProject}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Draw In - Live Project in 2026 */}
              <div 
                id="project-draw-in"
                className="glass p-6 rounded-2xl flex flex-col justify-between card-hover border-blue-500/30 overflow-hidden relative"
              >
                {/* Decorative element */}
                <div className="absolute top-0 right-0 left-0 h-[3px] bg-blue-500" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md bg-blue-950/40 text-blue-400 border border-blue-900/30">
                      {t.liveProjectBadge}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">2026</span>
                  </div>

                  <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200 mb-3">
                    {t.drawInTitle}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.drawInDesc}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Canvas API</span>
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Web App</span>
                    <span className="text-[11px] font-mono bg-slate-900/60 border border-white/5 text-slate-300 px-2.5 py-1 rounded">Digital Art</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <a 
                    href="https://drawkhe.netlify.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-3 px-4 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-2 card-hover"
                  >
                    <span>{t.openProject}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Placeholder slot 3 */}
              {[3].map((num) => (
                <div 
                  key={`2026-slot-${num}`}
                  id={`slot-2026-${num}`}
                  className="glass p-6 rounded-2xl flex flex-col justify-between opacity-80 card-hover"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {t.upcoming2026Badge}
                      </span>
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                    <h4 className="text-base font-bold text-slate-400 mb-2">
                      {t.placeholderTitle2026} #{num}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      {t.placeholderDesc2026}
                    </p>
                  </div>
                  
                  <button 
                    disabled 
                    className="btn-disabled py-2.5 px-4 rounded-xl text-xs font-bold w-full flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{t.actionInDev}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Part 3: Future Pipeline Slots 2027 */}
          <div>
            <div className="flex items-center gap-2 mb-6 border-t border-white/5 pt-8">
              <Lock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
                {t.future2027Title} — <span className="text-xs text-slate-500 lowercase normal-case font-normal">{t.future2027Subtitle}</span>
              </h3>
            </div>

            {/* Grid of 5 upcoming slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((num) => (
                <div 
                  key={`2027-slot-${num}`}
                  id={`slot-2027-${num}`}
                  className="glass p-5 rounded-2xl flex flex-col justify-between opacity-80 card-hover"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider rounded bg-blue-950/20 text-blue-500 border border-blue-900/20">
                        {t.upcoming2027Badge}
                      </span>
                      <Lock className="w-3 h-3 text-slate-700" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-500 mb-2">
                      {t.placeholderTitle2027} #{num}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-4">
                      {t.placeholderDesc2027}
                    </p>
                  </div>
                  
                  <button 
                    disabled 
                    className="btn-disabled py-2 rounded-xl text-[10px] font-semibold w-full flex items-center justify-center gap-1"
                  >
                    <span>{t.actionInDev}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Connect & Footer Section */}
      <section id="connect" className="relative py-24 border-t border-white/5 overflow-hidden">
        {/* Glow behind buttons */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            {t.connectTitle}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto mb-12">
            {t.connectSubtitle}
          </p>

          {/* Socials & Actions buttons side by side */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto mb-16">
            
            {/* Instagram Button */}
            <a 
              href="https://www.instagram.com/hatemkhe.12?igsh=N29meXdndXpidm1r" 
              target="_blank" 
              rel="noopener noreferrer"
              id="instagram-btn"
              className="btn-secondary w-full sm:w-1/2 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold card-hover"
            >
              <Instagram className="w-5 h-5 text-slate-400 group-hover:text-pink-500 group-hover:scale-110 transition-all duration-300" />
              <span>{t.instagramLabel}</span>
            </a>

            {/* Support Button */}
            <a 
              href="https://apk-file-generation-hnac.bolt.host" 
              target="_blank" 
              rel="noopener noreferrer"
              id="support-btn"
              className="btn-primary w-full sm:w-1/2 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-sm font-bold card-hover"
            >
              <Heart className="w-5 h-5 text-white fill-blue-200/20 group-hover:text-red-400 group-hover:fill-red-500 group-hover:scale-110 transition-all duration-300" />
              <span>{t.supportLabel}</span>
            </a>

          </div>

          <div className="border-t border-white/5 pt-8 mt-8">
            <p className="text-xs text-slate-500">
              {t.copyright}
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
