import type { ChatMessage } from '@/types';

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_welcome_01',
    role: 'assistant',
    content: `Namaste! 🙏 I am your **GovConnect AI Assistant**.\n\nI can help you:\n- Discover and check eligibility for 200+ Central & State welfare schemes\n- Track the latest government jobs, syllabus, and application deadlines\n- Draft formal complaint letters for CPGRAMS & state grievance portals\n- Manage and organize documents in your personal digital vault\n\nWhat would you like to explore today?`,
    timestamp: new Date().toISOString(),
    suggestions: [
      'Show recommended schemes for me',
      'What are the latest SSC & Banking jobs?',
      'Help me draft a road pothole complaint',
      'What documents are needed for PMAY?',
    ],
  },
];

export const suggestedPrompts: string[] = [
  'Show recommended schemes for me',
  'What are the latest SSC & Banking jobs?',
  'Help me draft a road pothole complaint',
  'What documents are needed for PMAY?',
  'How do I check my Ayushman Bharat eligibility?',
  'Switch language to Hindi',
];
