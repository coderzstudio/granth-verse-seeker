
import { useEffect, useRef, useState } from 'react';

interface UseViewportTrackingProps {
  threshold?: number;
  debounceMs?: number;
}

export const useViewportTracking = ({ 
  threshold = 0.5, 
  debounceMs = 300 
}: UseViewportTrackingProps = {}) => {
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const elementsRef = useRef<Map<Element, string>>(new Map());

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Clear existing timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Debounce the visibility updates
        debounceTimeoutRef.current = setTimeout(() => {
          const currentVisible: string[] = [];
          
          entries.forEach((entry) => {
            const id = elementsRef.current.get(entry.target);
            if (id && entry.isIntersecting && entry.intersectionRatio >= threshold) {
              currentVisible.push(id);
            }
          });

          setVisibleItems(prev => {
            // Only update if there's a change
            const newVisible = [...new Set([...prev.filter(id => 
              !entries.some(entry => elementsRef.current.get(entry.target) === id)
            ), ...currentVisible])];
            
            return JSON.stringify(newVisible) !== JSON.stringify(prev) ? newVisible : prev;
          });
        }, debounceMs);
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [threshold, debounceMs]);

  const trackElement = (element: Element, id: string) => {
    if (!observerRef.current) return;

    elementsRef.current.set(element, id);
    observerRef.current.observe(element);
  };

  const untrackElement = (element: Element) => {
    if (!observerRef.current) return;

    elementsRef.current.delete(element);
    observerRef.current.unobserve(element);
  };

  return {
    visibleItems,
    trackElement,
    untrackElement
  };
};
