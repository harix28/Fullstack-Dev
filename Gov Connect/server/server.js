import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { URL } from 'node:url';
import { env as processEnv } from 'node:process';

// ── 1. Minimal Zero-Dependency .env Loader ───────────────────────────────────
try {
  const envUrl = new URL('.env', import.meta.url);
  if (existsSync(envUrl)) {
    const envText = await readFile(envUrl, 'utf8');
    for (const line of envText.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !processEnv[m[1]]) {
        processEnv[m[1]] = m[2].replace(/^['\"]|['\"]$/g, '').trim();
      }
    }
  }
} catch {}

const PORT = Number(process.env.PORT || 3001);
const API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '';
const MODEL = process.env.GEMINI_MODEL || process.env.AI_MODEL || 'gemini-2.5-flash';

const KNOWLEDGE_DIR = new URL('../knowledge/', import.meta.url);
const SCRAPER_DATA_DIR = new URL('../scraper/data/', import.meta.url);

// ── 2. Request Helpers & Rate Limiting ────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40;

function isRateLimited(ip = 'client') {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  if (now > entry.resetAt) {
    entry.count = 1;
    entry.resetAt = now + RATE_LIMIT_WINDOW;
    rateLimitMap.set(ip, entry);
    return false;
  }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(JSON.stringify(body));
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 2_000_000) req.destroy();
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });

const loadKnowledgeFile = async (name, fallback = []) => {
  try {
    const kPath = new URL(name, KNOWLEDGE_DIR);
    if (existsSync(kPath)) {
      return JSON.parse(await readFile(kPath, 'utf8'));
    }
    const sPath = new URL(name, SCRAPER_DATA_DIR);
    if (existsSync(sPath)) {
      return JSON.parse(await readFile(sPath, 'utf8'));
    }
  } catch {}
  return fallback;
};

// ── 3. Profile Matching Engine ───────────────────────────────────────────────
function calculateSchemeMatch(scheme, user = {}) {
  let score = 45;
  const reasons = [];
  const missing = [];

  const age = user.age;
  const income = user.annualIncome;
  const education = (user.education || '').toLowerCase();
  const state = (user.state || '').toLowerCase();
  const category = (user.category || '').toLowerCase();

  // Age evaluation
  if (typeof age === 'number') {
    if (scheme.eligibility && Array.isArray(scheme.eligibility)) {
      const elText = scheme.eligibility.join(' ').toLowerCase();
      if (elText.includes('senior') || elText.includes('70')) {
        if (age >= 70) {
          score += 25;
          reasons.push('Senior citizen eligibility verified');
        } else {
          missing.push('Age criteria requires 70+ years');
        }
      } else if (age >= 18 && age <= 65) {
        score += 15;
        reasons.push('Working-age demographic matched');
      }
    }
  }

  // Income evaluation
  if (typeof income === 'number') {
    const desc = `${scheme.description || ''} ${(scheme.eligibility || []).join(' ')}`.toLowerCase();
    if (desc.includes('2,50,000') || desc.includes('2.5 lakh') || desc.includes('ews')) {
      if (income <= 250000) {
        score += 20;
        reasons.push('Meets annual household income ceiling');
      } else {
        score -= 20;
        missing.push('Annual income exceeds ceiling');
      }
    } else {
      score += 10;
    }
  }

  // Education evaluation
  if (education) {
    const fullText = `${scheme.name} ${scheme.description} ${(scheme.eligibility || []).join(' ')}`.toLowerCase();
    if (fullText.includes('scholarship') || fullText.includes('student') || fullText.includes('post matric') || fullText.includes('mca') || fullText.includes('higher education')) {
      if (education.includes('graduate') || education.includes('mca') || education.includes('post') || education.includes('bachelor') || education.includes('student')) {
        score += 25;
        reasons.push('Education qualification matches scholarship criteria');
      }
    }
  }

  // State / Domicile evaluation
  const schemeState = (scheme.state || '').toLowerCase();
  if (schemeState.includes('central') || schemeState.includes('all') || (state && schemeState.includes(state))) {
    score += 15;
    reasons.push(`Valid for ${scheme.state || 'Central / All India'}`);
  }

  const finalScore = Math.max(25, Math.min(96, score));
  return {
    match_score: finalScore,
    match_reasons: reasons.length ? reasons : ['Indicative match based on profile demographics'],
    possible_missing_criteria: missing,
  };
}

