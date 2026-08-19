// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {AndroidLogo, FlutterLogo} from '@thunderid/components';
import {Box} from '@wso2/oxygen-ui';
import {JSX} from 'react';
import AngularLogo from './icons/AngularLogo';
import BrowserLogo from './icons/BrowserLogo';
import ExpressLogo from './icons/ExpressLogo';
import GoLogo from './icons/GoLogo';
import IOSLogo from './icons/IOSLogo';
import NextLogo from './icons/NextLogo';
import NodeLogo from './icons/NodeLogo';
import NuxtLogo from './icons/NuxtLogo';
import PythonLogo from './icons/PythonLogo';
import ReactLogo from './icons/ReactLogo';
import ReactRouterLogo from './icons/ReactRouterLogo';
import VueLogo from './icons/VueLogo';

const LOGO_SIZE = 30;

const ORDER = [
  ReactLogo,
  NextLogo,
  VueLogo,
  NuxtLogo,
  BrowserLogo,
  ExpressLogo,
  NodeLogo,
  GoLogo,
  PythonLogo,
  IOSLogo,
  AndroidLogo,
  FlutterLogo,
  AngularLogo,
  ReactRouterLogo,
];

const CLOUD = Array.from({length: 22}, (_, i) => {
  const Logo = ORDER[i % ORDER.length];
  const pass = Math.floor(i / ORDER.length);
  return {Logo, key: `${Logo.name}-${pass}`};
});

export default function FloatingLogosBackground(): JSX.Element {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 280,
        overflow: 'hidden',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '34px',
          p: '34px 40px',
          filter: 'grayscale(1)',
          opacity: 0.13,
        }}
      >
        {CLOUD.map(({Logo, key}) => (
          <Box key={key} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30}}>
            <Logo size={LOGO_SIZE} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
