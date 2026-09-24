import { useState, useEffect, useRef, useMemo } from 'react';
import emailjs from '@emailjs/browser';
import { APP_CONFIG } from './Config';
import './App.css';

const QUESTIONS = [
  // PARTE 1
  {
    id: 1, section: 1, type: "select",
    text: "¿Qué utilidad logró este negocio en este período?",
    options: ["UR$ 10,000", "UR$ 2,050", "No sé", "UR$ 450", "UR$ 3,000"],
    correct: "UR$ 450"
  },
  {
    id: 2, section: 1, type: "select",
    text: "¿Cuál es su rentabilidad? (ROI)?",
    options: ["10%", "25%", "No sé", "3.25%", "4.5%"],
    correct: "4.5%"
  },
  {
    id: 3, section: 1, type: "select",
    text: "¿Cuál es su razón circulante?",
    options: ["4.67x", "No sé", "6.76x", "3.5x", "2.88x"],
    correct: "4.67x"
  },
  {
    id: 4, section: 1, type: "select",
    text: "¿Cuánto necesita vender este negocio para llegar al punto de equilibrio?",
    options: ["UR$ 5,269", "UR$ 2,342", "UR$ 2,127", "No sé", "UR$ 3,154"],
    correct: "UR$ 2,342"
  },
  {
    id: 5, section: 1, type: "select",
    text: "¿Cuánto necesita vender para llegar a una utilidad meta de UR$ 2,000?",
    options: ["UR$ 5,269", "UR$ 2,388", "UR$ 3,157", "No sé", "UR$ 4,363"],
    correct: "UR$ 5,269"
  },
  // PARTE 2
  {
    id: 6, section: 2, type: "text",
    prompt: "Un negocio vende una pluma por $1.00, su costo es de $0.60 y los gastos fijos son de $2,000 por mes. Su utilidad meta es de $1,000 por mes.",
    text: "¿Cuánto necesita vender este negocio por mes para alcanzar su punto de equilibrio?",
    correct: "5000"
  },
  {
    id: 7, section: 2, type: "text",
    prompt: "Un negocio vende una pluma por $1.00, su costo es de $0.60 y los gastos fijos son de $2,000 por mes. Su utilidad meta es de $1,000 por mes.",
    text: "¿Cuánto necesita vender este negocio por mes para alcanzar su utilidad meta?",
    correct: "7500"
  },
  // PARTE 3
  {
    id: 8, section: 3, type: "radio",
    prompt: "Evento 1 de 2 - Venta al Contado:\nHacemos una venta por $2,000. El impuesto de ventas (IVA) es del 5%, el costo del producto que estamos vendiendo es de $800 y la comisión para la persona que cerró la venta es del 10%, la cual no será pagada inmediatamente.",
    options: [
      "Debitar Ventas Locales y acreditar Cajas & Bancos. Debitar Impuestos por Pagar y acreditar Cajas & Bancos. Debitar Inventarios y acreditar Costo del Producto Vendido. Debitar Comisiones por Pagar y acreditar Comisiones.",
      "Debitar Cajas & Bancos y acreditar Ventas Locales. Debitar Cajas & Bancos y acreditar Impuestos por Pagar. Debitar Inventarios y acreditar Costo del Producto Vendido. Debitar Comisiones por Pagar y acreditar Comisiones.",
      "Debitar Ventas Locales y acreditar Cajas & Bancos. Debitar Cajas & Bancos y acreditar Impuestos por Pagar. Debitar Costo del Producto Vendido y acreditar Inventarios. Debitar Comisiones y acreditar Comisiones por Pagar.",
      "No sé.",
      "Debitar Cajas & Bancos y acreditar Ventas Locales. Debitar Cajas & Bancos y acreditar Impuestos por Pagar. Debitar Costo del Producto Vendido y acreditar Inventarios. Debitar comisiones y acreditar Comisiones por Pagar."
    ],
    correct: "Debitar Cajas & Bancos y acreditar Ventas Locales. Debitar Cajas & Bancos y acreditar Impuestos por Pagar. Debitar Costo del Producto Vendido y acreditar Inventarios. Debitar comisiones y acreditar Comisiones por Pagar."
  },
  {
    id: 9, section: 3, type: "radio",
    prompt: "Evento 2 de 2 - Pago Rebotado:\nEl pago que habíamos hecho por $1,000 para cubrir la deuda con nuestro proveedor de inventarios, ha rebotado. El banco nos cobra $25 por este incidente.",
    options: [
      "Debitar Cuentas por Pagar y acreditar Cajas & Bancos. Debitar Otros Gastos y acreditar Cajas & Bancos.",
      "Debitar Cajas & Bancos y acreditar Inventarios. Debitar Otros Gastos y acreditar Cajas & Bancos.",
      "No sé.",
      "Debitar Cajas & Bancos y acreditar Cuentas por Pagar. Debitar Otros Gastos y acreditar Cajas & Bancos.",
      "Debitar Cuentas por Pagar y acreditar Inventarios. Debitar Cajas & Bancos y acreditar Otros Gastos."
    ],
    correct: "Debitar Cajas & Bancos y acreditar Cuentas por Pagar. Debitar Otros Gastos y acreditar Cajas & Bancos."
  },
  // PARTE 4
  {
    id: 10, section: 4, type: "dual-select",
    text: "Usa el menu desplegable para definir los siguientes conceptos.",
    options: ["Varía según la institución", "No sé", "Restas", "Depende de la naturaleza de la cuenta", "Sumas"],
    correctDebits: "Sumas",
    correctCredits: "Restas"
  }
];

