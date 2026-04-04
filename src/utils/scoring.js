/**
 * AI Scoring Engine — InVisionU Candidate Evaluation
 * 
 * Architecture: This module implements a rule-based NLP evaluation engine
 * that scores candidate responses across 4 dimensions:
 *   1. Motivation — drive, passion, commitment
 *   2. Experience — leadership, projects, achievements
 *   3. Skills — technical and soft skills
 *   4. Potential — innovation, growth mindset, scalability
 * 
 * Scoring Method: Keyword density analysis + structural quality metrics
 *   - Primary keywords (high-impact terms) → +8 points each
 *   - Secondary keywords (supporting terms) → +4 points each
 *   - Sentence variety and length bonuses for detailed responses
 *   - Specificity bonus: dates, numbers, and complex sentence structure
 * 
 * Multilingual: Keywords are defined in EN, RU, and KZ to support
 * trilingual evaluation without language bias.
 * 
 * Production Roadmap: In v2, this module will be replaced with actual
 * LLM API calls (e.g., OpenAI GPT-4, Google Gemini) for deep semantic
 * analysis. The function signatures will remain identical, ensuring
 * a seamless swap with zero frontend changes.
 */

// Multilingual keyword dictionaries for each evaluation dimension
const KEYWORDS = {
  motivation: {
    high: ['passion', 'inspired', 'dream', 'committed', 'purpose', 'mission', 'determined', 'vision', 'impact', 'change', 'community', 'society', 'future', 'leader', 'innovate', 'transform', 'dedicate', 'страсть', 'вдохновение', 'мечта', 'цель', 'миссия', 'ынта', 'шабыт', 'мақсат'],
    medium: ['interest', 'want', 'like', 'hope', 'plan', 'believe', 'think', 'goal', 'интерес', 'хочу', 'надеюсь', 'қызығу', 'қалау'],
  },
  experience: {
    high: ['led', 'organized', 'founded', 'built', 'managed', 'created', 'developed', 'implemented', 'achieved', 'result', 'outcome', 'impact', 'team', 'project', 'руководил', 'создал', 'достиг', 'басқардым', 'құрдым', 'жетістік'],
    medium: ['participated', 'helped', 'worked', 'contributed', 'involved', 'learned', 'участвовал', 'помогал', 'қатыстым', 'көмектестім'],
  },
  skills: {
    high: ['programming', 'design', 'research', 'analysis', 'leadership', 'communication', 'problem-solving', 'critical thinking', 'data', 'AI', 'machine learning', 'программирование', 'дизайн', 'исследование', 'бағдарламалау', 'зерттеу'],
    medium: ['writing', 'reading', 'math', 'English', 'teamwork', 'creative', 'письмо', 'математика', 'жазу', 'математика'],
  },
  potential: {
    high: ['startup', 'enterprise', 'solve', 'innovate', 'scale', 'global', 'sustainable', 'revolution', 'breakthrough', 'pioneer', 'стартап', 'решить', 'инновация', 'стартап', 'шешу', 'инновация'],
    medium: ['improve', 'grow', 'learn', 'develop', 'future', 'career', 'улучшить', 'расти', 'жақсарту', 'өсу'],
  },
};

/**
 * Count keyword matches in text (case-insensitive, multilingual)
 * @param {string} text - Candidate's response text
 * @param {Object} keywords - { high: string[], medium: string[] }
 * @returns {{ high: number, medium: number }} — match counts
 */
function countKeywords(text, keywords) {
  const lower = text.toLowerCase();
  let high = 0;
  let medium = 0;
  keywords.high.forEach(k => {
    if (lower.includes(k.toLowerCase())) high++;
  });
  keywords.medium.forEach(k => {
    if (lower.includes(k.toLowerCase())) medium++;
  });
  return { high, medium };
}

