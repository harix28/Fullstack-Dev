import { useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

const experienceData = [
  {
    type: "education",
    title: "Master of Computer Applications",
    organization: "KIET Deemed to be University",
    date: "2026 — Expected 2028",
    location: "Ghaziabad, UP",
    description: "Focusing on Data Science, Artificial Intelligence, Machine Learning, and modern software development architectures.",
    icon: GraduationCap
  },
  {
    type: "experience",
    title: "Data Science & AI Intern",
    organization: "Tech Innovators Inc.",
    date: "2025 — 2026",
    location: "Remote",
    description: "Developed and optimized machine learning pipelines for customer churn prediction. Engineered robust data visualizations for stakeholders.",
    icon: Briefcase
  },
  {
    type: "education",
    title: "Bachelor of Computer Applications",
    organization: "University Name",
    date: "2023 — 2026",
    location: "India",
    description: "Core computer science fundamentals, object-oriented programming, and foundational database management.",
    icon: GraduationCap
  }
];

const ExperienceCard = ({ item, index }: { item: any; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.set(x);
    mouseY.set(y);
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Node / Center Icon */}
      <div className="absolute left-[-20px] md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-background border-2 border-accent/50 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)] group-hover:scale-125 transition-transform duration-500">
        <item.icon className="w-4 h-4 text-accent" />
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full border border-accent animate-ping opacity-20" />
      </div>

      {/* Content Box */}
      <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${isEven ? 'md:text-left md:pl-16' : 'md:text-right md:pr-16'}`}>
        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="group relative rounded-3xl p-[1px] overflow-hidden cursor-default transition-transform duration-500 hover:-translate-y-2"
        >
          {/* Spotlight overlay for border */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.4), transparent 40%)`
            }}
          />
          {/* Default Border Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-0 transition-opacity duration-500" />
          
          {/* Inner Card */}
          <div className="relative h-full bg-background/95 backdrop-blur-3xl rounded-[23px] p-8 md:p-10 z-10 flex flex-col gap-4">
            
            {/* Spotlight overlay for inner content */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay rounded-[23px]"
              style={{
                background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.1), transparent 40%)`
              }}
            />

            <div className={`flex flex-col md:flex-row items-start md:items-center gap-3 text-accent text-sm font-bold tracking-wide uppercase ${isEven ? '' : 'md:justify-end'}`}>
              <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
                <Calendar className="w-4 h-4" />
                {item.date}
              </div>
              <div className="flex items-center gap-2 text-foreground/50">
                <MapPin className="w-4 h-4" />
                {item.location}
              </div>
            </div>
            
            <div>
              <h4 className="text-3xl font-bold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-accent transition-colors duration-300">
                {item.title}
              </h4>
              <h5 className="text-xl font-medium text-blue-400">
                {item.organization}
              </h5>
            </div>
            
            <p className="text-foreground/70 leading-relaxed text-base mt-2">
              {item.description}
            </p>
          </div>
        </div>
      </div>

      {/* Empty Spacer for alternating layout */}
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
};

export default function Experience() {
  return (
    <section className="relative w-full py-32 px-6 bg-background min-h-screen overflow-hidden flex flex-col items-center">
      
      {/* Background Ambience & Motion SVG */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden fixed-bg">
        {/* Soft color glows */}
        <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] bg-accent rounded-full mix-blend-screen filter blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 left-0 w-[30vw] h-[30vw] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10" />
        
        {/* Custom Framer Motion SVG Line Drawing (Book) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
          <motion.svg
            width="800"
            height="800"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground w-[150vw] h-[150vw] md:w-[70vw] md:h-[70vw]"
          >
            {/* Left Page */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
            />
            {/* Right Page */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 1 }}
              d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
            />
          </motion.svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        
        {/* Header */}
        <div className="mb-32 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-accent/5 text-accent font-semibold text-sm w-fit border border-accent/20">
              <Briefcase className="w-4 h-4" /> CAREER JOURNEY
            </div>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground leading-[1.1]">
              Experience & <span className="text-transparent bg-clip-text bg-gradient-to-br from-accent to-blue-500">Education.</span>
            </h3>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative ml-4 md:ml-0">
          
          {/* Animated Center Line */}
          <div className="absolute top-0 bottom-0 left-0 md:left-1/2 w-[2px] bg-white/10 md:-translate-x-1/2 overflow-hidden rounded-full">
            <motion.div 
              className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-accent to-transparent"
              animate={{ y: ["-100%", "400%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-32 py-10">
            {experienceData.map((item, index) => (
              <ExperienceCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
