import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  Smartphone, 
  Clock, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Sliders, 
  Plus, 
  Trash2, 
  Play, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Terminal, 
  Github, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  X
} from 'lucide-react';

// --- AUDIO SYNTHESIS MODULE (Web Audio API) ---
class HardwareSoundSystem {
  private ctx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTouch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.035);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playSolenoidLock() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
      clickGain.gain.setValueAtTime(0.35, now);
      clickGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.07);

      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(160, now + 0.02);
      thudOsc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
      thudGain.gain.setValueAtTime(0.4, now + 0.02);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);
      thudOsc.start(now + 0.02);
      thudOsc.stop(now + 0.26);
    } catch {}
  }

  playSolenoidUnlock() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(2.5, now);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const playBuzz = (offset: number) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now + offset);
        gain.gain.setValueAtTime(0.25, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.11);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.12);
      };
      playBuzz(0.0);
      playBuzz(0.15);
    } catch {}
  }

  playVictory() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.18 },
        { freq: 659.25, time: 0.16, dur: 0.18 },
        { freq: 783.99, time: 0.32, dur: 0.22 },
        { freq: 1046.50, time: 0.52, dur: 0.55 }
      ];
      const now = this.ctx.currentTime;
      notes.forEach(n => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        gain.gain.setValueAtTime(0.22, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur);
      });
    } catch {}
  }

  playEmergencyTick(pitchMultiplier = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 * pitchMultiplier, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }
}

const soundSystem = new HardwareSoundSystem();

// --- DATA TYPES ---
interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

interface Subject {
  id: string;
  name: string;
  color: string;
  weeklyGoalHours: number;
  studiedSeconds: number;
  topics: Topic[];
}

interface CalendarEvent {
  id: string;
  date: string;
  time: string;
  subjectId: string;
  topic: string;
  durationMinutes: number;
  status: 'pending' | 'completed';
}

interface Settings {
  hardcoreMode: boolean;
  soundEnabled: boolean;
  screenBrightness: number;
}

interface TerminalLog {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

interface ActiveSession {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  topicTitle: string;
  totalSeconds: number;
  remainingSeconds: number;
  elapsedSeconds: number;
}

// Initial Mock Data
const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-portugues',
    name: 'Português',
    color: '#10b981',
    weeklyGoalHours: 8,
    studiedSeconds: 30600,
    topics: [
      { id: 'p1', title: 'Crase e Regência Verbal', completed: true },
      { id: 'p2', title: 'Figuras de Linguagem e Estilo', completed: true },
      { id: 'p3', title: 'Interpretação de Textos e Coesão', completed: false },
      { id: 'p4', title: 'Concordância Nominal e Verbal', completed: false }
    ]
  },
  {
    id: 'subj-matematica',
    name: 'Matemática',
    color: '#6366f1',
    weeklyGoalHours: 10,
    studiedSeconds: 44100,
    topics: [
      { id: 'm1', title: 'Funções de 1º e 2º Grau', completed: true },
      { id: 'm2', title: 'Trigonometria no Triângulo Retângulo', completed: true },
      { id: 'm3', title: 'Geometria Espacial (Prismas)', completed: true },
      { id: 'm4', title: 'Análise Combinatória', completed: false }
    ]
  },
  {
    id: 'subj-historia',
    name: 'História',
    color: '#f59e0b',
    weeklyGoalHours: 6,
    studiedSeconds: 24000,
    topics: [
      { id: 'h1', title: 'Brasil Colônia e Mineração', completed: true },
      { id: 'h2', title: 'Revolução Industrial', completed: true },
      { id: 'h3', title: 'Era Vargas e Estado Novo', completed: false }
    ]
  },
  {
    id: 'subj-redacao',
    name: 'Redação',
    color: '#f43f5e',
    weeklyGoalHours: 8,
    studiedSeconds: 33600,
    topics: [
      { id: 'r1', title: 'Estrutura Dissertativo-Argumentativa', completed: true },
      { id: 'r2', title: 'Proposta de Intervenção Nota 1000', completed: true },
      { id: 'r3', title: 'Repertórios Socioculturais', completed: false }
    ]
  },
  {
    id: 'subj-ingles',
    name: 'Inglês',
    color: '#06b6d4',
    weeklyGoalHours: 4,
    studiedSeconds: 15000,
    topics: [
      { id: 'i1', title: 'Phrasal Verbs Mais Frequentes', completed: true },
      { id: 'i2', title: 'Linking Words e Conectivos Lógicos', completed: false }
    ]
  }
];

