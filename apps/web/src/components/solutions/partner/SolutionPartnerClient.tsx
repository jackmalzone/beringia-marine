'use client';

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import type { PartnerJson } from '@/lib/content/partner-content';
import { resolveAssetUrl } from '@/lib/content/partner-content';
import { DemoSection } from './DemoSection';
import { InteractiveSection } from './InteractiveSection';
import { MediaGallerySection, type GalleryRenderable } from './MediaGallerySection';
import { MediaLinksSection } from './MediaLinksSection';
import { OverviewSection } from './OverviewSection';
import { SellingPointsSection, type SellingPoint } from './SellingPointsSection';
import { UseCasesSection, type UseCaseItem } from './UseCasesSection';
import { ValuePropositionSection } from './ValuePropositionSection';
import { useSolutionScrollToSection } from './hooks/useSolutionScrollToSection';
import { SolutionSubNav, type SolutionNavItem } from './SolutionSubNav';
import { isValidSketchfabModelId } from '@/lib/media/sketchfab';
import { solutionClientPath } from './solutionClientRoutes';
import shellStyles from './shell.module.css';

function extractSellingPoints(partner: PartnerJson): { title: string; points: SellingPoint[] } | null {
  const sp = 'sellingPoints' in partner ? partner.sellingPoints : null;
  if (!sp?.points?.length) return null;
  return {
    title: sp.title,
    points: sp.points.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      features: p.features || [],
      icon: typeof p.icon === 'string' ? p.icon : undefined,
      link: p.link,
      documentation: p.documentation as SellingPoint['documentation'],
    })),
  };
}

function mapUseCases(partner: PartnerJson): { title: string; description?: string; cases: UseCaseItem[] } | null {
  const uc = 'useCases' in partner ? partner.useCases : null;
  if (!uc?.cases?.length) return null;
  return {
    title: uc.title,
    description: uc.description,
    cases: uc.cases.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      keyPoints: c.keyPoints || [],
    })),
  };
}

function buildGalleryItems(partner: PartnerJson): GalleryRenderable[] {
  const gallery = 'gallery' in partner && Array.isArray(partner.gallery) ? partner.gallery : [];
  const out: GalleryRenderable[] = [];
  for (const item of gallery) {
    if (item.type === 'image' && 'bundledAsset' in item) {
      const url = resolveAssetUrl(item.bundledAsset as string);
      if (url) {
        out.push({ id: item.id, type: 'image', url, alt: item.alt || '' });
      }
    }
    if (item.type === 'sketchfab' && item.modelId && isValidSketchfabModelId(item.modelId)) {
      out.push({
        id: item.id,
        type: 'sketchfab',
        modelId: item.modelId.trim(),
        alt: item.alt || '',
      });
    }
  }
  return out;
}

