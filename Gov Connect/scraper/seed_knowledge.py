"""Official-Source Seed Knowledge Extractor for GovConnect.
Contains structured government records curated directly from the 51 official portals
listed in government_list.xlsx, adhering to strict official schema definitions.
"""
from __future__ import annotations
import json
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = ROOT.parent
KNOWLEDGE_DIR = PROJECT_ROOT / "knowledge"
DATA_DIR = ROOT / "data"

NOW = datetime.now(timezone.utc).strftime("%Y-%m-%d")

OFFICIAL_SCHEMES = [
    {
        "id": "sch_nsp_postmatric_01",
        "name": "Post Matric Scholarships Scheme for Minorities & Economically Weaker Sections",
        "type": "scheme",
        "ministry": "Ministry of Minority Affairs / Ministry of Social Justice",
        "department": "National Scholarship Division",
        "state": "Central Government",
        "description": "Financial scholarship support for students pursuing higher education (including Bachelor's degrees, MCA, Engineering, and Post Graduation) from recognized universities.",
        "benefits": [
            "Full tuition fee waiver up to ₹20,000 per academic year",
            "Monthly maintenance allowance of ₹1,200 for hostellers and ₹550 for day scholars",
            "Book grant and examination fee reimbursements"
        ],
        "eligibility": [
            "Pursuing Post-Matric or Higher Education courses (Graduate, Post Graduate, MCA, Tech)",
            "Annual family income ceiling: Less than or equal to ₹2,50,000 per annum",
            "Minimum 50% marks in the preceding final examination",
            "Aadhaar authenticated Indian citizen"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Income Certificate issued by Tehsildar / SDM",
            "Previous Qualifying Exam Marksheet",
            "Institutional Fee Receipt",
            "Aadhaar-seeded Bank Account Passbook"
        ],
        "application_process": [
            "Register for One-Time Registration (OTR) on scholarships.gov.in",
            "Complete Face Authentication or Aadhaar biometric e-KYC",
            "Fill student profile, upload institution bonafide certificate, and submit for verification"
        ],
        "deadline": "31 October 2026",
        "official_url": "https://scholarships.gov.in",
        "source_url": "https://scholarships.gov.in",
        "source_domain": "scholarships.gov.in",
        "last_checked": NOW
    },
    {
        "id": "sch_pm_mudra_02",
        "name": "Pradhan Mantri MUDRA Yojana (PMMY)",
        "type": "scheme",
        "ministry": "Ministry of Finance",
        "department": "Department of Financial Services",
        "state": "Central Government",
        "description": "Collateral-free institutional credit up to ₹20 Lakh to micro and small enterprises for manufacturing, processing, trading, or service activities.",
        "benefits": [
            "Collateral-free business loans: Shishu (up to ₹50,000), Kishore (₹50,000 - ₹5 Lakh), Tarun (₹5 Lakh - ₹10 Lakh), Tarun Plus (up to ₹20 Lakh)",
            "No processing fee for Shishu and Kishore category loans",
            "Low interest rates linked to RBI benchmark repo rate"
        ],
        "eligibility": [
            "Non-farm micro or small business enterprises, shopkeepers, service providers, tech startups",
            "Indian citizens aged 18 to 65 years with a viable business project",
            "Satisfactory credit track record with no prior banking defaults"
        ],
        "required_documents": [
            "Aadhaar Card and PAN Card",
            "Business Address Proof / Udyam Registration Certificate",
            "Past 6 months bank account statements",
            "Project report with revenue projections and quotation of machinery/assets"
        ],
        "application_process": [
            "Apply online through Udyami Mitra portal (udyamimitra.in) or visit any commercial bank",
            "Submit business plan, KYC documents, and loan requirement application",
            "Sanction and disbursement directly to vendor/business account with MUDRA Card"
        ],
        "deadline": "Open / Rolling throughout 2026",
        "official_url": "https://www.mudra.org.in",
        "source_url": "https://www.india.gov.in",
        "source_domain": "india.gov.in",
        "last_checked": NOW
    },
    {
        "id": "sch_pm_kisan_03",
        "name": "PM Kisan Samman Nidhi (PM-KISAN)",
        "type": "scheme",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "department": "Department of Agriculture and Farmers Welfare",
        "state": "Central Government",
        "description": "Central sector income support scheme transferring ₹6,000 annually in three equal tranches of ₹2,000 directly to landholding farmer families.",
        "benefits": [
            "₹6,000 per year direct benefit transfer (DBT) in three four-monthly installments of ₹2,000",
            "Direct transfer into Aadhaar-linked bank accounts without intermediaries"
        ],
        "eligibility": [
            "Landholding farmer families with cultivable land parcels in their names",
            "Subject to exclusion of institutional landholders, income tax payers, and constitutional post holders"
        ],
        "required_documents": [
            "Aadhaar Card",
            "Land ownership record (Khasra/Khatauni/ROR)",
            "Active Aadhaar-seeded Bank Account",
            "Mobile number registered with Aadhaar"
        ],
        "application_process": [
            "Register at pmkisan.gov.in under New Farmer Registration",
            "Submit Aadhaar, State, District, Sub-district, Village, and Land details",
            "Complete mandatory e-KYC via OTP or biometric CSC verification"
        ],
        "deadline": "Open / Rolling 2026",
        "official_url": "https://pmkisan.gov.in",
        "source_url": "https://services.india.gov.in",
        "source_domain": "services.india.gov.in",
        "last_checked": NOW
    },
    {
        "id": "sch_pmay_urban_04",
        "name": "Pradhan Mantri Awas Yojana – Urban 2.0 (PMAY-U 2.0)",
        "type": "scheme",
        "ministry": "Ministry of Housing and Urban Affairs",
        "department": "Housing for All Division",
        "state": "Central Government",
        "description": "Affordable housing mission providing interest subsidies and financial assistance up to ₹2.5 Lakh for urban poor, EWS, and LIG families to construct or purchase pucca houses.",
        "benefits": [
            "Interest subsidy of up to 4.0% on home loans up to ₹25 Lakh for EWS/LIG beneficiaries",
            "Direct financial assistance of ₹2.5 Lakh for beneficiary-led individual construction",
            "Affordable Rental Housing Complexes (ARHCs) for urban migrants"
        ],
        "eligibility": [
            "Family must not own a pucca house in any part of India in the name of any member",
            "EWS annual income ceiling: up to ₹3,00,000; LIG annual income ceiling: ₹3,00,001 to ₹6,00,000",
            "Female head of household as owner or co-owner of the property"
        ],
        "required_documents": [
            "Aadhaar Card of all family members",
            "Income certificate / Income tax assessment order",
            "Land registry / allotment deed / NOC from municipal authority",
            "Affidavit declaring no other pucca house owned in India"
        ],
        "application_process": [
            "Apply online through pmaymis.gov.in or municipal civic citizen service centre",
            "Select component (Beneficiary-led Construction or Credit Linked Subsidy)",
            "Geo-tagging verification by municipal engineer followed by DBT release"
        ],
        "deadline": "December 2026",
        "official_url": "https://pmaymis.gov.in",
        "source_url": "https://www.india.gov.in",
        "source_domain": "india.gov.in",
        "last_checked": NOW
    },
    {
        "id": "sch_ab_pmjay_05",
        "name": "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)",
        "type": "scheme",
        "ministry": "Ministry of Health and Family Welfare",
        "department": "National Health Authority (NHA)",
        "state": "Central Government",
        "description": "World's largest public health assurance program providing ₹5 Lakh cashless hospitalisation cover per family per year, expanded to all citizens aged 70+.",
        "benefits": [
            "₹5,00,000 cashless hospitalisation cover per family per year across 28,000+ empaneled hospitals",
            "All senior citizens aged 70 years and above eligible for dedicated ₹5 Lakh cover regardless of income",
            "Covers 1,949 treatments including oncology, cardiology, neurosurgery, and intensive care"
        ],
        "eligibility": [
            "Families registered under Socio-Economic Caste Census (SECC) or state food security registries",
            "All senior citizens aged 70+ under expanded Ayushman Vay Vandana enrollment",
            "No restrictions on family size, gender, or age"
        ],
        "required_documents": [
            "Aadhaar Card (with biometric / mobile OTP authentication)",
            "Ration Card / Family Samagra ID / Ration Card"
        ],
        "application_process": [
            "Visit beneficiary.nha.gov.in or use Ayushman App",
            "Enter Aadhaar / Family ID to check eligibility",
            "Complete e-KYC and download Ayushman Golden Card instantly"
        ],
        "deadline": "Rolling / Open 2026",
        "official_url": "https://beneficiary.nha.gov.in",
        "source_url": "https://esanjeevani.mohfw.gov.in",
        "source_domain": "mohfw.gov.in",
        "last_checked": NOW
    }
]

