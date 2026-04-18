"use client";

import { useState, useEffect, useCallback } from 'react';

export type FeatureArea =
    | 'hero'
    | 'multimodal'
    | 'intelligence'
    | 'privacy'
    | 'speed'
    | 'monetization';

const CTA_MAP: Record<FeatureArea, string> = {
    hero: 'Start Curating Today',
    multimodal: 'Design Your Studio',
    intelligence: 'Automate Your Flow',
    privacy: 'Claim Your Space',
    speed: 'Build on the Edge',
    monetization: 'Start Earning Now',
};

export const useHoverTracking = () => {
    const [lastHovered, setLastHovered] = useState<FeatureArea | null>(null);
    const [ctaText, setCtaText] = useState('Start Curating Today — It’s Free');

    const trackHover = useCallback((area: FeatureArea) => {
        setLastHovered(area);
    }, []);

    useEffect(() => {
        if (lastHovered && lastHovered in CTA_MAP) {
            const timer = setTimeout(() => {
                setCtaText(CTA_MAP[lastHovered]);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setCtaText('Start Curating Today — It’s Free');
        }
    }, [lastHovered]);

    return [{ lastHovered, ctaText }, trackHover] as const;
};
