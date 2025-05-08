
const questions = [
  // --- ETHICS & PROFESSIONAL BOUNDARIES ---
  { topic: "ethics", question: "What does HIPAA stand for?", answers: ["Health Insurance Portability and Accountability Act", "Hippocratic Information Patient Privacy Act"], correct: 0 },
  { topic: "ethics", question: "What is veracity in massage therapy ethics?", answers: ["Client's right to objective truth", "Doing no harm"], correct: 0 },
  { topic: "ethics", question: "What does non-maleficence mean?", answers: ["To do no harm", "To maximize benefits"], correct: 0 },
  { topic: "ethics", question: "Who determines Scope of Practice?", answers: ["States and their licensing boards", "Individual therapists"], correct: 0 },
  { topic: "ethics", question: "What should you do if there is a power differential issue?", answers: ["Ensure informed consent and professional boundaries", "Ignore it"], correct: 0 },

  // --- SOAP NOTES & DOCUMENTATION ---
  { topic: "soap", question: "What does SOAP stand for?", answers: ["Subjective, Objective, Assessment, Plan", "Systematic Observation and Plan"], correct: 0 },
  { topic: "soap", question: "Where do you document client complaints?", answers: ["Subjective section", "Objective section"], correct: 0 },
  { topic: "soap", question: "Where do you document what you observed?", answers: ["Objective section", "Subjective section"], correct: 0 },
  { topic: "soap", question: "Where do you record your analysis of the session?", answers: ["Assessment section", "Plan section"], correct: 0 },
  { topic: "soap", question: "Where do you record future treatment suggestions?", answers: ["Plan section", "Objective section"], correct: 0 },

  // --- HISTORY ---
  { topic: "history", question: "Who is considered the Father of Medicine?", answers: ["Hippocrates", "Asclepius"], correct: 0 },
  { topic: "history", question: "Who wrote 'Canon of Massage'?", answers: ["Avicenna", "Galen"], correct: 0 },
  { topic: "history", question: "Who invented Chair Massage?", answers: ["David Palmer", "Elizabeth Dicke"], correct: 0 },
  { topic: "history", question: "What caused massage decline after the Fall of Rome?", answers: ["Fear and association with magic", "More advanced medicine replaced it"], correct: 0 },
  { topic: "history", question: "What was 'Anatripsis'?", answers: ["Rubbing to push blood through limbs", "A type of joint movement"], correct: 0 },

  // --- MASSAGE TECHNIQUES ---
  { topic: "techniques", question: "What is effleurage?", answers: ["Gliding", "Percussion"], correct: 0 },
  { topic: "techniques", question: "What is petrissage?", answers: ["Kneading", "Gliding"], correct: 0 },
  { topic: "techniques", question: "What is tapotement?", answers: ["Percussion techniques like hacking", "Gentle gliding strokes"], correct: 0 },
  { topic: "techniques", question: "What is shearing?", answers: ["Wringing or chucking", "Kneading"], correct: 0 },
  { topic: "techniques", question: "What is oscillation in massage?", answers: ["Rocking, shaking, or jostling", "Tapotement"], correct: 0 },

  // --- CONTRAINDICATIONS ---
  { topic: "contraindications", question: "What is a contraindication?", answers: ["A reason to avoid or modify massage", "A desired massage effect"], correct: 0 },
  { topic: "contraindications", question: "Can massage be performed on someone with uncontrolled hypertension?", answers: ["No, must refer out or get medical clearance", "Yes, proceed carefully"], correct: 0 },
  { topic: "contraindications", question: "What is pitting edema?", answers: ["A contraindication", "A type of technique"], correct: 0 },
  { topic: "contraindications", question: "Is massage contraindicated during cancer treatment?", answers: ["Yes, without medical clearance", "No"], correct: 0 },
  { topic: "contraindications", question: "Is 1st trimester pregnancy a contraindication?", answers: ["Yes, because it is more volatile", "No"], correct: 0 },

  // --- PHYSIOLOGICAL EFFECTS ---
  { topic: "effects", question: "What does Gate Control Theory describe?", answers: ["Massage interrupts pain signals", "Massage blocks nerves permanently"], correct: 0 },
  { topic: "effects", question: "How does massage affect parasympathetic nervous system?", answers: ["Promotes rest and digest state", "Stimulates fight or flight"], correct: 0 },
  { topic: "effects", question: "What effect does effleurage have on capillaries?", answers: ["Temporarily dilates them", "Shrinks them permanently"], correct: 0 },

  // --- PROFESSIONAL PRACTICE ---
  { topic: "professional", question: "What is informed consent?", answers: ["Client understands and agrees to treatment", "Therapist deciding treatment unilaterally"], correct: 0 },
  { topic: "professional", question: "What is the recommended massage room temperature?", answers: ["72-75°F", "60°F"], correct: 0 },
  { topic: "professional", question: "Why is proper draping important?", answers: ["Protects client privacy and comfort", "Just for decoration"], correct: 0 },
  { topic: "professional", question: "Why is grounding important for therapists?", answers: ["Stay present and connected with client", "Increase pressure techniques"], correct: 0 }
];
