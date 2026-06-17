import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Shield, Zap, Clock, Users, BarChart3,
  ChevronDown, Star, ArrowRight, CheckCircle2,
  ExternalLink, MessageCircle, Mail,
} from 'lucide-react';
import Button from '../components/common/Button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Hero ──────────────────────────────────────────────────── */
const heroImages = [
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1540039155733-d6f1cba30c27?auto=format&fit=crop&w=800&q=80',
];

const Hero = () => {
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--space-20) 0',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-12)',
          alignItems: 'center',
        }} className="hero-grid">
          
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} custom={0} style={{ marginBottom: 'var(--space-6)' }}>
              <span className="badge badge-accent" style={{ fontSize: 'var(--text-xs)', padding: '6px 16px' }}>
                <Zap size={12} /> Live Party Experiences
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} style={{
              fontSize: 'clamp(var(--text-4xl), 5vw, var(--text-6xl))',
              fontWeight: 800,
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              marginBottom: 'var(--space-6)',
            }}>
              Book Your Next{' '}
              <span className="gradient-text">Unforgettable Event</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              maxWidth: 500,
              marginBottom: 'var(--space-8)',
              lineHeight: 'var(--leading-relaxed)',
            }}>
              Discover premium parties, concerts, and exclusive events. Reserve your seats in real-time before they sell out.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} style={{
              display: 'flex',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}>
              <Link to="/register">
                <Button size="lg" icon={<ArrowRight size={16} />}>Find Events</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">Sign In</Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'relative', height: 500, borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-2xl)' }}
            className="hero-image-container"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImg}
                src={heroImages[currentImg]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
                alt="Party Event"
              />
            </AnimatePresence>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(9,9,11,0.8) 0%, transparent 40%)',
              pointerEvents: 'none'
            }} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
          .hero-grid > div:first-child p { margin-left: auto; margin-right: auto; }
          .hero-grid > div:first-child > div:last-child { justify-content: center; }
          .hero-image-container { height: 350px !important; margin-top: var(--space-8); }
        }
      `}</style>
    </section>
  );
};

/* ── Features ──────────────────────────────────────────────── */
const features = [
  { icon: <Ticket size={22} />, title: 'Real-Time Booking', desc: 'See seat availability update live. No double bookings — ever.' },
  { icon: <Clock size={22} />, title: 'Timed Reservations', desc: '5-minute hold ensures fair access. Confirm or release automatically.' },
  { icon: <Shield size={22} />, title: 'Atomic Transactions', desc: 'MongoDB multi-doc transactions guarantee data consistency.' },
  { icon: <Users size={22} />, title: 'Concurrency Safe', desc: 'Built for thousands of simultaneous users without race conditions.' },
  { icon: <BarChart3 size={22} />, title: 'Admin Dashboard', desc: 'Full control with analytics, event management, and seat overrides.' },
  { icon: <Zap size={22} />, title: 'Blazing Fast', desc: 'Optimized queries with indexed lookups and lean API responses.' },
];

const Features = () => (
  <section style={{ padding: 'var(--space-20) 0' }}>
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
      >
        <motion.p variants={fadeUp} className="text-accent font-semibold text-sm" style={{ marginBottom: 'var(--space-2)' }}>
          Features
        </motion.p>
        <motion.h2 variants={fadeUp} style={{
          fontSize: 'var(--text-4xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)',
          marginBottom: 'var(--space-4)',
        }}>
          Everything you need
        </motion.h2>
        <motion.p variants={fadeUp} className="text-secondary" style={{ maxWidth: 500, margin: '0 auto' }}>
          A production-grade booking system built with correctness, performance, and developer experience in mind.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={stagger}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            className="card"
            style={{ cursor: 'default' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-lg)',
              background: 'var(--color-accent-light)', color: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 'var(--space-4)',
            }}>
              {f.icon}
            </div>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{f.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', margin: 0 }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ── How It Works ──────────────────────────────────────────── */
const steps = [
  { step: '01', title: 'Browse Events', desc: 'Explore upcoming events with real-time availability.' },
  { step: '02', title: 'Select Seats', desc: 'Pick your preferred seats from the interactive seat map.' },
  { step: '03', title: 'Confirm Booking', desc: 'Confirm within the countdown timer to lock in your seats.' },
];

const HowItWorks = () => (
  <section style={{ padding: 'var(--space-20) 0', background: 'var(--color-surface)' }}>
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
      >
        <motion.p variants={fadeUp} className="text-accent font-semibold text-sm" style={{ marginBottom: 'var(--space-2)' }}>
          How It Works
        </motion.p>
        <motion.h2 variants={fadeUp} style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)' }}>
          Three simple steps
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {steps.map((s, i) => (
          <motion.div key={i} variants={fadeUp} custom={i} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <div style={{
              fontSize: 'var(--text-5xl)', fontWeight: 800, lineHeight: 1,
              background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 'var(--space-4)',
            }}>
              {s.step}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>{s.title}</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', margin: 0 }}>{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ── Stats ─────────────────────────────────────────────────── */
const stats = [
  { value: '10K+', label: 'Seats Booked' },
  { value: '500+', label: 'Events Hosted' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<200ms', label: 'Avg. Response' },
];

const Stats = () => (
  <section style={{ padding: 'var(--space-16) 0' }}>
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            style={{ textAlign: 'center', padding: 'var(--space-6)' }}
          >
            <div style={{
              fontSize: 'var(--text-4xl)', fontWeight: 800,
              background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 'var(--space-1)',
            }}>
              {s.value}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ── Testimonials ──────────────────────────────────────────── */
const testimonials = [
  { name: 'Sarah Chen', role: 'Event Manager', text: 'The real-time seat map is a game-changer. Our booking conflicts dropped to zero.', rating: 5 },
  { name: 'Marcus Johnson', role: 'Tech Lead', text: 'Atomic transactions and proper concurrency handling — exactly what we needed.', rating: 5 },
  { name: 'Priya Patel', role: 'Product Designer', text: 'Beautiful UI with buttery smooth animations. Our attendees love the experience.', rating: 5 },
];

const Testimonials = () => (
  <section style={{ padding: 'var(--space-20) 0', background: 'var(--color-surface)' }}>
    <div className="container">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
      >
        <motion.p variants={fadeUp} className="text-accent font-semibold text-sm" style={{ marginBottom: 'var(--space-2)' }}>
          Testimonials
        </motion.p>
        <motion.h2 variants={fadeUp} style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)' }}>
          Loved by teams everywhere
        </motion.h2>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {testimonials.map((t, i) => (
          <motion.div key={i} variants={fadeUp} custom={i} className="card-elevated">
            <div style={{ display: 'flex', gap: 2, marginBottom: 'var(--space-3)' }}>
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} fill="var(--color-warning)" color="var(--color-warning)" />
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)', marginBottom: 'var(--space-4)' }}>
              "{t.text}"
            </p>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{t.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t.role}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

/* ── FAQ ───────────────────────────────────────────────────── */
const faqs = [
  { q: 'How does seat reservation work?', a: 'When you select seats, they are temporarily held for 5 minutes using an atomic transaction. During this window, no other user can book those seats. If you don\'t confirm, the hold is released automatically.' },
  { q: 'Is my booking guaranteed?', a: 'Yes. We use MongoDB multi-document transactions to ensure atomic operations. Once confirmed, your booking is permanent and consistent.' },
  { q: 'Can I select multiple seats?', a: 'Absolutely. You can select up to 10 seats per reservation, perfect for group bookings.' },
  { q: 'What happens if two users try to book the same seat?', a: 'Our system uses optimistic concurrency control. The first user to commit the transaction wins, and the second user is notified to pick different seats.' },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(!open)}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: 'var(--space-5) 0',
      }}>
        <span style={{ fontWeight: 500, fontSize: 'var(--text-base)' }}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} color="var(--color-text-muted)" />
        </motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
              lineHeight: 'var(--leading-relaxed)', paddingBottom: 'var(--space-5)', margin: 0,
            }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const FAQ = () => (
  <section style={{ padding: 'var(--space-20) 0' }}>
    <div className="container" style={{ maxWidth: 700 }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
        style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
      >
        <motion.p variants={fadeUp} className="text-accent font-semibold text-sm" style={{ marginBottom: 'var(--space-2)' }}>
          FAQ
        </motion.p>
        <motion.h2 variants={fadeUp} style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)' }}>
          Common questions
        </motion.h2>
      </motion.div>

      {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
    </div>
  </section>
);

/* ── Footer ────────────────────────────────────────────────── */
const Footer = () => (
  <footer style={{
    borderTop: '1px solid var(--color-border)',
    padding: 'var(--space-12) 0 var(--space-8)',
  }}>
    <div className="container">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 'var(--space-4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Ticket size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>EventHub</span>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          {[ExternalLink, MessageCircle, Mail].map((Icon, i) => (
            <a
              key={i}
              href="#"
              style={{
                color: 'var(--color-text-muted)',
                transition: 'color var(--duration-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 'var(--space-8)',
        paddingTop: 'var(--space-6)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 'var(--space-4)',
      }}>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
          © {new Date().getFullYear()} EventHub. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          {['Privacy', 'Terms', 'Support'].map((link) => (
            <a key={link} href="#" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{link}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ── Page ──────────────────────────────────────────────────── */
const LandingPage = () => (
  <div>
    <Hero />
    <Features />
    <HowItWorks />
    <Stats />
    <Testimonials />
    <FAQ />
    <Footer />
  </div>
);

export default LandingPage;
