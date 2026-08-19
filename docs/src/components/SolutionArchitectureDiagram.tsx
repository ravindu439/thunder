// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Typography} from '@wso2/oxygen-ui';
import {Facebook, GitHub, Google, KeyRound, Server, ShieldCheck, Smartphone, User} from '@wso2/oxygen-ui-icons-react';
import React, {useEffect, useRef, useState} from 'react';

// Fixed canvas, scaled to fit the available width via the ResizeObserver below.
// Below MIN_SCALE it stops shrinking and scrolls horizontally so labels stay legible.
const W = 1220;
const H = 730;
const MIN_SCALE = 0.45;

const lineSx = {stroke: 'var(--ifm-color-emphasis-400)', strokeWidth: 1.6, fill: 'none'};

const iconSx = {
  color: 'var(--ifm-color-primary)',
  '& svg': {fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 1.7},
};

const cardSx = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.3rem',
  borderRadius: '14px',
  border: '1px solid var(--ifm-color-emphasis-200)',
  background: 'var(--ifm-background-surface-color)',
  boxShadow: '0 6px 18px color-mix(in srgb, var(--ifm-color-emphasis-900) 6%, transparent)',
  textAlign: 'center',
  padding: '0.5rem',
} as const;

// The two pieces the reader actually owns and wires together get an accent.
const highlightSx = {
  border: '1.5px solid var(--ifm-color-primary)',
  background: 'color-mix(in srgb, var(--ifm-color-primary) 6%, var(--ifm-background-surface-color))',
} as const;

const labelSx = {fontSize: '0.85rem', fontWeight: 700, color: 'var(--ifm-font-color-base)'};
const subLabelSx = {fontSize: '0.68rem', fontWeight: 500, color: 'var(--ifm-color-emphasis-700)', lineHeight: 1.3, textAlign: 'center'} as const;
// One of the identity layer's jobs: a titled inner card.
const stepSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.1rem',
  border: '1px solid var(--ifm-color-emphasis-300)',
  borderRadius: '10px',
  background: 'var(--ifm-background-surface-color)',
  padding: '0.5rem 0.75rem',
  textAlign: 'center',
} as const;
const stepTitleSx = {fontSize: '0.82rem', fontWeight: 700, color: 'var(--ifm-font-color-base)'} as const;

// The identity layer's real jobs in this solution, in product terms (journeys as
// flows, account management, role-based permissions) — not a low-level feature list.
const IDENTITY_SUBTITLE = "Everything about the customer's identity, in one place";

/** One provider glyph inside the External providers card. */
function ProviderChip({icon}: {icon: React.ReactNode}) {
  return (
    <Box aria-hidden sx={{...iconSx, display: 'inline-flex', color: 'var(--ifm-color-emphasis-700)'}}>
      {icon}
    </Box>
  );
}

