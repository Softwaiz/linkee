import { useState, useEffect } from 'react';

interface Activity {
    id: number;
    user: string;
    action: string;
    time: string;
}

export const ActivityFeed = () => {
    const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
    const [count, setCount] = useState(5247);

    useEffect(() => {
        // Simulate new activities
        const activityInterval = setInterval(() => {
            const newActivity: Activity = {
                id: Date.now(),
                user: SAMPLE_USERS[Math.floor(Math.random() * SAMPLE_USERS.length)],
                action: SAMPLE_ACTIONS[Math.floor(Math.random() * SAMPLE_ACTIONS.length)],
                time: 'Just now'
            };

            setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
        }, 5000);

        // Increment counter
        const counterInterval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        }, 3000);

        return () => {
            clearInterval(activityInterval);
            clearInterval(counterInterval);
        };
    }, []);

    return (
        <section className="activity-feed section">
            <div className="container">
                <div className="feed-container glass-strong">
                    <div className="feed-header">
                        <h3 className="feed-title">
                            <span className="pulse-dot" />
                            Live Activity
                        </h3>
                        <div className="feed-stats">
                            <span className="stat-number gradient-text">{count.toLocaleString()}+</span>
                            <span className="stat-label">lists curated today</span>
                        </div>
                    </div>

                    <div className="feed-list">
                        {activities.map((activity, i) => (
                            <div
                                key={activity.id}
                                className="activity-item"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="activity-avatar">{activity.user[0]}</div>
                                <div className="activity-content">
                                    <span className="activity-user">{activity.user}</span>
                                    <span className="activity-action">{activity.action}</span>
                                </div>
                                <div className="activity-time">{activity.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .activity-feed {
          background: var(--color-bg-dark);
        }

        .feed-container {
          max-width: 800px;
          margin: 0 auto;
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid var(--glass-border);
        }

        .feed-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: var(--color-electric-blue);
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
          position: relative;
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 hsla(210, 100%, 56%, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px hsla(210, 100%, 56%, 0);
          }
          100% {
            box-shadow: 0 0 0 0 hsla(210, 100%, 56%, 0);
          }
        }

        .feed-stats {
          text-align: right;
        }

        .stat-number {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          display: block;
          line-height: 1;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .feed-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 0.875rem;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          animation: slide-in-left 0.5s ease-out;
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-electric-blue), var(--color-soft-pink));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 700;
          color: white;
          font-size: 1.125rem;
        }

        .activity-content {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .activity-user {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .activity-action {
          color: var(--color-text-secondary);
        }

        .activity-time {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .feed-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
          }

          .feed-stats {
            text-align: left;
          }
        }
      `}</style>
        </section>
    );
};

const INITIAL_ACTIVITIES: Activity[] = [
    { id: 1, user: 'Sarah M.', action: 'curated 50 AI research papers', time: '2m ago' },
    { id: 2, user: 'Miguel R.', action: 'organized 100 design resources', time: '5m ago' },
    { id: 3, user: 'Aisha K.', action: 'tagged 200 startup articles', time: '8m ago' },
    { id: 4, user: 'Chen L.', action: 'summarized 30 podcasts', time: '12m ago' },
    { id: 5, user: 'Priya S.', action: 'built a productivity toolkit', time: '15m ago' },
];

const SAMPLE_USERS = [
    'Alex T.', 'Jordan P.', 'Sam W.', 'Taylor M.', 'Morgan F.',
    'Casey B.', 'Riley D.', 'Avery H.', 'Quinn S.', 'Reese L.'
];

const SAMPLE_ACTIONS = [
    'curated 100 tech articles',
    'organized design inspiration',
    'built a learning library',
    'tagged marketing resources',
    'summarized industry reports',
    'created a podcast collection',
];
