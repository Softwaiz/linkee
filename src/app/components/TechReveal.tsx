import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useState, useEffect } from 'react';

interface TechRevealProps {
  onHover?: (area: 'tech') => void;
}

export const TechReveal = ({ onHover }: TechRevealProps) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.3 });
  const [linkeeTime, setLinkeeTime] = useState(0);
  const [competitorTime, setCompetitorTime] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Animate counter for Linkee
      let start = 0;
      const linkeeEnd = 342;
      const linkeeIncrement = linkeeEnd / 30;

      const linkeeInterval = setInterval(() => {
        start += linkeeIncrement;
        if (start >= linkeeEnd) {
          setLinkeeTime(linkeeEnd);
          clearInterval(linkeeInterval);
        } else {
          setLinkeeTime(Math.floor(start));
        }
      }, 30);

      // Animate counter for competitor
      let compStart = 0;
      const compEnd = 4200;
      const compIncrement = compEnd / 30;

      const compInterval = setInterval(() => {
        compStart += compIncrement;
        if (compStart >= compEnd) {
          setCompetitorTime(compEnd);
          clearInterval(compInterval);
        } else {
          setCompetitorTime(Math.floor(compStart));
        }
      }, 30);

      return () => {
        clearInterval(linkeeInterval);
        clearInterval(compInterval);
      };
    }
  }, [isVisible]);

  return (
    <section
      ref={ref}
      className="tech-reveal section"
      onMouseEnter={() => onHover?.('tech')}
    >
      <div className="container">
        <h2 className="section-title text-display">
          Curation at the <span className="gradient-text">Speed of Thought</span>
        </h2>
        <p className="section-subtitle text-body">
          Performance is the foundation of engagement. Built on the RedwoodSDK and Cloudflare Workers,
          Linkee delivers sub-second page loads globally.
        </p>

        <div className={`tech-grid ${isVisible ? 'visible' : ''}`}>
          {/* Performance Counter */}
          <div className="tech-card glass-strong performance-card">
            <h3 className="card-title">Real-Time Speed Test</h3>
            <div className="speed-comparison">
              <div className="comparison-item linkee">
                <div className="logo-circle">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="url(#linkee-gradient)" />
                    <path d="M15 20l5 5 10-10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="linkee-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-electric-blue)" />
                        <stop offset="100%" stopColor="var(--color-vibrant-orange)" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="comparison-name">Linkee</div>
                <div className="comparison-time gradient-text">
                  {linkeeTime}ms
                </div>
                <div className="comparison-label">Cloudflare Edge</div>
              </div>

              <div className="vs-divider">vs</div>

              <div className="comparison-item competitor">
                <div className="logo-circle gray">
                  <svg width="40" height="40" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="18" fill="#555" />
                    <path d="M15 15l10 10m0-10l-10 10" stroke="#999" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="comparison-name">Others</div>
                <div className="comparison-time slow">
                  {competitorTime}ms
                </div>
                <div className="comparison-label">Traditional Servers</div>
              </div>
            </div>
          </div>

          {/* Tech Stack Icons */}
          {TECH_STACK.map((tech, i) => (
            <div
              key={i}
              className={`tech-card glass hover-lift ${isVisible ? 'fade-in' : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="tech-icon-wrapper">
                <div className="tech-icon">{tech.icon}</div>
              </div>
              <h4 className="tech-name">{tech.name}</h4>
              <p className="tech-description">{tech.description}</p>
              <div className="tech-benefit">{tech.benefit}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tech-reveal {
          background: linear-gradient(180deg, hsl(220, 15%, 10%) 0%, var(--color-bg-dark) 100%);
        }

        .tech-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-md);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tech-grid.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .tech-card {
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          text-align: center;
          position: relative;
          opacity: 0;
        }

        .tech-card.fade-in {
          animation: fade-in-scale 0.6s forwards;
        }

        .performance-card {
          grid-column: 1 / -1;
          opacity: 1 !important;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          margin-bottom: var(--space-lg);
          color: var(--color-text-primary);
        }

        /* Speed Comparison */
        .speed-comparison {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xl);
        }

        .comparison-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }

        .logo-circle {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: var(--space-sm);
        }

        .logo-circle.gray {
          opacity: 0.5;
        }

        .comparison-name {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .comparison-time {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 800;
          line-height: 1;
        }

        .comparison-time.slow {
          color: var(--color-text-secondary);
          text-decoration: line-through;
        }

        .comparison-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .vs-divider {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--color-text-secondary);
        }

        /* Tech Stack Cards */
        .tech-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto var(--space-md);
          background: var(--glass-bg);
          border: 2px solid var(--glass-border);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-base);
        }

        .tech-card:hover .tech-icon-wrapper {
          border-color: var(--color-electric-blue);
          box-shadow: 0 0 20px hsla(210, 100%, 56%, 0.3);
          transform: scale(1.05);
        }

        .tech-icon {
          font-size: 2.5rem;
        }

        .tech-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--space-sm);
        }

        .tech-description {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
          margin-bottom: var(--space-sm);
        }

        .tech-benefit {
          display: inline-block;
          background: hsla(210, 100%, 56%, 0.15);
          color: var(--color-electric-blue);
          padding: 0.375rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .speed-comparison {
            flex-direction: column;
            gap: var(--space-lg);
          }

          .vs-divider {
            transform: rotate(90deg);
          }

          .comparison-time {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
};

const TECH_STACK = [
  {
    icon: '⚡',
    name: 'Cloudflare Workers',
    description: 'Run code at the edge, closer to your users',
    benefit: 'Global Edge Network'
  },
  {
    icon: '⚛️',
    name: 'React Server Components',
    description: 'Zero-bundle server rendering for instant loads',
    benefit: 'Zero Client JS'
  },
  {
    icon: '🌲',
    name: 'RedwoodSDK',
    description: 'Modern fullstack framework built for speed',
    benefit: 'Sub-2s LCP'
  },
  {
    icon: '💾',
    name: 'Cloudflare D1',
    description: 'Serverless SQL at the edge with zero latency',
    benefit: 'Edge Database'
  },
];
