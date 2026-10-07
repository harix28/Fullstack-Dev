import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { projectsData } from '../../data/projects';

// Interactive Project Card Component
const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Spotlight tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring for subtle 3D tilt
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 800], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1000], [-5, 5]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const num = (index + 1).toString().padStart(2, '0');
  const isEven = index % 2 === 0;

  return (
    <motion.a
      ref={cardRef}
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ perspective: 1000 }}
      className="group relative flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full cursor-pointer z-10"
    >
      {/* Dynamic Ambient Glow Behind Card */}
      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none rounded-3xl" />

      {/* Interactive Number */}
      <motion.div 
        style={{ x: useTransform(mouseX, [0, 1000], [-20, 20]), y: useTransform(mouseY, [0, 800], [-20, 20]) }}
        className={`text-[150px] md:text-[250px] font-black leading-none text-white/5 pointer-events-none select-none transition-colors duration-700 group-hover:text-accent/10 ${isEven ? 'md:order-1' : 'md:order-2'}`}
      >
        {num}
      </motion.div>
      
      {/* 3D Tilting Card */}
      <motion.div 
        style={{ rotateX: isHovered ? rotateX : 0, rotateY: isHovered ? rotateY : 0 }}
        className={`relative flex-1 p-1 md:p-[2px] rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent overflow-hidden ${isEven ? 'md:order-2' : 'md:order-1'}`}
      >
        {/* Spotlight Effect overlay */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
          style={{
            background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`
          }}
        />

        <div className="relative h-full bg-background/90 backdrop-blur-3xl rounded-[30px] p-8 md:p-12 border border-white/5 group-hover:border-transparent transition-colors duration-500 overflow-hidden">
          
          {/* Inner Content */}
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-bold tracking-widest text-accent uppercase bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                {project.category}
              </span>
              <div className="flex gap-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <FaGithub className="w-6 h-6 text-foreground group-hover:text-accent group-hover:scale-110 transition-all" />
                {project.liveDemo && (
                  <ExternalLink className="w-6 h-6 text-foreground group-hover:text-accent group-hover:scale-110 transition-all" />
                )}
              </div>
            </div>
            
            <h4 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent transition-all duration-300 transform group-hover:translate-x-2">
              {project.title}
            </h4>
            
            <p className="text-foreground/60 mb-10 text-lg leading-relaxed transform group-hover:translate-x-1 transition-transform duration-500">
              {project.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 mt-auto">
              <AnimatePresence>
                {project.technologies.map((tech: string, i: number) => (
                  <motion.span 
                    key={tech} 
                    initial={{ opacity: 0.8, y: 0 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="text-sm font-medium text-foreground/80 bg-white/5 border border-white/10 px-4 py-2 rounded-xl group-hover:border-accent/30 group-hover:bg-accent/5 transition-colors duration-300"
                  >
                    {tech}
                  </motion.span>
                ))}
              </AnimatePresence>
              
              <div className="ml-auto w-14 h-14 rounded-full bg-white/5 border border-white/10 text-foreground flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-background group-hover:scale-110 transition-all duration-500 overflow-hidden relative">
                <ArrowRight className="w-6 h-6 -rotate-45 absolute transition-all duration-300 group-hover:translate-x-8 group-hover:-translate-y-8" />
                <ArrowRight className="w-6 h-6 -rotate-45 absolute -translate-x-8 translate-y-8 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
};

export default function Projects() {
  return (
    <section className="relative w-full py-32 px-6 bg-background min-h-screen flex flex-col items-center overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-20%] w-[60vw] h-[60vw] bg-accent/20 rounded-full mix-blend-screen filter blur-[150px]" 
        />
        <motion.div 
          animate={{ rotate: -360 }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-20%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[150px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* Header */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
            className="flex flex-col gap-4"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-accent/5 text-accent font-semibold text-sm w-fit border border-accent/20 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              SELECTED WORKS
            </div>
            <h3 className="text-6xl md:text-[7rem] font-black tracking-tighter text-foreground leading-[0.9] drop-shadow-2xl">
              Featured <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent via-blue-400 to-indigo-500">Projects.</span>
            </h3>
          </motion.div>
        </div>

        {/* Project Vertical List */}
        <div className="flex flex-col gap-24 md:gap-40 mt-20">
          {projectsData.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