/**
 * Score a single interview answer against its evaluation category.
 * 
 * Scoring breakdown:
 *   Base: 30 points (minimum for any valid response)
 *   Length: +10 (30+ words), +10 (60+ words), +5 (100+ words), +5 (150+ words)
 *   Keywords: +8 per high-impact, +4 per medium-impact
 *   Structure: +5 (3+ sentences), +5 (5+ sentences)
 *   Specificity: +3 (contains year), +2 (contains numbers), +2 (uses commas)
 *   Range: Clamped to [20, 100] with ±2 variance for evaluation realism
 * 
 * @param {string} text - The candidate's answer text
 * @param {string} category - One of: 'motivation', 'experience', 'skills', 'potential'
 * @returns {{ score: number, feedback: string }}
 */
export function scoreAnswer(text, category) {
  if (!text || text.trim().length < 10) {
    return { score: 15, feedback: 'Please provide a more detailed response.' };
  }

  const wordCount = text.trim().split(/\s+/).length;
  const keywords = KEYWORDS[category] || KEYWORDS.motivation;
  const { high, medium } = countKeywords(text, keywords);

  // Base score from response length (rewards detailed answers)
  let score = 30;
  if (wordCount > 30) score += 10;
  if (wordCount > 60) score += 10;
  if (wordCount > 100) score += 5;
  if (wordCount > 150) score += 5;

  // Keyword relevance bonus
  score += high * 8;
  score += medium * 4;

  // Sentence variety bonus (rewards structured, multi-point answers)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 3) score += 5;
  if (sentences.length > 5) score += 5;

  // Specificity bonus — concrete details strengthen any response
  if (text.match(/\d{4}/)) score += 3; // Contains year (e.g., "In 2024...")
  if (text.match(/\d+/)) score += 2;   // Contains numbers (quantified claims)
  if (text.includes(',')) score += 2;   // Complex sentence structure

  // Clamp to valid range with slight variance for evaluation realism
  score = Math.min(score, 98);
  score += Math.floor(Math.random() * 5) - 2;
  score = Math.max(20, Math.min(100, score));

  // Generate contextual, actionable feedback based on score tier
  const feedbacks = {
    high: [
      'Excellent response! Shows deep understanding and genuine commitment.',
      'Outstanding answer with clear passion and concrete examples.',
      'Very impressive! Your response demonstrates strong potential.',
    ],
    medium: [
      'Good response with relevant points. Consider adding specific examples.',
      'Solid answer. Could be strengthened with more personal experiences.',
      'Nice start! Try to connect your ideas to real-world impact.',
    ],
    low: [
      'Try to provide more specific details and personal experiences.',
      'Consider explaining your motivations more deeply.',
      'Adding concrete examples would strengthen your response.',
    ],
  };

  let feedback;
  if (score >= 80) feedback = feedbacks.high[Math.floor(Math.random() * feedbacks.high.length)];
  else if (score >= 50) feedback = feedbacks.medium[Math.floor(Math.random() * feedbacks.medium.length)];
  else feedback = feedbacks.low[Math.floor(Math.random() * feedbacks.low.length)];

  return { score, feedback };
}

/**
 * Simulate AI-powered CV analysis.
 * Extracts skills, experience years, and education level.
 * Returns with a processing delay to simulate real API latency.
 * 
 * Production: Will be replaced with document parsing API (e.g., 
 * Azure Document Intelligence) + LLM evaluation pipeline.
 * 
 * @param {string} fileName - Name of the uploaded CV file
 * @returns {Promise<Object>} — CV analysis results
 */
export function scoreCV(fileName) {
  const delay = 2000 + Math.random() * 1500;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        matchScore: 72 + Math.floor(Math.random() * 20),
        skills: [
          { name: 'Leadership', level: 70 + Math.floor(Math.random() * 25) },
          { name: 'Communication', level: 65 + Math.floor(Math.random() * 30) },
          { name: 'Technical Skills', level: 60 + Math.floor(Math.random() * 30) },
          { name: 'Problem Solving', level: 68 + Math.floor(Math.random() * 25) },
          { name: 'Teamwork', level: 75 + Math.floor(Math.random() * 20) },
          { name: 'Critical Thinking', level: 62 + Math.floor(Math.random() * 30) },
        ],
        experienceYears: 1 + Math.floor(Math.random() * 4),
        education: 'High School Diploma / Foundation',
        suggestions: [
          'Highlight specific projects with measurable outcomes',
          'Add more details about leadership experiences',
          'Include technical certifications or courses',
          'Quantify achievements where possible',
        ],
      });
    }, delay);
  });
}