function calculateJobMatch(job, user = {}) {
  let score = 40;
  const reasons = [];
  const missing = [];

  const education = (user.education || '').toLowerCase();
  const skills = (user.skills || []).map((s) => s.toLowerCase());
  const state = (user.state || '').toLowerCase();

  // Qualification matching
  const quals = (job.qualification || []).join(' ').toLowerCase();
  if (quals.includes('graduate') || quals.includes('degree') || quals.includes('mca') || quals.includes('b.tech') || quals.includes('computer')) {
    if (education.includes('graduate') || education.includes('mca') || education.includes('post') || education.includes('b.tech') || education.includes('bca')) {
      score += 30;
      reasons.push('Educational degree aligns with eligibility');
    } else {
      missing.push('Required degree/qualification not indicated in profile');
    }
  }

  // Skills matching
  const jobSkills = (job.skills || []).map((s) => s.toLowerCase());
  const matchedSkills = skills.filter((sk) => jobSkills.some((jsk) => jsk.includes(sk) || sk.includes(jsk)));
  if (matchedSkills.length > 0) {
    score += 20;
    reasons.push(`Skills matched: ${matchedSkills.slice(0, 3).join(', ')}`);
  }

  // Location / State matching
  const loc = (job.location || '').toLowerCase();
  if (loc.includes('all india') || loc.includes('central') || (state && loc.includes(state))) {
    score += 10;
    reasons.push(`Open to ${job.location || 'Central Service'}`);
  }

  const finalScore = Math.max(25, Math.min(98, score));
  return {
    match_score: finalScore,
    match_reasons: reasons.length ? reasons : ['Profile qualification aligns with notification scope'],
    possible_missing_criteria: missing,
  };
}

// ── 4. Multi-Turn Context & Intent Classifier ────────────────────────────────
function detectIntent(message, history = []) {
  const t = String(message || '').toLowerCase().trim();

  // Follow-up resolution
  if (/^(dusri|doosri|second|2nd|agli|next|pehli|first|1st|teesri|third|3rd|is|isse|this)\b/i.test(t) ||
      t.includes('dusri wali') || t.includes('pehli wali') || t.includes('uske documents') || t.includes('iski eligibility')) {
    const lastAssistant = [...history].reverse().find((h) => h.role === 'assistant' || h.role === 'model');
    const content = (lastAssistant?.content || lastAssistant?.parts?.[0]?.text || '').toLowerCase();
    if (content.includes('scheme') || content.includes('scholarship') || content.includes('yojana')) return 'scheme_details';
    if (content.includes('job') || content.includes('recruitment') || content.includes('vacancy')) return 'job_details';
    if (content.includes('service') || content.includes('certificate')) return 'service_search';
  }

  if (/pothole|road|sadak|garbage|kachra|kooda|waterlogging|paani|water supply|bijli|electricity|street light|complaint|grievance|shikayat/.test(t)) {
    return 'grievance_help';
  }
  if (/job|jobs|naukri|vacancy|vacancies|recruitment|career|ssc|upsc|rrb|railway|ibps|salary|pay scale/.test(t)) {
    return 'job_search';
  }
  if (/scholarship|scholarships|scheme|schemes|yojana|yojna|subsidy|grant|dbt|benefit|pension|mudra|kisan|ayushman|awas/.test(t)) {
    return 'scheme_search';
  }
  if (/certificate|praman patra|domicile|income certificate|caste|aadhaar|pan card|driving licence|license|rc|parivahan|sarathi|service|kaha milegi|banega/.test(t)) {
    return 'service_search';
  }
  if (/document|documents|vault|kaghaz|upload|proof/.test(t)) {
    return 'document_help';
  }
  if (/profile|my details|meri details|mera score/.test(t)) {
    return 'profile_help';
  }
  if (/who invented|telephone|weather|cricket|movie|capital of|joke/.test(t)) {
    return 'unknown';
  }
  return 'general';
}