function getTodayString(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

const INITIAL_SCHEDULE: CalendarEvent[] = [
  { id: 'sch-1', date: getTodayString(0), time: '09:00', subjectId: 'subj-portugues', topic: 'Crase e Regência Verbal', durationMinutes: 45, status: 'completed' },
  { id: 'sch-2', date: getTodayString(0), time: '14:00', subjectId: 'subj-matematica', topic: 'Geometria Espacial (Prismas)', durationMinutes: 60, status: 'completed' },
  { id: 'sch-3', date: getTodayString(0), time: '16:30', subjectId: 'subj-historia', topic: 'Era Vargas e Estado Novo', durationMinutes: 45, status: 'pending' },
  { id: 'sch-4', date: getTodayString(0), time: '19:00', subjectId: 'subj-redacao', topic: 'Repertórios Socioculturais', durationMinutes: 60, status: 'pending' }
];

function formatDuration(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

export default function App() {
  // Navigation & Screen Tabs
  const [currentTab, setCurrentTab] = useState<'foco' | 'materias' | 'calendario' | 'config'>('foco');
  const [configSubtab, setConfigSubtab] = useState<'subjects' | 'calendar' | 'box'>('subjects');

  // Persistence State
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem('lockstudy_subjects');
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [schedule, setSchedule] = useState<CalendarEvent[]>(() => {
    try {
      const saved = localStorage.getItem('lockstudy_schedule');
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('lockstudy_settings');
      return saved ? JSON.parse(saved) : { hardcoreMode: false, soundEnabled: true, screenBrightness: 100 };
    } catch {
      return { hardcoreMode: false, soundEnabled: true, screenBrightness: 100 };
    }
  });

  // Hardware Simulator State
  const [phoneInside, setPhoneInside] = useState(true);
  const [lidClosed, setLidClosed] = useState(true);
  const [solenoidLocked, setSolenoidLocked] = useState(false);
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { time: '10:00:00', message: 'KERNEL LOCKSTUDY OS v2.4 INICIALIZADO', type: 'info' },
    { time: '10:00:01', message: 'SENSOR ÓPTICO: Smartphone detectado', type: 'success' },
    { time: '10:00:02', message: 'BOBINA QI: Carga por indução 15W ativa', type: 'success' }
  ]);
  const [showHardwareDrawer, setShowHardwareDrawer] = useState(false);

  // Focus Session State
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj-portugues');
  const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>('Crase e Regência Verbal');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  const [isCustomTopic, setIsCustomTopic] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [shakeError, setShakeError] = useState(false);

  // Emergency Unlock State
  const [emergencyHoldProgress, setEmergencyHoldProgress] = useState(0);
  const [isHoldingEmergency, setIsHoldingEmergency] = useState(false);
  const emergencyHoldRef = useRef<NodeJS.Timeout | null>(null);
  const [showEmergencyPinModal, setShowEmergencyPinModal] = useState(false);
  const [emergencyExpectedPin, setEmergencyExpectedPin] = useState('8492');
  const [emergencyPinInput, setEmergencyPinInput] = useState('');
  const [emergencyPinError, setEmergencyPinError] = useState('');

  // Modals & Dialogs
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState<{ subjectName: string; durationMinutes: number; topicId?: string; subjectId?: string } | null>(null);
  const [alertModal, setAlertModal] = useState<{ title: string; message: string } | null>(null);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Date strip selection
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString(0));

  // Digital clock
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  // Sync Audio Setting
  useEffect(() => {
    soundSystem.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Persist storage
  useEffect(() => {
    localStorage.setItem('lockstudy_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('lockstudy_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('lockstudy_settings', JSON.stringify(settings));
  }, [settings]);

  // Clock Ticker
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTimeStr(now.toTimeString().split(' ')[0]);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Logger helper
  const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setTerminalLogs(prev => [{ time, message, type }, ...prev.slice(0, 25)]);
  };

  // Timer loop for active study session
  useEffect(() => {
    if (!activeSession) return;

    const interval = setInterval(() => {
      setActiveSession(prev => {
        if (!prev) return null;
        const newRemaining = prev.remainingSeconds - timeMultiplier;
        const newElapsed = prev.elapsedSeconds + timeMultiplier;

        if (newRemaining <= 0) {
          // Finished!
          clearInterval(interval);
          handleSessionFinished(prev.subjectId, prev.subjectName, prev.topicTitle, prev.totalSeconds);
          return null;
        }

        return {
          ...prev,
          remainingSeconds: newRemaining,
          elapsedSeconds: newElapsed
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, timeMultiplier]);

  const handleSessionFinished = (subjId: string, subjName: string, topicTitle: string, totalSec: number) => {
    soundSystem.playVictory();
    setSolenoidLocked(false);
    soundSystem.playSolenoidUnlock();
    addLog('SOLENOIDE: DESTRAVADO 🔓 (Sessão concluída com sucesso!)', 'success');

    // Add study time to subject
    setSubjects(prev => prev.map(s => {
      if (s.id === subjId) {
        return { ...s, studiedSeconds: s.studiedSeconds + totalSec };
      }
      return s;
    }));

    const subject = subjects.find(s => s.id === subjId);
    const topicObj = subject?.topics.find(t => t.title === topicTitle);

    setCompletionData({
      subjectName: subjName,
      durationMinutes: Math.round(totalSec / 60),
      topicId: topicObj?.id,
      subjectId: subjId
    });
    setShowCompletionModal(true);
  };

  // Hardware Switch Handlers
  const handleTogglePhone = (present: boolean) => {
    soundSystem.playTouch();
    setPhoneInside(present);
    addLog(present ? 'SENSOR ÓPTICO: Smartphone colocado' : 'SENSOR ÓPTICO: Compartimento VAZIO', present ? 'success' : 'warn');
  };

  const handleToggleLid = (closed: boolean) => {
    if (solenoidLocked && !closed) {
      soundSystem.playError();
      addLog('BLOQUEIO: Tentativa de abrir tampa falhou (Solenoide travado)', 'error');
      setAlertModal({
        title: 'Bloqueio Mecânico Eletromagnético',
        message: 'A tampa não pode ser aberta enquanto o solenoide estiver trancado!'
      });
      return;
    }
    soundSystem.playTouch();
    setLidClosed(closed);
    addLog(closed ? 'MICROSWITCH: Tampa fechada' : 'MICROSWITCH: Tampa aberta', 'info');
  };

  const handleForceMasterUnlock = () => {
    soundSystem.playTouch();
    setSolenoidLocked(false);
    soundSystem.playSolenoidUnlock();
    addLog('SOLENOIDE: DESTRAVAMENTO FORÇADO 🚨', 'warn');
    if (activeSession) {
      if (activeSession.elapsedSeconds > 60) {
        setSubjects(prev => prev.map(s => s.id === activeSession.subjectId ? { ...s, studiedSeconds: s.studiedSeconds + activeSession.elapsedSeconds } : s));
      }
      setActiveSession(null);
    }
    setAlertModal({
      title: 'Destravamento Forçado',
      message: 'O solenoide foi recolhido manualmente pelo comando mestre.'
    });
  };

  const toggleSpeedAcceleration = () => {
    soundSystem.playTouch();
    const next = timeMultiplier === 1 ? 60 : 1;
    setTimeMultiplier(next);
    addLog(next === 60 ? 'DEBUG: Aceleração de tempo 60x ATIVADA ⚡' : 'DEBUG: Velocidade normal (1x)', 'warn');
  };

  // Start Study Session
  const handleStartStudy = () => {
    if (!phoneInside || !lidClosed) {
      soundSystem.playError();
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      setAlertModal({
        title: 'Atenção aos Sensores!',
        message: !phoneInside 
          ? 'Sensor Óptico: Nenhum celular foi detectado dentro da caixa! Coloque o aparelho primeiro.'
          : 'Tampa Aberta: Feche a tampa da caixa para acionar a trava eletromagnética!'
      });
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
    const finalTopic = isCustomTopic && customTopicInput.trim() ? customTopicInput.trim() : (selectedTopicTitle || 'Estudo Focado');
    const totalSec = durationMinutes * 60;

    // Engage solenoid
    setSolenoidLocked(true);
    soundSystem.playSolenoidLock();
    addLog(`SOLENOIDE: PINO ENGATADO! CELULAR PRESO 🔒 [${subject.name} - ${durationMinutes}m]`, 'warn');

    setActiveSession({
      subjectId: subject.id,
      subjectName: subject.name,
      subjectColor: subject.color,
      topicTitle: finalTopic,
      totalSeconds: totalSec,
      remainingSeconds: totalSec,
      elapsedSeconds: 0
    });
  };

  // Emergency Hold to Unlock
  const startEmergencyHold = () => {
    if (settings.hardcoreMode) return;
    setIsHoldingEmergency(true);
    setEmergencyHoldProgress(0);
    soundSystem.playEmergencyTick(1);

    let progress = 0;
    emergencyHoldRef.current = setInterval(() => {
      progress += 20;
      setEmergencyHoldProgress(progress);
      soundSystem.playEmergencyTick(1 + progress / 100);

      if (progress >= 100) {
        if (emergencyHoldRef.current) clearInterval(emergencyHoldRef.current);
        setIsHoldingEmergency(false);
        setEmergencyHoldProgress(0);
        // Open PIN challenge
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        setEmergencyExpectedPin(pin);
        setEmergencyPinInput('');
        setEmergencyPinError('');
        setShowEmergencyPinModal(true);
      }
    }, 1000);
  };

  const cancelEmergencyHold = () => {
    if (emergencyHoldRef.current) clearInterval(emergencyHoldRef.current);
    setIsHoldingEmergency(false);
    setEmergencyHoldProgress(0);
  };

  const handleVerifyEmergencyPin = () => {
    if (emergencyPinInput.trim() === emergencyExpectedPin) {
      soundSystem.playSolenoidUnlock();
      setSolenoidLocked(false);
      addLog('SOLENOIDE: DESTRAVADO 🔓 (Autorizado via PIN de emergência)', 'success');
      setShowEmergencyPinModal(false);
      if (activeSession && activeSession.elapsedSeconds > 60) {
        setSubjects(prev => prev.map(s => s.id === activeSession.subjectId ? { ...s, studiedSeconds: s.studiedSeconds + activeSession.elapsedSeconds } : s));
      }
      setActiveSession(null);
      setAlertModal({
        title: 'Caixa Destravada',
        message: 'Destravamento de emergência efetuado com sucesso.'
      });
    } else {
      soundSystem.playError();
      setEmergencyPinError('Código incorreto! Tente novamente.');
    }
  };

  // Subjects / Topics management
  const handleAddSubject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem('subName') as HTMLInputElement;
    const colorInput = form.elements.namedItem('subColor') as HTMLInputElement;
    const goalInput = form.elements.namedItem('subGoal') as HTMLInputElement;

    if (!nameInput.value.trim()) return;

    const newSubj: Subject = {
      id: 'subj-' + Date.now(),
      name: nameInput.value.trim(),
      color: colorInput.value || '#10b981',
      weeklyGoalHours: Number(goalInput.value) || 6,
      studiedSeconds: 0,
      topics: [{ id: 'top-' + Date.now(), title: 'Fundamentos e Revisão', completed: false }]
    };

    setSubjects(prev => [...prev, newSubj]);
    soundSystem.playTouch();
    form.reset();
    setAlertModal({ title: 'Sucesso!', message: `Matéria "${newSubj.name}" adicionada.` });
  };

  const handleAddTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const subjSelect = form.elements.namedItem('topicSubj') as HTMLSelectElement;
    const titleInput = form.elements.namedItem('topicTitle') as HTMLInputElement;

    if (!titleInput.value.trim()) return;

    setSubjects(prev => prev.map(s => {
      if (s.id === subjSelect.value) {
        return {
          ...s,
          topics: [...s.topics, { id: 'top-' + Date.now(), title: titleInput.value.trim(), completed: false }]
        };
      }
      return s;
    }));

    soundSystem.playTouch();
    titleInput.value = '';
    setAlertModal({ title: 'Sucesso!', message: 'Conteúdo inserido com sucesso.' });
  };

  const handleToggleTopic = (subjId: string, topicId: string) => {
    soundSystem.playTouch();
    setSubjects(prev => prev.map(s => {
      if (s.id === subjId) {
        return {
          ...s,
          topics: s.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
        };
      }
      return s;
    }));
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (confirm(`Deseja remover a matéria "${name}"?`)) {
      soundSystem.playTouch();
      setSubjects(prev => prev.filter(s => s.id !== id));
      setSchedule(prev => prev.filter(sc => sc.subjectId !== id));
    }
  };

  // Schedule management
  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const dateInput = form.elements.namedItem('schDate') as HTMLInputElement;
    const timeInput = form.elements.namedItem('schTime') as HTMLInputElement;
    const subjSelect = form.elements.namedItem('schSubj') as HTMLSelectElement;
    const topicInput = form.elements.namedItem('schTopic') as HTMLInputElement;
    const durInput = form.elements.namedItem('schDur') as HTMLInputElement;

    if (!topicInput.value.trim()) return;

    const newEvent: CalendarEvent = {
      id: 'sch-' + Date.now(),
      date: dateInput.value,
      time: timeInput.value,
      subjectId: subjSelect.value,
      topic: topicInput.value.trim(),
      durationMinutes: Number(durInput.value) || 45,
      status: 'pending'
    };

    setSchedule(prev => [...prev, newEvent]);
    soundSystem.playTouch();
    setSelectedDate(dateInput.value);
    setCurrentTab('calendario');
    setAlertModal({ title: 'Agendado!', message: 'Estudo adicionado ao seu cronograma diário.' });
  };

  const handleToggleEventStatus = (eventId: string) => {
    soundSystem.playTouch();
    setSchedule(prev => prev.map(e => e.id === eventId ? { ...e, status: e.status === 'completed' ? 'pending' : 'completed' } : e));
  };

  const handleDeleteEvent = (eventId: string) => {
    soundSystem.playTouch();
    setSchedule(prev => prev.filter(e => e.id !== eventId));
  };

  // Factory Reset
  const handleFactoryReset = () => {
    if (confirm('Deseja restaurar todos os dados e matérias para as configurações de fábrica?')) {
      localStorage.clear();
      setSubjects(INITIAL_SUBJECTS);
      setSchedule(INITIAL_SCHEDULE);
      setSettings({ hardcoreMode: false, soundEnabled: true, screenBrightness: 100 });
      setAlertModal({ title: 'Configurações Restauradas', message: 'Dados de fábrica restabelecidos com sucesso.' });
    }
  };

  // Active Subject helper
  const currentSelectedSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Calendar dates strip
  const calendarDates = [-2, -1, 0, 1, 2, 3, 4].map(offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
      dayNum: d.getDate()
    };
  });

  const dailyEvents = schedule.filter(e => e.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
  const dailyTotal = dailyEvents.length;
  const dailyDone = dailyEvents.filter(e => e.status === 'completed').length;
  const totalStudiedAll = subjects.reduce((acc, s) => acc + (s.studiedSeconds || 0), 0);

  // Copy code snippet helper
  const copyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    soundSystem.playTouch();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col justify-between selection:bg-sky-500 selection:text-white">

      {/* TOP BAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-xs text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            LS
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>LOCKSTUDY ONE™</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950 border border-sky-600/40 text-sky-400 font-semibold">v2.4</span>
            </h1>
            <p className="text-[10px] text-slate-400 hidden sm:block">Caixa Inteligente de Estudos &amp; Simulação de Hardware</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* GitHub Hosting Button */}
          <button
            type="button"
            onClick={() => { soundSystem.playTouch(); setShowGithubModal(true); }}
            className="touch-btn px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 hover:border-emerald-400 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hospedar no GitHub</span>
            <span className="sm:hidden">GitHub</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Auto</span>
          </button>

          {/* Hardware Drawer Toggle (Mobile) */}
          <button
            type="button"
            onClick={() => { soundSystem.playTouch(); setShowHardwareDrawer(!showHardwareDrawer); }}
            className="touch-btn lg:hidden px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-500 text-sky-400 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Hardware</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start justify-center">

          {/* ========================================================= */}
          {/* COLUNA 1: DISPLAY ACOPLADO NA CAIXA (OLED TOUCH EMBARCADO) */}
          {/* ========================================================= */}
          <section className="lg:col-span-7 flex flex-col items-center justify-center w-full">
            <div className="hardware-chassis w-full max-w-[430px] rounded-[32px] sm:rounded-[38px] p-2.5 sm:p-4 relative">
              
              {/* Torx Screws */}
              <div className="chassis-screw hidden sm:block absolute top-3.5 left-3.5" />
              <div className="chassis-screw hidden sm:block absolute top-3.5 right-3.5" />
              <div className="chassis-screw hidden sm:block absolute bottom-3.5 left-3.5" />
              <div className="chassis-screw hidden sm:block absolute bottom-3.5 right-3.5" />

              {/* Logo text */}
              <div className="text-center mb-1.5 sm:mb-2.5">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase select-none">
                  LOCKSTUDY • EMBEDDED TOUCH DISPLAY
                </span>
              </div>

              {/* OLED Glass Frame */}
              <div 
                style={{ filter: `brightness(${settings.screenBrightness}%)` }}
                className={`oled-screen-frame rounded-[22px] sm:rounded-[26px] h-[640px] sm:h-[690px] flex flex-col justify-between select-none ${shakeError ? 'shake-error' : ''}`}
              >
                {/* Scanline Overlay */}
                <div className="scanline-overlay absolute inset-0 pointer-events-none z-30 opacity-30" />

                {/* 1. EMBEDDED OS TOP BAR */}
                <header className="h-11 sm:h-12 border-b border-slate-800/80 bg-slate-950/90 px-3.5 flex items-center justify-between text-xs relative z-20">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code font-bold text-sky-400 text-xs tracking-wider">
                      {currentTimeStr || '10:45:00'}
                    </span>
                    {activeSession && (
                      <span 
                        style={{ color: activeSession.subjectColor }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 truncate max-w-[110px]"
                      >
                        ● {activeSession.subjectName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Qi Wireless Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${phoneInside ? 'bg-cyan-950/80 border border-cyan-700/50' : 'bg-rose-950/80 border border-rose-700/50'}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${phoneInside ? 'bg-cyan-400 animate-pulse' : 'bg-rose-500'}`} />
                      <span className={`text-[10px] font-semibold ${phoneInside ? 'text-cyan-300' : 'text-rose-300'}`}>
                        {phoneInside ? '15W Qi' : 'Sem Celular'}
                      </span>
                    </div>

                    {/* Solenoid Lock Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${solenoidLocked ? 'bg-amber-950/90 border border-amber-500/70 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-emerald-950/70 border border-emerald-600/40'}`}>
                      {solenoidLocked ? (
                        <>
                          <Lock className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-300 font-bold text-[10px] tracking-wider">TRANCADO</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold text-[10px] tracking-wider">ABERTA</span>
                        </>
                      )}
                    </div>
                  </div>
                </header>

                {/* 2. TAB VIEWPORTS */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative p-3 sm:p-3.5 space-y-3 z-10">

                  {/* ===================== TAB: FOCO ===================== */}
                  {currentTab === 'foco' && (
                    <div className="flex flex-col space-y-3">
                      {!activeSession ? (
                        /* IDLE VIEW (SETUP SESSION) */
                        <div className="space-y-3">
                          {/* Subject Selector */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                                1. Qual matéria você vai estudar?
                              </label>
                              <button 
                                type="button" 
                                onClick={() => { soundSystem.playTouch(); setCurrentTab('materias'); }}
                                className="text-[10px] text-sky-400 hover:underline"
                              >
                                Ver todas
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {subjects.map(s => {
                                const isSelected = s.id === selectedSubjectId;
                                return (
                                  <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => {
                                      soundSystem.playTouch();
                                      setSelectedSubjectId(s.id);
                                      setIsCustomTopic(false);
                                      const firstPending = s.topics.find(t => !t.completed);
                                      setSelectedTopicTitle(firstPending ? firstPending.title : (s.topics[0]?.title || 'Revisão'));
                                    }}
                                    style={{ borderColor: isSelected ? s.color : 'transparent' }}
                                    className={`touch-btn flex items-center gap-2 p-2 rounded-xl text-left transition-all ${isSelected ? 'bg-slate-800/90 border-2 shadow-sm' : 'bg-slate-900/60 border border-slate-800 opacity-70'}`}
                                  >
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                    <span className="text-xs font-semibold text-slate-200 truncate">{s.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Topic Selector */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                              2. Tópico ou tarefa do dia:
                            </label>
                            
                            <select 
                              value={isCustomTopic ? '__custom__' : selectedTopicTitle}
                              onChange={(e) => {
                                soundSystem.playTouch();
                                if (e.target.value === '__custom__') {
                                  setIsCustomTopic(true);
                                } else {
                                  setIsCustomTopic(false);
                                  setSelectedTopicTitle(e.target.value);
                                }
                              }}
                              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                            >
                              <option value="">-- Escolher Conteúdo --</option>
                              {currentSelectedSubject?.topics.map(t => (
                                <option key={t.id} value={t.title}>
                                  {t.completed ? '✓ ' : '○ '} {t.title}
                                </option>
                              ))}
                              <option value="__custom__">+ Digitar outro assunto...</option>
                            </select>

                            {isCustomTopic && (
                              <div className="mt-2">
                                <input
                                  type="text"
                                  value={customTopicInput}
                                  onChange={(e) => setCustomTopicInput(e.target.value)}
                                  placeholder="Ex: Exercícios pg 45 a 49"
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                                />
                              </div>
                            )}
                          </div>

                          {/* Study Duration */}
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <div className="flex items-center justify-between mb-1.5">
                              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-sky-400" />
                                3. Tempo com celular trancado:
                              </label>
                              <span className="text-[10px] text-slate-400 font-mono">minutos</span>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5 mb-2">
                              {[25, 45, 60, 120].map(min => (
                                <button
                                  key={min}
                                  type="button"
                                  onClick={() => { soundSystem.playTouch(); setDurationMinutes(min); }}
                                  className={`touch-btn py-2 rounded-xl text-xs font-semibold border transition-all ${durationMinutes === min ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-900 text-slate-300 border-slate-800'}`}
                                >
                                  {min === 60 ? '1h' : min === 120 ? '2h' : `${min}m`}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
                              <span>Outro tempo:</span>
                              <input
                                type="number"
                                min="1"
                                max="180"
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(Math.max(1, Math.min(180, Number(e.target.value) || 25)))}
                                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono font-bold text-sky-400 focus:outline-none focus:border-sky-500"
                              />
                              <span>minutos</span>
                            </div>
                          </div>

                          {/* Sensor Checks */}
                          <div className="p-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-around text-xs">
                            <div className="flex items-center gap-1.5">
                              {phoneInside ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span className="text-xs text-emerald-300">Celular detectado</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                                  <span className="text-xs text-rose-300 font-medium">Insira o celular</span>
                                </>
                              )}
                            </div>
                            <span className="text-slate-700">|</span>
                            <div className="flex items-center gap-1.5">
                              {lidClosed ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span className="text-xs text-emerald-300">Tampa fechada</span>
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                                  <span className="text-xs text-amber-300 font-medium">Feche a tampa</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Lock & Start Button */}
                          <button
                            type="button"
                            onClick={handleStartStudy}
                            className="touch-btn w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center justify-center gap-2 transition-all"
                          >
                            <Lock className="w-4 h-4 text-white" />
                            <span>TRANCAR CELULAR E INICIAR ESTUDO</span>
                          </button>
                        </div>
                      ) : (
                        /* ACTIVE STUDY VIEW (PHONE LOCKED) */
                        <div className="flex flex-col items-center space-y-3 pt-1">
                          <div className="text-center">
                            <span 
                              style={{ 
                                backgroundColor: `${activeSession.subjectColor}25`, 
                                color: activeSession.subjectColor, 
                                borderColor: `${activeSession.subjectColor}60` 
                              }}
                              className="px-3 py-1 rounded-full text-xs font-bold border inline-block mb-1"
                            >
                              {activeSession.subjectName}
                            </span>
                            <h3 className="text-sm font-extrabold text-white truncate max-w-[280px]">
                              {activeSession.topicTitle}
                            </h3>
                          </div>

                          {/* Circular Animated SVG Timer */}
                          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center my-1">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                              <circle cx="100" cy="100" r="90" className="text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" />
                              <circle
                                cx="100"
                                cy="100"
                                r="90"
                                strokeWidth="9"
                                strokeLinecap="round"
                                stroke={activeSession.subjectColor}
                                fill="transparent"
                                strokeDasharray={565.48}
                                strokeDashoffset={565.48 - ((activeSession.totalSeconds - activeSession.remainingSeconds) / activeSession.totalSeconds) * 565.48}
                                className="timer-ring-circle filter drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                              />
                            </svg>

                            <div className="absolute flex flex-col items-center">
                              <span className="font-mono-code font-black text-3xl sm:text-4xl text-white tracking-tight">
                                {`${String(Math.floor(activeSession.remainingSeconds / 60)).padStart(2, '0')}:${String(activeSession.remainingSeconds % 60).padStart(2, '0')}`}
                              </span>
                              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-1">
                                <Lock className="w-3 h-3 text-amber-400" />
                                Celular Trancado
                              </span>
                            </div>
                          </div>

                          {/* In-Session Topics Checklist */}
                          <div className="w-full p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-slate-300">Checklist durante o estudo:</span>
                              <span className="text-[10px] text-slate-500">marque na telinha</span>
                            </div>
                            <div className="space-y-1.5 max-h-24 sm:max-h-28 overflow-y-auto no-scrollbar">
                              {subjects.find(s => s.id === activeSession.subjectId)?.topics.map(top => (
                                <div key={top.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                                  <span className={`truncate pr-2 ${top.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{top.title}</span>
                                  <input
                                    type="checkbox"
                                    checked={top.completed}
                                    onChange={() => handleToggleTopic(activeSession.subjectId, top.id)}
                                    className="w-4 h-4 rounded accent-sky-500 cursor-pointer"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Emergency Unlock */}
                          <div className="w-full pt-1">
                            {!settings.hardcoreMode ? (
                              <div
                                onMouseDown={startEmergencyHold}
                                onMouseUp={cancelEmergencyHold}
                                onMouseLeave={cancelEmergencyHold}
                                onTouchStart={(e) => { e.preventDefault(); startEmergencyHold(); }}
                                onTouchEnd={cancelEmergencyHold}
                                onTouchCancel={cancelEmergencyHold}
                                className="touch-btn relative overflow-hidden w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-rose-900/60 text-rose-400 text-xs font-bold text-center cursor-pointer select-none"
                              >
                                <div 
                                  style={{ width: `${emergencyHoldProgress}%` }}
                                  className="absolute left-0 top-0 bottom-0 bg-rose-600/40 transition-all duration-300 pointer-events-none"
                                />
                                <span className="relative z-10 flex items-center justify-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                                  {isHoldingEmergency 
                                    ? `Segurando... ${Math.round((100 - emergencyHoldProgress) / 20)}s` 
                                    : 'Segure por 5s para Destravar'}
                                </span>
                              </div>
                            ) : (
                              <div className="p-2 rounded-xl bg-amber-950/50 border border-amber-700/60 text-center">
                                <span className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  MODO RIGOROSO ATIVO (Destravamento Bloqueado)
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ===================== TAB: MATÉRIAS ===================== */}
                  {currentTab === 'materias' && (
                    <div className="flex flex-col space-y-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Total Estudado na Caixa</h3>
                          <div className="text-lg font-extrabold text-white font-mono mt-0.5">{formatDuration(totalStudiedAll)}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => { soundSystem.playTouch(); setCurrentTab('config'); setConfigSubtab('subjects'); }}
                          className="touch-btn px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 text-xs font-semibold hover:bg-slate-750"
                        >
                          + Nova Matéria
                        </button>
                      </div>

                      <div className="space-y-2">
                        {subjects.map(s => {
                          const completedCount = s.topics.filter(t => t.completed).length;
                          const totalCount = s.topics.length;
                          const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                          return (
                            <div key={s.id} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                              <div className="flex items-start justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${s.color}25`, color: s.color }}>
                                    {s.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-white">{s.name}</h4>
                                    <p className="text-[10px] text-slate-400">Total: {formatDuration(s.studiedSeconds)}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    soundSystem.playTouch();
                                    setSelectedSubjectId(s.id);
                                    const firstPending = s.topics.find(t => !t.completed);
                                    setSelectedTopicTitle(firstPending ? firstPending.title : (s.topics[0]?.title || 'Revisão'));
                                    setCurrentTab('foco');
                                  }}
                                  className="touch-btn px-2 py-1 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-300 text-[10px] font-semibold flex items-center gap-1"
                                >
                                  <Play className="w-2.5 h-2.5" /> Estudar
                                </button>
                              </div>

                              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-1.5">
                                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                              </div>

                              <details className="text-xs">
                                <summary className="cursor-pointer text-[10px] text-slate-400 py-0.5 select-none">
                                  Ver {totalCount} tópicos ({pct}% feito)
                                </summary>
                                <div className="pt-1 space-y-1">
                                  {s.topics.map(t => (
                                    <div key={t.id} className="flex items-center justify-between py-0.5 px-1.5 rounded bg-slate-950/60 border border-slate-800/40 text-[11px]">
                                      <span className={t.completed ? 'line-through text-slate-500' : 'text-slate-200'}>{t.title}</span>
                                      <input
                                        type="checkbox"
                                        checked={t.completed}
                                        onChange={() => handleToggleTopic(s.id, t.id)}
                                        className="w-3.5 h-3.5 rounded accent-sky-500 cursor-pointer"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ===================== TAB: CALENDÁRIO ===================== */}
                  {currentTab === 'calendario' && (
                    <div className="flex flex-col space-y-3">
                      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800">
                        <div className="flex items-center justify-between text-xs">
                          <div>
                            <span className="text-slate-400 text-[10px]">Meta de hoje:</span>
                            <div className="font-bold text-white">{dailyDone} de {dailyTotal} concluídas</div>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 text-[10px]">Concluído:</span>
                            <div className="font-bold text-emerald-400">{dailyTotal > 0 ? Math.round((dailyDone / dailyTotal) * 100) : 0}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Day Strip */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                          <span>Dias da semana:</span>
                          <button type="button" onClick={() => setSelectedDate(getTodayString(0))} className="text-sky-400 hover:underline">Hoje</button>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                          {calendarDates.map(d => {
                            const isSel = d.dateStr === selectedDate;
                            return (
                              <button
                                key={d.dateStr}
                                type="button"
                                onClick={() => { soundSystem.playTouch(); setSelectedDate(d.dateStr); }}
                                className={`touch-btn flex-1 min-w-[42px] py-1.5 px-1 rounded-xl border flex flex-col items-center transition-all ${isSel ? 'bg-sky-500 text-slate-950 font-bold border-sky-400' : 'bg-slate-900/90 text-slate-300 border-slate-800'}`}
                              >
                                <span className="text-[9px]">{d.dayName}</span>
                                <span className="text-xs font-bold">{d.dayNum}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Schedule list */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-slate-200">Cronograma do dia</span>
                          <button
                            type="button"
                            onClick={() => { soundSystem.playTouch(); setCurrentTab('config'); setConfigSubtab('calendar'); }}
                            className="text-[11px] text-sky-400 font-semibold hover:underline"
                          >
                            + Agendar
                          </button>
                        </div>

                        {dailyEvents.length === 0 ? (
                          <p className="text-center py-6 text-xs text-slate-400">Nenhum estudo agendado para este dia.</p>
                        ) : (
                          <div className="space-y-2">
                            {dailyEvents.map(ev => {
                              const subj = subjects.find(s => s.id === ev.subjectId) || { name: 'Geral', color: '#64748b' };
                              const isDone = ev.status === 'completed';
                              return (
                                <div key={ev.id} className={`p-2.5 rounded-xl bg-slate-900/80 border ${isDone ? 'border-emerald-900/50 bg-emerald-950/10' : 'border-slate-800'} flex items-center justify-between gap-2`}>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleEventStatus(ev.id)}
                                      className={`w-5 h-5 rounded border flex items-center justify-center ${isDone ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 text-xs' : 'border-slate-700 text-transparent'}`}
                                    >
                                      ✓
                                    </button>
                                    <div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[11px] font-mono font-bold text-slate-300">{ev.time}</span>
                                        <span className="text-[9px] px-1 py-0.2 rounded font-semibold" style={{ backgroundColor: `${subj.color}25`, color: subj.color }}>{subj.name}</span>
                                      </div>
                                      <p className={`text-xs text-slate-200 truncate max-w-[170px] ${isDone ? 'line-through text-slate-500' : ''}`}>{ev.topic}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    {!isDone && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          soundSystem.playTouch();
                                          setSelectedSubjectId(ev.subjectId);
                                          setSelectedTopicTitle(ev.topic);
                                          setDurationMinutes(ev.durationMinutes);
                                          setCurrentTab('foco');
                                        }}
                                        className="touch-btn px-2 py-0.5 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 text-[10px] font-semibold"
                                      >
                                        Iniciar
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteEvent(ev.id)}
                                      className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ===================== TAB: CONFIGURAÇÕES ===================== */}
                  {currentTab === 'config' && (
                    <div className="flex flex-col space-y-3">
                      {/* Subtabs Header */}
                      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                        <button
                          type="button"
                          onClick={() => { soundSystem.playTouch(); setConfigSubtab('subjects'); }}
                          className={`touch-btn py-1.5 rounded-lg font-bold transition-all ${configSubtab === 'subjects' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'}`}
                        >
                          Matérias
                        </button>
                        <button
                          type="button"
                          onClick={() => { soundSystem.playTouch(); setConfigSubtab('calendar'); }}
                          className={`touch-btn py-1.5 rounded-lg font-bold transition-all ${configSubtab === 'calendar' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'}`}
                        >
                          Agenda
                        </button>
                        <button
                          type="button"
                          onClick={() => { soundSystem.playTouch(); setConfigSubtab('box'); }}
                          className={`touch-btn py-1.5 rounded-lg font-bold transition-all ${configSubtab === 'box' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'}`}
                        >
                          Caixa
                        </button>
                      </div>

                      {/* SUBPANE 1: GERENCIAR MATÉRIAS & TÓPICOS */}
                      {configSubtab === 'subjects' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Adicionar Nova Matéria
                            </h4>
                            <form onSubmit={handleAddSubject} className="space-y-2">
                              <input
                                name="subName"
                                type="text"
                                required
                                placeholder="Nome (ex: Biologia, Física, Filosofia)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Cor da etiqueta:</label>
                                  <input
                                    name="subColor"
                                    type="color"
                                    defaultValue="#10b981"
                                    className="w-full h-8 bg-slate-950 border border-slate-700 rounded-xl px-1 cursor-pointer"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Meta semanal:</label>
                                  <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-xl px-2 h-8">
                                    <input
                                      name="subGoal"
                                      type="number"
                                      min="1"
                                      max="40"
                                      defaultValue="6"
                                      className="w-10 bg-transparent text-xs text-white focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-500">horas</span>
                                  </div>
                                </div>
                              </div>
                              <button type="submit" className="touch-btn w-full py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs">
                                Salvar Matéria
                              </button>
                            </form>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-sky-400" /> Adicionar Conteúdo para Estudar
                            </h4>
                            <form onSubmit={handleAddTopic} className="space-y-2">
                              <select name="topicSubj" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500">
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                              </select>
                              <input
                                name="topicTitle"
                                type="text"
                                required
                                placeholder="Nome do Tópico (ex: Leitura Capítulo 4)"
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                              />
                              <button type="submit" className="touch-btn w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 font-bold text-xs">
                                + Inserir Conteúdo
                              </button>
                            </form>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <h4 className="text-xs font-bold text-white mb-2">Matérias Cadastradas</h4>
                            <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
                              {subjects.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="font-semibold text-slate-200">{s.name}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubject(s.id, s.name)}
                                    className="text-rose-400 hover:underline text-[10px]"
                                  >
                                    Excluir
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUBPANE 2: PLANEJAR CALENDÁRIO */}
                      {configSubtab === 'calendar' && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400" /> Agendar Estudo no Calendário
                            </h4>
                            <form onSubmit={handleAddSchedule} className="space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Data:</label>
                                  <input
                                    name="schDate"
                                    type="date"
                                    required
                                    defaultValue={selectedDate}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-slate-400 block mb-0.5">Horário:</label>
                                  <input
                                    name="schTime"
                                    type="time"
                                    defaultValue="14:00"
                                    required
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Matéria:</label>
                                <select name="schSubj" className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none">
                                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Assunto ou tarefa:</label>
                                <input
                                  name="schTopic"
                                  type="text"
                                  required
                                  placeholder="Ex: Simulado ENEM e Correção"
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] text-slate-400 block mb-0.5">Duração (minutos):</label>
                                <input
                                  name="schDur"
                                  type="number"
                                  defaultValue="45"
                                  min="10"
                                  max="240"
                                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                                />
                              </div>

                              <button type="submit" className="touch-btn w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-xs shadow-md">
                                Salvar no Calendário
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {/* SUBPANE 3: PREFERÊNCIAS DA CAIXA */}
                      {configSubtab === 'box' && (
                        <div className="space-y-2.5">
                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white">🛡️ Modo Rigoroso (Hardcore)</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Bloqueia o destravamento antecipado de emergência.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.hardcoreMode}
                                onChange={(e) => setSettings(prev => ({ ...prev, hardcoreMode: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                            </label>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white">🔊 Sons Acústicos da Caixa</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">Feedback nos toques da tela, trava e solenóide.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings.soundEnabled}
                                onChange={(e) => setSettings(prev => ({ ...prev, soundEnabled: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500" />
                            </label>
                          </div>

                          <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">Brilho do Visor OLED</span>
                              <span className="text-xs text-sky-400 font-mono">{settings.screenBrightness}%</span>
                            </div>
                            <input
                              type="range"
                              min="40"
                              max="115"
                              value={settings.screenBrightness}
                              onChange={(e) => setSettings(prev => ({ ...prev, screenBrightness: Number(e.target.value) }))}
                              className="w-full accent-sky-400 cursor-pointer"
                            />
                          </div>

                          <div className="p-2.5 rounded-2xl bg-rose-950/20 border border-rose-900/50">
                            <button
                              type="button"
                              onClick={handleFactoryReset}
                              className="touch-btn w-full py-2 rounded-xl bg-rose-900/40 hover:bg-rose-900/70 border border-rose-700/60 text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Redefinir Dados de Fábrica (Reset)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* 3. FIXED BOTTOM NAVIGATION BAR */}
                <nav className="h-14 sm:h-16 border-t border-slate-800/90 bg-slate-950/95 grid grid-cols-4 px-1.5 relative z-20">
                  <button
                    type="button"
                    onClick={() => { soundSystem.playTouch(); setCurrentTab('foco'); }}
                    className={`touch-btn flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${currentTab === 'foco' ? 'nav-tab-active text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Foco</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { soundSystem.playTouch(); setCurrentTab('materias'); }}
                    className={`touch-btn flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${currentTab === 'materias' ? 'nav-tab-active text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Matérias</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { soundSystem.playTouch(); setCurrentTab('calendario'); }}
                    className={`touch-btn flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${currentTab === 'calendario' ? 'nav-tab-active text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Agenda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { soundSystem.playTouch(); setCurrentTab('config'); }}
                    className={`touch-btn flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all ${currentTab === 'config' ? 'nav-tab-active text-sky-400' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Config</span>
                  </button>
                </nav>

              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* COLUNA 2: PAINEL DE SIMULAÇÃO FÍSICA (HARDWARE TWIN)       */}
          {/* ========================================================= */}
          <section className="hidden lg:flex lg:col-span-5 flex-col space-y-4">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                  <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-white font-mono">
                    SIMULADOR FÍSICO DA CAIXA
                  </h2>
                </div>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">HARDWARE TWIN</span>
              </div>

              {/* Physical Cutaway Schematic */}
              <div className="relative w-full h-52 rounded-2xl bg-gradient-to-b from-[#0a0d14] to-[#121622] border border-slate-800 p-3 flex flex-col justify-between overflow-hidden shadow-inner mb-3">
                <div className="flex items-center justify-between text-xs z-10">
                  <span className="text-[10px] text-slate-400 font-mono">TAMPA SUPERIOR</span>
                  <span className={`font-mono text-[10px] ${lidClosed ? (solenoidLocked ? 'text-amber-400 font-bold' : 'text-emerald-400 font-medium') : 'text-rose-400 font-bold'}`}>
                    {lidClosed ? (solenoidLocked ? 'LID: TRANCADA 🔒' : 'LID: FECHADA') : 'LID: ABERTA ⚠️'}
                  </span>
                </div>

                <div className="relative flex-1 flex items-center justify-center my-1">
                  {/* Qi Coil */}
                  <div className="relative w-32 h-24 rounded-2xl border border-cyan-800/40 bg-cyan-950/20 flex items-center justify-center">
                    {phoneInside && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full border border-cyan-400/50 qi-wave absolute" />
                        <div className="w-20 h-20 rounded-full border border-cyan-400/30 qi-wave absolute" />
                      </div>
                    )}
                    <div className="text-[8px] font-mono font-bold text-cyan-600 uppercase tracking-widest select-none">
                      QI INDUCTION 15W
                    </div>

                    {/* Smartphone Graphic */}
                    <div 
                      style={{ opacity: phoneInside ? 1 : 0 }}
                      className="absolute w-24 h-16 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 border-2 border-slate-600 shadow-2xl flex flex-col items-center justify-between p-1 transition-all duration-300"
                    >
                      <div className="w-5 h-0.5 rounded-full bg-slate-700" />
                      <span className="text-[7px] font-mono text-cyan-400 font-bold">SMARTPHONE</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    </div>
                  </div>

                  {/* Solenoid Pin Graphic */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <div className="text-[7px] font-mono text-slate-500 -rotate-90 select-none">SOLENOIDE</div>
                    <div className="w-4 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-start p-0.5">
                      <div className={`w-3 h-5 rounded-sm solenoid-bolt ${solenoidLocked ? 'solenoid-locked' : 'solenoid-unlocked'}`} />
                    </div>
                  </div>
                </div>

                {/* Microcontroller LED status */}
                <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-slate-800/80 text-[9px] font-mono text-slate-400 z-10">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${phoneInside ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-600'}`} />
                    <span className="truncate">Óptico</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${lidClosed ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'}`} />
                    <span className="truncate">Tampa</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${phoneInside ? 'bg-cyan-400 shadow-[0_0_6px_#06b6d4]' : 'bg-slate-600'}`} />
                    <span className="truncate">Qi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${solenoidLocked ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b]' : 'bg-slate-600'}`} />
                    <span className="truncate">Trava</span>
                  </div>
                </div>
              </div>

              {/* Physical Switches */}
              <div className="space-y-2 mb-3">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">📱 Celular na Caixa</span>
                    <p className="text-[10px] text-slate-400">Simula colocar ou retirar do compartimento.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={phoneInside}
                      onChange={(e) => handleTogglePhone(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
                  </label>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white">📦 Tampa da Caixa</span>
                    <p className="text-[10px] text-slate-400">Abrir/fechar (bloqueia quando trancada).</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lidClosed}
                      disabled={solenoidLocked}
                      onChange={(e) => handleToggleLid(e.target.checked)}
                      className="sr-only peer disabled:opacity-50"
                    />
                    <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={toggleSpeedAcceleration}
                    className={`touch-btn py-2 px-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1 border transition-all ${timeMultiplier === 60 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/40'}`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{timeMultiplier === 60 ? '⚡ Acelerado (60x)' : '⚡ Acelerar (60x)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleForceMasterUnlock}
                    className="touch-btn py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/40 text-[11px] font-semibold flex items-center justify-center gap-1"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>🚨 Destravar Forçado</span>
                  </button>
                </div>
              </div>

              {/* UART Console Logs */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-emerald-400" /> CONSOLE UART:</span>
                  <span className="text-emerald-400 font-bold">ONLINE</span>
                </div>
                <div className="h-28 overflow-y-auto rounded-xl bg-black/90 border border-slate-800 p-2 space-y-1 font-mono-code text-[10px]">
                  {terminalLogs.map((log, idx) => {
                    const color = log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-amber-400' : log.type === 'error' ? 'text-rose-400 font-bold' : 'text-slate-400';
                    return (
                      <div key={idx} className={color}>
                        <span className="text-slate-500">[{log.time}]</span> {log.message}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* MOBILE HARDWARE DRAWER */}
      {showHardwareDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 embedded-modal-backdrop bg-black/80 flex flex-col justify-end p-2 sm:p-4">
          <div className="w-full max-w-lg mx-auto rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Painel Físico do Hardware (Simulador)
              </h3>
              <button
                type="button"
                onClick={() => setShowHardwareDrawer(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">📱 Celular no Compartimento</span>
                <input
                  type="checkbox"
                  checked={phoneInside}
                  onChange={(e) => handleTogglePhone(e.target.checked)}
                  className="w-5 h-5 rounded accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white">📦 Tampa da Caixa (Fechada)</span>
                <input
                  type="checkbox"
                  checked={lidClosed}
                  disabled={solenoidLocked}
                  onChange={(e) => handleToggleLid(e.target.checked)}
                  className="w-5 h-5 rounded accent-emerald-500 cursor-pointer disabled:opacity-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={toggleSpeedAcceleration}
                  className={`touch-btn py-2 rounded-xl text-xs font-bold border ${timeMultiplier === 60 ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-amber-500/20 border-amber-500 text-amber-300'}`}
                >
                  ⚡ Acelerar (60x)
                </button>
                <button
                  type="button"
                  onClick={() => { handleForceMasterUnlock(); setShowHardwareDrawer(false); }}
                  className="touch-btn py-2 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 font-bold text-xs"
                >
                  🚨 Destravar Forçado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EMERGENCY PIN CHALLENGE */}
      {showEmergencyPinModal && (
        <div className="fixed inset-0 z-50 embedded-modal-backdrop bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-500/50 p-5 shadow-2xl space-y-3.5">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-rose-950 border border-rose-600 text-rose-400 flex items-center justify-center mx-auto mb-1.5 text-lg">
                ⚠️
              </div>
              <h3 className="text-sm font-bold text-white">Destravamento de Emergência</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Para evitar quebras de foco por impulso, digite o código de 4 dígitos:
              </p>
            </div>

            <div className="text-center py-2 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">CÓDIGO DE FRICÇÃO:</span>
              <span className="text-2xl font-black font-mono tracking-widest text-rose-400">{emergencyExpectedPin}</span>
            </div>

            <div>
              <input
                type="text"
                maxLength={4}
                value={emergencyPinInput}
                onChange={(e) => setEmergencyPinInput(e.target.value)}
                placeholder="0000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-rose-500"
              />
              {emergencyPinError && (
                <p className="text-xs text-rose-400 text-center mt-1">{emergencyPinError}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowEmergencyPinModal(false)}
                className="touch-btn py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleVerifyEmergencyPin}
                className="touch-btn py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
              >
                Destravar Caixa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SESSION COMPLETED CELEBRATION */}
      {showCompletionModal && completionData && (
        <div className="fixed inset-0 z-50 embedded-modal-backdrop bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-emerald-500/50 p-5 shadow-2xl text-center space-y-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl animate-bounce">
              🏆
            </div>
            <div>
              <h3 className="text-base font-black text-white">Sessão Concluída com Sucesso!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Você manteve o foco por <strong>{completionData.durationMinutes} minutos</strong> em <strong>{completionData.subjectName}</strong>!
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Celular liberado para uso!</span>
              </div>
              <p className="text-[10px] text-slate-400">Tempo de foco acumulado automaticamente no histórico da matéria.</p>
            </div>

            <div className="space-y-1.5 pt-1">
              {completionData.topicId && completionData.subjectId && (
                <button
                  type="button"
                  onClick={() => {
                    handleToggleTopic(completionData.subjectId!, completionData.topicId!);
                    setShowCompletionModal(false);
                  }}
                  className="touch-btn w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Marcar Tópico como Concluído
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowCompletionModal(false)}
                className="touch-btn w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GENERIC SENSOR WARNING */}
      {alertModal && (
        <div className="fixed inset-0 z-50 embedded-modal-backdrop bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/60 p-4 shadow-2xl space-y-2.5 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-950 border border-amber-500 text-amber-400 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h3 className="text-sm font-bold text-white">{alertModal.title}</h3>
            <p className="text-xs text-slate-300">{alertModal.message}</p>
            <button
              type="button"
              onClick={() => setAlertModal(null)}
              className="touch-btn w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs mt-1"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL: HOSPEDAGEM NO GITHUB (TUDO AUTOMÁTICO) */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 embedded-modal-backdrop bg-black/80 flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Hospedar no GitHub Pages</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold">Configuração 100% Automática Concluída!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status card */}
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>O que já está configurado para você:</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                <li><code className="text-emerald-300 font-mono">.github/workflows/deploy.yml</code>: Deploy automático via GitHub Actions</li>
                <li><code className="text-emerald-300 font-mono">vite.config.ts</code>: <code className="text-sky-300 font-mono">base: './'</code> para funcionar em qualquer repositório</li>
                <li><code className="text-emerald-300 font-mono">README.md</code>: Instruções completas em português</li>
              </ul>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono">1</span>
                  Envie o código para o seu repositório no GitHub
                </h4>
                <div className="relative group">
                  <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-[11px] text-slate-200 overflow-x-auto">
{`git init
git add .
git commit -m "feat: LockStudy One app"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copyCommand(`git init\ngit add .\ngit commit -m "feat: LockStudy One app"\ngit branch -M main\ngit remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git\ngit push -u origin main`, 1)}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 border border-slate-700"
                  >
                    {copiedIndex === 1 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedIndex === 1 ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-xs font-mono">2</span>
                  Ative o GitHub Pages no repositório (com 1 clique)
                </h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <p>1. No seu repositório GitHub, vá em <strong>Settings</strong> &gt; <strong>Pages</strong>.</p>
                  <p>2. Na seção <strong>Build and deployment &gt; Source</strong>, selecione:</p>
                  <div className="p-2 rounded-lg bg-slate-900 border border-sky-500/40 text-sky-300 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span>Selecione: <strong>"GitHub Actions"</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Assim que você der o <code className="text-white font-mono">git push</code>, o GitHub Actions construirá o app automaticamente e colocará seu site no ar no endereço <code className="text-emerald-400 font-mono">https://seu-usuario.github.io/seu-repo/</code> em ~1 minuto.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowGithubModal(false)}
                className="touch-btn w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
              >
                Perfeito, Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-2.5 text-center text-[11px] text-slate-500 font-mono flex items-center justify-center gap-2">
        <span>LockStudy One™ • 100% Pronto para GitHub Pages</span>
      </footer>

    </div>
  );
}
