"use client";

import { motion } from "framer-motion";
import { HeroOrbital } from "@/components/HeroOrbital";
import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Terminal, Shield, ArrowRight } from "lucide-react";
import { UserRole } from "@/lib/mockData";

export default function LandingPage() {
  const { setRole } = useAppStore();
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setRole(role);
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-base">
      <HeroOrbital />

      <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col pt-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent flex items-center justify-center text-base">
              <Terminal size={24} />
            </div>
            <div className="h-px bg-border flex-1 max-w-[100px]" />
            <span className="text-secondary font-mono text-sm tracking-widest uppercase">AI-Powered Freelancing</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground tracking-tighter mb-8 leading-none">
            OrbitFlow<span className="text-accent inline-block animate-pulse">_</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-body max-w-xl leading-relaxed border-l-2 border-border pl-6 py-2">
            The AI-powered platform that connects great employers with top freelancers. Projects scoped, delivered, and verified automatically.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl self-end">
          <RoleCard
            title="I'm Hiring"
            id="EMPLOYER"
            description="Post a project, set your budget, and let AI break it into clear milestones. Track progress from one place."
            icon={Shield}
            color="border-accent hover:bg-accent hover:text-base text-accent"
            onClick={() => handleRoleSelect("employer")}
            delay={0.2}
          />
          <RoleCard
            title="I'm Freelancing"
            id="FREELANCER"
            description="Browse available projects, submit your work, and get paid instantly after AI quality review."
            icon={Terminal}
            color="border-secondary hover:bg-secondary hover:text-base text-secondary"
            onClick={() => handleRoleSelect("freelancer")}
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
}

function RoleCard({ title, id, description, icon: Icon, color, onClick, delay }: any) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative p-8 border-2 bg-panel/80 backdrop-blur-md text-left transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[280px] ${color}`}
    >
      <div className="flex justify-between items-start w-full">
        <Icon size={32} className="transition-colors" />
        <span className="font-mono text-[10px] tracking-widest uppercase opacity-60 group-hover:opacity-100">{id}</span>
      </div>
      
      <div className="mt-8">
        <h2 className="text-3xl font-display font-bold mb-4 tracking-tight transition-colors">{title}</h2>
        <p className="text-sm font-mono leading-relaxed opacity-80 transition-colors line-clamp-3 mb-6">{description}</p>
        
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300">
          Get Started <ArrowRight size={14} />
        </div>
      </div>
    </motion.button>
  );
}