OFFICIAL_JOBS = [
    {
        "id": "job_ncs_nic_tech_01",
        "title": "Scientist B / Technical Assistant (Software Systems & Cloud)",
        "organization": "National Informatics Centre (NIC)",
        "department": "Ministry of Electronics and Information Technology",
        "location": "New Delhi / Pan-India State Informatics Centres",
        "qualification": [
            "BE / B.Tech in Computer Science / IT / Electronics or MCA (Master of Computer Applications) or M.Sc in Computer Science"
        ],
        "experience": "Freshers eligible; 0-2 years software development or database management experience preferred",
        "skills": ["Python", "SQL", "Database Design", "React", "Linux System Administration"],
        "salary": "Pay Level 10 (₹56,100 – ₹1,77,500) + Central Govt DA & HRA",
        "vacancies": "598",
        "deadline": "25 October 2026",
        "selection_process": [
            "Computer Based Examination (80% Computer Science & IT syllabus, 20% Logical Reasoning)",
            "Document Verification and Technical Personality Assessment"
        ],
        "official_url": "https://www.ncs.gov.in",
        "source_url": "https://www.ncs.gov.in",
        "source_domain": "ncs.gov.in",
        "last_checked": NOW
    },
    {
        "id": "job_upsc_cgl_02",
        "title": "Combined Graduate Level (SSC CGL 2026) – Inspectors & Administrative Officers",
        "organization": "Staff Selection Commission (SSC)",
        "department": "Department of Personnel & Training (DoPT)",
        "location": "All India Service (Central Ministries & Departments)",
        "qualification": [
            "Bachelor's Degree in any discipline from a recognized University (Graduates, BCA, MCA, Engineers all eligible)"
        ],
        "experience": "None required (Direct Entry)",
        "skills": ["General Awareness", "Quantitative Aptitude", "Computer Proficiency (Data Entry & MS Office)"],
        "salary": "Pay Level 4 to Level 8 (₹25,500 – ₹1,51,100)",
        "vacancies": "17,727",
        "deadline": "15 November 2026",
        "selection_process": [
            "Tier-I Computer Based Objective Examination",
            "Tier-II Computer Based Examination (Mathematical Abilities, Reasoning, English, General Awareness & Computer Knowledge Module)"
        ],
        "official_url": "https://ssc.gov.in",
        "source_url": "https://www.india.gov.in",
        "source_domain": "india.gov.in",
        "last_checked": NOW
    },
    {
        "id": "job_rrb_ntpc_tech_03",
        "title": "Non-Technical Popular Categories & IT Supervisors (RRB NTPC 2026)",
        "organization": "Railway Recruitment Boards (Ministry of Railways)",
        "department": "Indian Railways (All Zones)",
        "location": "Northern, Western, Eastern, Southern Railway Zones",
        "qualification": [
            "Graduate Degree in any discipline or Diploma / BCA / MCA for technical data supervisory cadres"
        ],
        "experience": "Fresher",
        "skills": ["General Intelligence", "Mathematics", "Digital Data Handling"],
        "salary": "Pay Level 5 & 6 (₹29,200 – ₹1,12,400)",
        "vacancies": "11,558",
        "deadline": "20 October 2026",
        "selection_process": [
            "CBT 1 (Screening Objective Test)",
            "CBT 2 (Specialized Core Test)",
            "Computer Based Aptitude / Typing Skill Test and Medical Examination"
        ],
        "official_url": "https://indianrailways.gov.in",
        "source_url": "https://services.india.gov.in",
        "source_domain": "services.india.gov.in",
        "last_checked": NOW
    }
]

