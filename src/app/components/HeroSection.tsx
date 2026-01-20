import { useState, useEffect } from 'react';
import { useKineticScroll } from '../hooks/useScrollAnimation';

export const HeroSection = () => {
    const rotation = useKineticScroll();

    return (
        <section className="hero-section section">
            <div className="hero-background" />

            <div className="container">
                <div className="hero-content">
                    <h1
                        className="hero-headline text-display gradient-text"
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: 'transform 0.1s linear'
                        }}
                    >
                        Curation with Soul,<br />
                        Speed, and an Edge
                    </h1>

                    <p className="hero-subtitle text-body">
                        Linkee is the AI-powered curation agent that organizes the internet
                        with sub-second speed and creative intelligence.
                    </p>

                    <div className="hero-ctas">
                        <button className="cta-primary glass-strong hover-lift">
                            Start Curating Free
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="cta-secondary glass hover-lift">
                            Watch Demo
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M6.5 5.5l8 4.5-8 4.5V5.5z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="hero-visual">
                    <AgentTerminalPreview />
                </div>
            </div>

            <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 50%, hsla(210, 100%, 56%, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 30%, hsla(330, 85%, 68%, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 60% 70%, hsla(25, 95%, 58%, 0.1) 0%, transparent 50%);
          animation: breathe 8s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .hero-content {
          max-width: 800px;
          margin-bottom: var(--space-xl);
        }

        .hero-headline {
          font-size: clamp(2.5rem, 8vw, 5rem);
          line-height: 1.1;
          margin-bottom: var(--space-md);
          transform-origin: center left;
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-lg);
          max-width: 600px;
        }

        .hero-ctas {
          display: flex;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .cta-primary, .cta-secondary {
          padding: 1rem 2rem;
          border-radius: var(--radius-md);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1.125rem;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-base);
        }

        .cta-primary {
          background: linear-gradient(135deg, var(--color-electric-blue), var(--color-vibrant-orange));
          color: white;
        }

        .cta-primary:hover {
          box-shadow: var(--shadow-glow);
          transform: translateY(-2px) scale(1.02);
        }

        .cta-secondary {
          color: var(--color-text-primary);
        }

        .hero-visual {
          margin-top: var(--space-2xl);
        }

        @media (max-width: 768px) {
          .hero-headline {
            font-size: 2.5rem;
          }
          
          .hero-ctas {
            flex-direction: column;
          }

          .cta-primary, .cta-secondary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </section>
    );
};

const AgentTerminalPreview = () => {
    const [text, setText] = useState('');
    const [showResults, setShowResults] = useState(false);
    const fullText = 'Find me 50 podcasts about space exploration';

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < fullText.length) {
                setText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(interval);
                setTimeout(() => setShowResults(true), 500);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="agent-terminal glass-strong">
            <div className="terminal-header">
                <div className="terminal-dots">
                    <span className="dot dot-red" />
                    <span className="dot dot-yellow" />
                    <span className="dot dot-green" />
                </div>
                <span className="terminal-title">Linkee Agent</span>
            </div>

            <div className="terminal-body">
                <div className="terminal-input">
                    <span className="prompt">$</span>
                    <span className="input-text">{text}</span>
                    <span className="cursor">▊</span>
                </div>

                {showResults && (
                    <div className="terminal-results animate-fade-in-up">
                        <div className="result-line">
                            <span className="result-icon">✓</span>
                            <span>Analyzing 10,000+ podcast sources...</span>
                        </div>
                        <div className="result-line">
                            <span className="result-icon">✓</span>
                            <span>Filtering by relevance and quality...</span>
                        </div>
                        <div className="result-line">
                            <span className="result-icon">⚡</span>
                            <span className="highlight">Found 50 podcasts in 0.3s</span>
                        </div>

                        <div className="mini-bento">
                            <div className="mini-card glass animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
                                <div className="card-emoji">🎙️</div>
                                <div className="card-title">Space Talks Daily</div>
                            </div>
                            <div className="mini-card glass animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
                                <div className="card-emoji">🚀</div>
                                <div className="card-title">Rocket Science</div>
                            </div>
                            <div className="mini-card glass animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
                                <div className="card-emoji">🌌</div>
                                <div className="card-title">Cosmos Explorer</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .agent-terminal {
          border-radius: var(--radius-lg);
          overflow: hidden;
          max-width: 700px;
          margin: 0 auto;
        }

        .terminal-header {
          background: hsla(0, 0%, 100%, 0.05);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .terminal-dots {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-red { background: hsl(0, 70%, 60%); }
        .dot-yellow { background: hsl(45, 90%, 60%); }
        .dot-green { background: hsl(120, 50%, 50%); }

        .terminal-title {
          font-family: var(--font-display);
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .terminal-body {
          padding: 1.5rem;
          font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
          font-size: 0.9rem;
          min-height: 200px;
        }

        .terminal-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .prompt {
          color: var(--color-electric-blue);
          font-weight: bold;
        }

        .input-text {
          color: var(--color-text-primary);
        }

        .cursor {
          animation: blink 1s infinite;
          color: var(--color-vibrant-orange);
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .terminal-results {
          opacity: 0;
        }

        .result-line {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: var(--color-text-secondary);
        }

        .result-icon {
          font-size: 0.875rem;
        }

        .highlight {
          color: var(--color-soft-pink);
          font-weight: 600;
        }

        .mini-bento {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .mini-card {
          padding: 1rem;
          border-radius: var(--radius-sm);
          text-align: center;
          opacity: 0;
        }

        .card-emoji {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-size: 0.75rem;
          font-family: var(--font-primary);
          color: var(--color-text-primary);
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .mini-bento {
            grid-template-columns: 1fr;
          }

          .terminal-body {
            font-size: 0.8rem;
          }
        }
      `}</style>
        </div>
    );
};
