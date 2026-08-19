// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box} from '@wso2/oxygen-ui';
import {Check, ChevronDown, ExternalLink, ListOrdered, Terminal, Wand2} from '@wso2/oxygen-ui-icons-react';
import React, {Children, isValidElement, useEffect, useRef, useState} from 'react';

// Icons are resolved from a name string rather than accepted as a component prop, since .mdx files
// can only pass plain values (no per-file component imports). Add an entry here to support a new icon.
const ICONS: Record<string, React.ComponentType<{size?: number}>> = {
  'external-link': ExternalLink,
  'list-ordered': ListOrdered,
  terminal: Terminal,
  wand: Wand2,
};

export interface PatternProps {
  /** Stable identifier for this option. */
  value: string;
  /** Short label shown in the trigger and the option list. */
  label: string;
  /** One-line summary shown under the label, so a reader can tell options apart without opening the panel. */
  description: string;
  /** Key into the icon map above (e.g. 'external-link', 'list-ordered', 'wand', 'terminal'). */
  icon: keyof typeof ICONS;
  /** Marks this option as not yet written. Still selectable; the badge just sets expectations. */
  comingSoon?: boolean;
  /** Selected by default when no other Pattern sets this. */
  default?: boolean;
  children?: React.ReactNode;
}

/** One option inside a `<PatternPicker>`. Renders its children; PatternPicker reads the rest of its props from each child. */
export function Pattern({children = null}: PatternProps): React.ReactNode {
  return children;
}

const triggerSx = {
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.07)',
  border: '1px solid rgba(255, 255, 255, 0.22)',
  borderRadius: '10px',
  color: 'var(--ifm-font-color-base)',
  cursor: 'pointer',
  display: 'flex',
  gap: '0.75rem',
  padding: '0.75rem 0.9rem',
  textAlign: 'left',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  width: '100%',
  '&:hover': {
    borderColor: 'color-mix(in srgb, var(--ifm-color-primary) 55%, transparent)',
    boxShadow: '0 0 0 3px color-mix(in srgb, var(--ifm-color-primary) 10%, transparent)',
  },
  '[data-theme="light"] &': {
    background: 'rgba(0, 0, 0, 0.03)',
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
} as const;

const triggerOpenSx = {
  borderColor: 'color-mix(in srgb, var(--ifm-color-primary) 55%, transparent)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--ifm-color-primary) 10%, transparent)',
} as const;

const triggerIconSx = {
  alignItems: 'center',
  background: 'color-mix(in srgb, var(--ifm-color-primary) 18%, transparent)',
  borderRadius: '8px',
  color: 'var(--ifm-color-primary)',
  display: 'inline-flex',
  flexShrink: 0,
  height: '2.25rem',
  justifyContent: 'center',
  width: '2.25rem',
} as const;