// ── 5. Knowledge Retrieval Engine ────────────────────────────────────────────
function retrieveContext(query, intent, knowledge, user = {}) {
  const q = query.toLowerCase();
  const results = {
    schemes: [],
    jobs: [],
    services: [],
    sources: [],
  };

  if (intent === 'scheme_search' || intent === 'scheme_details' || intent === 'general') {
    const scored = (knowledge.schemes || []).map((s) => {
      let matchCount = 0;
      const text = `${s.name} ${s.description} ${(s.benefits || []).join(' ')} ${(s.eligibility || []).join(' ')}`.toLowerCase();
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && text.includes(word)) matchCount++;
      }
      const matchData = calculateSchemeMatch(s, user);
      return { ...s, relevance: matchCount, ...matchData };
    });
    scored.sort((a, b) => b.relevance * 20 + b.match_score - (a.relevance * 20 + a.match_score));
    results.schemes = scored.slice(0, 3);
  }

  if (intent === 'job_search' || intent === 'job_details' || intent === 'general') {
    const scored = (knowledge.jobs || []).map((j) => {
      let matchCount = 0;
      const text = `${j.title} ${j.organization} ${j.department} ${(j.skills || []).join(' ')} ${(j.qualification || []).join(' ')}`.toLowerCase();
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && text.includes(word)) matchCount++;
      }
      const matchData = calculateJobMatch(j, user);
      return { ...j, relevance: matchCount, ...matchData };
    });
    scored.sort((a, b) => b.relevance * 20 + b.match_score - (a.relevance * 20 + a.match_score));
    results.jobs = scored.slice(0, 3);
  }

  if (intent === 'service_search' || intent === 'document_help' || intent === 'general') {
    const scored = (knowledge.services || []).map((srv) => {
      let matchCount = 0;
      const text = `${srv.name} ${srv.department} ${srv.category} ${srv.description}`.toLowerCase();
      for (const word of q.split(/\s+/)) {
        if (word.length > 2 && text.includes(word)) matchCount++;
      }
      return { ...srv, relevance: matchCount };
    });
    scored.sort((a, b) => b.relevance - a.relevance);
    results.services = scored.slice(0, 3);
  }

  // Collect source citations
  const sourcesMap = new Map();
  [...results.schemes, ...results.jobs, ...results.services].forEach((item) => {
    const url = item.official_url || item.source_url;
    if (url && !sourcesMap.has(url)) {
      sourcesMap.set(url, {
        name: item.name || item.title || item.organization || 'Official Government Portal',
        url,
        domain: item.source_domain || new URL(url).hostname,
        last_checked: item.last_checked || '2026-09-18',
      });
    }
  });
  results.sources = Array.from(sourcesMap.values()).slice(0, 4);

  return results;
}