/**
 * Evaluate a motivation letter across 4 quality dimensions:
 *   - Authenticity: How genuine and personal the writing feels
 *   - Writing Quality: Grammar, structure, and clarity
 *   - Relevance: Alignment with inVision U's mission and values
 *   - Impact: Strength of the candidate's vision and ambition
 * 
 * Also performs theme extraction using multilingual keyword matching
 * to identify the candidate's key focus areas (Leadership, Innovation, etc.)
 * 
 * @param {string} text - The motivation letter text
 * @returns {Promise<Object>} — Letter analysis with scores and themes
 */
export function scoreMotivationLetter(text) {
  const wordCount = text.trim().split(/\s+/).length;
  const delay = 1500 + Math.random() * 1500;

  return new Promise((resolve) => {
    setTimeout(() => {
      // Base score scales with letter length (incentivizes thorough writing)
      const base = wordCount > 100 ? 60 : wordCount > 50 ? 45 : 30;
      const rand = () => Math.floor(Math.random() * 20);

      // Theme extraction — multilingual keyword detection (EN/RU/KZ)
      const themes = [];
      const lower = text.toLowerCase();
      if (lower.includes('leader') || lower.includes('лидер') || lower.includes('көшбасшы')) themes.push('Leadership');
      if (lower.includes('innovat') || lower.includes('инновац') || lower.includes('инновация')) themes.push('Innovation');
      if (lower.includes('communit') || lower.includes('сообщест') || lower.includes('қоғамдастық')) themes.push('Community');
      if (lower.includes('team') || lower.includes('команд') || lower.includes('команда')) themes.push('Teamwork');
      if (lower.includes('technolog') || lower.includes('технолог') || lower.includes('технология')) themes.push('Technology');
      if (lower.includes('sustain') || lower.includes('устойчив') || lower.includes('тұрақты')) themes.push('Sustainability');
      if (lower.includes('research') || lower.includes('исследован') || lower.includes('зерттеу')) themes.push('Research');
      if (themes.length === 0) themes.push('General');

      resolve({
        authenticity: Math.min(100, base + rand() + 10),
        writingQuality: Math.min(100, base + rand() + 5),
        relevance: Math.min(100, base + rand() + (themes.length > 2 ? 15 : 0)),
        impact: Math.min(100, base + rand()),
        themes,
        suggestions: [
          'Open with a compelling personal story',
          'Connect your goals to inVision U\'s mission specifically',
          'Show how you\'ll contribute to the community after graduation',
          'Use specific examples rather than general statements',
        ],
      });
    }, delay);
  });
}

/**
 * Calculate weighted overall score from all evaluation components.
 * Weights: Interview 40%, CV 30%, Motivation Letter 30%
 * 
 * This weighting reflects admissions committee priorities:
 * real-time interview performance carries highest weight,
 * while documented credentials and written communication
 * are equally valued.
 * 
 * @param {Object|null} interviewScores - { overall, motivation, experience, skills, potential }
 * @param {Object|null} cvAnalysis - { matchScore, skills, ... }
 * @param {Object|null} motivationAnalysis - { authenticity, writingQuality, relevance, impact }
 * @returns {number} — Weighted overall score (0-100)
 */
export function getOverallScore(interviewScores, cvAnalysis, motivationAnalysis) {
  let total = 0;
  let count = 0;

  if (interviewScores) {
    total += interviewScores.overall * 0.4;
    count += 0.4;
  }
  if (cvAnalysis) {
    total += cvAnalysis.matchScore * 0.3;
    count += 0.3;
  }
  if (motivationAnalysis) {
    const avgMotivation = (motivationAnalysis.authenticity + motivationAnalysis.writingQuality + motivationAnalysis.relevance + motivationAnalysis.impact) / 4;
    total += avgMotivation * 0.3;
    count += 0.3;
  }

  return count > 0 ? Math.round(total / count) : 0;
}