const panelSx = {
  // Reuses the existing keyframe defined for ConnectTypeSelector's panel in src/css/custom.css.
  animation: 'connect-panel-enter 0.16s ease',
  background: '#ffffff',
  border: '1px solid var(--ifm-color-emphasis-200)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  left: 0,
  marginTop: '0.4rem',
  padding: '0.35rem',
  position: 'absolute',
  right: 0,
  zIndex: 10,
  '[data-theme="dark"] &': {
    background: '#0e1929',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
} as const;

const optionSx = {
  alignItems: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: '9px',
  color: 'var(--ifm-font-color-base)',
  cursor: 'pointer',
  display: 'flex',
  gap: '0.75rem',
  padding: '0.6rem 0.65rem',
  textAlign: 'left',
  transition: 'background 0.12s ease',
  width: '100%',
  '&:hover': {
    background: 'var(--ifm-color-emphasis-200)',
  },
  '&:hover .pp-opt-icon': {
    background: 'color-mix(in srgb, var(--ifm-color-primary) 10%, transparent)',
    color: 'var(--ifm-color-primary)',
  },
} as const;

const optionActiveSx = {
  background: 'color-mix(in srgb, var(--ifm-color-primary) 10%, transparent)',
  '&:hover': {
    background: 'color-mix(in srgb, var(--ifm-color-primary) 14%, transparent)',
  },
  '& .pp-opt-icon': {
    background: 'color-mix(in srgb, var(--ifm-color-primary) 22%, transparent)',
    color: 'var(--ifm-color-primary)',
  },
  '& .pp-opt-label': {color: 'var(--ifm-color-primary)'},
} as const;

const optionIconSx = {
  alignItems: 'center',
  background: 'color-mix(in srgb, var(--ifm-color-primary) 14%, transparent)',
  borderRadius: '8px',
  color: 'var(--ifm-color-content-secondary)',
  display: 'inline-flex',
  flexShrink: 0,
  height: '2.2rem',
  justifyContent: 'center',
  transition: 'background 0.12s ease, color 0.12s ease',
  width: '2.2rem',
} as const;

/**
 * A dropdown selector for mutually-exclusive walkthrough content, composed the same way as
 * `<Tabs>`/`<TabItem>` (drop-in replacement), but rendered as a single trigger + panel instead of
 * a row of tabs. Each option's description is visible in the panel without needing to select it
 * first, so a reader can tell the options apart before committing to one.
 */
export function PatternPicker({children}: {children: React.ReactNode}): React.ReactElement | null {
  const patterns = Children.toArray(children).filter((child): child is React.ReactElement<PatternProps> =>
    isValidElement(child),
  );
  const initial = patterns.find(p => p.props.default) ?? patterns[0];
  const [selectedValue, setSelectedValue] = useState<string | undefined>(initial?.props.value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = patterns.find(p => p.props.value === selectedValue) ?? initial;
  if (!selected) {
    return null;
  }
  const SelectedIcon = ICONS[selected.props.icon];

  return (
    <Box sx={{my: 2}}>
      <Box ref={ref} sx={{position: 'relative'}}>
        <Box
          aria-expanded={open}
          aria-haspopup="listbox"
          component="button"
          onClick={() => setOpen(v => !v)}
          sx={open ? {...triggerSx, ...triggerOpenSx} : triggerSx}
          type="button"
        >
          <Box component="span" sx={triggerIconSx}>
            <SelectedIcon aria-hidden size={20} />
          </Box>
          <Box component="span" sx={{display: 'flex', flex: 1, flexDirection: 'column', gap: '0.1rem', minWidth: 0}}>
            <Box component="span" sx={{fontSize: '0.95rem', fontWeight: 600}}>{selected.props.label}</Box>
            <Box component="span" sx={{color: 'var(--ifm-color-content-secondary)', fontSize: '0.78rem'}}>
              {selected.props.description}
            </Box>
          </Box>
          <Box
            component="span"
            sx={{
              color: 'var(--ifm-color-content-secondary)',
              display: 'inline-flex',
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <ChevronDown aria-hidden size={16} />
          </Box>
        </Box>

        {open && (
          <Box role="listbox" sx={panelSx}>
            {patterns.map((pattern) => {
              const {value, label, description, icon, comingSoon} = pattern.props;
              const Icon = ICONS[icon];
              const isActive = value === selectedValue;
              return (
                <Box
                  aria-selected={isActive}
                  component="button"
                  key={value}
                  onClick={() => {
                    setSelectedValue(value);
                    setOpen(false);
                  }}
                  role="option"
                  sx={isActive ? {...optionSx, ...optionActiveSx} : optionSx}
                  type="button"
                >
                  <Box className="pp-opt-icon" component="span" sx={optionIconSx}>
                    <Icon aria-hidden size={18} />
                  </Box>
                  <Box component="span" sx={{display: 'flex', flex: 1, flexDirection: 'column', gap: '0.1rem', minWidth: 0}}>
                    <Box
                      className="pp-opt-label"
                      component="span"
                      sx={{alignItems: 'center', display: 'flex', fontSize: '0.875rem', fontWeight: 600, gap: '0.5rem', lineHeight: 1.2}}
                    >
                      {label}
                      {comingSoon && (
                        <Box component="span" sx={{
                          background: 'color-mix(in srgb, var(--ifm-color-emphasis-400) 30%, transparent)',
                          borderRadius: '20px',
                          color: 'var(--ifm-color-content-secondary)',
                          fontSize: '0.6rem',
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          padding: '0.1rem 0.4rem',
                          textTransform: 'uppercase',
                        }}>
                          Coming Soon
                        </Box>
                      )}
                    </Box>
                    <Box component="span" sx={{color: 'var(--ifm-color-content-secondary)', fontSize: '0.72rem', lineHeight: 1.3}}>
                      {description}
                    </Box>
                  </Box>
                  {isActive && (
                    <Box component="span" sx={{color: 'var(--ifm-color-primary)', display: 'inline-flex', flexShrink: 0}}>
                      <Check aria-hidden size={14} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Box sx={{marginTop: '1.25rem'}}>{selected.props.children}</Box>
    </Box>
  );
}
