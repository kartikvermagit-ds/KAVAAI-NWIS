import React from 'react';
import { ArrowRight, Shield, Award } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  subRole: string;
  image: string;
  github?: string;
  linkedin?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'VAISHNAV KANT',
    role: 'Systems & Platform',
    subRole: 'Platform & Architecture',
    image: '/team/vaishnav.jpg',
  },
  {
    name: 'ASMITA SHUKLA',
    role: 'PPT & Core Research',
    subRole: 'Research & Documentation',
    image: '/team/asmita.jpg',
  },
  {
    name: 'AASTHA KUMARI',
    role: 'Security & Research',
    subRole: 'Infrastructure & Audit',
    image: '/team/aastha.jpg',
  },
  {
    name: 'KARTIK VERMA',
    role: 'Backend & AI',
    subRole: 'Architecture & Pipelines',
    image: '/team/kartik.jpg',
  },
  {
    name: 'KRISHNA KUMAR',
    role: 'Frontend',
    subRole: 'UI & Interaction Design',
    image: '/team/krishna.jpg',
  },
  {
    name: 'AMAN KUMAR',
    role: 'UX and Data & RAG',
    subRole: 'Knowledge & UX Systems',
    image: '/team/aman.jpg',
  },
];

export const OurTeamSection: React.FC = () => {
  return (
    <section className="relative z-10 py-12 border-t border-[#123A5A]/80 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 text-left">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-white font-mono uppercase">
              OUR TEAM
            </h2>
          </div>
          <div className="text-amber-400 font-mono text-sm font-semibold tracking-wide">
            Engineers. Researchers. Builders.
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-sans leading-relaxed">
            A multidisciplinary team passionate about building KAVAAI-NWIS drilling intelligence & AI solutions for Smart India Hackathon 2026.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#071626] border border-amber-500/50 text-amber-300 font-mono text-xs font-semibold shadow-sm">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>TEAM KAVAAI • SIH 2026</span>
          </div>
        </div>
      </div>

      {/* Team Cards Grid (6 Members) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            className="group relative bg-[#071424]/90 backdrop-blur-sm border border-[#143354] hover:border-amber-500/70 rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Circular Portrait with Glow Ring */}
            <div className="pt-2 pb-3">
              <div className="relative w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-[0_0_16px_rgba(34,211,238,0.35)] group-hover:shadow-[0_0_22px_rgba(245,158,11,0.5)] group-hover:from-amber-400 group-hover:to-cyan-400 transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#071424]"
                  onError={(e) => {
                    // Fallback to avatar placeholder if image loading fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>

            {/* Member Details */}
            <div className="space-y-1">
              <h3 className="font-mono font-bold text-xs sm:text-sm text-white tracking-wider leading-tight group-hover:text-amber-300 transition-colors">
                {member.name}
              </h3>
              <div className="text-[11px] font-sans font-semibold text-amber-400 leading-tight">
                {member.role}
              </div>
              <div className="text-[10px] font-mono text-cyan-400/80 leading-tight pt-0.5">
                {member.subRole}
              </div>
            </div>

            {/* Subtle bottom index badge */}
            <div className="pt-3 border-t border-[#123150]/60 mt-3 flex items-center justify-center">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                MEMBER 0{idx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