/** A numbered flow-step label: a small primary circle carrying the step number, then the text. */
function StepLabel({n, left, top, width, text, accent = false}: {n: number; left: number; top: number; width: number; text: string; accent?: boolean}) {
  return (
    <Box sx={{position: 'absolute', left, top, width, display: 'flex', gap: '0.4rem', alignItems: 'flex-start'}}>
      <Box
        component="span"
        aria-hidden
        sx={{flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '999px', background: 'var(--ifm-color-primary)', color: '#fff', fontSize: '0.68rem', fontWeight: 700}}
      >
        {n}
      </Box>
      <Typography component="span" sx={{fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.35, color: accent ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-700)'}}>
        {text}
      </Typography>
    </Box>
  );
}

/**
 * The Solution Architecture diagram. Two accented pieces are what the reader
 * owns and wires together: their customer application and the identity layer.
 * The identity layer's box names its real jobs in this solution, in product
 * terms — it runs the user journeys (sign-in, sign-up, recovery, onboarding) as
 * flows, manages the customer and staff accounts, and assigns each user their
 * permissions through roles — not a low-level feature list. The numbered steps
 * trace one request: the customer signs in through the app (1),
 * the app hands the journey to the identity layer (2), which mints one signed
 * token carrying the customer's permissions (3), and the app presents that token
 * to the backend APIs (4), which trust it and check its permissions. External
 * providers are one optional way to handle the verify step and never mint the
 * token. Built with Oxygen UI + Lucide icons; scales to fit the width, scrolls
 * below MIN_SCALE.
 */
export function SolutionArchitectureDiagram() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) {
      return undefined;
    }
    const updateScale = () => {
      const next = Math.min(1, el.clientWidth / W);
      setScale(Math.max(next, MIN_SCALE));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const needsScroll = scale <= MIN_SCALE;

  return (
    <Box
      component="figure"
      aria-label="Solution architecture, as a numbered flow. The identity layer owns everything about the customer's identity in one place: it runs the user journeys (sign-in, sign-up, recovery, and onboarding) as flows, manages the customer and staff accounts and their profiles, and assigns each user their permissions through the roles you define. Step 1: the customer signs in, signs up, or recovers access through the customer application. Step 2: the application hands the journey to the identity layer. Step 3: the identity layer mints one signed token carrying the customer's permissions and returns it to the application. Step 4: the application presents that token to the backend APIs, which trust it and check its permissions. External providers are one optional way to handle sign-in verification and never mint the token."
      sx={{margin: '2rem 0 2.5rem', border: 0, padding: 0, overflow: 'visible'}}
    >
      <Box
        ref={wrapperRef}
        sx={{width: '100%', height: H * scale, overflowX: needsScroll ? 'auto' : 'hidden', overflowY: 'hidden', WebkitOverflowScrolling: 'touch'}}
      >
        <Box sx={{width: W * scale, height: H * scale, overflow: 'hidden'}}>
        <Box sx={{position: 'relative', width: W, height: H, transform: `scale(${scale})`, transformOrigin: 'top left'}}>

          {/* Connector layer */}
          <Box component="svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden sx={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
            <defs>
              <marker id="sa-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--ifm-color-emphasis-500)" />
              </marker>
            </defs>
            {/* 1: customer -> application */}
            <path d="M940,154 V301" style={lineSx} markerEnd="url(#sa-arrow)" />
            {/* 2: application -> identity layer, hands off the journey (top lane, above the token) */}
            <path d="M820,306 H574" style={lineSx} markerEnd="url(#sa-arrow)" />
            {/* 3: identity layer -> token -> application (bottom lane: minted here, handed over) */}
            <path d="M570,368 H611" style={lineSx} markerEnd="url(#sa-arrow)" />
            <path d="M790,368 H816" style={lineSx} markerEnd="url(#sa-arrow)" />
            {/* 4: application <-> backend APIs (present token / data back), down the spine */}
            <path d="M940,379 V536" style={lineSx} markerEnd="url(#sa-arrow)" markerStart="url(#sa-arrow)" />
            {/* identity layer -> external providers (optional delegation) */}
            <path d="M310,436 V586" style={lineSx} markerEnd="url(#sa-arrow)" />
          </Box>

          {/* Customer (top of the spine) */}
          <Box sx={{...cardSx, left: 865, top: 70, width: 150, height: 84, borderRadius: '999px'}}>
            <Box aria-hidden sx={iconSx}><User size={26} /></Box>
            <Typography component="span" sx={labelSx}>Customer</Typography>
          </Box>
          <StepLabel n={1} left={1000} top={200} width={195} text="Signs in, signs up, or recovers access" />

          {/* Customer application (owned by the reader, accented) */}
          <Box sx={{...cardSx, ...highlightSx, left: 820, top: 301, width: 240, height: 78}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Box aria-hidden sx={iconSx}><Smartphone size={22} /></Box>
              <Typography component="span" sx={labelSx}>Customer application</Typography>
            </Box>
          </Box>

          {/* Identity layer: the centrepiece, accented. Its box shows the sign-in
              pipeline (verify -> authorize -> issue), not a capability catalogue. */}
          <Box sx={{...cardSx, ...highlightSx, left: 50, top: 150, width: 520, height: 286, alignItems: 'stretch', justifyContent: 'flex-start', gap: '0.45rem', padding: '1.1rem 1.25rem'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}>
              <Box aria-hidden sx={iconSx}><ShieldCheck size={26} /></Box>
              <Typography component="span" sx={{...labelSx, fontSize: '1rem'}}>Identity layer</Typography>
            </Box>
            <Typography component="span" sx={{...subLabelSx, marginBottom: '0.2rem'}}>{IDENTITY_SUBTITLE}</Typography>
            <Box sx={stepSx}>
              <Typography component="span" sx={stepTitleSx}>Runs the user journeys</Typography>
              <Typography component="span" sx={subLabelSx}>sign-in, sign-up, recovery, and onboarding, built as flows</Typography>
            </Box>
            <Box sx={stepSx}>
              <Typography component="span" sx={stepTitleSx}>Manages the accounts</Typography>
              <Typography component="span" sx={subLabelSx}>customers and staff, and their profiles</Typography>
            </Box>
            <Box sx={stepSx}>
              <Typography component="span" sx={stepTitleSx}>Assigns their permissions</Typography>
              <Typography component="span" sx={subLabelSx}>through the roles you define</Typography>
            </Box>
          </Box>
          <StepLabel n={2} left={590} top={250} width={240} text="Hands off sign-in, sign-up & recovery" />

          {/* Signed token: minted by the identity layer at sign-in, carries permissions */}
          <StepLabel n={3} left={600} top={408} width={220} text="Minted by the identity layer at sign-in" accent />
          <Box sx={{...cardSx, left: 615, top: 335, width: 175, height: 66, gap: '0.15rem', border: '1.5px solid var(--ifm-color-primary)', background: 'color-mix(in srgb, var(--ifm-color-primary) 10%, var(--ifm-background-surface-color))'}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '0.35rem'}}>
              <Box aria-hidden sx={iconSx}><KeyRound size={18} /></Box>
              <Typography component="span" sx={{...labelSx, fontSize: '0.82rem'}}>Signed token</Typography>
            </Box>
            <Typography component="span" sx={subLabelSx}>carries their permissions</Typography>
          </Box>

          {/* Backend APIs (bottom of the spine) */}
          <StepLabel n={4} left={985} top={430} width={200} text="Presents the token, gets data back" />
          <Box sx={{...cardSx, left: 815, top: 540, width: 250, height: 92}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Box aria-hidden sx={iconSx}><Server size={22} /></Box>
              <Typography component="span" sx={labelSx}>Backend APIs</Typography>
            </Box>
            <Typography component="span" sx={subLabelSx}>Trust the token · check its permissions</Typography>
          </Box>

          {/* External providers: one optional way to verify at sign-in */}
          <Typography component="span" sx={{position: 'absolute', left: 330, top: 486, width: 200, fontSize: '0.72rem', fontWeight: 600, lineHeight: 1.4, color: 'var(--ifm-color-emphasis-700)'}}>
            Optionally delegate sign-in
          </Typography>
          <Box sx={{...cardSx, left: 160, top: 590, width: 300, height: 110}}>
            <Typography component="span" sx={labelSx}>External providers</Typography>
            <Typography component="span" sx={subLabelSx}>social and enterprise logins, verification only</Typography>
            <Box sx={{display: 'flex', alignItems: 'center', gap: '0.9rem'}}>
              <ProviderChip icon={<Google size={20} />} />
              <ProviderChip icon={<Facebook size={20} />} />
              <ProviderChip icon={<GitHub size={20} />} />
            </Box>
          </Box>

        </Box>
        </Box>
      </Box>
    </Box>
  );
}
