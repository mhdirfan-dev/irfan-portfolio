/**
 * ================================================================
 *  Mohammed Irfan A — Portfolio (Single File App.jsx)
 *  Faithful rebuild of github.com/RifqiMuhammadAliya12/portofoliov1
 *  with the real Three.js / Rapier physics lanyard card animation.
 *
 *  SETUP GUIDE (read bottom of this file too):
 *  1.  npx create-react-app my-portfolio
 *  2.  cd my-portfolio
 *  3.  npm install three @react-three/fiber @react-three/drei
 *                  @react-three/rapier meshline framer-motion
 *                  lucide-react gsap
 *  4.  Replace src/App.jsx with this file.
 *  5.  npm start
 *
 *  The kartu.glb and bandd.png assets from the original repo are
 *  embedded / replaced with programmatic equivalents so you need
 *  NO external files.  Just npm install + copy-paste.
 * ================================================================
 */

import React, {
  useState, useEffect, useRef, useCallback,
  useMemo, createElement,
} from 'react';
import * as THREE from 'three';
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider, CuboidCollider, Physics,
  RigidBody, useRopeJoint, useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { motion, AnimatePresence } from 'framer-motion';
// SVG replacements for Github & Linkedin (removed in newer lucide-react)
import {
  Mail, ExternalLink, Code, Award, Globe, FileText,
  ArrowUpRight, ArrowRight, ChevronRight,
  Code2, User, X, Menu,
  Cpu, MonitorPlay, Zap,
} from 'lucide-react';
const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    width={props.size||24} height={props.size||24}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/>
    <path d="M9 18c-4.51 2-5-2-7-2"/>
  </svg>
);
const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    width={props.size||24} height={props.size||24}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);



extend({ MeshLineGeometry, MeshLineMaterial });

/* ================================================================
   GLOBAL STYLES  (injected into <head> at runtime)
================================================================ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  :root {
    --bg-primary:   #0d0d0d;
    --bg-secondary: #141414;
    --bg-card:      #1a1a1a;
    --border:       #2a2a2a;
    --text-primary: #f0f0f0;
    --text-secondary:#888888;
    --text-muted:   #555555;
    --accent:       #d4d4d4;
  }
  html { scroll-behavior: smooth; scrollbar-width: none; }
  html::-webkit-scrollbar { display:none; }
  body {
    background: var(--bg-primary);
    color: var(--text-primary);
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    -ms-overflow-style: none;
  }
  * { caret-color: transparent; user-select: none; }
  input, textarea { caret-color: white; user-select: text; }
  .dm-mono { font-family: 'DM Mono', monospace; }
`;

function injectStyles() {
  if (document.getElementById('irfan-global')) return;
  const s = document.createElement('style');
  s.id = 'irfan-global';
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

/* ================================================================
   PERSONAL DATA
================================================================ */
const DATA = {
  name:     'Mohammed Irfan A',
  role:     'AI & Full-Stack',
  title:    'Engineer',
  subtitle: 'AI & Full-Stack Engineer',
  domain:   'irfan.dev',
  email:    'mohammedirfan.a02@gmail.com',
  linkedin: 'https://www.linkedin.com/in/mohammed-irfan-a-7ba342368/',
  github:   'https://github.com',
  location: 'Palakkad, Kerala',
  bio: `Bridging the gap between artificial intelligence and full-stack architecture.
Focused on building hands-on, employment-ready automated systems. Currently pursuing
B.Tech in Computer Science (AI & ML), transitioning from theoretical learning to
deploying real-time monitoring solutions.`,
  stats: { projects: 3, certificates: 4, stack: 12 },
  heroSkills: ['Python', 'React.js', 'YOLOv12'],
 projects: [
    {
      title: 'Kerala Career Compass',
      role:  'AI-Powered Career Guidance Platform for Kerala Students',
      desc:  'A free, intelligent career guidance platform built for Kerala students from SSLC to M.Tech. Students select their education level and interest field to get visual career roadmaps, compare colleges with full fee transparency, and chat with a bilingual AI counselor that answers in English or Malayalam.\n\nThe AI counselor works by fetching real college data from MongoDB and injecting it as context into Llama 3.1 — making every answer grounded in actual Kerala college information, not generic responses. This is a RAG (Retrieval-Augmented Generation) architecture built on a fully free stack.',
      tech:  ['React 18', 'Node.js', 'Express', 'MongoDB Atlas', 'Groq API (Llama 3.1)', 'Tailwind CSS', 'Vercel', 'Render'],
      icon:  Globe,
      color: '#22d3ee',
      demo:  'https://kerala-compass-frontend.vercel.app/',
      features: [
        'Bilingual AI counselor (English + Malayalam) powered by Llama 3.1',
        'RAG architecture — real college data injected as AI context for accurate answers',
        'Career roadmap generator for SSLC, Plus Two, Diploma, and Degree students',
        'College comparison with fee transparency, NAAC grade, district filter',
        'Fully free deployment — ₹0/month running cost',
      ],
    },
    {
      title: 'NCERC Campus Fleet Management System',
      role:  'Real-Time AI Bus Detection & Automated Campus Monitoring',
      desc:  'An AI-powered gate monitoring system built for Nehru College of Engineering, Thrissur. Live camera footage from the campus gate is processed in real time — YOLOv12 detects college buses, a custom YOLO model isolates the number plate region, and EasyOCR reads the Kerala plate text. Every entry and exit is automatically logged to MongoDB with timestamp and direction.\n\nThe system monitors 29 registered college buses. If any bus misses its morning arrival (7–9 AM) or evening departure (4–6 PM) window, an automated Telegram alert is sent to the Transport Officer. A live web dashboard shows real-time movement logs with search, filter, and export.',
      tech:  ['Python 3.10', 'YOLOv12', 'EasyOCR', 'OpenCV', 'MongoDB', 'Flask', 'Socket.IO', 'Telegram Bot API'],
      icon:  MonitorPlay,
      color: '#6366f1',
      demo:  'https://ncerc-fleet-management.vercel.app/',
      features: [
        'Dual AI model pipeline — YOLOv12 for bus detection + custom YOLO for number plate detection',
        'EasyOCR with Kerala number plate format validation and OCR error auto-correction',
        'Real-time web dashboard with live Socket.IO updates — no page refresh needed',
        'Automated Telegram alerts for missing buses during morning and evening windows',
        'Offline backup system — detections saved locally if MongoDB is unavailable, synced on reconnect',
      ],
    },
    {
      title: 'Picto Pro',
      role:  'Generative AI Tool for Text-to-Video and Image-to-Video Creation',
      desc:  'A Generative AI application built for educators that converts text prompts and images into videos. Designed to simplify multimedia content creation for teachers who want to produce quality educational videos without technical expertise. The entire media generation pipeline is automated using Python.',
      tech:  ['Python', 'Generative AI', 'Text-to-Video', 'Image-to-Video', 'Multimedia Automation'],
      icon:  Cpu,
      color: '#a855f7',
      demo:  'https://picto-pro.vercel.app/',
      features: [
        'Text-to-Video generation — type a description, get a video',
        'Image-to-Video conversion for educational content',
        'Built for educators — no technical knowledge required to operate',
        'Fully automated Python pipeline for multimedia production',
      ],
    },
  ],
  experience: [
    {
      title:   'Android Application Development Intern',
      company: 'GRAPESGENIX Technical Solutions Pvt. Ltd',
      date:    'May 2023',
      desc:    [
        'Developed and tested Android applications using Java and XML-based UI design',
        'Debugged application logic and improved feature reliability through structured unit testing',
        'Used Git for version control and task tracking in a team environment',
        'Gained full SDLC exposure — from development through deployment and documentation',
      ],
    },
  ],
  education: [
    {
      degree:      'B.Tech in Computer Science Engineering (AI & ML)',
      institution: 'Nehru College of Engineering and Research Centre, Thrissur',
      board:       'APJ Abdul Kalam Technological University',
      period:      '2024 – Present',
      score:       'CGPA: 8.37 / 10.0  ·  7th Semester',
    },
    {
      degree:      'Diploma in Computer Engineering',
      institution: "St. Mary's Polytechnic College, Valliyode",
      board:       'State Board of Technical Education, Kerala',
      period:      '2022 – 2024',
      score:       'CGPA: 9.32 / 10.0',
    },
    {
      degree:      'Higher Secondary (Plus Two)',
      institution: 'S M High School, Ayalur',
      board:       'Directorate of Higher Secondary Education, Kerala',
      period:       '2021 – 2022',
      score:       'Grade: 85%',
    },
  ],
  skills: [
    { category: 'AI & Machine Learning', items: ['YOLOv12', 'EasyOCR', 'Computer Vision', 'Generative AI', 'LLM Integration', 'RAG', 'Prompt Engineering'] },
    { category: 'Full Stack Development', items: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Flask', 'REST APIs'] },
    { category: 'Programming',           items: ['Python', 'JavaScript', 'Java', 'SQL'] },
    { category: 'Tools',                 items: ['Git', 'Figma', 'MongoDB Atlas', 'Vercel', 'Render', 'n8n'] },
  ],
  certifications: [
  { name: 'Prompt Engineering & Applied AI', org: 'Dubai Future Foundation', year: '2025' },
  { name: 'Artificial Intelligence', org: 'Infosys Springboard', year: '2025' },
  { name: 'Generative AI for All', org: 'Infosys Springboard', year: '2025' },
  { name: 'Career Edge: Young Professional', org: 'TCS iON', year: '2024' },
],
};

/* ================================================================
   TYPING EFFECT (self-contained, no gsap needed here)
================================================================ */
function TypingText({ texts, speed = 75, pause = 1500, deleteSpeed = 50 }) {
  const [idx, setIdx]           = useState(0);
  const [shown, setShown]       = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = texts[idx];
    let t;
    if (!deleting && shown.length < full.length) {
      t = setTimeout(() => setShown(full.slice(0, shown.length + 1)), speed);
    } else if (!deleting && shown.length === full.length) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && shown.length > 0) {
      t = setTimeout(() => setShown(shown.slice(0, -1)), deleteSpeed);
    } else {
      setDeleting(false);
      setIdx((idx + 1) % texts.length);
    }
    return () => clearTimeout(t);
  }, [shown, deleting, idx, texts, speed, pause, deleteSpeed]);

  return (
    <span style={{ color: 'var(--text-secondary)', fontFamily: "'DM Mono', monospace", fontSize: 15, letterSpacing: '0.1em' }}>
      {shown}
      <span style={{ opacity: 1, animation: 'blink 1s step-end infinite' }}>_</span>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </span>
  );
}

