import type { PostHog } from '@posthog/types'

declare global {
    interface Window {
       posthogApiKey: string;
       posthogApiHost: string;
    }
}

export {}