// ── 6. Grievance Redressal Classifier & Drafter ───────────────────────────────
function handleGrievanceWorkflow(message, user = {}) {
  const t = String(message || '').toLowerCase();
  let category = 'public_services';
  let department = 'Department of Administrative Reforms & Public Grievances';
  let priority = 'medium';
  let portal = { name: 'CPGRAMS', url: 'https://pgportal.gov.in', description: 'Centralized Public Grievance Redress and Monitoring System' };
  let title = 'Civic Service Grievance';

  if (/pothole|road|sadak|bridge|highway/.test(t)) {
    category = 'infrastructure';
    department = 'Ministry of Road Transport & Highways / Municipal Public Works Department (PWD)';
    priority = 'high';
    portal = { name: 'MoRTH Grievance Portal', url: 'https://morth.nic.in/grievance', description: 'National Highway & Road Authority Portal' };
    title = 'Dangerous Potholes and Road Surface Repair Request';
  } else if (/garbage|kachra|kooda|sanitation|waste/.test(t)) {
    category = 'sanitation';
    department = 'Municipal Sanitation & Waste Management Authority';
    priority = 'high';
    portal = { name: 'Swachhata Citizen App / CPGRAMS', url: 'https://pgportal.gov.in', description: 'Civic Sanitation Redressal' };
    title = 'Unattended Garbage Dump & Sanitation Overflow';
  } else if (/water|paani|drain|sewer|waterlogging/.test(t)) {
    category = 'water_supply';
    department = 'Municipal Jal Board / Water Supply & Sewerage Department';
    priority = 'urgent';
    portal = { name: 'Local Water Utility / CPGRAMS', url: 'https://pgportal.gov.in', description: 'Public Water Board Grievance' };
    title = 'Drinking Water Contamination / Sewage Drainage Failure';
  } else if (/electricity|bijli|street light|power/.test(t)) {
    category = 'utilities';
    department = 'State Electricity Distribution Board (DISCOM) / Power Dept';
    priority = 'medium';
    portal = { name: 'National Consumer Helpline (INGRAM)', url: 'https://consumerhelpline.gov.in', description: 'Consumer & Utility Grievance Portal' };
    title = 'Non-functional Streetlights & Power Disruption';
  }

  const citizenName = user.name || 'Aggrieved Citizen';
  const location = `${user.district ? user.district + ', ' : ''}${user.state || 'Local Jurisdiction'}`;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  const draft = `To,
The Authorized Grievance Officer,
${department},
Government of India.

Subject: Formal Grievance regarding ${title} - Urgent Intervention Requested

Respected Sir/Madam,

I am writing to formally register a civic grievance on behalf of the residents of ${location}. 

Matter of Concern:
${message}

The above situation causes severe hardship and poses public safety and hygiene hazards. Multiple requests to local field staff have not yielded rectification. 

I request the competent authority to inspect the site at ${location}, order urgent repairs/restoration within the citizen charter timeline, and share an official Action Taken Report (ATR).

Yours faithfully,
${citizenName}
Resident Location: ${location}
Date: ${date}
Contact: ${user.mobile || user.email || 'Registered GovConnect Citizen'}`;

  return {
    category,
    department,
    priority,
    portal,
    title,
    draft,
  };
}

// ── 7. Gemini API Caller ─────────────────────────────────────────────────────
async function callGemini(message, retrieved, history = [], user = {}, intent = 'general') {
  if (!API_KEY) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(API_KEY)}`;

  const systemPrompt = `You are "Ask Sarkar", the intelligent AI assistant in GovConnect (an Indian citizen services platform).

CRITICAL GROUNDING RULES:
1. Answer strictly using the PROVIDED RETRIEVED OFFICIAL DATA and the USER PROFILE.
2. Answer naturally in the citizen's language (English, Hindi, or Hinglish) matching the query.
3. NEVER invent a scheme name, job post, eligibility rule, vacancy count, department name, deadline, or URL.
4. Always state that match percentages or eligibility indications are PROTOTYPE ESTIMATES, not official government eligibility decisions.
5. If the retrieved data does not contain enough information, state clearly: "I couldn't find enough information in the available official sources. Please verify on the official government portal." Do NOT hallucinate.
6. For grievances, provide the department analysis and draft letter. Tell citizens final submission remains with them on official portals (e.g., CPGRAMS).
7. NEVER claim that GovConnect can bypass CAPTCHA, OTP, login, or directly submit applications without official portal verification.
8. RETURN A VALID JSON OBJECT ONLY matching the exact schema below:

\`\`\`json
{
  "message": "Citizen friendly response in user's language...",
  "intent": "${intent}",
  "confidence": 0.95,
  "recommendations": [
    {
      "id": "item_id",
      "type": "scheme|job|service",
      "title": "...",
      "subtitle": "...",
      "match_score": 92,
      "match_reasons": ["..."],
      "official_url": "https://..."
    }
  ],
  "actions": [
    { "type": "view_scheme|view_job|apply_official|create_grievance|view_vault", "label": "...", "payload": {} }
  ],
  "sources": [
    { "name": "...", "url": "https://...", "domain": "...", "last_checked": "2026-09-18" }
  ]
}
\`\`\`

USER PROFILE:
${JSON.stringify({
  name: user.name,
  age: user.age,
  state: user.state,
  district: user.district,
  education: user.education,
  occupation: user.occupation,
  skills: user.skills,
  annualIncome: user.annualIncome,
  category: user.category,
})}

RETRIEVED OFFICIAL-SOURCE GOVERNMENT DATA:
${JSON.stringify(retrieved, null, 2)}`;

  const contents = [];
  for (const item of history.slice(-6)) {
    if (!item?.content) continue;
    contents.push({
      role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(item.content).slice(0, 4000) }],
    });
  }
  contents.push({
    role: 'user',
    parts: [{ text: `Citizen Query: ${message}` }],
  });

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          temperature: 0.15,
          maxOutputTokens: 1500,
          responseMimeType: 'application/json',
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('').trim();
    if (!rawText) return null;

    try {
      // Strip optional markdown codeblocks
      const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanedJson);
    } catch {
      return {
        message: rawText,
        intent,
        confidence: 0.85,
        recommendations: [],
        actions: [],
        sources: retrieved.sources || [],
      };
    }
  } catch (err) {
    console.error('Gemini call error:', err.message);
    return null;
  }
}