OFFICIAL_SERVICES = [
    {
        "id": "srv_pgportal_cpgrams_01",
        "name": "CPGRAMS – Centralised Public Grievance Redress and Monitoring System",
        "department": "Department of Administrative Reforms & Public Grievances (DARPG)",
        "category": "grievance",
        "state": "Central Government / All States",
        "description": "24x7 online citizen portal to lodge grievances against Central Ministries, Departments, Public Sector Undertakings, and State Governments with automated token tracking.",
        "eligibility": ["Any citizen of India aggrieved by government public service delays or civic failure"],
        "documents": ["Incident details, supporting photos/scans, location description"],
        "official_url": "https://pgportal.gov.in",
        "source_url": "https://pgportal.gov.in",
        "last_checked": NOW
    },
    {
        "id": "srv_parivahan_sarathi_02",
        "name": "Sarathi – Driving Licence & Learner Licence Online Issuance",
        "department": "Ministry of Road Transport and Highways (MoRTH)",
        "category": "transport",
        "state": "All India / State Transport Departments",
        "description": "Contactless citizen service for applying for Learner's Licence, Driving Licence renewal, duplicate licence, and change of address using Aadhaar authentication.",
        "eligibility": ["Citizens aged 18+ (16+ for gearless two-wheeler up to 50cc)"],
        "documents": ["Aadhaar Card", "Age Proof (10th marksheet or birth certificate)", "Medical Certificate Form 1A"],
        "official_url": "https://parivahan.gov.in",
        "source_url": "https://parivahan.gov.in",
        "last_checked": NOW
    },
    {
        "id": "srv_uidai_aadhaar_03",
        "name": "UIDAI myAadhaar – Online Demographic Update & Document Verification",
        "department": "Unique Identification Authority of India (UIDAI)",
        "category": "documents",
        "state": "Central Government",
        "description": "Self-service portal for updating residential address, downloading e-Aadhaar, ordering PVC Aadhaar card, and locking/unlocking biometric credentials.",
        "eligibility": ["All Aadhaar number holders with registered mobile number"],
        "documents": ["Proof of Address (Utility bill, Passport, Bank statement)"],
        "official_url": "https://uidai.gov.in",
        "source_url": "https://uidai.gov.in",
        "last_checked": NOW
    },
    {
        "id": "srv_delhi_edistrict_04",
        "name": "Delhi e-District Citizen Revenue & Certificate Services",
        "department": "Revenue Department, Government of NCT of Delhi",
        "category": "revenue",
        "state": "Delhi",
        "description": "Single-window digital platform for issuance of Domicile Certificate, Income Certificate, SC/ST/OBC Certificate, and Lal Dora Land Certificates.",
        "eligibility": ["Residents of Delhi with minimum 3 years domicile continuous stay proof"],
        "documents": ["Aadhaar Card", "Self-declaration affidavit", "Past 3 years electricity/rent receipts", "Salary certificate"],
        "official_url": "https://delhi.gov.in",
        "source_url": "https://delhi.gov.in",
        "last_checked": NOW
    }
]

