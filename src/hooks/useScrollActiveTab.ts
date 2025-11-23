import React, { useRef, useEffect } from 'react';

export function useScrollActiveTab<TSectionKey extends string>(
  sectionKeys: readonly TSectionKey[],
  hasItems: (key: TSectionKey) => boolean
): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  registerHeader: (key: TSectionKey) => (el: HTMLParagraphElement | null) => void;
  activeTab: TSectionKey;
  setActiveTab: React.Dispatch<React.SetStateAction<TSectionKey>>;
} {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const headerRefs = useRef<Record<TSectionKey, HTMLParagraphElement | null>>(
    {} as Record<TSectionKey, HTMLParagraphElement | null>
  );

  const [activeTab, setActiveTab] = React.useState<TSectionKey>(sectionKeys[0]);

  const registerHeader = React.useCallback(
    (key: TSectionKey): ((el: HTMLParagraphElement | null) => void) => {
      return (el: HTMLParagraphElement | null) => {
        if (!el) return;
        headerRefs.current[key] = el;
      };
    },
    []
  );

  useEffect((): void | (() => void) => {
    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const updateActiveTabByScroll = (): void => {
      const containerTop = container.getBoundingClientRect().top;

      let closestKey: TSectionKey | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const key of sectionKeys) {
        if (!hasItems(key)) continue;
        const header = headerRefs.current[key];
        if (!header) continue;
        const headerTop = header.getBoundingClientRect().top;
        const distance = Math.abs(headerTop - containerTop);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestKey = key;
        }
      }

      if (closestKey && closestKey !== activeTab) {
        setActiveTab(closestKey);
      }
    };

    const onScroll = (): void => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveTabByScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.requestAnimationFrame(() => {
      updateActiveTabByScroll();
    });

    return () => {
      container.removeEventListener('scroll', onScroll);
    };
  }, [activeTab, hasItems, sectionKeys]);

  return { containerRef, registerHeader, activeTab, setActiveTab };
}
