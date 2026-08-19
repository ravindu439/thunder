// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {Box, Typography} from '@wso2/oxygen-ui';
import type {JSX} from 'react';
import {useEffect, useRef, useState} from 'react';
import type {DocusaurusProductConfig} from '@site/docusaurus.product.config';
import useIsDarkMode from '@site/src/hooks/useIsDarkMode';

interface EventItem {
  city: string;
  endDate: string;
  id: string;
  link: string;
  location: string;
  name: string;
  startDate: string;
  tags: string[];
}

const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTHS_FULL = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

function formatCardDate(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const month = MONTHS_SHORT[start.getMonth()];
  const year = start.getFullYear();
  if (startDate === endDate) return `${month} ${start.getDate()}, ${year}`;
  if (start.getMonth() === end.getMonth()) return `${month} ${start.getDate()}–${end.getDate()}, ${year}`;
  return `${month} ${start.getDate()}–${MONTHS_SHORT[end.getMonth()]} ${end.getDate()}, ${year}`;
}

function formatListDate(startDate: string, endDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const month = MONTHS_FULL[start.getMonth()];
  const year = start.getFullYear();
  if (startDate === endDate) return `${month} ${start.getDate()}, ${year}`;
  if (start.getMonth() === end.getMonth()) return `${month} ${start.getDate()}–${end.getDate()}, ${year}`;
  return `${month} ${start.getDate()}–${MONTHS_FULL[end.getMonth()]} ${end.getDate()}, ${year}`;
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const BOLT_PATH =
  'M55.5 26.4L58.9 0H0V26.4H55.5ZM39.9 147.4L49.6 72.3H0V256.7H60.6L80.1 147.4H39.9ZM192.4 59.4C182.8 40.2 169 25.6 150.9 15.3L115.4 103.7H159.8L76.3 256.7H83.4C109.5 256.7 131.7 251.6 150.2 241.2C168.6 230.9 182.7 216.1 192.4 197C202.1 177.8 206.9 154.8 206.9 128C206.9 101.3 202.1 78.5 192.4 59.4Z';
const BOLT_VW = 207;
const BOLT_VH = 257;

interface Particle {
  base: number;
  h: number;
  r: number;
  sp: number;
  tw: number;
  x: number;
  y: number;
}

interface Star {
  a: number;
  r: number;
  sp: number;
  tw: number;
  x: number;
  y: number;
}

function BoltCanvas({dark}: {dark: boolean}): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const boltPath = new Path2D(BOLT_PATH);
    let W = 0, H = 0, pts: Particle[] = [], stars: Star[] = [], t = 0, rafId = 0;

    const buildBolt = (): void => {
      pts = [];
      const margin = 0.18;
      const scale = Math.min((W * (1 - margin * 2)) / BOLT_VW, (H * (1 - margin * 2)) / BOLT_VH);
      if (scale <= 0) return;
      const ox = (W - BOLT_VW * scale) / 2;
      const oy = (H - BOLT_VH * scale) / 2;
      const size = Math.ceil(BOLT_VW * scale);
      const sizeH = Math.ceil(BOLT_VH * scale);
      const off = document.createElement('canvas');
      off.width = size;
      off.height = sizeH;
      const o = off.getContext('2d')!;
      o.setTransform(scale, 0, 0, scale, 0, 0);
      o.fillStyle = '#fff';
      o.fill(boltPath);
      const data = o.getImageData(0, 0, size, sizeH).data;
      const step = Math.max(2, Math.floor(scale * 0.5));
      for (let y = 0; y < sizeH; y += step) {
        for (let x = 0; x < size; x += step) {
          if (data[(y * size + x) * 4 + 3] > 100) {
            const rnd = Math.random();
            pts.push({
              base: 0.45 + Math.random() * 0.55,
              h: Math.random(),
              r: rnd < 0.03 ? 2.0 + Math.random() * 1.2 : rnd < 0.12 ? 1.0 + Math.random() * 0.8 : 0.35 + Math.random() * 0.55,
              sp: 0.4 + Math.random() * 2.2,
              tw: Math.random() * 6.283,
              x: ox + x + (Math.random() - 0.5) * step * 1.4,
              y: oy + y + (Math.random() - 0.5) * step * 1.4,
            });
          }
        }
      }
    };

    const buildStars = (): void => {
      stars = [];
      const n = Math.floor((W * H) / 6000);
      for (let i = 0; i < n; i++) {
        stars.push({a: 0.04 + Math.random() * 0.25, r: 0.3 + Math.random() * 0.9, sp: 0.15 + Math.random() * 0.8, tw: Math.random() * 6.283, x: Math.random() * W, y: Math.random() * H});
      }
    };

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildBolt(); buildStars();
    };

    const draw = (): void => {
      t += 0.014;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5, cy = H * 0.5;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.58);
      if (dark) {
        g.addColorStop(0, 'rgba(0,140,255,0.11)');
        g.addColorStop(0.5, 'rgba(0,80,200,0.06)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
      } else {
        g.addColorStop(0, 'rgba(0,120,255,0.09)');
        g.addColorStop(0.5, 'rgba(0,80,200,0.04)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        const a = s.a * (0.4 + 0.6 * Math.sin(t * s.sp + s.tw));
        ctx.fillStyle = dark
          ? `rgba(200,230,255,${a.toFixed(3)})`
          : `rgba(30,90,200,${(a * 0.6).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      }
      for (const p of pts) {
        const tw = 0.5 + 0.5 * Math.sin(t * p.sp + p.tw);
        const a = p.base * (0.28 + 0.72 * tw);
        let rr: number, gg: number, bb: number;
        if (dark) {
          rr = Math.floor(p.h * 54);
          gg = Math.floor(160 + p.h * 60 + tw * 35);
          bb = Math.floor(210 + p.h * 45);
        } else {
          rr = Math.floor(10 + p.h * 40);
          gg = Math.floor(70 + p.h * 80 + tw * 20);
          bb = Math.floor(180 + p.h * 50);
        }
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${Math.min(a, 1).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      }
      rafId = requestAnimationFrame(draw);
    };

    resize();
    rafId = requestAnimationFrame(draw);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, [dark]);

  return <canvas ref={canvasRef} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block'}} />;
}

export default function EventsPage(): JSX.Element {
  const isDark = useIsDarkMode();
  const {withBaseUrl} = useBaseUrlUtils();
  const {siteConfig} = useDocusaurusContext();
  const productName = (siteConfig.customFields?.product as DocusaurusProductConfig)?.project?.name ?? siteConfig.title;
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch(withBaseUrl('/data/events.json'))
      .then((r) => r.json() as Promise<{events: EventItem[]}>)
      .then((data) => setEvents(data.events ?? []))
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }, [withBaseUrl]);

  const today = todayStr();
  const currentYear = today.slice(0, 4);
  const upcoming = events.filter((e) => e.endDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const past = events.filter((e) => e.endDate < today).sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <Layout
      description="Conferences, summits and workshops where the ThunderID team shows up in person."
      title="Events"
    >
      <Box sx={{display: 'flex', height: 'calc(100vh - var(--ifm-navbar-height))', minHeight: 480, overflow: 'hidden'}}>

        {/* LEFT: animated canvas */}
        <Box sx={{flex: '0 0 50%', position: 'relative', overflow: 'hidden', bgcolor: isDark ? '#020c1b' : '#e8f2ff', display: {xs: 'none', md: 'block'}}}>
          <BoltCanvas dark={isDark} />
        </Box>

        {/* RIGHT: events panel */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: {xs: '32px 24px 40px', md: '52px 48px 60px'},
            bgcolor: isDark ? 'rgba(6,13,26,0.95)' : 'background.paper',
            borderLeft: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {/* Heading */}
          <Box sx={{mb: 5}}>
            <Box sx={{display: 'inline-flex', alignItems: 'center', gap: 1.25, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.625rem', color: '#3688ff', textTransform: 'uppercase', letterSpacing: '0.18em', mb: 1.25}}>
              <Box component="span" sx={{width: '18px', height: '1px', bgcolor: '#3688ff', display: 'inline-block'}} />
              Where to find us
            </Box>
            <Typography sx={{fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, mb: 1.25, color: 'text.primary'}} variant="h2">
              {productName} on the road · {currentYear}
            </Typography>
            <Typography sx={{fontSize: '0.84rem', lineHeight: 1.65, color: 'text.secondary', maxWidth: 360}}>
              Conferences, summits and workshops where the team shows up in person.
            </Typography>
          </Box>

          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <>
              <Box sx={{mb: 1.25}}>
                <Box component="span" sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.59rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'text.disabled'}}>
                  Upcoming
                </Box>
              </Box>
              {upcoming.map((event) => (
                <Box
                  key={event.id}
                  sx={{borderRadius: '14px', border: '1px solid rgba(54,136,255,0.3)', bgcolor: 'rgba(54,136,255,0.055)', p: '22px 22px 20px', display: 'flex', flexDirection: 'column', gap: 1.625, mb: 3.5, transition: 'border-color 0.2s', '&:hover': {borderColor: 'rgba(54,136,255,0.52)'}}}
                >
                  <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Box component="span" sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.69rem', color: isDark ? '#8bf9fa' : '#1a6fe8', letterSpacing: '0.04em'}}>
                      {formatCardDate(event.startDate, event.endDate)}
                    </Box>
                    <Box component="span" sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.53rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: isDark ? '#8bf9fa' : '#1a6fe8', bgcolor: 'rgba(54,136,255,0.12)', border: '1px solid rgba(54,136,255,0.35)', borderRadius: '999px', px: 1.25, py: '3px'}}>
                      Upcoming
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={{fontSize: '1rem', fontWeight: 600, mb: 0.75, letterSpacing: '-0.01em', color: 'text.primary', lineHeight: 1.25}}>
                      {event.name}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', color: 'text.secondary'}}>
                      <svg fill="none" height="11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="11">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location}
                    </Box>
                  </Box>
                  {event.tags.length > 0 && (
                    <Box sx={{display: 'flex', gap: 0.75, flexWrap: 'wrap'}}>
                      {event.tags.map((tag) => (
                        <Box component="span" key={tag} sx={{fontSize: '0.66rem', color: 'text.secondary', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', px: 1.125, py: '3px'}}>
                          {tag}
                        </Box>
                      ))}
                    </Box>
                  )}
                  <Box
                    component="a"
                    href={event.link}
                    rel="noopener noreferrer"
                    sx={{display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 500, color: '#3688ff', textDecoration: 'none', transition: 'gap 0.18s', width: 'fit-content', '&:hover': {gap: '9px'}}}
                    target="_blank"
                  >
                    View event
                    <svg fill="none" height="11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="11">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Box>
                </Box>
              ))}
            </>
          )}

          {/* Past events */}
          {past.length > 0 && (
            <>
              <Box sx={{mb: 1.25}}>
                <Box component="span" sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.59rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'text.disabled'}}>
                  Past
                </Box>
              </Box>
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                {past.map((event, i) => (
                  <Box
                    key={event.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: 3,
                      py: 2.25,
                      borderTop: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)',
                      ...(i === past.length - 1 ? {borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.07)'} : {}),
                      opacity: 0.55,
                    }}
                  >
                    <Box>
                      <Box sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.84rem', fontWeight: 600, color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 0.75}}>
                        {event.name}
                      </Box>
                      <Box sx={{fontFamily: '"JetBrains Mono", monospace', fontSize: '0.69rem', color: 'text.disabled', letterSpacing: '0.05em', textTransform: 'uppercase'}}>
                        {formatListDate(event.startDate, event.endDate)} · {event.location.toUpperCase()}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
