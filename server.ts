import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { SCHEMES } from './src/data/schemes.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client if GEMINI_API_KEY is provided
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Health API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', geminiAvailable: !!ai });
  });

  // AI Chat Assistant API endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, language = 'hi', history = [] } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Keyword matching across schemes for matched suggested schemes
      const query = message.toLowerCase();
      const matchedSchemeIds: string[] = [];

      SCHEMES.forEach((scheme) => {
        const nameInLang = (scheme.name[language as keyof typeof scheme.name] || scheme.name.en).toLowerCase();
        const taglineInLang = (scheme.tagline[language as keyof typeof scheme.tagline] || scheme.tagline.en).toLowerCase();
        const category = scheme.category.toLowerCase();

        if (
          query.includes(scheme.id) ||
          query.includes(category) ||
          nameInLang.split(' ').some((word) => word.length > 2 && query.includes(word)) ||
          taglineInLang.split(' ').some((word) => word.length > 3 && query.includes(word)) ||
          (query.includes('kisan') && scheme.id === 'pm-kisan') ||
          (query.includes('pension') && (scheme.id === 'old-age-pension' || scheme.id === 'pm-kisan')) ||
          (query.includes('scholarship') && scheme.id === 'post-matric-scholarship') ||
          (query.includes('certificate') && (scheme.id === 'income-certificate' || scheme.id === 'caste-certificate')) ||
          (query.includes('income') && scheme.id === 'income-certificate') ||
          (query.includes('caste') && scheme.id === 'caste-certificate') ||
          (query.includes('internship') && scheme.id === 'pm-internship') ||
          (query.includes('skill') && scheme.id === 'skill-india') ||
          (query.includes('health') && scheme.id === 'ayushman-bharat') ||
          (query.includes('hospital') && scheme.id === 'ayushman-bharat') ||
          (query.includes('5 lakh') && scheme.id === 'ayushman-bharat')
        ) {
          if (!matchedSchemeIds.includes(scheme.id)) {
            matchedSchemeIds.push(scheme.id);
          }
        }
      });

      // If Gemini AI is initialized, ask Gemini for an empathetic, accurate citizen answer in the requested language
      if (ai) {
        try {
          const systemPrompt = `You are DigiYojna AI, a friendly, respectful, and helpful Indian Government Scheme Citizen Assistant.
Language requested by citizen: ${language} (Format: hi=Hindi, en=English, mr=Marathi, bn=Bengali, ta=Tamil).
Respond ONLY in the requested language ${language} using native script.
Keep answers clear, short, empathetic, and easily readable for first-time internet users.
Mention scheme eligibility, benefits, required documents, and how to apply in simple steps.

Here is the database of current schemes you can reference:
${JSON.stringify(
  SCHEMES.map((s) => ({
    id: s.id,
    name: s.name[language as keyof typeof s.name] || s.name.en,
    benefit: s.benefit[language as keyof typeof s.benefit] || s.benefit.en,
    eligibility: s.eligibility[language as keyof typeof s.eligibility] || s.eligibility.en,
    documents: s.documents[language as keyof typeof s.documents] || s.documents.en,
    steps: s.steps[language as keyof typeof s.steps] || s.steps.en,
  })),
  null,
  2
)}

Be warm, reassuring, and precise. Avoid unnecessary jargon.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: message,
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.3,
            },
          });

          const responseText = response.text || '';
          if (responseText.trim().length > 0) {
            return res.json({
              reply: responseText,
              suggestedSchemes: matchedSchemeIds.length > 0 ? matchedSchemeIds : ['pm-kisan', 'ayushman-bharat'],
              source: 'gemini',
            });
          }
        } catch (geminiError) {
          console.warn('Gemini API call failed, using smart local fallback:', geminiError);
        }
      }

      // Smart local response fallback
      let fallbackReply = '';
      if (matchedSchemeIds.length > 0) {
        const topScheme = SCHEMES.find((s) => s.id === matchedSchemeIds[0])!;
        const name = topScheme.name[language as keyof typeof topScheme.name] || topScheme.name.en;
        const benefit = topScheme.benefit[language as keyof typeof topScheme.benefit] || topScheme.benefit.en;
        const eligibility = topScheme.eligibility[language as keyof typeof topScheme.eligibility] || topScheme.eligibility.en;

        if (language === 'hi') {
          fallbackReply = `आपके प्रश्न के आधार पर **${name}** आपके लिए उपयुक्त योजना हो सकती है।\n\n• **मुख्य लाभ:** ${benefit}\n• **मुख्य पात्रता:** ${eligibility[0]}\n\nनीचे दिए गए कार्ड पर "आवेदन प्रक्रिया देखें" पर क्लिक करके पूरा विवरण और आवश्यक दस्तावेज देखें।`;
        } else if (language === 'mr') {
          fallbackReply = `तुमच्या प्रश्नानुसार **${name}** ही योजना तुमच्यासाठी योग्य असू शकते.\n\n• **मुख्य लाभ:** ${benefit}\n• **पात्रता:** ${eligibility[0]}\n\nखालील कार्डवर क्लिक करून अर्ज प्रक्रिया व कागदपत्रे पहा.`;
        } else if (language === 'bn') {
          fallbackReply = `আপনার প্রশ্নের ভিত্তিতে **${name}** আপনার জন্য উপযুক্ত প্রকল্প হতে পারে।\n\n• **প্রধান সুবিধা:** ${benefit}\n• **যোগ্যতা:** ${eligibility[0]}\n\nনিচের কার্ড থেকে সম্পূর্ণ আবেদনের ধাপসমূহ দেখে নিন।`;
        } else if (language === 'ta') {
          fallbackReply = `உங்கள் கேள்விக்கு ஏற்ப **${name}** திட்டம் உங்களுக்கு ஏற்றதாக இருக்கும்.\n\n• **முக்கிய பலன்:** ${benefit}\n• **தகுதி:** ${eligibility[0]}\n\nகீழே உள்ள கார்டை கிளிக் செய்து முழு விவரங்களையும் காண்க.`;
        } else {
          fallbackReply = `Based on your query, **${name}** appears to be a matching scheme for you.\n\n• **Key Benefit:** ${benefit}\n• **Eligibility:** ${eligibility[0]}\n\nCheck the scheme card below to expand application steps and required documents.`;
        }
      } else {
        if (language === 'hi') {
          fallbackReply = `धन्यवाद! मैं आपकी सहायता के लिए तैयार हूँ। आप पीएम किसान, पोस्ट-मैट्रिक छात्रवृत्ति, वृद्धावस्था पेंशन, आय/जाति प्रमाण पत्र, पीएम इंटर्नशिप या आयुष्मान भारत जैसी सरकारी योजनाओं के बारे में पूछ सकते हैं।`;
        } else if (language === 'mr') {
          fallbackReply = `धन्यवाद! तुम्ही मला पीएम किसान, शिष्यवृत्ती, पेन्शन, उत्पन्नाचा दाखला, कौशल्य विकास किंवा आयुष्मान भारत योजनेबद्दल विचारू शकता.`;
        } else if (language === 'bn') {
          fallbackReply = `ধন্যবাদ! আপনি পিএম কিষাণ, স্কলারশিপ, পেনশন, আয়ের শংসাপত্র বা আয়ুষ্মান ভারত সম্পর্কে প্রশ্ন করতে পারেন।`;
        } else if (language === 'ta') {
          fallbackReply = `நன்றி! PM கிசான், கல்வி உதவித்தொகை, ஓய்வூதியம், வருமானச் சான்றிதழ் அல்லது ஆயுஷ்மான் பாரத் பற்றி என்னிடம் கேட்கலாம்.`;
        } else {
          fallbackReply = `Thank you! I am here to help you. You can ask me about PM Kisan, Post-Matric Scholarship, Old Age Pension, Income/Caste Certificates, Skill India, or Ayushman Bharat.`;
        }
      }

      return res.json({
        reply: fallbackReply,
        suggestedSchemes: matchedSchemeIds.length > 0 ? matchedSchemeIds : ['pm-kisan', 'post-matric-scholarship', 'ayushman-bharat'],
        source: 'local_matching',
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DigiYojna server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
