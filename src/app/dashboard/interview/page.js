'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import useStore from '@/store/useStore';
import { t } from '@/i18n/translations';
import { interviewQuestions } from '@/data/mockData';
import { scoreAnswer } from '@/utils/scoring';
import styles from './interview.module.css';
import RadarChart from '@/components/RadarChart';

export default function InterviewPage() {
  const { language, interviewCompleted, interviewScores, setInterviewResults, addActivity } = useStore();
  const lang = language;
  const questions = interviewQuestions[lang] || interviewQuestions.en;

  const [mounted, setMounted] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [scoring, setScoring] = useState(false);
  const [scores, setScores] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const chatRef = useRef(null);

  const speakText = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [lang, voiceEnabled]);

  useEffect(() => {
    if (started && !finished && currentQ === 0) {
      speakText(questions[0].question);
    }
  }, [started, finished, currentQ, speakText, questions]);

  const toggleListening = () => {
    if (isListening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in your browser.");
    
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ru' ? 'ru-RU' : lang === 'kk' ? 'kk-KZ' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setAnswer(prev => (prev ? prev + ' ' : '') + e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  };

  useEffect(() => {
    setFinished(interviewCompleted);
    setMounted(true);
  }, [interviewCompleted]);

  const handleSubmit = async () => {
    if (!answer.trim() || scoring || showFeedback) return;
    setScoring(true);
    setShowFeedback(false);

    const result = scoreAnswer(answer, questions[currentQ].category);
    await new Promise(r => setTimeout(r, 1500));

    const newAnswers = [...answers, { question: questions[currentQ], answer, ...result }];
    const newScores = [...scores, result];
    setAnswers(newAnswers);
    setScores(newScores);
    setScoring(false);
    setShowFeedback(true);
    setAnswer(''); // Clear immediately so it's empty when it comes back

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
        speakText(questions[currentQ + 1].question);
        setShowFeedback(false);
      } else {
        // Calculate final scores
        const categories = { motivation: [], experience: [], skills: [], potential: [] };
        newAnswers.forEach(a => {
          categories[a.question.category].push(a.score);
        });
        const avg = (arr) => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
        const finalScores = {
          motivation: avg(categories.motivation),
          experience: avg(categories.experience),
          skills: avg(categories.skills),
          potential: avg(categories.potential),
          overall: avg(newScores.map(s => s.score)),
        };
        setInterviewResults(finalScores);
        addActivity({ type: 'interview', message: 'Completed AI Interview' });
        setFinished(true);
      }
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 2500);
  };

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [answers, scoring, showFeedback]);

  if (!mounted) return null;

  const displayScores = interviewScores || null;

  if (finished && displayScores) {
    return (
      <div className={styles.page}>
        <div className={styles.completedCard}>
          <div className={styles.completedIcon}>🎉</div>
          <h1 className={styles.completedTitle}>{t(lang, 'interview.completed')}</h1>
          <p className={styles.completedDesc}>{t(lang, 'interview.completedDesc')}</p>

          <div className={styles.overallScore}>
            <div className={styles.overallNum}>{displayScores.overall}</div>
            <div className={styles.overallLabel}>{t(lang, 'interview.score')}</div>
          </div>

          <div className={styles.radarContainer}>
            <RadarChart 
              scores={displayScores} 
              categories={[
                { key: 'motivation', label: t(lang, 'interview.motivation') },
                { key: 'experience', label: t(lang, 'interview.experience') },
                { key: 'skills', label: t(lang, 'interview.skills') },
                { key: 'potential', label: t(lang, 'interview.potential') },
              ]}
              size={220}
            />
          </div>

          <div className={styles.categoryScores}>
            {['motivation', 'experience', 'skills', 'potential'].map(cat => (
              <div key={cat} className={styles.categoryRow}>
                <span className={styles.catName}>{t(lang, `interview.${cat}`)}</span>
                <div className={styles.catBarTrack}>
                  <div className={styles.catBarFill} style={{ width: `${displayScores[cat]}%` }} />
                </div>
                <span className={styles.catScore}>{displayScores[cat]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={styles.page}>
        <div className={styles.startCard}>
          <div className={styles.startIcon}>🤖</div>
          <h1 className={styles.startTitle}>{t(lang, 'interview.title')}</h1>
          <p className={styles.startDesc}>{t(lang, 'interview.subtitle')}</p>
          <div className={styles.startInfo}>
            <div className={styles.infoItem}>📝 10 {lang === 'en' ? 'Questions' : lang === 'ru' ? 'Вопросов' : 'Сұрақ'}</div>
            <div className={styles.infoItem}>⏱️ ~15 {lang === 'en' ? 'minutes' : lang === 'ru' ? 'минут' : 'минут'}</div>
            <div className={styles.infoItem}>🎯 4 {lang === 'en' ? 'Categories' : lang === 'ru' ? 'Категории' : 'Категория'}</div>
          </div>
          <button className="btn-neon" onClick={() => setStarted(true)} style={{ padding: '16px 40px', fontSize: '16px' }}>
            {t(lang, 'interview.start')} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((currentQ + (!showFeedback && scoring ? 0 : showFeedback ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>
      <div className={styles.progressText}>
        {t(lang, 'interview.question')} {currentQ + 1} {t(lang, 'interview.of')} {questions.length}
      </div>

      {/* Chat */}
      <div className={styles.chatContainer} ref={chatRef}>
        {/* Past messages */}
        {answers.map((a, i) => (
          <div key={i} className={styles.chatGroup}>
            <div className={styles.botMessage}>
              <span className={styles.botAvatar}>🤖</span>
              <div className={styles.botBubble}>
                <span className={styles.catTag}>{a.question.category}</span>
                {a.question.question}
              </div>
            </div>
            <div className={styles.userMessage}>
              <div className={styles.userBubble}>{a.answer}</div>
            </div>
            <div className={styles.feedbackMessage}>
              <span className={styles.feedbackScore}>{a.score}/100</span>
              <span className={styles.feedbackText}>{a.feedback}</span>
            </div>
          </div>
        ))}

        {/* Current question */}
        {!finished && (
          <div className={styles.chatGroup}>
            <div className={styles.botMessage}>
              <span className={styles.botAvatar}>🤖</span>
              <div className={styles.botBubble}>
                <span className={styles.catTag}>{questions[currentQ].category}</span>
                {questions[currentQ].question}
              </div>
            </div>

            {scoring && (
              <div className={styles.thinkingMessage}>
                <div className={styles.thinkingDots}>
                  <span /><span /><span />
                </div>
                {t(lang, 'interview.thinking')}
              </div>
            )}

            {showFeedback && scores[scores.length - 1] && (
              <div className={styles.feedbackMessage}>
                <span className={styles.feedbackScore}>{scores[scores.length - 1].score}/100</span>
                <span className={styles.feedbackText}>{scores[scores.length - 1].feedback}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      {!finished && !scoring && !showFeedback && (
        <div className={styles.inputArea}>
          <button className={styles.micBtn} onClick={toggleListening} disabled={isListening} title="Voice Input">
            {isListening ? '🎙️' : '🎤'}
          </button>
          <textarea
            className={styles.textInput}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={t(lang, 'interview.placeholder')}
            rows={3}
            style={{ paddingRight: '50px' }}
          />
          <button className="btn-neon" onClick={handleSubmit} disabled={!answer.trim()} style={{ alignSelf: 'flex-end' }}>
            {currentQ < questions.length - 1 ? t(lang, 'interview.submit') : t(lang, 'interview.finish')} →
          </button>
        </div>
      )}
    </div>
  );
}
