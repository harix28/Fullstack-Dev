import { motion } from 'framer-motion';
import { Database, Code2, BrainCircuit, Rocket, Activity } from 'lucide-react';

const JOURNEY_STEPS = [
  {
    title: 'Learn',
    description: 'Absorbing complex computer science theories, algorithms, and deep mathematical concepts behind AI/ML.',
    icon: BrainCircuit,
    color: 'from-blue-500 to-cyan-400'
  },
  {
    title: 'Practice',
    description: 'Transforming theory into reality through intense coding sessions, data modeling, and iterative problem solving.',
    icon: Code2,
    color: 'from-cyan-400 to-teal-400'
  },
  {
    title: 'Build',
    description: 'Architecting robust data pipelines, training predictive models, and engineering full-stack architectures.',
    icon: Database,
    color: 'from-teal-400 to-emerald-400'
  },
  {
    title: 'Deploy',
    description: 'Shipping production-ready AI services, interactive dashboards, and scalable APIs to the real world.',
    icon: Rocket,
    color: 'from-emerald-400 to-green-500'
  },
  {
    title: 'Improve',
    description: 'Monitoring metrics, optimizing database queries, reducing model latency, and continuously iterating.',
    icon: Activity,
    color: 'from-green-500 to-lime-400'
  }
];

export default function About() {
  return (
    <section className="relative w-full py-24 px-6 bg-background overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="mb-24 md:mb-32 flex flex-col lg:flex-row gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:w-3/5"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-8 border border-accent/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              ABOUT ME
            </div>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-8 leading-snug">
              I'm Hari Sharma,<br />
              an MCA student focused on <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-500">Data Science, Artificial Intelligence,</span> Machine Learning and modern software development.
            </h3>
            <p className="text-xl text-foreground/70 leading-relaxed border-l-4 border-accent/50 pl-6 bg-gradient-to-r from-accent/5 to-transparent py-2">
              My engineering philosophy revolves around taking complex, massive datasets and turning them into scalable, intelligent products. I bridge the gap between academic machine learning models and high-performance, real-world web applications.
            </p>
          </motion.div>

          {/* Animated Visual */}
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8 }}
             className="lg:w-2/5 relative w-full"
          >
             <div className="relative w-full aspect-square max-w-md mx-auto group">
                {/* Glowing backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/30 to-blue-500/30 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-700 blur-2xl" />
                
                {/* Glassmorphism container */}
                <div className="absolute inset-0 bg-background/60 backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden z-10 shadow-2xl">
                    
                    {/* Animated rings */}
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[120%] h-[120%] border-[1px] border-dashed border-accent/30 rounded-full"
                    />
                    <motion.div 
                        animate={{ rotate: -360 }} 
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute w-[80%] h-[80%] border-[1px] border-blue-500/20 rounded-full"
                    />
                    
                    {/* Center Icon */}
                    <div className="relative z-20 w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                      <Database className="w-10 h-10 text-accent animate-bounce" style={{ animationDuration: '3s' }} />
                    </div>
                    
                    {/* Floating Data Badges */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-10 left-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-blue-300"
                    >
                      SELECT * FROM data;
                    </motion.div>
                    
                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-12 right-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-accent"
                    >
                      model.fit(X, y)
                    </motion.div>

                </div>
             </div>
          </motion.div>
        </div>

        {/* Visual Journey Timeline */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[28px] md:left-1/2 w-[2px] bg-white/10 -translate-x-1/2" />
          
          <div className="flex flex-col gap-20">
            {JOURNEY_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-150px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : 'md:text-left'} pl-16 md:pl-0`}>
                    <h4 className="text-3xl font-bold tracking-tight text-foreground mb-4">{step.title}</h4>
                    <p className="text-lg text-foreground/60 leading-relaxed">{step.description}</p>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-0 md:left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-background border-4 border-background flex items-center justify-center z-10">
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-6 h-6 text-background" />
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
