import { useState, useEffect } from 'react';
import { useScrollProgress } from '../hooks/useScrollAnimation';

interface StickyCTAProps {
    ctaText: string;
}

export const StickyCTA = ({ ctaText }: StickyCTAProps) => {
    const scrollProgress = useScrollProgress();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show CTA after user has scrolled 20% of the page
        setIsVisible(scrollProgress > 20);
    }, [scrollProgress]);

    return (
        <div className={`sticky-cta ${isVisible ? 'visible' : ''}`}>
            <div className="cta-container glass-strong">
                <div className="cta-content">
                    <div className="cta-text">
                        <div className="cta-heading">{ctaText}</div>
                        <div className="cta-subtext">No credit card required • Free forever</div>
                    </div>
                    <button className="cta-button">
                        Get Started
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4 10h12m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            <style>{`
        .sticky-cta {
          position: fixed;
          bottom: var(--space-md);
          left: 50%;
          transform: translateX(-50%) translateY(120%);
          z-index: 1000;
          max-width: 900px;
          width: calc(100% - 2rem);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sticky-cta.visible {
          transform: translateX(-50%) translateY(0);
        }

        .cta-container {
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.4),
            0 0 0 1px var(--glass-border);
        }

        .cta-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-md);
        }

        .cta-text {
          flex: 1;
        }

        .cta-heading {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .cta-subtext {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .cta-button {
          padding: 0.875rem 1.75rem;
          background: linear-gradient(135deg, var(--color-electric-blue), var(--color-vibrant-orange));
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-base);
          white-space: nowrap;
        }

        .cta-button:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-glow);
        }

        .cta-button:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .cta-content {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
          }

          .cta-button {
            justify-content: center;
            width: 100%;
          }

          .cta-heading {
            font-size: 1.125rem;
          }
        }
      `}</style>
        </div>
    );
};