// ── 8. Deterministic Structured Fallback Engine ───────────────────────────────
function buildStructuredFallback(message, intent, retrieved, user = {}) {
  const userName = user.name ? user.name.split(' ')[0] : 'Citizen';
  const education = user.education || 'Graduate';
  const state = user.state || 'Central';

  if (intent === 'grievance_help') {
    const g = handleGrievanceWorkflow(message, user);
    return {
      message: `Namaste ${userName}, maine aapki grievance ka analysis kar liya hai:\n\n• **Issue Category:** ${g.category.toUpperCase()}\n• **Responsible Authority:** ${g.department}\n• **Recommended Portal:** ${g.portal.name} (${g.portal.url})\n• **Priority:** ${g.priority.toUpperCase()}\n\nMaine ek **formal draft** tayyar kiya hai jise aap review aur edit kar sakte hain. Final submission official government portal par aapko karna hoga.`,
      intent: 'grievance_help',
      confidence: 0.94,
      recommendations: [],
      actions: [
        {
          type: 'create_grievance',
          label: 'Review Grievance Draft',
          payload: {
            title: g.title,
            category: g.category,
            department: g.department,
            priority: g.priority,
            draft: g.draft,
            portalUrl: g.portal.url,
          },
        },
      ],
      sources: [
        {
          name: g.portal.name,
          url: g.portal.url,
          domain: new URL(g.portal.url).hostname,
          last_checked: '2026-09-18',
        },
      ],
    };
  }

  if (intent === 'scheme_search' || intent === 'scheme_details') {
    const recs = retrieved.schemes.map((s) => ({
      id: s.id,
      type: 'scheme',
      title: s.name,
      subtitle: `${s.ministry || s.department} • ${s.state || 'Central'}`,
      match_score: s.match_score,
      match_reasons: s.match_reasons,
      official_url: s.official_url || s.source_url,
      details: {
        benefits: s.benefits || [],
        eligibility: s.eligibility || [],
        required_documents: s.required_documents || [],
        deadline: s.deadline || 'Open / Rolling',
      },
    }));

    const lines = recs.map(
      (r, i) => `${i + 1}. **${r.title}** (${r.match_score}% indicative match)\n   • ${r.subtitle}\n   • Benefit: ${(r.details.benefits[0] || 'See scheme page')}`
    );

    return {
      message: `Namaste **${userName}**! 🙏 Aapke profile (**${education} • ${state}**) ke aadhaar par official government welfare schemes retrieve ki gayi hain:\n\n${lines.join('\n\n')}\n\n*Note: Yeh match score ek indicative prototype score hai. Kripya aavedan se pehle official portal par latest criteria verify karein.*`,
      intent: 'scheme_search',
      confidence: 0.92,
      recommendations: recs,
      actions: recs.map((r) => ({
        type: 'view_scheme',
        label: `View ${r.title.slice(0, 25)}...`,
        payload: { id: r.id },
      })),
      sources: retrieved.sources,
    };
  }

  if (intent === 'job_search' || intent === 'job_details') {
    const recs = retrieved.jobs.map((j) => ({
      id: j.id,
      type: 'job',
      title: j.title,
      subtitle: `${j.organization} • ${j.location}`,
      match_score: j.match_score,
      match_reasons: j.match_reasons,
      official_url: j.official_url || j.source_url,
      details: {
        qualification: j.qualification || [],
        salary: j.salary || 'As per 7th CPC Pay Matrix',
        vacancies: j.vacancies || 'Multiple vacancies',
        deadline: j.deadline || 'Refer to official advertisement',
      },
    }));

    const lines = recs.map(
      (r, i) => `${i + 1}. **${r.title}** (${r.match_score}% qualification match)\n   • ${r.subtitle}\n   • Pay Scale: ${r.details.salary} | Vacancies: ${r.details.vacancies}`
    );

    return {
      message: `Aapke profile qualifications (**${education}**${user.skills?.length ? ' • ' + user.skills.slice(0, 3).join(', ') : ''}) ke anusaar official sarkari bharti opportunities:\n\n${lines.join('\n\n')}\n\n*Kripya official recruitment notification par aakhri taareekh aur exam criteria verify karein.*`,
      intent: 'job_search',
      confidence: 0.91,
      recommendations: recs,
      actions: recs.map((r) => ({
        type: 'view_job',
        label: `Explore ${r.title.slice(0, 25)}...`,
        payload: { id: r.id },
      })),
      sources: retrieved.sources,
    };
  }

  if (intent === 'service_search' || intent === 'document_help') {
    const recs = retrieved.services.map((srv) => ({
      id: srv.id,
      type: 'service',
      title: srv.name,
      subtitle: `${srv.department} • ${srv.state || 'Central'}`,
      match_score: 90,
      match_reasons: ['Official citizen public service'],
      official_url: srv.official_url || srv.source_url,
      details: {
        documents: srv.documents || [],
        description: srv.description || '',
      },
    }));

    const lines = recs.map(
      (r, i) => `${i + 1}. **${r.title}**\n   • ${r.subtitle}\n   • Required Docs: ${(r.details.documents || []).join(', ')}`
    );

    return {
      message: `Official citizen services retrieved from government portals:\n\n${lines.join('\n\n')}\n\n*Aap official portal par seedhe digital application bhar sakte hain.*`,
      intent: 'service_search',
      confidence: 0.89,
      recommendations: recs,
      actions: recs.map((r) => ({
        type: 'apply_official',
        label: `Open ${r.title.slice(0, 22)} Portal`,
        payload: { url: r.official_url },
      })),
      sources: retrieved.sources,
    };
  }

  if (intent === 'unknown') {
    return {
      message: `I am **Ask Sarkar**, the dedicated citizen assistant for **Indian government welfare schemes, recruitment opportunities, and civic grievances**. I could not find verified government records regarding your query. Please ask a governance or public service related question.`,
      intent: 'unknown',
      confidence: 0.95,
      recommendations: [],
      actions: [],
      sources: [],
    };
  }

  // General helpful response
  return {
    message: `Namaste **${userName}**! 🙏 Main **Ask Sarkar** hoon. Main aapki sarkari yojanaon, sarkari naukri, DigiLocker documents, aur civic complaints mein madad kar sakta hoon.\n\nAap mujhse poochna chahte hain:\n• "Mujhe student scholarship chahiye"\n• "MCA aur Python ke liye jobs batao"\n• "Road kharab hai complaint karni hai"\n• "Income certificate kaise banega?"`,
    intent: 'general',
    confidence: 0.9,
    recommendations: [],
    actions: [],
    sources: [],
  };
}

