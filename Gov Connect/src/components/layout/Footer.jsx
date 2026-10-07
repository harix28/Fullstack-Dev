import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Sparkles } from 'lucide-react';
import ROUTES from '@/constants/routes';
export default function Footer() {
    return (<footer className="bg-[#2D231E] text-white pt-16 pb-12 font-sans border-t border-[#43342B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#59463B] flex items-center justify-center shadow-sm text-white">
                <Shield className="h-5 w-5"/>
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Gov<span className="text-[#A67C65]">Connect</span>
              </span>
            </Link>
            
            <p className="text-[#D5BDAF] text-sm font-semibold tracking-wide">
              One Platform. Every Citizen. Every Opportunity.
            </p>
            
            <p className="text-[#D6CCC2] text-xs sm:text-sm leading-relaxed max-w-sm">
              An AI-assisted unified citizen empowerment college engineering capstone project. Helping Indian citizens discover welfare schemes, government jobs, manage digital documents, and resolve civic grievances.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#8C7D73]">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-ping"/>
              <span>Assisted Preparation Layer • Verified Portals</span>
            </div>
          </div>

          {/* Col 2: Citizen Modules */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Citizen Modules
            </h3>
            <ul className="space-y-2 text-[#D6CCC2]">
              <li><Link to={ROUTES.SCHEMES} className="hover:text-white transition-colors">Schemes Discovery</Link></li>
              <li><Link to={ROUTES.JOBS} className="hover:text-white transition-colors">Sarkari Jobs & PSUs</Link></li>
              <li><Link to={ROUTES.DOCUMENTS} className="hover:text-white transition-colors">Digital Document Vault</Link></li>
              <li><Link to={ROUTES.GRIEVANCES} className="hover:text-white transition-colors">Grievance Redressal</Link></li>
              <li><Link to={ROUTES.ASSISTANT} className="hover:text-white transition-colors flex items-center gap-1">Ask Sarkar AI <Sparkles className="w-3 h-3 text-amber-400"/></Link></li>
              <li><Link to={ROUTES.SERVICES} className="hover:text-white transition-colors">Local Services Locator</Link></li>
            </ul>
          </div>

          {/* Col 3: Information & Guide */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Explore
            </h3>
            <ul className="space-y-2 text-[#D6CCC2]">
              <li><a href="/#motive" className="hover:text-white transition-colors">Project Motive & Problem</a></li>
              <li><a href="/#services" className="hover:text-white transition-colors">Citizen Services Suite</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">How GovConnect Works</a></li>
              <li><Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">Sign In to Dashboard</Link></li>
              <li><Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">Register Account</Link></li>
            </ul>
          </div>

          {/* Col 4: Official Portals Directory */}
          <div className="space-y-3 text-xs">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Official Portals
            </h3>
            <ul className="space-y-2 text-[#D6CCC2]">
              <li>
                <a href="https://pgportal.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  CPGRAMS Portal <ExternalLink className="w-3 h-3 text-[#7D6E63]"/>
                </a>
              </li>
              <li>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  myScheme.gov.in <ExternalLink className="w-3 h-3 text-[#7D6E63]"/>
                </a>
              </li>
              <li>
                <a href="https://www.digilocker.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  DigiLocker <ExternalLink className="w-3 h-3 text-[#7D6E63]"/>
                </a>
              </li>
              <li>
                <a href="https://scholarships.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  National Scholarship Portal <ExternalLink className="w-3 h-3 text-[#7D6E63]"/>
                </a>
              </li>
              <li>
                <a href="https://ssc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
                  Staff Selection Commission <ExternalLink className="w-3 h-3 text-[#7D6E63]"/>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Strip (Prompt Section 52) */}
        <div className="pt-8 border-t border-[#43342B] text-xs text-[#8C7D73] space-y-3">
          <div className="bg-[#241C18]/60 p-4 rounded-xl border border-[#43342B] text-[#D6CCC2] leading-relaxed">
            <strong className="text-amber-400">Prototype Notice:</strong> GovConnect is a prototype citizen-assistance platform. Government scheme eligibility, job information and application requirements should always be verified through the relevant official government portal. GovConnect prepares your eligibility and complaint drafts, but does not submit applications or store official documents on central government servers.
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[11px] text-[#7D6E63]">
            <p>&copy; 2026 GovConnect. Built with pride for India's 1.4 Billion Citizens.</p>
            <div className="flex items-center gap-4">
              <a href="/#motive" className="hover:underline">Project Motive</a>
              <a href="/#services" className="hover:underline">Services</a>
              <a href="/#how-it-works" className="hover:underline">Workflow</a>
            </div>
          </div>
        </div>
      </div>
    </footer>);
}
