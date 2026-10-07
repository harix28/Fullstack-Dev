import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { skillsData } from '../../data/skills';
import { Code2, Database, BarChart3, Layout, BrainCircuit, LineChart, Wrench } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const categoryIcons: Record<string, any> = {
  "Programming": Code2,
  "Data Science": BarChart3,
  "AI / ML": BrainCircuit,
  "Databases": Database,
  "Visualization": LineChart,
  "Web Development": Layout,
  "Tools & DevOps": Wrench,
};

export default function Skills() {
  return (
    <section className="relative w-full py-32 px-6 bg-background overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* Cyber Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', 
          backgroundSize: '4rem 4rem',
          backgroundPosition: 'center' 
        }} 
      />

      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        
        {/* Header Section */}
        <div className="mb-20 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-sm bg-accent/10 text-accent font-mono text-sm tracking-widest mb-6 border border-accent/20">
              <span className="w-2 h-2 bg-accent animate-pulse" />
              SYSTEM.CAPABILITIES
            </div>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[1.1] uppercase">
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">Arsenal.</span>
            </h3>
          </motion.div>
        </div>

        {/* Cyberpunk Terminal Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {skillsData.map((category, index) => {
            const CategoryIcon = categoryIcons[category.category] || Code2;
            
            return (
              <motion.div 
                key={category.category}
                variants={itemVariants}
                className="group relative bg-[#0a0f1d] backdrop-blur-xl border border-white/5 hover:border-accent/40 transition-colors duration-500 overflow-visible"
                style={{ 
                  clipPath: 'polygon(0 20px, 20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)' 
                }}
              >
                {/* Cyber Corner Accents */}
                <div className="absolute top-0 left-0 w-16 h-[2px] bg-accent/0 group-hover:bg-accent transition-colors duration-500" />
                <div className="absolute top-0 left-0 w-[2px] h-16 bg-accent/0 group-hover:bg-accent transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-16 h-[2px] bg-accent/0 group-hover:bg-accent transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-[2px] h-16 bg-accent/0 group-hover:bg-accent transition-colors duration-500" />
                
                {/* Scanline Effect on Hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/10 to-transparent translate-y-[-100%] group-hover:animate-[scanline_2s_linear_infinite] pointer-events-none" />

                <div className="p-8 h-full flex flex-col relative z-10">
                  
                  {/* Terminal Header */}
                  <div className="flex items-start gap-4 mb-8 pb-5 border-b border-white/10 relative">
                    <div className="p-3 bg-white/5 group-hover:bg-accent/10 group-hover:text-accent text-white/50 rounded-sm transition-colors duration-300">
                      <CategoryIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-accent/70 mb-1 tracking-wider">
                        // MOD.{(index + 1).toString().padStart(2, '0')}
                      </div>
                      <h4 className="text-2xl font-bold tracking-tight text-white uppercase">
                        {category.category}
                      </h4>
                    </div>
                    {/* Blinking cursor aesthetic */}
                    <div className="absolute bottom-[-1px] left-0 w-8 h-[1px] bg-accent group-hover:w-full transition-all duration-700 ease-out" />
                  </div>
                  
                  {/* Hex/Angled Skills Tags */}
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {category.items.map((skill) => (
                      <div 
                        key={skill}
                        className="px-4 py-2 border border-white/10 bg-white/5 text-white/70 group-hover:border-accent/30 group-hover:text-white hover:!bg-accent/20 hover:!border-accent hover:!text-accent transition-all duration-300 text-sm font-medium font-mono cursor-default"
                        style={{ 
                          clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' 
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
