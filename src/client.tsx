import { initClient, initClientNavigation } from "rwsdk/client";
import posthog from 'posthog-js';

if (window.location.hostname !== 'localhost') {
  posthog.init(window.posthogApiKey, {
    api_host: window.posthogApiHost,
    defaults: '2025-11-30',
    __add_tracing_headers: [window.location.host, 'localhost'],
  });
}

const { handleResponse, onHydrated } = initClientNavigation();

initClient({ handleResponse, onHydrated });