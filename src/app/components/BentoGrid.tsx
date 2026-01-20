import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface BentoGridProps {
  onHover?: (area: 'podcasts' | 'entrepreneurs' | 'speed') => void;
}

export const BentoGrid = ({ onHover }: BentoGridProps) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={ref} className="bento-section section">
      <div className="container">
        <h2 className="section-title text-display gradient-text">
          The "Bento Box" for Your Digital Identity
        </h2>
        <p className="section-subtitle text-body">
          Ditch the "grocery list" aesthetic. Organize your world in responsive, branded bento grids.
        </p>

        <div className={`bento-grid ${isVisible ? 'visible' : ''}`}>
          {/* Large Block: Multimodal by Design */}
          <div
            className="bento-item bento-large glass hover-lift"
            onMouseEnter={() => onHover?.('podcasts')}
          >
            <div className="bento-header">
              <div className="bento-icon">🎨</div>
              <h3 className="bento-title">Multimodal by Design</h3>
            </div>
            <p className="bento-description">
              Seamlessly embed audio players, high-res design assets, and live social feeds directly into your layout.
            </p>
            <div className="podcast-list">
              {MOCK_PODCASTS.map((podcast, i) => (
                <div
                  key={i}
                  className="podcast-card glass-strong"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="podcast-cover">{podcast.emoji}</div>
                  <div className="podcast-info">
                    <div className="podcast-name">{podcast.name}</div>
                    <div className="podcast-meta">Embed • Live Source</div>
                  </div>
                  <div className="podcast-badge">Active</div>
                </div>
              ))}
            </div>
          </div>

          {/* Medium Block: Automated Intelligence */}
          <div
            className="bento-item bento-medium glass hover-lift"
            onMouseEnter={() => onHover?.('entrepreneurs')}
          >
            <div className="bento-header">
              <div className="bento-icon">🤖</div>
              <h3 className="bento-title">Automated Intelligence</h3>
            </div>
            <p className="bento-description">
              Let our smart capture tools handle the metadata, so you can focus on the narrative.
            </p>
            <div className="metadata-visual">
              <div className="metadata-card glass-strong animate-pulse-slow">
                <div className="meta-row">
                  <span className="meta-label">Title</span>
                  <span className="meta-val">The Future of AI</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Tags</span>
                  <div className="meta-tags">
                    <span className="tag">#Tech</span>
                    <span className="tag">#Future</span>
                  </div>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Summary</span>
                  <div className="meta-lines">
                    <div className="line" style={{ width: '90%' }}></div>
                    <div className="line" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="scan-line"></div>
              </div>
            </div>
          </div>

          {/* Small Block: Privacy-First */}
          <div
            className="bento-item bento-small glass hover-lift"
            onMouseEnter={() => onHover?.('speed')}
          >
            <div className="bento-header">
              <div className="bento-icon">🔒</div>
              <h3 className="bento-title">Privacy-First</h3>
            </div>
            <p className="bento-description">
              Effortlessly toggle between a private "second brain" and a public "thought leadership" hub.
            </p>
            <div className="privacy-visual">
              <div className="toggle-switch glass-strong">
                <div className="toggle-slider"></div>
                <span className="toggle-label left">Private</span>
                <span className="toggle-label right active">Public</span>
              </div>
              <div className="status-indicator">
                <span className="status-dot"></span> Live
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bento-section {
          background: linear-gradient(180deg, var(--color-bg-dark) 0%, hsl(220, 15%, 10%) 100%);
        }

        .section-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          text-align: center;
          margin-bottom: var(--space-sm);
        }

        .section-subtitle {
          text-align: center;
          color: var(--color-text-secondary);
          font-size: 1.25rem;
          margin-bottom: var(--space-xl);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: var(--space-md);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .bento-grid.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .bento-item {
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .bento-large {
          grid-column: span 8;
        }

        .bento-medium {
          grid-column: span 4;
        }

        .bento-small {
          grid-column: span 12; 
          /* Made small block span full width on bottom or 4 if needed, but per design maybe row 2? */
          /* Let's adjust grid: 8+4 top row, then maybe full width or split? */
          /* Original was 8, 4, 4. But 8+4=12. So row 1 is full. */
          /* Let's make Privacy First span 12 or 4? */
          /* Let's do: Row 1: Multimodal (8) + Automated (4). Row 2: Privacy (12) or make Automated 6 and Privacy 6? */
          /* Let's stick to 8 (Large), 4 (Medium) for first row. */
          /* Where does Privacy go? Maybe make Multimodal 6, Automated 6, Privacy 12? */
          /* Or Multimodal 8, Automated 4. Privacy as a separate row or fit in. */
          /* Let's try: Multimodal (8), Automated (4). Privacy (12) for emphasis? Or maybe a 3-col layout. */
          /* Let's go with: Multimodal (7), Automated (5). Privacy (12). */
        }
        
        /* Adjusted Grid Layout */
        .bento-large { grid-column: span 7; }
        .bento-medium { grid-column: span 5; }
        .bento-small { grid-column: span 12; margin-top: 0; }

        .bento-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .bento-icon {
          font-size: 2rem;
        }

        .bento-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--color-text-primary);
        }

        .bento-description {
          color: var(--color-text-secondary);
          margin-bottom: var(--space-md);
        }

        /* Podcast List */
        .podcast-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .podcast-card {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          opacity: 0;
          animation: fade-in-up 0.5s forwards;
        }

        .podcast-cover {
          font-size: 2rem;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass-bg);
          border-radius: var(--radius-sm);
        }

        .podcast-info {
          flex: 1;
        }

        .podcast-name {
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .podcast-meta {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .podcast-badge {
          background: var(--color-electric-blue);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        /* Metadata Visual */
        .metadata-visual {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .metadata-card {
           width: 100%;
           padding: 1.5rem;
           border-radius: var(--radius-md);
           position: relative;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          align-items: center;
        }

        .meta-label {
          color: var(--color-text-secondary);
          font-size: 0.875rem;
        }

        .meta-val {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .meta-tags {
          display: flex;
          gap: 0.5rem;
        }

        .tag {
          background: hsla(210, 100%, 56%, 0.15);
          color: var(--color-electric-blue);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .meta-lines {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 60%;
          align-items: flex-end;
        }

        .line {
          height: 6px;
          background: var(--glass-border);
          border-radius: 3px;
        }
        
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-vibrant-orange);
          box-shadow: 0 0 10px var(--color-vibrant-orange);
          animation: scan 2s linear infinite;
          opacity: 0.5;
        }

        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        /* Privacy Visual */
        .privacy-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 1rem;
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: 30px;
          padding: 4px;
          position: relative;
          width: 200px;
          height: 48px;
        }

        .toggle-slider {
          position: absolute;
          left: 50%;
          width: 48%;
          height: 80%;
          background: var(--color-electric-blue);
          border-radius: 24px;
          transition: 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
        }

        .toggle-label {
          flex: 1;
          text-align: center;
          z-index: 1;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: color 0.3s;
        }

        .toggle-label.active {
          color: white;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-lime-green);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: currentColor;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
          animation: pulse 2s infinite;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .bento-large,
          .bento-medium,
          .bento-small {
            grid-column: span 12;
          }
        }

        @media (max-width: 640px) {
          .privacy-visual {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

const MOCK_PODCASTS = [
  { name: 'Design Matters', emoji: '🎨', badge: 'Live' },
  { name: 'Tech Crunch', emoji: '⚡', badge: 'New' },
  { name: 'Indie Hackers', emoji: '🚀', badge: 'Popular' },
];