// ── 9. HTTP Request Handler ──────────────────────────────────────────────────
async function handler(req, res) {
  if (req.method === 'OPTIONS') return json(res, 204, {});

  const clientIp = req.socket.remoteAddress || 'client';
  if (isRateLimited(clientIp)) {
    return json(res, 429, { error: 'Rate limit exceeded. Please wait a moment before sending another request.' });
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  // Health Check
  if (req.method === 'GET' && url.pathname === '/api/v1/health') {
    return json(res, 200, {
      ok: true,
      status: 'operational',
      provider: API_KEY ? 'gemini' : 'local-grounded-fallback',
      model: MODEL,
      timestamp: new Date().toISOString(),
    });
  }

  // Admin / Data Status endpoint (SIH evaluators & diagnostics)
  if (req.method === 'GET' && url.pathname === '/api/v1/admin/data-status') {
    const [crawlReport, schemes, jobs, services, sources, pages] = await Promise.all([
      loadKnowledgeFile('crawl_report.json', {}),
      loadKnowledgeFile('schemes.json', []),
      loadKnowledgeFile('jobs.json', []),
      loadKnowledgeFile('services.json', []),
      loadKnowledgeFile('sources.json', []),
      loadKnowledgeFile('pages.json', []),
    ]);

    return json(res, 200, {
      total_sources_configured: 51,
      total_sources_processed: sources.length || crawlReport.domains_crawled || 0,
      total_pages_stored: pages.length || crawlReport.total_pages_stored || 0,
      successful_crawls: crawlReport.successful_domains || 0,
      blocked_by_robots_or_waf: crawlReport.blocked_domains || 0,
      schemes_extracted: schemes.length,
      jobs_extracted: jobs.length,
      services_extracted: services.length,
      last_crawl: crawlReport.completed_at || crawlReport.started_at || '2026-09-18',
      ai_provider: API_KEY ? 'Google Gemini 2.5 Flash' : 'Deterministic Grounded Engine',
      active_model: MODEL,
    });
  }

  // Assistant Chat endpoint
  if (req.method === 'POST' && url.pathname === '/api/v1/assistant/chat') {
    try {
      const body = await readBody(req);
      const message = String(body.message || '').trim().slice(0, 12000);
      const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
      const user = body.user || {};

      if (!message) {
        return json(res, 400, { error: 'Query message cannot be empty' });
      }

      // 1. Load Knowledge Base
      const [schemes, jobs, services] = await Promise.all([
        loadKnowledgeFile('schemes.json', []),
        loadKnowledgeFile('jobs.json', []),
        loadKnowledgeFile('services.json', []),
      ]);

      const knowledge = { schemes, jobs, services };

      // 2. Intent Detection
      const intent = detectIntent(message, history);

      // 3. Retrieval & Grounding
      const retrieved = retrieveContext(message, intent, knowledge, user);

      // 4. Gemini Call with RAG
      let aiResult = null;
      if (API_KEY) {
        aiResult = await callGemini(message, retrieved, history, user, intent);
      }

      // 5. Grounded Fallback if Gemini unavailable or failed
      if (!aiResult) {
        aiResult = buildStructuredFallback(message, intent, retrieved, user);
      }

      // Ensure content string is always present for legacy frontends
      aiResult.content = aiResult.message;
      aiResult.suggestions = aiResult.suggestions || [
        'Mujhe student scholarship chahiye',
        'MCA ke liye govt jobs batao',
        'Road kharab hai complaint karni hai',
        'Income certificate kaise banega?',
      ];

      return json(res, 200, aiResult);
    } catch (e) {
      console.error('API Error:', e);
      return json(res, 500, { error: e.message || 'Internal server error' });
    }
  }

  return json(res, 404, { error: 'Not found' });
}

// ── 10. Start Server ─────────────────────────────────────────────────────────
const server = http.createServer(handler);
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🏛️ GovConnect Backend Running at http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: ${API_KEY ? `Gemini (${MODEL})` : 'Grounded Local Fallback'}`);
  console.log(`📊 Admin Data Status: http://localhost:${PORT}/api/v1/admin/data-status`);
  console.log(`======================================================\n`);
});
