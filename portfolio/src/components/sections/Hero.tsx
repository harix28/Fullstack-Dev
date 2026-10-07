import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Download, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import HeroScene from '../three/HeroScene';
import { profile } from '../../config/profile';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center bg-background overflow-hidden">
      {/* 3D WebGL Background Layer */}
      <HeroScene />
      
      {/* Content Layer */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid md:grid-cols-2 gap-12 pointer-events-none">
        
        <div className="flex flex-col justify-center pointer-events-auto pt-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-4"
          >
            Hi, I'm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-accent to-blue-500">
              Hari Sharma.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-foreground/70 max-w-xl mb-10 leading-relaxed font-light"
          >
            {profile.bio}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-5"
          >
            <Link 
              to="/projects" 
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-background bg-accent hover:bg-white transition-colors duration-300 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)]"
            >
              View Projects
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
            
            <a 
              href={profile.resume} 
              target="_blank" 
              download="Hari_Sharma_Resume.pdf"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold text-foreground border border-white/20 hover:bg-white/5 transition-colors duration-300 rounded-full backdrop-blur-sm"
            >
              Download Resume
              <Download className="ml-2 w-4 h-4" />
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex items-center gap-6"
          >
            {[
              { Icon: FaGithub, href: profile.github },
              { Icon: FaLinkedin, href: profile.linkedin },
              { Icon: Mail, href: `mailto:${profile.email}` }
            ].map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className="text-white/40 hover:text-accent transition-colors duration-300"
              >
                <item.Icon className="w-6 h-6" />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right side is intentionally empty to let the 3D scene breathe */}
        <div className="hidden md:block"></div>
        
      </div>
    </section>
  );
}
