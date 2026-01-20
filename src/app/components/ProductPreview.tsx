import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ProductPreviewProps {
    onHover?: (area: 'agent') => void;
}

export const ProductPreview = ({ onHover }: ProductPreviewProps) => {
    const [ref, isVisible] = useScrollAnimation({ threshold: 0.2 });

    return (
        <section
            ref={ref}
            className="product-preview section"
            onMouseEnter={() => onHover?.('agent')}
        >
            <div className="container">
                <h2 className="section-title text-display">
                    Watch the <span className="gradient-text">Agent</span> Work
                </h2>
                <p className="section-subtitle text-body">
                    Autonomous curation that never sleeps
                </p>

                <div className={`demo-container ${isVisible ? 'visible' : ''}`}>
                    <div className="demo-screen glass-strong">
                        <div className="demo-header">
                            <div className="demo-tabs">
                                <div className="tab active">Agent Mode</div>
                                <div className="tab">Manual</div>
                            </div>
                        </div>

                        <div className="demo-content">
                            <div className="task-list">
                                {AGENT_TASKS.map((task, i) => (
                                    <div
                                        key={i}
                                        className={`task-item ${isVisible ? 'animate' : ''}`}
                                        style={{ animationDelay: `${i * 0.2}s` }}
                                    >
                                        <div className="task-icon">{task.icon}</div>
                                        <div className="task-details">
                                            <div className="task-name">{task.name}</div>
                                            <div className="task-status">{task.status}</div>
                                        </div>
                                        <div className={`task-badge ${task.badgeType}`}>
                                            {task.badge}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="curated-output">
                                <div className="output-header">
                                    <span className="output-label">Live Output</span>
                                    <span className="output-count">147 items curated</span>
                                </div>
                                <div className="output-grid">
                                    {CURATED_ITEMS.map((item, i) => (
                                        <div
                                            key={i}
                                            className={`output-card glass ${isVisible ? 'slide-in' : ''}`}
                                            style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                                        >
                                            <div className="output-thumb">{item.thumb}</div>
                                            <div className="output-title">{item.title}</div>
                                            <div className="output-tags">
                                                {item.tags.map((tag, j) => (
                                                    <span key={j} className="tag">{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .product-preview {
          background: var(--color-bg-dark);
          position: relative;
          overflow: hidden;
        }

        .product-preview::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, hsla(280, 85%, 65%, 0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .demo-container {
          max-width: 1200px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .demo-container.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .demo-screen {
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .demo-header {
          background: hsla(0, 0%, 100%, 0.03);
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .demo-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .tab {
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .tab.active {
          background: var(--color-electric-blue);
          color: white;
        }

        .demo-content {
          padding: var(--space-lg);
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--space-lg);
        }

        /* Task List */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .task-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 1rem;
          background: var(--glass-bg);
          border-radius: var(--radius-md);
          border: 1px solid var(--glass-border);
          opacity: 0;
          transform: translateX(-20px);
        }

        .task-item.animate {
          animation: slide-in-right 0.5s forwards;
        }

        @keyframes slide-in-right {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .task-icon {
          font-size: 1.5rem;
        }

        .task-details {
          flex: 1;
        }

        .task-name {
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .task-status {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .task-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .task-badge.success {
          background: hsla(120, 50%, 50%, 0.2);
          color: hsl(120, 50%, 70%);
        }

        .task-badge.active {
          background: hsla(210, 100%, 56%, 0.2);
          color: var(--color-electric-blue);
          animation: pulse 2s infinite;
        }

        /* Curated Output */
        .curated-output {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          padding: var(--space-md);
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
        }

        .output-label {
          font-family: var(--font-display);
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .output-count {
          font-size: 0.875rem;
          color: var(--color-electric-blue);
          font-weight: 600;
        }

        .output-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .output-card {
          padding: 1rem;
          border-radius: var(--radius-sm);
          opacity: 0;
          transform: translateY(20px);
        }

        .output-card.slide-in {
          animation: fade-in-up 0.5s forwards;
        }

        .output-thumb {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .output-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .output-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .tag {
          background: var(--glass-bg);
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          color: var(--color-text-secondary);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .demo-content {
            grid-template-columns: 1fr;
          }

          .output-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .output-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </section>
    );
};

const AGENT_TASKS = [
    {
        icon: '🔍',
        name: 'Finding broken links',
        status: 'Checked 1,247 URLs',
        badge: 'Done',
        badgeType: 'success'
    },
    {
        icon: '🏷️',
        name: 'Auto-tagging resources',
        status: 'Processing...',
        badge: 'Active',
        badgeType: 'active'
    },
    {
        icon: '📝',
        name: 'Summarizing articles',
        status: 'Queue: 34 items',
        badge: 'Done',
        badgeType: 'success'
    },
];

const CURATED_ITEMS = [
    { thumb: '📱', title: 'Mobile Design Patterns', tags: ['Design', 'UI'] },
    { thumb: '🎨', title: 'Color Theory Guide', tags: ['Design', 'Theory'] },
    { thumb: '⚡', title: 'Performance Tips', tags: ['Dev', 'Speed'] },
    { thumb: '🔒', title: 'Security Best Practices', tags: ['Dev', 'Security'] },
    { thumb: '🎯', title: 'UX Research Methods', tags: ['UX', 'Research'] },
    { thumb: '💡', title: 'Innovation Frameworks', tags: ['Strategy', 'Ideas'] },
];