export function SolutionPartnerClient({ partner }: { partner: PartnerJson }) {
  const headerSrc = resolveAssetUrl(partner.headerImage as string);
  const logoSrc = resolveAssetUrl(partner.logo as string);
  const sellingBlock = extractSellingPoints(partner);
  const useCasesBlock = mapUseCases(partner);
  const valueProp = 'valueProposition' in partner ? partner.valueProposition : null;
  const mediaLinks = 'mediaLinks' in partner ? partner.mediaLinks : null;
  const demo = 'demo' in partner ? partner.demo : null;
  const demoVideo =
    demo && 'videoUrl' in demo && demo.videoUrl ? resolveAssetUrl(demo.videoUrl as string) : null;
  const galleryItems = buildGalleryItems(partner);

  const modelId = 'modelId' in partner ? partner.modelId : undefined;
  const interactiveCopy =
    'clientPageInteractiveCopy' in partner && partner.clientPageInteractiveCopy
      ? partner.clientPageInteractiveCopy
      : null;

  const hasInteractive =
    partner.slug === 'advanced-navigation' && isValidSketchfabModelId(modelId);
  const hasDemo = partner.slug === 'anchor-bot' && demoVideo;

  const base = solutionClientPath(partner.slug);

  const overviewRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => ({
      [base]: overviewRef,
      [`${base}/features`]: featuresRef,
      [`${base}/interactive`]: interactiveRef,
      [`${base}/value`]: valueRef,
      [`${base}/demo`]: demoRef,
      [`${base}/media`]: mediaRef,
    }),
    [base]
  );

  const navItems: SolutionNavItem[] = useMemo(() => {
    const items: SolutionNavItem[] = [{ path: base, hashId: 'partner-overview', label: 'Overview' }];
    if (sellingBlock || useCasesBlock) {
      items.push({ path: `${base}/features`, hashId: 'partner-features', label: 'Features' });
    }
    if (hasInteractive) {
      items.push({
        path: `${base}/interactive`,
        hashId: 'partner-interactive',
        label: '3D Model',
        is3d: true,
      });
    }
    if (valueProp?.highlights?.length) {
      items.push({ path: `${base}/value`, hashId: 'partner-value', label: 'Value' });
    }
    if (hasDemo) {
      items.push({ path: `${base}/demo`, hashId: 'partner-demo', label: 'Demo' });
    }
    if (mediaLinks || galleryItems.length) {
      items.push({ path: `${base}/media`, hashId: 'partner-media', label: 'Media' });
    }
    return items;
  }, [
    base,
    sellingBlock,
    useCasesBlock,
    hasInteractive,
    valueProp?.highlights?.length,
    hasDemo,
    mediaLinks,
    galleryItems.length,
  ]);

  useSolutionScrollToSection(partner.slug);

  return (
    <div className={shellStyles.shell}>
      <div className={shellStyles.navContainer}>
        <SolutionSubNav clientSlug={partner.slug} sectionRefs={sectionRefs} navItems={navItems} />
      </div>

      <div className={shellStyles.content}>
        <div ref={overviewRef} id="partner-overview" className={shellStyles.section}>
          {headerSrc ? (
            <OverviewSection
              title={partner.overview?.title || partner.name}
              description={partner.overview?.description || ''}
              headerImage={headerSrc}
              logo={logoSrc}
              website={mediaLinks?.website}
            />
          ) : null}
        </div>

        {sellingBlock || useCasesBlock ? (
          <div ref={featuresRef} id="partner-features" className={shellStyles.section}>
            {sellingBlock ? (
              <SellingPointsSection title={sellingBlock.title} points={sellingBlock.points} />
            ) : null}
            {useCasesBlock ? (
              <UseCasesSection
                title={useCasesBlock.title}
                description={useCasesBlock.description}
                cases={useCasesBlock.cases}
              />
            ) : null}
          </div>
        ) : null}

        {hasInteractive && modelId ? (
          <div ref={interactiveRef} id="partner-interactive" className={shellStyles.section}>
            <InteractiveSection
              modelId={modelId}
              title={interactiveCopy?.title || 'Hydrus'}
              description={
                interactiveCopy?.description ||
                'Explore this detailed 3D model. Rotate and zoom to examine from every angle.'
              }
            />
          </div>
        ) : null}

        {valueProp?.highlights?.length ? (
          <div ref={valueRef} id="partner-value" className={shellStyles.section}>
            <ValuePropositionSection
              title={valueProp.title || ''}
              description={valueProp.description}
              highlights={valueProp.highlights}
            />
          </div>
        ) : null}

        {hasDemo && demo && demoVideo ? (
          <div ref={demoRef} id="partner-demo" className={shellStyles.section}>
            <DemoSection title={demo.title} description={demo.description} videoUrl={demoVideo} />
          </div>
        ) : null}

        {mediaLinks || galleryItems.length ? (
          <div ref={mediaRef} id="partner-media" className={shellStyles.section}>
            {mediaLinks ? <MediaLinksSection links={mediaLinks} /> : null}
            {galleryItems.length ? <MediaGallerySection items={galleryItems} /> : null}
          </div>
        ) : null}

        <section className={shellStyles.section} style={{ textAlign: 'center', paddingBottom: '3rem' }}>
          <p style={{ color: '#c9dbe4', marginBottom: '1rem' }}>
            Discuss deployment, integration, and fit with Beringia.
          </p>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              color: '#f2f8fb',
              background: 'var(--gradient-cta)',
              textDecoration: 'none',
              borderRadius: '999px',
              padding: '0.75rem 1.35rem',
              fontWeight: 600,
            }}
          >
            Contact Beringia
          </Link>
        </section>
      </div>
    </div>
  );
}
