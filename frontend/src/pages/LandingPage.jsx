import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Ticket, Shield, Zap, Clock, Users, BarChart3,
  ChevronDown, Star, ArrowRight, ExternalLink, MessageCircle, Mail,
  Activity, Globe, Lock, Crown
} from 'lucide-react';
import Button from '../components/common/Button';

const easeLuxury = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 1, ease: easeLuxury },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Global Utility Components ───────────────────────────────── */
const SectionLabel = ({ children }) => (
  <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
    <div style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-accent)' }} />
    <span style={{ 
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: 600, 
      textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' 
    }}>
      {children}
    </span>
  </motion.div>
);

const SectionHeading = ({ children, style }) => (
  <motion.h2 variants={fadeUp} style={{
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(var(--text-4xl), 6vw, var(--text-6xl))',
    fontWeight: 500,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    color: '#fff',
    marginBottom: 'var(--space-8)',
    ...style
  }}>
    {children}
  </motion.h2>
);

/* ── Hero Section ──────────────────────────────────────────── */
const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      paddingTop: '160px',
    }}>
      {/* Cinematic Background */}
      <motion.div style={{ position: 'absolute', inset: 0, zIndex: 0, y: y1, opacity }}>
        <img 
          src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Luxury Concert Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4) contrast(1.2)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, transparent 0%, var(--color-bg) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--color-bg) 100%)' }} />
        {/* Floating Gradient Orbs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, -100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', top: '20%', left: '20%', width: '40vw', height: '40vw', background: 'var(--color-accent)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }}
        />
      </motion.div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
          
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: easeLuxury }}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
              padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)', marginBottom: 'var(--space-8)'
            }}
          >
            <Activity size={14} color="var(--color-accent)" />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>
              12,403 VIP TICKETS SECURED THIS WEEK
            </span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: easeLuxury, delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(var(--text-5xl), 8vw, 7.5rem)',
              fontWeight: 500,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              color: '#fff',
              marginBottom: 'var(--space-6)',
              textShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}
          >
            Experience Events <br />
            <span style={{ color: 'var(--color-text-muted)' }}>Before They </span>
            <span style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sell Out.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(var(--text-lg), 2vw, var(--text-2xl))',
              color: 'var(--color-text-secondary)',
              maxWidth: 600,
              lineHeight: 1.5,
              marginBottom: 'var(--space-10)'
            }}
          >
            The world's most exclusive ticketing platform. Atomic reservations, unparalleled concurrency, and premium access to the nightlife elite.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: easeLuxury }}
            style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link to="/register">
              <Button size="lg" style={{ 
                height: 64, padding: '0 var(--space-10)', fontSize: 'var(--text-lg)',
                boxShadow: 'var(--shadow-luxury-glow)', borderRadius: 'var(--radius-full)'
              }}>
                Request Access
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" size="lg" style={{ 
                height: 64, padding: '0 var(--space-8)', fontSize: 'var(--text-lg)',
                background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.1)'
              }}>
                View Showcase
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Live Booking Widget */}
        <motion.div 
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: easeLuxury }}
        >
          <div style={{
            marginTop: 'var(--space-20)',
            maxWidth: 800, margin: 'var(--space-20) auto 0',
            background: 'rgba(10, 10, 12, 0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-6)',
            boxShadow: 'var(--shadow-luxury)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=200&auto=format&fit=crop" alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: 'var(--color-success)', borderRadius: '50%', border: '2px solid #000' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'var(--text-base)', color: '#fff' }}>Afterlife Tulum 2026</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>VIP Section • 42 seats booked in last hour</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: -10 }}>
              {[1,2,3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i*10}`} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(10,10,12,1)', marginLeft: i > 1 ? -12 : 0 }} alt="Avatar" />
              ))}
              <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(10,10,12,1)', marginLeft: -12, background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', color: '#fff' }}>
                +12
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ── Bento Features ────────────────────────────────────────── */
const BentoGrid = () => (
  <section style={{ padding: 'var(--space-24) 0', position: 'relative' }}>
    <div className="container">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger}>
        <SectionLabel>Platform Capabilities</SectionLabel>
        <SectionHeading style={{ maxWidth: 800 }}>
          Architected for high-end exclusivity and flawless execution.
        </SectionHeading>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--space-6)',
          gridAutoRows: 'minmax(300px, auto)'
        }}>
          {/* Card 1: Large Span */}
          <motion.div className="bento-card hide-on-mobile" variants={fadeUp} style={{
            gridColumn: 'span 8',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-10)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: 400 }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <Lock size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Atomic 10-Minute Locks</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>
                Secure your VIP table with zero race conditions. Powered by MongoDB multi-document transactions ensuring your reservation is absolutely guaranteed.
              </p>
            </div>
            {/* Decorative background element */}
            <div style={{ position: 'absolute', right: '-10%', bottom: '-20%', width: '60%', height: '100%', background: 'radial-gradient(circle, rgba(200,77,255,0.15) 0%, transparent 70%)' }} />
          </motion.div>

          {/* Card 2: Small Span */}
          <motion.div className="bento-card" variants={fadeUp} style={{
            gridColumn: 'span 4',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-8)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
             <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-alt)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <Globe size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Global Edge Sync</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
                Sub-200ms latency worldwide. Real-time availability updates instantly across all client devices.
              </p>
          </motion.div>

          {/* Card 3: Small Span */}
          <motion.div className="bento-card" variants={fadeUp} style={{
            gridColumn: 'span 4',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-8)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
             <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: 'var(--color-surface-alt)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <Crown size={24} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>Premium Scoping</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
                Organizers enjoy total data isolation. Your high-profile guest lists and sales metrics remain strictly confidential.
              </p>
          </motion.div>

          {/* Card 4: Large Span */}
          <motion.div className="bento-card" variants={fadeUp} style={{
            gridColumn: 'span 8',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--space-10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}>
            <div style={{ maxWidth: 350 }}>
              <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'var(--color-surface-alt)', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
                <Zap size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Concurrency Safe</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>
                Engineered to handle thousands of simultaneous checkout attempts during massive drops without breaking a sweat.
              </p>
            </div>
            {/* Visual Element */}
            <div style={{ width: '40%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ width: 200, height: 200, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ position: 'absolute', inset: 0, border: '2px solid transparent', borderTopColor: 'var(--color-accent)', borderRadius: '50%' }} />
                  <BarChart3 size={48} color="rgba(255,255,255,0.5)" />
               </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
    
    {/* Responsive override for grid */}
    <style>{`
      @media (max-width: 900px) {
        section > .container > div > div {
          display: flex;
          flex-direction: column;
        }
        section > .container > div > div > div {
          grid-column: span 12 !important;
        }
      }
    `}</style>
  </section>
);

/* ── Luxury Timeline (How it Works) ────────────────────────── */
const Timeline = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const steps = [
    { num: '01', title: 'Curated Discovery', desc: 'Browse highly vetted, premium nightlife and luxury events across global capitals.' },
    { num: '02', title: 'Tactical Selection', desc: 'Use our interactive venue maps to select the perfect vantage point and VIP sections.' },
    { num: '03', title: 'Immutable Confirmation', desc: 'Secure your reservation with atomic certainty before the window closes.' }
  ];

  return (
    <section ref={containerRef} style={{ padding: 'var(--space-24) 0', background: 'var(--color-bg-alt)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
          <SectionLabel>The Journey</SectionLabel>
          <SectionHeading>Three Steps to the Front Row</SectionHeading>
        </motion.div>

        <div style={{ position: 'relative', paddingLeft: 'var(--space-12)' }}>
          {/* Track */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 24, width: 2, background: 'var(--color-border)' }} />
          {/* Animated Fill */}
          <motion.div style={{ position: 'absolute', top: 0, left: 24, width: 2, background: 'var(--gradient-accent)', scaleY: scrollYProgress, transformOrigin: 'top' }} />

          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: easeLuxury }}
              style={{ position: 'relative', marginBottom: i === steps.length - 1 ? 0 : 'var(--space-16)' }}
            >
              {/* Dot */}
              <div style={{ position: 'absolute', left: 'calc(-var(--space-12) + 24px - 6px)', top: 12, width: 14, height: 14, borderRadius: '50%', background: 'var(--color-bg)', border: '2px solid var(--color-accent)', zIndex: 2 }} />
              
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 300, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
                {step.num}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', lineHeight: 1.6, maxWidth: 500 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Executive Stats ───────────────────────────────────────── */
const Stats = () => {
  const stats = [
    { value: '10K+', label: 'Elite Reservations' },
    { value: '500+', label: 'Exclusive Events' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<200ms', label: 'Transaction Latency' },
  ];

  return (
    <section style={{ padding: 'var(--space-24) 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
      <div className="container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} custom={i} style={{ 
              padding: 'var(--space-10) var(--space-6)', 
              background: 'var(--color-surface)', 
              borderRadius: 'var(--radius-2xl)', 
              border: '1px solid var(--color-border)',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(var(--text-4xl), 4vw, var(--text-5xl))', fontWeight: 500,
                color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)',
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ── FAQ Accordion ─────────────────────────────────────────── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)', padding: 'var(--space-8) 0' }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', textAlign: 'left' }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 400 }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.4, ease: easeLuxury }}>
          <ChevronDown size={24} color="var(--color-text-muted)" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeLuxury }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)',
              lineHeight: 1.6, paddingTop: 'var(--space-4)', margin: 0, maxWidth: 800
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    { q: 'How does the atomic reservation system work?', a: 'Upon selecting your VIP seats, our system invokes a MongoDB multi-document transaction to place a strict 10-minute hold. This guarantees 100% exclusivity during your checkout flow, eliminating any race conditions.' },
    { q: 'Is my data scoped securely?', a: 'Yes. Our platform architecture strictly scopes all data. Event organizers operate within isolated dashboards, ensuring that high-profile guest lists and sales analytics remain strictly confidential.' },
    { q: 'Can I transfer my premium reservations?', a: 'Premium reservations are securely tied to your identity to prevent scalping and maintain the exclusivity of the event. Transfer rules are set by individual luxury organizers.' },
  ];

  return (
    <section style={{ padding: 'var(--space-32) 0', background: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: 1000 }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={stagger} style={{ marginBottom: 'var(--space-16)' }}>
          <SectionLabel>Inquiries</SectionLabel>
          <SectionHeading>Technical & Platform Specifics.</SectionHeading>
        </motion.div>
        <div>
          {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
        </div>
      </div>
    </section>
  );
};

/* ── Enterprise Footer ─────────────────────────────────────── */
const Footer = () => (
  <footer className="hide-on-mobile" style={{
    background: 'var(--color-surface)',
    padding: 'var(--space-24) 0 var(--space-8)',
    borderTop: '1px solid var(--color-border)',
  }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-16)', marginBottom: 'var(--space-24)' }}>
        
        {/* Brand & Newsletter */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-lg)', background: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={20} color="#000" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--text-2xl)', color: 'var(--color-text-primary)' }}>Sort My Scene Assignment</span>
          </div>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)', maxWidth: 400, marginBottom: 'var(--space-8)' }}>
            The definitive platform for securing premium access to the world's most exclusive experiences.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: 400, flexWrap: 'wrap' }}>
            <input type="email" placeholder="Join the inner circle..." style={{ 
              flex: '1 1 200px', background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', 
              padding: 'var(--space-4) var(--space-6)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-primary)', fontSize: 'var(--text-base)', outline: 'none'
            }} />
            <Button style={{ borderRadius: 'var(--radius-full)', padding: '0 var(--space-6)', flex: '1 1 100%' }}>Subscribe</Button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>Platform</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {['Showcase', 'Organizers', 'Atomic Tech', 'Pricing'].map(l => (
              <li key={l}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', textDecoration: 'none' }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {['About Us', 'Careers', 'Press', 'Contact'].map(l => (
              <li key={l}><a href="#" style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)', textDecoration: 'none' }}>{l}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        paddingTop: 'var(--space-8)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)'
      }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
          © {new Date().getFullYear()} EventHub Technologies. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
           {[ExternalLink, MessageCircle, Mail].map((Icon, i) => (
            <a key={i} href="#" style={{ color: 'var(--color-text-muted)' }}>
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ── Page Assembly ─────────────────────────────────────────── */
const LandingPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ background: 'var(--color-bg)' }}>
      <Hero />
      <BentoGrid />
      <Timeline />
      <Stats />
      <FAQ />
      <Footer />
      <style>{`
        @media (max-width: 900px) {
          .bento-card { grid-column: span 12 !important; }
          .hero-title { font-size: clamp(2.5rem, 10vw, 4rem) !important; line-height: 1.1 !important; }
          .hide-on-mobile { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default LandingPage;