/* ================================================================
   SCROLL-REVEAL
================================================================ */
function Reveal({ children, delay = 0, className = '', style = {} }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 1s ease ${delay}ms, transform 1s ease ${delay}ms`,
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(48px)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ================================================================
   ANIMATED BACKGROUND BLOBS + GRID
================================================================ */
function AnimatedBackground() {
  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const handler = () => {
      const s = window.pageYOffset;
      refs.forEach((r, i) => {
        if (!r.current) return;
        const x = Math.sin(s / 120 + i * 0.6) * 100;
        const y = Math.cos(s / 120 + i * 0.6) * 35;
        r.current.style.transform  = `translate(${x}px,${y}px)`;
        r.current.style.transition = 'transform 1.2s ease-out';
      });
    };
    window.addEventListener('scroll', handler);
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const blobs = [
    { top: '10px',  left:  '10px',  size: 224 },
    { top: '10px',  right: '10px',  size: 224 },
    { bottom:'10px',left:  '10px',  size: 240 },
    { bottom:'10px',right: '10px',  size: 224 },
  ];

  return (
    <div style={{ position:'fixed', inset:0, zIndex:-10, overflow:'hidden', pointerEvents:'none' }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={refs[i]}
          style={{
            position:'absolute', borderRadius:'50%',
            width: b.size, height: b.size,
            background: '#ffffff',
            filter: 'blur(90px)',
            opacity: 0.08,
            ...b,
          }}
        />
      ))}
      {/* grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: 'linear-gradient(to right,#ffffff10 1px,transparent 1px),linear-gradient(to bottom,#ffffff10 1px,transparent 1px)',
        backgroundSize: '26px 26px',
      }} />
    </div>
  );
}

/* ================================================================
   PHYSICS LANYARD CARD  (exact replica of original band/App.js)
   Uses a programmatic card mesh instead of the .glb file.
================================================================ */

function PhysicsCard({ isMobile, maxSpeed = 50, minSpeed = 10 }) {
  const band   = useRef();
  const fixed  = useRef();
  const j1     = useRef(), j2 = useRef(), j3 = useRef();
  const card   = useRef();

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segProps = {
    type: 'dynamic', canSleep: true, colliders: false,
    angularDamping: 4, linearDamping: 4,
  };

  const { width, height } = useThree(s => s.size);

  const [curve] = useState(() =>
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(),
      new THREE.Vector3(), new THREE.Vector3(),
      new THREE.Vector3() // <-- Added a 5th anchor point
    ])
  );

  const [dragged, drag]   = useState(false);
  const [hovered, hover]  = useState(false);
  const canDrag = !isMobile;

  // ── band texture (striped lanyard) ────────────────────────────
  const lanyardTex = useMemo(() => {
    const size   = 256;
    const canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    // deep background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, size, size);
    // coloured stripes
    const stripes = [
      { x: 0,   w: 60,  c: '#7c3aed' },
      { x: 60,  w: 16,  c: '#ffffff' },
      { x: 76,  w: 60,  c: '#7c3aed' },
      { x: 136, w: 16,  c: '#ffffff' },
      { x: 152, w: 60,  c: '#3b82f6' },
      { x: 212, w: 16,  c: '#ffffff' },
      { x: 228, w: 28,  c: '#3b82f6' },
    ];
    stripes.forEach(s => {
      ctx.fillStyle = s.c;
      ctx.fillRect(s.x, 0, s.w, size);
    });
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  
 // ── ID card texture ────────────────────────────────────────────
  const cardTex = useMemo(() => {
    const W = 512, H = 720;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');

    // 1. Create texture early so the async image loader can update it
    const tex = new THREE.CanvasTexture(canvas);

    // card body gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0,   '#111827');
    grad.addColorStop(0.5, '#1e1b4b');
    grad.addColorStop(1,   '#111827');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // top accent bar
    const bar = ctx.createLinearGradient(0, 0, W, 0);
    bar.addColorStop(0, '#5337a7');
    bar.addColorStop(1, '#3b82f6');
    ctx.fillStyle = bar;
    ctx.fillRect(0, 0, W, 14);

    // --- AVATAR PLACEHOLDER (Shows immediately while loading) ---
    ctx.save();
    ctx.beginPath();
    ctx.arc(W/2, 220, 90, 0, Math.PI*2);
    ctx.clip();
    const avatarGrad = ctx.createRadialGradient(W/2,220,20,W/2,220,90);
    avatarGrad.addColorStop(0, '#754db6');
    avatarGrad.addColorStop(1, '#3b82f6');
    ctx.fillStyle = avatarGrad;
    ctx.fillRect(0,0,W,H);
    ctx.restore();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Syne, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MI', W/2, 220);

    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(W/2, 220, 90, 0, Math.PI*2);
    ctx.stroke();

    // --- ACTUAL PROFILE PHOTO ---
    const img = new Image();
    img.src = '/profile1.jpg';
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(W/2, 220, 90, 0, Math.PI*2);
      ctx.clip();
      
      // Apply the same grayscale/brightness filter you used in the HTML img!
      ctx.filter = 'grayscale(10%) brightness(65%)';
      
      // Draw image centered and scaled to fit the 176x176 circle
      ctx.drawImage(img, W/2 - 88, 220 - 88, 176, 176);
      ctx.restore();

      // Redraw the white ring border on top of the image
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(W/2, 220, 90, 0, Math.PI*2);
      ctx.stroke();

      // Crucial: Tell Three.js the canvas has new pixels and needs to be re-rendered
      tex.needsUpdate = true;
    };

    // name
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 36px Syne, sans-serif';
    ctx.fillText('Mohammed Irfan A', W/2, 360);

    // role
    ctx.fillStyle = '#a78bfa';
    ctx.font = '500 22px DM Mono, monospace';
    ctx.fillText('AI & Full-Stack Engineer', W/2, 405);

    // divider
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 440); ctx.lineTo(W-60, 440);
    ctx.stroke();

    // tags
    const tags = ['Python', 'React', 'YOLOv12', 'Node.js'];
    const tagW = 100, tagH = 30, gap = 14;
    const totalW = tags.length * tagW + (tags.length-1) * gap;
    let tx = (W - totalW) / 2;
    tags.forEach(t => {
      ctx.fillStyle = 'rgba(124,58,237,0.25)';
      roundRect(ctx, tx, 462, tagW, tagH, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(124,58,237,0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#c4b5fd';
      ctx.font = '500 13px DM Mono, monospace';
      ctx.fillText(t, tx + tagW/2, 477);
      tx += tagW + gap;
    });

    // barcode decoration
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    let bx = 80;
    for (let i=0; i<28; i++) {
      const bw = i%3===0 ? 4 : 2;
      ctx.fillRect(bx, 520, bw, 40);
      bx += bw + (i%5===0 ? 4 : 2);
    }

    // ID text
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '400 14px DM Mono, monospace';
    ctx.fillText('ID-2025-AI-MERN-0042', W/2, 590);

    // location
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.font = '400 14px DM Mono, monospace';
    ctx.fillText('📍 Palakkad, Kerala', W/2, 625);

    // bottom accent
    const bot = ctx.createLinearGradient(0, 0, W, 0);
    bot.addColorStop(0, '#3b82f6');
    bot.addColorStop(1, '#7c3aed');
    ctx.fillStyle = bot;
    ctx.fillRect(0, H-14, W, 14);

    return tex;
  }, []);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y); ctx.arcTo(x+w, y, x+w, y+r, r);
    ctx.lineTo(x+w, y+h-r); ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
    ctx.lineTo(x+r, y+h); ctx.arcTo(x, y+h, x, y+h-r, r);
    ctx.lineTo(x, y+r); ctx.arcTo(x, y, x+r, y, r);
    ctx.closePath();
  }

  useRopeJoint(fixed, j1, [[0,0,0],[0,0,0],1]);
  useRopeJoint(j1,   j2, [[0,0,0],[0,0,0],1.8]);
  useRopeJoint(j2,   j3, [[0,0,0],[0,0,0],1]);
  useSphericalJoint(j3, card, [[0,0,0],[0,0.28,0]]);

  useEffect(() => {
    if (hovered && canDrag) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered, dragged, canDrag]);

  useFrame((state, delta) => {
    if (dragged && card.current && canDrag) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card,j1,j2,j3,fixed].forEach(r => r.current?.wakeUp());
      const nx = vec.x - dragged.x;
      let   ny = vec.y - dragged.y;
      const nz = vec.z - dragged.z;
      if (state.pointer.y < -0.2) ny = card.current.translation().y;
      card.current.setNextKinematicTranslation({x:nx,y:ny,z:nz});
    }

    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1,j2].forEach(r => {
        if (!r.current.lerped)
          r.current.lerped = new THREE.Vector3().copy(r.current.translation());
        const d = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
        r.current.lerped.lerp(r.current.translation(), delta*(minSpeed+d*(maxSpeed-minSpeed)));
      });

      // Get the card's real 3D rotation to find "straight down"
      const quat = card.current.rotation();
      const cardRot = new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);
      const cardDown = new THREE.Vector3(0, -0.2, 0).applyQuaternion(cardRot);

      // Anchor point 0 hidden securely inside the clip
      curve.points[0].copy(j3.current.translation()).add(cardDown); 
      curve.points[1].copy(j3.current.translation());               
      curve.points[2].copy(j2.current.lerped);
      curve.points[3].copy(j1.current.lerped);
      curve.points[4].copy(fixed.current.translation());

      if (band.current?.geometry)
        band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({x:ang.x, y:ang.y - rot.y*0.25, z:ang.z});
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      {/* Moves the anchor higher and further right on mobile */}
      <group position={isMobile ? [1.5, 3.5, 0] : [3, 4, 0]}>
        <RigidBody ref={fixed} {...segProps} type="fixed" />
        <RigidBody position={[0.5,0,0]} ref={j1} {...segProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.0,0,0]} ref={j2} {...segProps}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5,0,0]} ref={j3} {...segProps}><BallCollider args={[0.1]} /></RigidBody>

        <RigidBody
          position={[2,0,0]}
          ref={card}
          {...segProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          {/* Shrinks the invisible physics boundary on mobile */}
          <CuboidCollider args={isMobile ? [0.6, 0.85, 0.01] : [0.88, 1.25, 0.01]} />
          {/* Shrinks the visual card size on mobile */}
          <group
            
            scale={isMobile ? 1.6 : 2.50}
            position={isMobile ? [0,-0.9,-0.05] : [0,-1.35,-0.05]}
            onPointerOver={() => canDrag && hover(true)}
            onPointerOut={()  => canDrag && hover(false)}
            onPointerUp={e => {
              if (!canDrag) return;
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={e => {
              if (!canDrag) return;
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {/* Card body */}
            <mesh>
              <boxGeometry args={[0.71, 1.0, 0.01]} />
              <meshPhysicalMaterial map={cardTex} roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Metal clip */}
            <mesh position={[0, 0.58, 0.02]}>
              <boxGeometry args={[0.06, 0.12, 0.02]} />
              <meshStandardMaterial color="#aaaaaa" metalness={0.95} roughness={0.05} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* Lanyard rope */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          transparent={true}
          opacity={1}           // Changed to 1 to stop overlapping shadow glitches
          depthTest={true}      // Keeps it behind the card
          depthWrite={false}    // THIS IS THE MAGIC FIX for the self-overlapping glitch
          resolution={[width, height]}
          useMap map={lanyardTex}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

function LanyardScene({ isMobile }) {
  return (
    <Physics interpolate gravity={[0,-40,0]} timeStep={1/60}>
      {/* Removed the !isMobile check so the card renders on all devices */}
      <PhysicsCard isMobile={isMobile} />
    </Physics>
  );
}

function LanyardCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div style={{ position:'absolute', inset:0, zIndex:40, pointerEvents: isMobile ? 'none' : 'auto' }}>
      <Canvas
        gl={{ alpha: true }}
        camera={{ position:[0,0,13], fov:25 }}
        style={{ background:'transparent', width:'100%', height:'100%' }}
      >
        <ambientLight intensity={Math.PI} />
        <LanyardScene isMobile={isMobile} />
        <Environment blur={0.75}>
          <Lightformer intensity={2}  color="white" position={[0,-1,5]}    rotation={[0,0,Math.PI/3]} scale={[100,0.1,1]} />
          <Lightformer intensity={3}  color="white" position={[-1,-1,1]}   rotation={[0,0,Math.PI/3]} scale={[100,0.1,1]} />
          <Lightformer intensity={3}  color="white" position={[1,1,1]}     rotation={[0,0,Math.PI/3]} scale={[100,0.1,1]} />
          <Lightformer intensity={10} color="white" position={[-10,0,14]}  rotation={[0,Math.PI/2,Math.PI/3]} scale={[100,10,1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

/* ================================================================
   WELCOME SCREEN (loading intro — exact replica)
================================================================ */
function WelcomeScreen() {
  const icons = [Code2, User, Globe];
  return (
    <div style={{
      width:'100%', height:'100vh', background:'#000',
      display:'flex', alignItems:'center', justifyContent:'center',
      position:'fixed', inset:0, zIndex:9999, overflow:'hidden', padding:20,
    }}>
      <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ duration:2, ease:[0.22,1,0.36,1] }}
        style={{ textAlign:'center', color:'white', display:'flex',
                 flexDirection:'column', alignItems:'center', gap:16,
                 width:'100%', maxWidth:320 }}
      >
        {/* Spinning icons */}
        <motion.div
          initial="hidden" animate="visible"
          variants={{ hidden:{}, visible:{ transition:{ staggerChildren:0.35 }}}}
          style={{ display:'flex', gap:14, alignItems:'center', justifyContent:'center' }}
        >
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              variants={{
                hidden:   { opacity:0, scale:0.3, rotate:-140, y:60 },
                visible:  { opacity:1, scale:1,   rotate:0,    y:0  },
              }}
              transition={{ duration:1.8, ease:[0.22,1,0.36,1] }}
              animate={{ y:[0,-6,0], rotate:[0,2,-2,0] }}
              style={{
                width:42, height:42, borderRadius:999,
                border:'1px solid rgba(255,255,255,0.1)',
                display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(255,255,255,0.03)',
              }}
            >
              <Icon size={18} color="white" />
            </motion.div>
          ))}
        </motion.div>

        {/* Text */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, flexWrap:'wrap' }}>
            <motion.span
              initial={{ opacity:0, x:120 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:1.2, duration:1.6, ease:[0.22,1,0.36,1] }}
              style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.05em' }}
            >Welcome</motion.span>
            <motion.span
              initial={{ opacity:0, x:-120 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:1.5, duration:1.6, ease:[0.22,1,0.36,1] }}
              style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.05em' }}
            >to my</motion.span>
          </div>
          <motion.h1
            initial={{ opacity:0, y:70 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:1.8, duration:1.6, ease:[0.22,1,0.36,1] }}
            style={{ fontSize:28, fontWeight:800, letterSpacing:'-0.05em',
                     lineHeight:1.15, margin:0, textAlign:'center' }}
          >Portfolio Website</motion.h1>
        </div>

        {/* Domain capsule */}
        <motion.div
          initial={{ opacity:0, y:-40 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:2.1, duration:1.6, ease:[0.22,1,0.36,1] }}
          style={{
            padding:'6px 14px', borderRadius:999,
            border:'1px solid rgba(255,255,255,0.12)',
            background:'rgba(255,255,255,0.04)',
            fontSize:12, letterSpacing:'0.12em',
            color:'rgba(255,255,255,0.7)',
          }}
        >www.irfan.dev</motion.div>
      </motion.div>
    </div>
  );
}

/* ================================================================
   NAVBAR
================================================================ */
function Navbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [open,     setOpen]           = useState(false);
  const [active,   setActive]         = useState('home');
  const [show,     setShow]           = useState(false);

  useEffect(() => {
    const navPlayed = sessionStorage.getItem('navbarPlayed');
    if (navPlayed) { setShow(true); return; }
    const t = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem('navbarPlayed', 'true');
    }, 3800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20);
      for (const id of ['home','about','portfolio','contact']) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= 140 && r.bottom >= 140) { setActive(id); break; }
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
  };

  const links = ['home','about','portfolio','contact'];

  return (
    <motion.nav
      initial={{ opacity:0, y:-30 }}
      animate={show ? { opacity:1, y:0 } : { opacity:0, y:-30 }}
      transition={{ duration:0.9, ease:[0.22,1,0.36,1] }}
      style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        padding: scrolled ? '14px 24px' : '22px 24px',
        background: scrolled ? 'rgba(13,13,13,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}
    >
      <a
        href="#home"
        onClick={e => scrollTo(e,'home')}
        className="dm-mono"
        style={{ fontSize:13, fontWeight:400, letterSpacing:'0.15em',
                 color:'var(--text-primary)', textDecoration:'none' }}
      >
        irfan.dev
      </a>

      {/* Desktop */}
      <div style={{ display:'flex', gap:28, alignItems:'center' }} className="hide-mobile">
        {links.map(l => (
          <a
            key={l}
            href={`#${l}`}
            onClick={e => scrollTo(e, l)}
            className="dm-mono"
            style={{
              fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase',
              color: active===l ? 'var(--text-primary)' : 'var(--text-muted)',
              textDecoration:'none', transition:'color 0.3s',
            }}
          >{l==='portfolio'?'works':l}</a>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{ display:'none', background:'none', border:'none',
                 color:'var(--text-primary)', cursor:'pointer' }}
        className="show-mobile"
      >
        {open ? <X size={22}/> : <Menu size={22}/>}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-10 }}
            style={{
              position:'absolute', top:'100%', left:0, right:0,
              background:'rgba(13,13,13,0.97)',
              backdropFilter:'blur(20px)',
              borderBottom:'1px solid var(--border)',
              display:'flex', flexDirection:'column', gap:0,
            }}
          >
            {links.map(l => (
              <a
                key={l}
                href={`#${l}`}
                onClick={e => scrollTo(e,l)}
                className="dm-mono"
                style={{
                  padding:'16px 24px', fontSize:12,
                  letterSpacing:'0.2em', textTransform:'uppercase',
                  color: active===l ? 'var(--text-primary)' : 'var(--text-muted)',
                  textDecoration:'none', borderBottom:'1px solid var(--border)',
                }}
              >{l==='portfolio'?'works':l}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media(min-width:768px){ .hide-mobile{ display:flex!important; } .show-mobile{ display:none!important; } }
        @media(max-width:767px){ .hide-mobile{ display:none!important; } .show-mobile{ display:flex!important; } }
      `}</style>
    </motion.nav>
  );
}

/* ================================================================
   HERO SECTION
================================================================ */
function HeroSection({ showApp }) {
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('heroPlayed') === 'true') {
      setStartAnim(true);
      return;
    }
    const t1 = setTimeout(() => setStartAnim(true), 3600);
    const t2 = setTimeout(() => sessionStorage.setItem('heroPlayed','true'), 5100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const ease = [0.22, 1, 0.36, 1];
  const anim = ok => ok
    ? { opacity:1, y:0,  filter:'blur(0px)', scale:1 }
    : { opacity:0, y:30, filter:'blur(12px)', scale:0.92 };

  return (
    <section
      id="home"
      style={{
        minHeight:'100vh', display:'flex', alignItems:'center',
        justifyContent:'flex-start', position:'relative', overflow:'hidden',
        padding:'0 24px 0 24px',
      }}
    >
      {/* Lanyard Canvas */}
      <div style={{
        position:'absolute', inset:0, zIndex:40,
        pointerEvents: showApp ? 'auto' : 'none',
      }}>
        {showApp && <LanyardCanvas />}
      </div>

      {/* Hero text */}
      <div style={{
        maxWidth:600, width:'100%', position:'relative', zIndex:5,
        paddingTop:80,
      }}
        className="hero-pad"
      >
        {/* Label */}
        <motion.div
          animate={anim(startAnim)}
          transition={{ duration:0.9, ease }}
          style={{ marginBottom:20 }}
        >
          <span className="dm-mono" style={{
            fontSize:12, color:'var(--text-muted)',
            letterSpacing:'0.2em', textTransform:'uppercase',
          }}>✦ Available for work</span>
        </motion.div>

        {/* H1 */}
        <div>
          <motion.h1
            animate={{ opacity: startAnim?1:0, scale: startAnim?1:0.85, y: startAnim?0:50 }}
            transition={{ duration:1, ease }}
            style={{ fontSize:'clamp(32px,6vw,62px)', fontWeight:800,
                     lineHeight:1.05, color:'var(--text-primary)',
                     letterSpacing:'-0.03em', marginBottom:0 }}
          >AI &amp; Full-Stack</motion.h1>

          <motion.h1
            animate={{ opacity: startAnim?1:0, x: startAnim?0:-80, rotate: startAnim?0:-4 }}
            transition={{ duration:1, delay:0.2, ease }}
            style={{ fontSize:'clamp(32px,6vw,62px)', fontWeight:800,
                     lineHeight:1.05, color:'var(--text-secondary)',
                     letterSpacing:'-0.03em', marginBottom:24 }}
          >Engineer</motion.h1>
        </div>

        {/* Typing subtitle */}
        <motion.div
          animate={{ opacity: startAnim?1:0, x: startAnim?0:40 }}
          transition={{ duration:0.8, delay:0.35 }}
          style={{ marginBottom:12 }}
        >
          <TypingText
            texts={['AI & ML Engineer','Computer Vision Dev','MERN Stack Builder','Happy Coding!']}
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          animate={{ opacity: startAnim?1:0, y: startAnim?0:50, scale: startAnim?1:0.96 }}
          transition={{ duration:1, delay:0.5 }}
          style={{ marginBottom:28, maxWidth:460 }}
        >
          <p style={{ fontSize:14, color:'var(--text-secondary)', lineHeight:1.9, letterSpacing:'0.01em' }}>
            Specialising in computer vision and MERN stack integration. Building intelligent,
            scalable systems that bridge AI and real-world applications.
          </p>
        </motion.div>

        {/* Skill pills */}
        <motion.div
          initial="hidden"
          animate={startAnim ? 'visible' : 'hidden'}
          variants={{ hidden:{}, visible:{ transition:{ staggerChildren:0.12, delayChildren:0.7 }}}}
          style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}
        >
          {DATA.heroSkills.map(s => (
            <motion.span
              key={s}
              variants={{
                hidden:   { opacity:0, y:25, scale:0.85 },
                visible:  { opacity:1, y:0,  scale:1    },
              }}
              transition={{ duration:0.5 }}
              className="dm-mono"
              style={{
                fontSize:11, color:'var(--text-secondary)',
                border:'1px solid var(--border)', borderRadius:999,
                padding:'5px 12px', background:'var(--bg-card)',
              }}
            >{s}</motion.span>
          ))}
        </motion.div>

        {/* Footer hints */}
        <motion.div
          animate={{ opacity: startAnim?1:0, y: startAnim?0:25 }}
          transition={{ duration:0.8, delay:1 }}
          style={{ display:'flex', flexDirection:'column', gap:6 }}
        >
          <span className="dm-mono" style={{ fontSize:13, color:'var(--text-muted)' }}>
            ↓ explore my work below
          </span>
          <span className="dm-mono" style={{ fontSize:13, color:'var(--text-muted)' }}>
            ↗ open to full-time & freelance opportunities
          </span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ opacity: startAnim?1:0, y: startAnim?0:40 }}
        transition={{ duration:0.9, delay:1.2, ease }}
        style={{
          position:'absolute', bottom:38, left:'50%',
          transform:'translateX(-50%)', zIndex:20, pointerEvents:'none',
        }}
      >
        <motion.div
          animate={{ y:[0,6,0], opacity:[1,0.65,1] }}
          transition={{ duration:1.4, repeat:Infinity, ease:'easeInOut' }}
          style={{ display:'flex', alignItems:'center', gap:8 }}
        >
          <span className="dm-mono" style={{
            fontSize:11, letterSpacing:'0.2em',
            textTransform:'uppercase', color:'var(--text-muted)',
          }}>Scroll</span>
          <span style={{ fontSize:16, color:'var(--text-secondary)' }}>↓</span>
        </motion.div>
      </motion.div>

      <style>{`
        @media(min-width:768px){ .hero-pad{ padding-left:120px!important; padding-right:60px!important; } }
        @media(max-width:767px){ .hero-pad{ padding-top: 40px!important; z-index: 50!important; pointer-events: none; } }
      `}</style>
    </section>
  );
}

/* ================================================================
   ABOUT SECTION
================================================================ */
function AboutSection() {
  // We add 'target' and 'tab' to each stat so they know exactly where to go
  const stats = [
    { icon:<Code size={16}/>,  value:'3',  title:'PROJECTS', target: 'portfolio', tab: 'projects' },
    { icon:<Award size={16}/>, value:'4',  title:'CERTIFICATES', target: 'education', tab: 'certifications' },
    { icon:<Globe size={16}/>, value:'7',  title:'COMPLETED WORKS', target: 'portfolio', tab: 'projects' },
  ];

  // Keeps the "View Projects" button working normally
  const scrollTo = () =>
    document.getElementById('portfolio')?.scrollIntoView({ behavior:'smooth' });

  // New function exclusively for the stat cards to scroll AND switch tabs
  const handleStatClick = (targetId, tabName) => {
    document.getElementById(targetId)?.scrollIntoView({ behavior:'smooth' });
    window.dispatchEvent(new CustomEvent('changeTab', { detail: tabName }));
  };

  return (
    <section
      id="about"
      style={{ minHeight:'100vh', display:'flex', alignItems:'flex-start',
               padding:'80px 24px 30px' }}
      className="about-pad"
    >
      <div style={{ width:'100%' }}>
        <div style={{ display:'flex', flexDirection:'row', alignItems:'center',
                      justifyContent:'space-between', gap:32, flexWrap:'wrap' }}>

          {/* Left */}
          <motion.div
            variants={{
              hidden:{},
              show:{ transition:{ staggerChildren:0.16 }}
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once:false, margin:'-80px' }}
            style={{ maxWidth:600, width:'100%' }}
          >
            <motion.div variants={{ hidden:{opacity:0,y:35,filter:'blur(8px)'},
                                    show:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:1,ease:[0.22,1,0.36,1]}} }}
              style={{ marginBottom:16 }}>
              <span className="dm-mono" style={{ fontSize:12, color:'var(--text-muted)', letterSpacing:'0.2em' }}>
                ABOUT ME
              </span>
            </motion.div>

            <motion.div variants={{ hidden:{opacity:0,y:35}, show:{opacity:1,y:0,transition:{duration:1,ease:[0.22,1,0.36,1]}} }}>
              <div style={{ fontSize:'clamp(32px,5vw,46px)', fontWeight:800,
                            lineHeight:1.03, color:'var(--text-primary)' }}>
                <div>Mohammed</div>
                <div>Irfan</div>
                <div>A</div>
              </div>
            </motion.div>

            <motion.p
              variants={{ hidden:{opacity:0,y:40}, show:{opacity:1,y:0,transition:{duration:1.1,delay:0.2}} }}
              style={{ marginTop:18, fontSize:14, color:'var(--text-secondary)',
                       lineHeight:1.75, maxWidth:490 }}
            >{DATA.bio}</motion.p>

            {/* Quote */}
            <motion.div
              variants={{ hidden:{opacity:0,scale:0.94}, show:{opacity:1,scale:1,transition:{duration:0.9,delay:0.3}} }}
              style={{ marginTop:18, padding:'12px 25px', borderRadius:10,
                       border:'1px solid var(--border)', background:'var(--bg-card)',
                       fontSize:12, fontStyle:'italic', display:'inline-block', width:'fit-content' }}
            >
              "Bridging AI intelligence with real-world engineering impact."
            </motion.div>

            {/* Buttons */}
            <motion.div
              variants={{ hidden:{opacity:0,y:35}, show:{opacity:1,y:0,transition:{duration:1,ease:[0.22,1,0.36,1]}} }}
              style={{ display:'flex', gap:10, marginTop:18, flexWrap:'wrap' }}
            >
              <a
                href="/Mohammed_Irfan_CV.pdf"
                download="Mohammed_Irfan_A_CV.pdf"
                target="_blank" rel="noreferrer"
                style={{ textDecoration:'none' }}
              >
                <button style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'10px 18px', borderRadius:8,
                  border:'1px solid white', background:'white',
                  color:'black', fontSize:13, fontWeight:600, cursor:'pointer',
                }}>
                  <FileText size={14}/> Download CV
                </button>
              </a>
              <button
                onClick={scrollTo}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'10px 18px', borderRadius:8,
                  border:'1px solid white', background:'transparent',
                  color:'white', fontSize:13, fontWeight:600, cursor:'pointer',
                }}
              >
                <ArrowUpRight size={14}/> View Projects
              </button>
            </motion.div>
          </motion.div>

          {/* Profile photo placeholder */}
          <motion.div
            initial={{ opacity:0, x:70, rotate:2 }}
            whileInView={{ opacity:1, x:0, rotate:0 }}
            viewport={{ once:false }}
            transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
            style={{ display:'flex', justifyContent:'flex-end' }}
            className="about-photo"
          >
            <img
                src="/profile1.jpg"
                alt="Mohammed Irfan A"
                style={{
                  width:240, height:240,
                  borderRadius:'50%',
                  objectFit:'cover',
                  objectPosition:'center top',
                  display:'block',
                  filter:'grayscale(15%) brightness(0.85)',
                }}
              />
          </motion.div>
        </div>

        {/* Stat cards */}
        <motion.div
          variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.16 }}}}
          initial="hidden" whileInView="show" viewport={{ once:false }}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
                   gap:18, marginTop:36 }}
        >
          {stats.map((item, i) => (
            <motion.div
              key={i}
              onClick={() => handleStatClick(item.target, item.tab)} // <-- Added onClick here to the whole card
              variants={{ hidden:{opacity:0,scale:0.92,y:25},
                          show:{opacity:1,scale:1,y:0,transition:{duration:0.85,ease:[0.22,1,0.36,1]}} }}
              whileHover={{ scale:1.03 }}
              style={{ position:'relative', padding:18, borderRadius:16,
                       border:'1px solid var(--border)', background:'var(--bg-card)', cursor:'pointer' }}
            >
              <div style={{ width:34, height:34, borderRadius:'50%', border:'1px solid var(--border)',
                            display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                {item.icon}
              </div>
              <div style={{ position:'absolute', top:16, right:16, fontSize:18, fontWeight:700 }}>
                {item.value}
              </div>
              <div style={{ fontSize:11, letterSpacing:'0.08em' }}>{item.title}</div>
              {/* Removed the old onClick from this child div so it doesn't conflict */}
              <div style={{ position:'absolute', bottom:14, right:14 }}>
                <ArrowUpRight size={15}/>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media(min-width:768px){ .about-pad{ padding:80px 60px 30px 120px!important; } }
        @media(max-width:767px){ .about-photo{ display:flex!important; justify-content:center!important; width:100%; margin-top:40px; } }
      `}</style>
    </section>
  );
}

