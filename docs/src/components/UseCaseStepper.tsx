// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import Link from '@docusaurus/Link';
import {Box} from '@wso2/oxygen-ui';
import React, {JSX, useState} from 'react';

export interface UseCaseStepperCardProps {
  title: string;
  summary: string;
  chips?: string[];
  icon?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  children?: React.ReactNode;
}

export const UseCaseStepperCard: React.FC<UseCaseStepperCardProps> = () => null;
UseCaseStepperCard.displayName = 'UseCaseStepperCard';

export function UseCaseStepper({children}: {children: React.ReactNode}): JSX.Element {
  const cards = React.Children.toArray(children).filter(
    (c): c is React.ReactElement<UseCaseStepperCardProps> =>
      React.isValidElement(c) &&
      (c.type as React.FC).displayName === 'UseCaseStepperCard',
  );

  const [selected, setSelected] = useState(0);

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: '2rem 0 2.25rem'}}>
      <style>{`@keyframes UseCaseStepperPanelFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`}</style>

      {/* Card grid */}
      <Box
        sx={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          position: 'relative',
          '@media (max-width: 1100px)': {gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'},
          '@media (max-width: 720px)': {gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'},
          '@media (max-width: 480px)': {gridTemplateColumns: '1fr'},
        }}
      >
        {cards.map((card, i) => {
          const isActive = i === selected;
          return (
            <Box
              key={card.props.title}
              component="button"
              onClick={() => setSelected(i)}
              sx={{
                alignItems: 'flex-start',
                background: `color-mix(in srgb, var(--ifm-background-surface-color, var(--ifm-card-background)) 92%, var(--ifm-color-primary) 8%)`,
                border: isActive
                  ? '1px solid color-mix(in srgb, var(--ifm-color-primary) 58%, var(--ifm-color-emphasis-300))'
                  : '1px solid color-mix(in srgb, var(--ifm-color-emphasis-300) 70%, transparent)',
                borderRadius: '8px',
                boxShadow: isActive
                  ? '0 12px 28px color-mix(in srgb, var(--ifm-color-primary) 14%, transparent)'
                  : 'none',
                color: 'var(--ifm-font-color-base)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                font: 'inherit',
                gap: '0.65rem',
                minHeight: i === selected ? undefined : '15.25rem',
                padding: '1rem',
                textAlign: 'left',
                transform: isActive ? 'translateY(-2px)' : 'none',
                transition: 'border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                '@media (max-width: 720px)': {minHeight: '13.5rem'},
                '@media (max-width: 480px)': {minHeight: 0},
                '&:hover': {
                  borderColor: 'color-mix(in srgb, var(--ifm-color-primary) 58%, var(--ifm-color-emphasis-300))',
                  boxShadow: '0 12px 28px color-mix(in srgb, var(--ifm-color-primary) 14%, transparent)',
                  transform: 'translateY(-2px)',
                },
                '&:focus-visible': {
                  outline: '2px solid color-mix(in srgb, var(--ifm-color-primary) 64%, white)',
                  outlineOffset: '3px',
                },
              }}
            >
              {card.props.icon && (
                <Box
                  sx={{
                    alignItems: 'center',
                    background: `radial-gradient(68px 68px at 28% 18%, color-mix(in srgb, var(--ifm-color-primary) 24%, transparent), transparent),
                      linear-gradient(160deg, color-mix(in srgb, var(--ifm-color-primary) 72%, #091629), color-mix(in srgb, var(--ifm-color-primary) 44%, #030712))`,
                    border: '1px solid color-mix(in srgb, var(--ifm-color-primary) 38%, var(--ifm-color-emphasis-300))',
                    borderRadius: '50%',
                    boxShadow: 'inset 0 0 0 1px color-mix(in srgb, #fff 24%, transparent), 0 8px 18px color-mix(in srgb, var(--ifm-color-primary) 20%, transparent)',
                    display: 'flex',
                    height: '3.4rem',
                    justifyContent: 'center',
                    minWidth: '3.4rem',
                    width: '3.4rem',
                    '& svg': {
                      fill: 'none',
                      height: '1.55rem',
                      stroke: '#fff',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: '1.8',
                      width: '1.55rem',
                    },
                  }}
                >
                  {card.props.icon}
                </Box>
              )}
              <Box sx={{fontSize: '1rem', fontWeight: 750, lineHeight: 1.2}}>{card.props.title}</Box>
              <Box sx={{color: 'var(--ifm-color-emphasis-700)', flex: 1, fontSize: '0.82rem', lineHeight: 1.45}}>
                {card.props.summary}
              </Box>
              {card.props.chips && card.props.chips.length > 0 && (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '0.35rem'}}>
                  {card.props.chips.map((chip) => (
                    <Box
                      key={chip}
                      sx={{
                        background: 'color-mix(in srgb, var(--ifm-color-primary) 8%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--ifm-color-primary) 22%, var(--ifm-color-emphasis-300))',
                        borderRadius: '999px',
                        color: 'var(--ifm-color-emphasis-800)',
                        fontSize: '0.68rem',
                        fontWeight: 650,
                        lineHeight: 1,
                        padding: '0.32rem 0.45rem',
                      }}
                    >
                      {chip}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Selected card panel */}
      {cards[selected] && (
        <Box
          sx={{
            animation: 'UseCaseStepperPanelFadeIn 0.25s',
            background: 'color-mix(in srgb, var(--ifm-background-surface-color, var(--ifm-card-background)) 96%, var(--ifm-color-primary) 4%)',
            border: '1px solid color-mix(in srgb, var(--ifm-color-primary) 24%, var(--ifm-color-emphasis-300))',
            borderRadius: '8px',
            boxShadow: 'var(--ifm-global-shadow-lw, 0 2px 12px rgba(0,0,0,0.10))',
            color: 'var(--ifm-font-color-base)',
            fontSize: '0.96rem',
            padding: '1.25rem 1.4rem',
            '& > *:last-child': {marginBottom: 0},
          }}
        >
          {cards[selected].props.children}
          {cards[selected].props.href && (
            <Box
              component={Link}
              to={cards[selected].props.href}
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
                fontWeight: 700,
                marginTop: '0.8rem',
                width: 'fit-content',
              }}
            >
              {cards[selected].props.linkLabel ?? 'Learn more'}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