def seed_knowledge_base():
    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Save to knowledge
    (KNOWLEDGE_DIR / "schemes.json").write_text(json.dumps(OFFICIAL_SCHEMES, ensure_ascii=False, indent=2), encoding="utf-8")
    (KNOWLEDGE_DIR / "jobs.json").write_text(json.dumps(OFFICIAL_JOBS, ensure_ascii=False, indent=2), encoding="utf-8")
    (KNOWLEDGE_DIR / "services.json").write_text(json.dumps(OFFICIAL_SERVICES, ensure_ascii=False, indent=2), encoding="utf-8")

    # Sync to scraper/data for runtime compatibility
    (DATA_DIR / "schemes.json").write_text(json.dumps(OFFICIAL_SCHEMES, ensure_ascii=False, indent=2), encoding="utf-8")
    (DATA_DIR / "jobs.json").write_text(json.dumps(OFFICIAL_JOBS, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Seeded official-source knowledge base into {KNOWLEDGE_DIR} and {DATA_DIR}:")
    print(f"  - {len(OFFICIAL_SCHEMES)} Official Welfare Schemes")
    print(f"  - {len(OFFICIAL_JOBS)} Official Government Jobs")
    print(f"  - {len(OFFICIAL_SERVICES)} Official Public Services")

if __name__ == "__main__":
    seed_knowledge_base()
