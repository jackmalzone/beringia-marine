'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { FaCubes } from 'react-icons/fa';
import { useActiveSectionPaths } from './hooks/useActiveSectionPaths';
import { useClientNavScrollContext } from './hooks/useClientNavScrollContext';
import styles from './solutionSubNav.module.css';

export type SolutionNavItem = {
  path: string;
  hashId: string;
  label: ReactNode;
  is3d?: boolean;
};

type SolutionSubNavProps = {
  clientSlug: string;
  sectionRefs: Record<string, RefObject<HTMLElement | null>>;
  navItems: SolutionNavItem[];
};

export function SolutionSubNav({ clientSlug, sectionRefs, navItems }: SolutionSubNavProps) {
  const { navHidden } = useClientNavScrollContext();
  const orderedPaths = navItems.map((n) => n.path);
  const activePath = useActiveSectionPaths(sectionRefs, orderedPaths);

  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (navItems.length === 0) return null;

  const navClassName = [styles.nav, navHidden ? styles.navScrolled : ''].filter(Boolean).join(' ');

  return (
    <nav className={navClassName} aria-label="Solution sections" data-client-subnav>
      {navItems.map(({ path, hashId, label, is3d }) => {
        const href = `/solutions/${clientSlug}#${hashId}`;
        const displayLabel = is3d ? (
          windowWidth <= 1024 ? (
            <FaCubes aria-hidden />
          ) : (
            <>
              <FaCubes aria-hidden /> 3D Model
            </>
          )
        ) : (
          label
        );

        return (
          <a
            key={path}
            href={href}
            className={`${styles.link} ${activePath === path ? styles.linkActive : ''} ${
              is3d ? styles.link3d : ''
            }`}
            onClick={(e) => {
              if (activePath === path) {
                e.preventDefault();
                return;
              }
              e.preventDefault();
              const el = document.getElementById(hashId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', href);
              }
            }}
          >
            {displayLabel}
          </a>
        );
      })}
    </nav>
  );
}