export default function App() {
  const quizQuestions = useMemo(() => {
    const shuffleArray = (array) => {
      const regularOptions = array.filter(opt => !opt.includes("No sé"));
      const noSeOptions = array.filter(opt => opt.includes("No sé"));
      
      for (let i = regularOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [regularOptions[i], regularOptions[j]] = [regularOptions[j], regularOptions[i]];
      }
      
      return [...regularOptions, ...noSeOptions];
    };

    return QUESTIONS.map(q => {
      if (q.options) {
        return { ...q, options: shuffleArray(q.options) };
      }
      return q;
    });
  }, []);

  const [step, setStep] = useState(0); 
  const [userInfo, setUserInfo] = useState({ name: '', email: '', company: '' });
  const [adminEmail, setAdminEmail] = useState(APP_CONFIG.defaultAdminEmail);
  
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(APP_CONFIG.timerSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Resume Modal State
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [recoveredData, setRecoveredData] = useState(null);
  
  const timerRef = useRef(null);

  // Check for saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('qbits_pretest_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      if (parsed.step > 0 && parsed.step < 100) {
        setRecoveredData(parsed);
        setShowResumePrompt(true);
      }
    }
  }, []);

  // Auto-save session progress
  useEffect(() => {
    if (step > 0 && step < 100 && !showResumePrompt) {
      const sessionData = { step, currentQ, userAnswers, score, timeLeft, userInfo };
      localStorage.setItem('qbits_pretest_session', JSON.stringify(sessionData));
    }
  }, [step, currentQ, userAnswers, score, timeLeft, userInfo, showResumePrompt]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipientParam = params.get('admin_email') || params.get('recipient');
    if (recipientParam) setAdminEmail(recipientParam);
  }, []);

  // Timer only runs if the resume modal is closed
  useEffect(() => {
    if (step >= 2 && step < 100 && timeLeft > 0 && !showResumePrompt) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, showResumePrompt]);

  const handleResumeYes = () => {
    if (recoveredData) {
      setStep(recoveredData.step);
      setCurrentQ(recoveredData.currentQ);
      setUserAnswers(recoveredData.userAnswers);
      setScore(recoveredData.score);
      setTimeLeft(recoveredData.timeLeft);
      setUserInfo(recoveredData.userInfo);
    }
    setShowResumePrompt(false);
  };

  const handleResumeNo = () => {
    localStorage.removeItem('qbits_pretest_session');
    setShowResumePrompt(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswerChange = (val, part = null) => {
    if (quizQuestions[currentQ].type === 'dual-select') {
      setUserAnswers(prev => ({
        ...prev,
        [currentQ]: { ...prev[currentQ], [part]: val }
      }));
    } else {
      setUserAnswers(prev => ({ ...prev, [currentQ]: val }));
    }
  };

  const evaluateCurrentQuestion = () => {
    const q = quizQuestions[currentQ];
    const ans = userAnswers[currentQ];
    
    if (q.type === 'dual-select') {
      let earned = 0;
      if (ans?.debits === q.correctDebits) earned += 5;
      if (ans?.credits === q.correctCredits) earned += 5;
      return earned;
    }

    if (q.type === 'text') {
      const cleanUser = String(ans || '').replace(/,/g, '').trim();
      const cleanCorrect = String(q.correct).replace(/,/g, '').trim();
      return cleanUser === cleanCorrect ? 10 : 0;
    }

    return ans === q.correct ? 10 : 0;
  };

  const handleNextQuestion = () => {
    const pointsEarned = evaluateCurrentQuestion();
    setScore(prev => prev + pointsEarned);

    if (currentQ < quizQuestions.length - 1) {
      if (quizQuestions[currentQ + 1].section !== quizQuestions[currentQ].section) {
        setStep(quizQuestions[currentQ + 1].section + 10); 
      }
      setCurrentQ(prev => prev + 1);
    } else {
      finishAndSendTest(score + pointsEarned);
    }
  };

  const handleAutoSubmit = () => finishAndSendTest(score);

  const finishAndSendTest = (finalScore) => {
    clearInterval(timerRef.current);
    localStorage.removeItem('qbits_pretest_session'); // Clear save file on finish
    setScore(finalScore);
    setStep(100); 
    setIsSubmitting(true);

    const templateParams = {
      admin_recipient: adminEmail,
      student_name: userInfo.name,
      student_email: userInfo.email,
      student_company: userInfo.company || 'N/A',
      final_score: `${finalScore} / 100`,
      time_spent: formatTime(APP_CONFIG.timerSeconds - timeLeft)
    };

    if (APP_CONFIG.emailJS.serviceID !== "YOUR_SERVICE_ID") {
      emailjs.send(APP_CONFIG.emailJS.serviceID, APP_CONFIG.emailJS.templateID, templateParams, APP_CONFIG.emailJS.publicKey)
        .then((response) => console.log('SUCCESS: Email sent!', response))
        .catch((error) => console.error('FAILED: Email did not send.', error))
        .finally(() => setIsSubmitting(false));
    } else {
      setTimeout(() => setIsSubmitting(false), 1500); 
    }
  };

  const handleClose = () => {
    window.location.href = "https://unithomasmore.edu.ni/qbits_landing/#tab=revista";
  };

  const renderQuestionInput = (q) => {
    const ans = userAnswers[currentQ];
    switch (q.type) {
      case "select":
        return (
          <select value={ans || ''} onChange={e => handleAnswerChange(e.target.value)} className="select-input-full">
            <option value="" disabled>- Seleccionar -</option>
            {q.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
          </select>
        );
      case "text":
        return (
          <input 
            type="text" 
            placeholder="Ingrese la cantidad (ej. 1,200)" 
            value={ans || ''} 
            onChange={e => handleAnswerChange(e.target.value)} 
            className="text-input-full"
          />
        );
      case "radio":
        return (
          <div className="radio-group">
            {q.options.map((opt, i) => (
              <label key={i} className="radio-label">
                <input 
                  type="radio" 
                  name={`q${q.id}`} 
                  value={opt} 
                  checked={ans === opt}
                  onChange={e => handleAnswerChange(e.target.value)} 
                />
                <span className="radio-text">{opt}</span>
              </label>
            ))}
          </div>
        );
      case "dual-select":
        return (
          <div className="dual-select-container">
            <div className="select-row">
              <strong>Débitos</strong> son: 
              <select value={ans?.debits || ''} onChange={e => handleAnswerChange(e.target.value, 'debits')} className="select-input-small">
                <option value="" disabled>- Seleccionar -</option>
                {q.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div className="select-row">
              <strong>Créditos</strong> son: 
              <select value={ans?.credits || ''} onChange={e => handleAnswerChange(e.target.value, 'credits')} className="select-input-small">
                <option value="" disabled>- Seleccionar -</option>
                {q.options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const isNextDisabled = () => {
    const ans = userAnswers[currentQ];
    if (quizQuestions[currentQ].type === 'dual-select') return !ans?.debits || !ans?.credits;
    return !ans || ans === '';
  };

  const wrapperClass = step === 3 ? "main-wrapper bg-clean" : "main-wrapper bg-branded";

  return (
    <div className={wrapperClass}>
      
      {showResumePrompt && (
        <div className="resume-modal-overlay">
          <div className="resume-modal">
            <div className="resume-icon">?</div>
            <h3>¿Desearía reanudar en donde se quedó?</h3>
            <div className="resume-buttons">
              <button className="btn-primary btn-resume" onClick={handleResumeYes}>Sí</button>
              <button className="btn-primary btn-resume" onClick={handleResumeNo}>No</button>
            </div>
          </div>
        </div>
      )}

      <div className="card-container">
        
        {step === 0 && (
          <div className="screen landing-screen">
            <div className="landing-content">
              <h1>Prueba preliminar - 12 minutos</h1>
              <p>Esta prueba te dirá si cuentas con el nivel mínimo de comprensión sobre los estados financieros que se espera de las personas en el mundo de los negocios.</p>
              <p>La idea es evaluar tu comprensión al comienzo del programa para poder compararla al final y saber cuánto aprendiste.</p>
              <p className="note highlight-text"><strong>Nota:</strong> Si no sabes la respuesta a una pregunta, elige: <em>"No sé"</em>.</p>
              <button className="btn-primary" onClick={() => setStep(1)}>Empezar prueba &gt;</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="screen form-screen">
            <div className="form-content">
              <h2>Favor introduce tu información:</h2>
              <form onSubmit={(e) => { e.preventDefault(); setStep(11); }}>
                <input type="text" placeholder="Nombre completo*" required value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="text-input-full" />
                <input type="email" placeholder="Correo electrónico*" required value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})} className="text-input-full" />
                <input type="text" placeholder="Institución/Compañía" value={userInfo.company} onChange={e => setUserInfo({...userInfo, company: e.target.value})} className="text-input-full" />
                <button type="submit" className="btn-primary">Continuar &gt;</button>
              </form>
            </div>
          </div>
        )}

        {[11, 12, 13, 14].includes(step) && (
          <div className="screen section-screen">
            <div className="timer-badge">⏱ {formatTime(timeLeft)}</div>
            <div className="section-content">
              {step === 11 && (
                <>
                  <h2>Parte 1 de 4 Analizando estados financieros</h2>
                  <p><strong>Instrucciones:</strong> Responde las siguientes cinco preguntas en base a los estados financieros que verás en pantalla.</p>
                </>
              )}
              {step === 12 && (
                <>
                  <h2>Parte 2 de 4 Análisis de punto de equilibrio</h2>
                  <p><strong>Instrucciones:</strong> Determina la cantidad correcta para responder las siguientes preguntas.</p>
                </>
              )}
              {step === 13 && (
                <>
                  <h2>Parte 3 de 4 Los eventos que construyen a los estados financieros</h2>
                  <p>Los estados financieros nos cuentan la historia de un negocio. Para entenderlos, es crucial saber cómo los eventos financieros los construyen. Esto revela cómo llegan los números a los estados financieros y qué significan.</p>
                  <p><strong>Instrucciones:</strong> Elije las respuestas que resuelven los siguientes eventos financieros.</p>
                </>
              )}
              {step === 14 && (
                <>
                  <h2>Parte 4 de 4 Los dos (2) conceptos básicos de la contabilidad financiera</h2>
                </>
              )}
            </div>
            <div className="quiz-footer">
              <div className="footer-stats">
                <span className="score-tracker">Su resultado: {score} de 100</span>
              </div>
              <button className="btn-primary" onClick={() => setStep(3)}>Continuar &gt;</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="screen quiz-screen">
            <div className="timer-badge">⏱ {formatTime(timeLeft)}</div>
            
            <div className="quiz-content-area">
              {quizQuestions[currentQ].section === 1 && (
                <div className="statement-frame">
                  <img src="/financial-statement.png" alt="Estado de Resultados y Balance General" />
                </div>
              )}
              
              {quizQuestions[currentQ].prompt && (
                <div className="question-prompt">
                  {quizQuestions[currentQ].prompt.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
              )}

              <div className="question-box">
                <label className="question-label">
                  {quizQuestions[currentQ].section === 2 || quizQuestions[currentQ].section === 3 ? `Pregunta ${quizQuestions[currentQ].id === 6 || quizQuestions[currentQ].id === 8 ? '1' : '2'} de 2: ` : `${quizQuestions[currentQ].id})`} {quizQuestions[currentQ].text}
                </label>
                {renderQuestionInput(quizQuestions[currentQ])}
              </div>
            </div>

            <div className="quiz-footer">
              <div className="footer-stats">
                <span className="score-tracker">Su resultado: {score} de 100</span>
                <span className="progress-tracker">Pregunta {currentQ + 1} de {quizQuestions.length}</span>
              </div>
              <button className="btn-primary" disabled={isNextDisabled()} onClick={handleNextQuestion}>Continuar &gt;</button>
            </div>
          </div>
        )}

        {step === 100 && (
          <div className="screen result-screen">
            <div className="result-content">
              {score >= 80 ? (
                <>
                  <div className="icon-pass">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                      <circle cx="12" cy="12" r="12" fill="#16a34a"/>
                      <path d="M7 12.5l3 3 7-7" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="pass-text">¡Felicidades, pasaste la prueba!</h2>
                </>
              ) : (
                <>
                  <div className="icon-fail">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                      <circle cx="12" cy="12" r="12" fill="#e11d48"/>
                      <path d="M15 9l-6 6M9 9l6 6" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="fail-text">No pasaste la prueba.</h2>
                </>
              )}
              <div className="score-details">
                <p>Tu puntaje: <strong>{score}% ({score} puntos)</strong></p>
                <p>Puntaje para pasar: <strong>80% (80 puntos)</strong></p>
              </div>
              
              {isSubmitting ? (
                <p className="sending-text">Enviando resultados al instructor...</p>
              ) : (
                <p className="success-text">Resultados enviados correctamente.</p>
              )}

              <button className="btn-primary btn-close" disabled={isSubmitting} onClick={handleClose}>
                {isSubmitting ? "Enviando..." : "Cerrar >"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}