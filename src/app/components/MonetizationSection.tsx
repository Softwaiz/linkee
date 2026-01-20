import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MonetizationProps {
  onHover?: (area: 'monetization') => void;
}

export const MonetizationSection = ({ onHover }: MonetizationProps) => {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className="monetization-section section"
      onMouseEnter={() => onHover?.('monetization')}
    >
      <div className="container">
        <div className={`content-wrapper ${isVisible ? 'visible' : ''}`}>
          <div className="text-col">
            <h2 className="section-title text-display">
              Keep the <span className="gradient-text">Lion's Share</span>
            </h2>
            <p className="section-subtitle text-body">
              Most platforms act as middlemen, taking the majority of your value.
              We believe your taste is a professional asset that deserves a fair return.
            </p>

            <ul className="benefit-list">
              <li className="benefit-item">
                <div className="benefit-icon glass">🦁</div>
                <div className="benefit-content">
                  <h3 className="benefit-title">65% Creator Payout</h3>
                  <p className="benefit-desc">We distribute the majority of ad revenue directly to you.</p>
                </div>
              </li>
              <li className="benefit-item">
                <div className="benefit-icon glass">🤝</div>
                <div className="benefit-content">
                  <h3 className="benefit-title">Trust over Algorithms</h3>
                  <p className="benefit-desc">
                    Monetize your expertise and build a lasting brand legacy without the noise of corporate-first advertising.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="visual-col">
            <div className="payout-card glass-strong hover-lift">
              <div className="card-header">
                <span className="card-label">Your Estimated Revenue</span>
              </div>
              <div className="card-amount gradient-text">$4,250.00</div>
              <div className="card-graph">
                <div className="graph-bar" style={{ height: '40%' }}></div>
                <div className="graph-bar" style={{ height: '60%' }}></div>
                <div className="graph-bar" style={{ height: '35%' }}></div>
                <div className="graph-bar" style={{ height: '75%' }}></div>
                <div className="graph-bar active" style={{ height: '90%' }}></div>
              </div>
              <div className="card-footer">
                <div className="footer-stat">
                  <span className="stat-label">Views</span>
                  <span className="stat-val">125K</span>
                </div>
                <div className="footer-stat">
                  <span className="stat-label">Payout</span>
                  <span className="stat-val highlight">65%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .monetization-section {
          background: linear-gradient(180deg, hsl(220, 15%, 10%) 0%, var(--color-bg-dark) 100%);
        }

        .content-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-2xl);
          align-items: center;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .content-wrapper.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: var(--space-md);
        }

        .section-subtitle {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-xl);
          max-width: 500px;
        }

        .benefit-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .benefit-item {
          display: flex;
          gap: var(--space-md);
        }

        .benefit-icon {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .benefit-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          color: var(--color-text-primary);
        }

        .benefit-desc {
          color: var(--color-text-secondary);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .visual-col {
          display: flex;
          justify-content: center;
        }

        .payout-card {
          width: 100%;
          max-width: 400px;
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
        }

        .card-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .card-amount {
          font-family: var(--font-display);
          font-size: 3.5rem;
          font-weight: 800;
          margin: var(--space-xs) 0 var(--space-lg);
        }

        .card-graph {
          display: flex;
          gap: 12px;
          height: 100px;
          align-items: flex-end;
          margin-bottom: var(--space-lg);
        }

        .graph-bar {
          flex: 1;
          background: var(--glass-border);
          border-radius: 4px;
          transition: height 1s ease;
        }

        .graph-bar.active {
          background: linear-gradient(180deg, var(--color-vibrant-orange), var(--color-electric-blue));
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          padding-top: var(--space-md);
          border-top: 1px solid var(--glass-border);
        }

        .footer-stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.25rem;
        }

        .stat-val {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .stat-val.highlight {
          color: var(--color-lime-green);
        }

        @media (max-width: 1024px) {
          .content-wrapper {
            grid-template-columns: 1fr;
            gap: var(--space-xl);
          }

          .visual-col {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
};
