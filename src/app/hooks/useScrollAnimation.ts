import { useEffect, useState, useRef, RefObject } from 'react';

interface ScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useScrollAnimation = (
    options: ScrollAnimationOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] => {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, isVisible];
};

export const useScrollProgress = (): number => {
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        let ticking = false;

        const updateScrollProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / scrollHeight) * 100;
            setScrollProgress(Math.min(progress, 100));
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        updateScrollProgress();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return scrollProgress;
};

export const useKineticScroll = (): number => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let ticking = false;

        const updateRotation = () => {
            const maxRotation = 2; // degrees
            const scrollY = window.scrollY;
            const rotation = Math.sin(scrollY / 100) * maxRotation;
            setRotation(rotation);
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateRotation);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return rotation;
};