/* ================================================================
   PORTFOLIO SHOWCASE
================================================================ */
function PortfolioCard({ project: p, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = p.icon;

  return (
    <motion.div
      layout // Enables smooth height animation
      initial={{ opacity:0, x: index%2===0 ? -50 : 50, y:20 }}
      whileInView={{ opacity:1, x:0, y:0 }}
      transition={{ duration:0.5 }}
      onPointerEnter={() => setExpanded(true)}
      onPointerLeave={() => setExpanded(false)}
      style={{
        position:'relative', borderRadius:26,
        border:'1px solid rgba(255,255,255,0.1)',
        background:'rgba(255,255,255,0.05)', padding:24,
        display:'flex', flexDirection:'column',
        overflow: 'hidden'
      }}
    >
      {/* 1. Title and Role at the Top */}
      <motion.h3 layout style={{ fontSize:18, fontWeight:700, marginBottom:6, lineHeight:1.3, color:'white' }}>
        {p.title}
      </motion.h3>
      <motion.p layout style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color: p.color, letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:16 }}>
        {p.role}
      </motion.p>

      {/* 2. Image / Icon Area */}
      <motion.div layout style={{
        width:'100%', height:100, borderRadius:16,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:`linear-gradient(135deg,${p.color}22,${p.color}11)`,
        marginBottom:16, border:'1px solid rgba(255,255,255,0.08)',
        flexShrink: 0
      }}>
        {Icon && <Icon size={38} color={p.color} />}
      </motion.div>

      {/* 3. Details Section */}
      <motion.div layout style={{ display:'flex', flexDirection:'column', flex: 1 }}>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', lineHeight:1.75,
                    marginBottom:12, whiteSpace:'pre-line',
                    display: expanded ? 'block' : '-webkit-box',
                    WebkitLineClamp: expanded ? 'unset' : 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.desc}
        </p>

        {/* Key features (Only show on hover) */}
        <AnimatePresence>
          {expanded && p.features && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginBottom:14, paddingLeft:0, listStyle:'none', display:'flex', flexDirection:'column', gap:6, overflow:'hidden' }}
            >
              {p.features.map((f, i) => (
                <li key={i} style={{ display:'flex', gap:8, fontSize:12, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
                  <span style={{ color: p.color, flexShrink:0 }}>›</span> {f}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* Tech tags */}
        <motion.div layout style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20, marginTop:'auto' }}>
          {p.tech.map(t => (
            <span key={t} className="dm-mono" style={{
              fontSize:10, border:'1px solid rgba(255,255,255,0.15)',
              padding:'3px 8px', borderRadius:4,
              color:'rgba(255,255,255,0.6)', textTransform:'uppercase',
            }}>{t}</span>
          ))}
        </motion.div>

        {/* 4. Full Width Live Demo Button */}
        <motion.div layout style={{ width: '100%' }}>
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer"
              style={{
                padding:'12px 16px', borderRadius:12,
                background: expanded ? p.color : 'rgba(255,255,255,0.1)',
                border:'none',
                color: expanded ? '#000' : 'white',
                fontSize:13, cursor:'pointer',
                textDecoration:'none', display:'flex', alignItems:'center', justifyContent: 'center', gap:8,
                fontFamily:"'DM Mono',monospace", fontWeight:700,
                transition: 'all 0.3s ease'
              }}>
              ↗ Live Demo
            </a>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function PortfolioShowcase() {
  const [tab, setTab]           = useState('projects');
  const [showAll, setShowAll]   = useState(false);

  const shown = showAll ? DATA.projects : DATA.projects.slice(0,3);
  const tabs  = ['projects','experience','tech stack'];

  return (
    <section
      id="portfolio"
      style={{ width:'100%', maxWidth:1450, margin:'0 auto',
               padding:'96px 20px', color:'white' }}
      className="port-pad"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity:0, y:45 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.9 }}
        style={{ textAlign:'center', marginBottom:32 }}
      >
        <h1 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, marginBottom:12 }}>
          Portfolio Showcase
        </h1>
        <p style={{ color:'rgba(255,255,255,0.55)', maxWidth:560, margin:'0 auto',
                    fontSize:15, lineHeight:1.7 }}>
          Explore my journey through projects, experience, and technical expertise.
        </p>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1,
                 background:'rgba(255,255,255,0.1)',
                 border:'1px solid rgba(255,255,255,0.1)',
                 borderRadius:12, overflow:'hidden', marginBottom:48 }}
      >
        {[
          // Counts the exact number of projects you have (3)
          { label:'PROJECTS', value: DATA.projects.length },
          
          // Counts the exact number of experiences you have (1)
          { label:'EXPERIENCE', value: DATA.experience.length },
          
          // Adds up every single skill inside your DATA.skills categories automatically (will be 23)
          { label:'TECHNOLOGIES', value: DATA.skills.reduce((total, group) => total + group.items.length, 0) },
        ].map(s => (
          <div key={s.label} style={{
            background:'var(--bg-primary)', padding:24,
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <span className="dm-mono" style={{
              fontSize:10, color:'rgba(255,255,255,0.5)',
              textTransform:'uppercase', letterSpacing:'0.1em',
            }}>{s.label}</span>
            <span style={{ fontSize:24, fontWeight:700 }}>{s.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Tab switcher */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
        <div style={{
          display:'flex', gap:8, padding:6,
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:999, background:'rgba(255,255,255,0.05)',
        }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="dm-mono"
              style={{
                padding:'10px 24px', borderRadius:999,
                border:'none', cursor:'pointer',
                fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em',
                background: tab===t ? 'white' : 'transparent',
                color: tab===t ? 'black' : 'rgba(255,255,255,0.5)',
                fontWeight: tab===t ? 700 : 400,
                transition:'all 0.3s',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ minHeight:400 }}>

        {/* PROJECTS */}
        {tab === 'projects' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:24, alignItems: 'start' }}>
            {shown.map((p, i) => (
              <PortfolioCard
                key={i} index={i} project={p}
              />
            ))}
          </div>
        )}

        {/* EXPERIENCE */}
        {tab === 'experience' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:720, margin:'0 auto' }}>
            {DATA.experience.map((e, i) => (
              <Reveal key={i} delay={i*100}>
                <div style={{
                  padding:32, border:'1px solid rgba(255,255,255,0.08)',
                  background:'rgba(255,255,255,0.02)', borderRadius:16,
                  display:'flex', gap:24, flexWrap:'wrap',
                }}>
                  <div style={{ minWidth:140 }}>
                    <p className="dm-mono" style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>{e.date}</p>
                    <p style={{ fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.03em' }}>{e.company}</p>
                  </div>
                  <div style={{ flex:1 }}>
                    <h4 style={{ fontSize:18, fontWeight:700, textTransform:'uppercase',
                                 letterSpacing:'-0.01em', marginBottom:10 }}>{e.title}</h4>
                    {Array.isArray(e.desc)
                      ? <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                          {e.desc.map((d, di) => (
                            <li key={di} style={{ display:'flex', alignItems:'flex-start', gap:8, color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.7 }}>
                              <span style={{ marginTop:6, width:4, height:4, borderRadius:'50%', background:'rgba(255,255,255,0.3)', flexShrink:0 }}/>
                              {d}
                            </li>
                          ))}
                        </ul>
                      : <p style={{ color:'rgba(255,255,255,0.6)', fontSize:13, lineHeight:1.7 }}>{e.desc}</p>
                    }
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* TECH STACK */}
        {tab === 'tech stack' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:24 }}>
            {DATA.skills.map((g, i) => (
              <Reveal key={i} delay={i*100}>
                <div style={{
                  padding:32, border:'1px solid rgba(255,255,255,0.08)',
                  background:'rgba(255,255,255,0.02)', borderRadius:16,
                }}>
                  <h4 className="dm-mono" style={{
                    fontSize:10, letterSpacing:'0.15em', color:'rgba(255,255,255,0.4)',
                    textTransform:'uppercase', marginBottom:20,
                    paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)',
                  }}>{g.category}</h4>
                  <ul style={{ listStyle:'none', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {g.items.map((item, j) => (
                      <li key={j} style={{
                        fontSize:13, color:'rgba(255,255,255,0.75)',
                        display:'flex', alignItems:'center', gap:8,
                      }}>
                        <span style={{ width:4, height:4, borderRadius:'50%',
                                       background:'rgba(255,255,255,0.3)', flexShrink:0 }}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media(min-width:768px){ .port-pad{ padding:96px 80px!important; } }
      `}</style>
    </section>
  );
}
/* ================================================================
   EDUCATION & CERTIFICATIONS SECTION
================================================================ */
function EducationSection() {
  const [tab, setTab] = useState('education');
  const tabs = ['education', 'certifications'];

  return (
    <section id="education" style={{ width:'100%', maxWidth:1450, margin:'0 auto', padding:'96px 20px', color:'white' }} className="port-pad">
      
      {/* Header */}
      <motion.div initial={{ opacity:0, y:45 }} whileInView={{ opacity:1, y:0 }} transition={{ duration:0.9 }} style={{ textAlign:'center', marginBottom:32 }}>
        <h1 style={{ fontSize:'clamp(28px,4vw,48px)', fontWeight:700, marginBottom:12 }}>Academics & Certifications</h1>
        <p style={{ color:'rgba(255,255,255,0.55)', maxWidth:480, margin:'0 auto', fontSize:15, lineHeight:1.7 }}>My educational background and professional qualifications.</p>
      </motion.div>

      {/* Tab Switcher */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
        <div style={{
          display:'flex', gap:8, padding:6,
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:999, background:'rgba(255,255,255,0.05)',
        }}>
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="dm-mono"
              style={{
                padding:'10px 24px', borderRadius:999,
                border:'none', cursor:'pointer',
                fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em',
                background: tab===t ? 'white' : 'transparent',
                color: tab===t ? 'black' : 'rgba(255,255,255,0.5)',
                fontWeight: tab===t ? 700 : 400,
                transition:'all 0.3s',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: 320 }}>
        
        {/* EDUCATION TAB */}
        {tab === 'education' && (
          <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:800, margin:'0 auto' }}>
            {DATA.education.map((ed, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{ padding:28, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', borderRadius:16, display:'flex', flexDirection:'column', gap:6, position:'relative' }}>
                  <div style={{ position:'absolute', top:20, right:20, fontFamily:"'DM Mono',monospace", fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em' }}>{ed.period}</div>
                  <h3 style={{ fontSize:16, fontWeight:700, color:'#f0f0f0', paddingRight:120 }}>{ed.degree}</h3>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>{ed.institution}</p>
                  <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.35)', letterSpacing:'0.05em' }}>{ed.board}</p>
                  <span style={{ marginTop:4, display:'inline-block', fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:999, padding:'3px 12px', width:'fit-content' }}>{ed.score}</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* CERTIFICATIONS TAB */}
        {tab === 'certifications' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:800, margin:'0 auto' }}>
            {DATA.certifications.map((cert, i) => (
              <Reveal key={i} delay={i*80}>
                <div style={{
                  padding:'16px 24px', border:'1px solid rgba(255,255,255,0.08)',
                  background:'rgba(255,255,255,0.02)', borderRadius:12,
                  display:'flex', justifyContent:'space-between', alignItems:'center',
                  flexWrap:'wrap', gap:8,
                }}>
                  <div>
                    <p style={{ fontSize:14, fontWeight:600, color:'#f0f0f0', marginBottom:4 }}>{cert.name}</p>
                    <p style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'0.05em' }}>{cert.org}</p>
                  </div>
                  <span style={{
                    fontFamily:"'DM Mono',monospace", fontSize:11,
                    color:'rgba(255,255,255,0.5)', border:'1px solid rgba(255,255,255,0.1)',
                    borderRadius:999, padding:'3px 12px',
                  }}>{cert.year}</span>
                </div>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
/* ================================================================
   CONTACT SECTION
================================================================ */
function ContactSection() {
  const [form, setForm]  = useState({ name:'', email:'', message:'' });
  const [sent, setSent]  = useState(false);

  const submit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ name:'',email:'',message:'' }); }, 3000);
  };

  const inputStyle = {
    width:'100%', padding:'12px 16px',
    background:'var(--bg-card)', border:'1px solid var(--border)',
    borderRadius:10, color:'var(--text-primary)',
    fontSize:14, outline:'none', transition:'border-color 0.3s',
    fontFamily:'inherit',
  };

  return (
    <section
      id="contact"
      style={{ width:'100%', maxWidth:1500, margin:'0 auto',
               padding:'80px 20px 96px', color:'white', textAlign:'center' }}
      className="cont-pad"
    >
      <motion.h1
        initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }}
        animate={{ y:[0,-10,0] }}
        transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
        style={{ fontSize:'clamp(36px,6vw,72px)', fontWeight:700,
                 letterSpacing:'-0.03em', marginBottom:16 }}
      >Contact Me</motion.h1>

      <motion.p
        initial={{ opacity:0, y:35 }} whileInView={{ opacity:1, y:0 }}
        style={{ color:'rgba(255,255,255,0.6)', maxWidth:560, margin:'0 auto 48px',
                 fontSize:15, lineHeight:1.7 }}
      >
        Have a project in mind or want to collaborate? Send a message and let's connect.
      </motion.p>

      {/* Form */}
      <motion.form
        onSubmit={submit}
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }}
        transition={{ duration:0.8 }}
        style={{ maxWidth:520, margin:'0 auto 48px',
                 display:'flex', flexDirection:'column', gap:16, textAlign:'left' }}
      >
        {[
          { key:'name',    label:'Name',    type:'text',  ph:'Mohammed Irfan A' },
          { key:'email',   label:'Email',   type:'email', ph:'irfan@example.com' },
        ].map(f => (
          <div key={f.key}>
            <label className="dm-mono" style={{ fontSize:11, color:'var(--text-muted)',
                   letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
              {f.label}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => setForm({...form,[f.key]:e.target.value})}
              placeholder={f.ph}
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor='rgba(124,58,237,0.5)'}
              onBlur={e  => e.target.style.borderColor='var(--border)'}
            />
          </div>
        ))}
        <div>
          <label className="dm-mono" style={{ fontSize:11, color:'var(--text-muted)',
                 letterSpacing:'0.12em', textTransform:'uppercase', display:'block', marginBottom:8 }}>
            Message
          </label>
          <textarea
            value={form.message}
            onChange={e => setForm({...form,message:e.target.value})}
            placeholder="Tell me about your project..."
            required rows={5}
            style={{ ...inputStyle, resize:'vertical' }}
            onFocus={e => e.target.style.borderColor='rgba(124,58,237,0.5)'}
            onBlur={e  => e.target.style.borderColor='var(--border)'}
          />
        </div>
        <button
          type="submit"
          style={{
            padding:'14px 32px', borderRadius:10, border:'none',
            background: sent
              ? 'linear-gradient(135deg,#10b981,#059669)'
              : 'linear-gradient(135deg,#7c3aed,#3b82f6)',
            color:'white', fontSize:15, fontWeight:700,
            cursor:'pointer', transition:'opacity 0.3s',
          }}
        >
          {sent ? '✓ Message Sent!' : 'Send Message →'}
        </button>
      </motion.form>

      {/* Social links */}
      <motion.div
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center' }}
      >
        <div style={{ display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center' }}>
          <a href={`mailto:${DATA.email}`}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px',
                     background:'white', color:'black', borderRadius:6,
                     textDecoration:'none', fontSize:13, fontWeight:700,
                     fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', textTransform:'uppercase' }}>
            <Mail size={16}/> Email Me
          </a>
          <a href={DATA.linkedin} target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px',
                     border:'1px solid rgba(255,255,255,0.2)', color:'white', borderRadius:6,
                     textDecoration:'none', fontSize:13, fontWeight:700,
                     fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', textTransform:'uppercase' }}>
            <Linkedin size={16}/> LinkedIn
          </a>
          <a href={DATA.github} target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 24px',
                     border:'1px solid rgba(255,255,255,0.2)', color:'white', borderRadius:6,
                     textDecoration:'none', fontSize:13, fontWeight:700,
                     fontFamily:"'DM Mono',monospace", letterSpacing:'0.1em', textTransform:'uppercase' }}>
            <Github size={16}/> GitHub
          </a>
        </div>
      </motion.div>
{/* Contact details */}
      <motion.div
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
        style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:16, marginTop:32 }}
      >
        {[
          { label:'Email',    value:'mohammedirfan.a02@gmail.com',             href:'mailto:mohammedirfan.a02@gmail.com' },
          { label:'Phone',    value:'+91 7034208710',                           href:'tel:+917034208710' },
          { label:'LinkedIn', value:'linkedin.com/in/mohammed-irfan-a-7ba342368', href:'https://www.linkedin.com/in/mohammed-irfan-a-7ba342368' },
          { label:'Location', value:'Palakkad, Kerala',                         href:null },
        ].map((item, i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'14px 24px', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, background:'rgba(255,255,255,0.02)', minWidth:200 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>{item.label}</span>
            {item.href
              ? <a href={item.href} target={item.label==='LinkedIn'?'_blank':undefined} rel="noreferrer" style={{ fontSize:13, color:'rgba(255,255,255,0.75)', textDecoration:'none', textAlign:'center', wordBreak:'break-all' }}>{item.value}</a>
              : <span style={{ fontSize:13, color:'rgba(255,255,255,0.75)', textAlign:'center' }}>{item.value}</span>
            }
          </div>
        ))}
      </motion.div>
      <style>{`
        @media(min-width:768px){ .cont-pad{ padding:80px 40px 96px!important; } }
      `}</style>
    </section>
  );
}

/* ================================================================
   FOOTER
================================================================ */
function Footer() {
  return (
    <footer style={{
      borderTop:'1px solid var(--border)', padding:'32px 24px',
      textAlign:'center',
    }}>
      <p className="dm-mono" style={{
        fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase',
        color:'var(--text-muted)',
      }}>
        Designed &amp; Engineered by Mohammed Irfan A // {new Date().getFullYear()}
      </p>
    </footer>
  );
}

/* ================================================================
   ROOT APP
================================================================ */
export default function App() {
  const [loading, setLoading]   = useState(true);
  const [showApp, setShowApp]   = useState(false);

  injectStyles();

  useEffect(() => {
    const already = sessionStorage.getItem('heroPlayed') === 'true';
    if (already) {
      setLoading(false);
      setShowApp(true);
      return;
    }
    // Welcome screen shows for ~3.5s, then page fades in
    const t1 = setTimeout(() => setLoading(false), 3500);
    const t2 = setTimeout(() => setShowApp(true),  3700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ position:'relative', background:'var(--bg-primary)',
                  color:'var(--text-primary)', minHeight:'100vh', overflowX:'hidden' }}>

      {/* Welcome intro */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="welcome"
            exit={{ opacity:0 }}
            transition={{ duration:0.7 }}
          >
            <WelcomeScreen/>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <>
          <AnimatedBackground/>
          <Navbar/>
          <main>
            <HeroSection showApp={showApp}/>
            <AboutSection/>
            <PortfolioShowcase/>
            <EducationSection/>
            <ContactSection/>
          </main>
          <Footer/>
        </>
      )}
    </div>
  );
}

/*
================================================================
  SETUP GUIDE — copy-paste into your terminal
================================================================

  # 1. Create a new React project
  npx create-react-app irfan-portfolio
  cd irfan-portfolio

  # 2. Install all dependencies
  npm install three @react-three/fiber @react-three/drei \
              @react-three/rapier meshline \
              framer-motion lucide-react gsap

  # 3. Replace App.jsx
  #    Copy this entire file to  src/App.jsx

  # 4. Start dev server
  npm start

  ─────────────────────────────────────────────────
  WHAT YOU GET (exact match to the video):

  ✅  Welcome / intro loading screen
      (icons spin in → "Welcome to my Portfolio Website" → domain capsule)

  ✅  Physics-based 3D lanyard ID card
      • Real Rapier rigid-body rope joints
      • Drag the card with your mouse
      • Realistic swing & settle physics
      • Custom programmatic card texture with:
          - Your name, role, initials avatar
          - Skill tags, barcode decoration, location

  ✅  Animated background (moving light blobs + grid)

  ✅  Animated navbar (appears after intro, tracks active section)

  ✅  Hero section
      • Staggered text reveal after intro
      • Typing animation (4 roles cycling)
      • Skill pill badges

  ✅  About section
      • Name split over 3 lines (original style)
      • Quote card, Download CV + View Projects buttons
      • Stat cards (Projects / Certificates / Works)

  ✅  Portfolio Showcase
      • Tab switcher: Projects | Experience | Tech Stack
      • All 3 projects with icons & tech tags
      • Both experience entries
      • All 4 skill group cards

  ✅  Contact section
      • Animated floating heading
      • Working contact form (client-side)
      • Email / LinkedIn / GitHub links

  ✅  Footer

  ─────────────────────────────────────────────────
  NOTE:  The original repo uses a .glb 3D model for
  the card shape. This file generates the card mesh
  programmatically so you don't need any external
  asset files — everything works out of the box.
================================================================
*/
