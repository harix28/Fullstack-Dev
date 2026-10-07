import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, Send, MapPin, Code2, Briefcase, Check } from 'lucide-react';
import { profile } from '../../config/profile';

// Magnetic Button Wrapper
const MagneticWrap = ({ children, className = "inline-block" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt for the form
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize coordinates from -0.5 to 0.5
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      className="relative w-full h-[calc(100vh-5rem)] px-6 bg-background flex items-center justify-center overflow-hidden"
    >
      
      {/* Background Interactive Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <motion.div 
          style={{ x: useTransform(x, [-0.5, 0.5], [-200, 200]), y: useTransform(y, [-0.5, 0.5], [-200, 200]) }}
          className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-accent/40 rounded-full mix-blend-screen filter blur-[150px]"
        />
      </div>

      <div className="max-w-[1400px] mx-auto w-full grid lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Left Side: Interactive Play Area */}
        <div className="relative flex flex-col justify-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative z-10 mb-4"
          >
            <h2 className="text-6xl lg:text-[7rem] font-black tracking-tighter text-foreground leading-[0.85] select-none pointer-events-none">
              Say <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">
                Hello.
              </span>
            </h2>
          </motion.div>

          <MagneticWrap>
            <button 
              onClick={copyEmail}
              className="group relative inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full backdrop-blur-md hover:bg-white/10 hover:border-accent/50 transition-all cursor-pointer overflow-hidden mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Mail className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg text-foreground tracking-wide relative z-10">
                {profile.email}
              </span>
              <AnimatePresence>
                {copied && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute right-4 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </MagneticWrap>

          <div className="mt-6 flex items-center gap-3 text-foreground/40 font-semibold tracking-widest uppercase text-sm">
            <MapPin className="w-4 h-4" /> Location: India
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <h4 className="text-sm font-bold tracking-widest text-foreground/40 uppercase">Find me elsewhere</h4>
            <div className="flex gap-4">
              <MagneticWrap>
                <a 
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-accent/50 transition-all group"
                >
                  <Code2 className="w-5 h-5 text-foreground/60 group-hover:text-accent transition-colors" />
                  <span className="font-bold text-base text-foreground/80 group-hover:text-foreground">GitHub</span>
                </a>
              </MagneticWrap>

              <MagneticWrap>
                <a 
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all group"
                >
                  <Briefcase className="w-5 h-5 text-foreground/60 group-hover:text-blue-500 transition-colors" />
                  <span className="font-bold text-base text-foreground/80 group-hover:text-foreground">LinkedIn</span>
                </a>
              </MagneticWrap>
            </div>
          </div>
          
        </div>

        {/* Right Side: 3D Tilting Form */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          className="flex items-center justify-center perspective-[1200px]"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="w-full max-w-xl relative"
          >
            {/* Multi-layered Glass Card */}
            <div className="relative bg-background/40 border border-white/10 p-8 rounded-[2rem] backdrop-blur-2xl shadow-2xl group overflow-visible">
              
              <div 
                className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
                style={{ transform: "translateZ(10px)" }}
              />

              <form action={`mailto:${profile.email}`} method="POST" encType="text/plain" className="relative z-10 flex flex-col gap-5" style={{ transform: "translateZ(30px)" }}>
                
                <h3 className="text-xl font-bold tracking-widest uppercase text-foreground/80 mb-1 border-b border-white/10 pb-3 inline-block">
                  Drop a message
                </h3>

                {/* Animated Inputs */}
                <div className="relative group/input mt-1">
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-base text-foreground placeholder-transparent focus:outline-none focus:border-accent focus:bg-accent/5 transition-all shadow-inner"
                    placeholder="Name"
                    required 
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute left-5 top-3 text-foreground/40 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-accent peer-focus:font-bold uppercase tracking-widest pointer-events-none"
                  >
                    Your Name
                  </label>
                </div>
                
                <div className="relative group/input mt-2">
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-base text-foreground placeholder-transparent focus:outline-none focus:border-accent focus:bg-accent/5 transition-all shadow-inner"
                    placeholder="Email"
                    required 
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-5 top-3 text-foreground/40 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-accent peer-focus:font-bold uppercase tracking-widest pointer-events-none"
                  >
                    Your Email
                  </label>
                </div>

                <div className="relative group/input mt-2">
                  <textarea 
                    name="message" 
                    id="message" 
                    rows={3}
                    className="peer w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-base text-foreground placeholder-transparent focus:outline-none focus:border-accent focus:bg-accent/5 transition-all shadow-inner resize-none"
                    placeholder="Message"
                    required 
                  />
                  <label 
                    htmlFor="message" 
                    className="absolute left-5 top-3 text-foreground/40 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-6 peer-focus:text-xs peer-focus:text-accent peer-focus:font-bold uppercase tracking-widest pointer-events-none"
                  >
                    Project Details
                  </label>
                </div>

                <MagneticWrap className="block w-full mt-4">
                  <button 
                    type="submit"
                    className="flex items-center justify-center gap-3 w-full py-5 bg-accent text-background hover:bg-white font-black text-xl tracking-wider uppercase rounded-2xl transition-colors duration-300 shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] cursor-pointer"
                  >
                    Shoot
                    <Send className="w-5 h-5" />
                  </button>
                </MagneticWrap>

              </form>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
