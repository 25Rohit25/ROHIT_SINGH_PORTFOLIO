import Hero from "@/components/hero";
import ScrollProgress from "@/components/ui/scroll-progress";
import Experience from "@/components/experience";
import Projects from "@/components/projects";
import Skills from "@/components/skills";
import Achievements from "@/components/achievements";
import Certifications from "@/components/certifications";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-[#0f172a]">
      <ScrollProgress />

      {/* 1. Signature 3-Screen Cinematic Hero (100% untouched & functional) */}
      <Hero />

      {/* 2. Professional Engineering Experience (Handshake AI) */}
      <Experience />

      {/* 3. Featured Projects Showcase (Organized Across 5 Core Domains) */}
      <Projects />

      {/* 4. Technical Skills Matrix (Pastel Icon Cards Matching Design Reference) */}
      <Skills />

      {/* 5. Algorithmic Rigor & Achievements (DSA, LeetCode Knight, CodeChef, Academics) */}
      <Achievements />

      {/* 6. Professional Industry Certifications (Microsoft, SAP, Oracle) */}
      <Certifications />

      {/* 7. Social Media Hub & Contact */}
      <Contact />

      {/* 8. Modern Light Footer */}
      <Footer />
    </div>
  );
}
