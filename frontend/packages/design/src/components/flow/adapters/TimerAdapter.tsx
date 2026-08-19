// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {FlowTimer, type FlowTimerRenderProps} from '@thunderid/react';
import {cn} from '@thunderid/utils';
import {Alert, Typography} from '@wso2/oxygen-ui';
import {useState, type JSX} from 'react';

/**
 * Props for the TimerAdapter component.
 */
interface TimerAdapterProps {
  /** Duration in seconds until the step expires */
  expiresIn: number;
  /** Text template with {time} placeholder, resolved from the component label */
  textTemplate?: string;
}

/**
 * Oxygen-UI styled timer adapter.
 *
 * Uses the SDK's `FlowTimer` render-prop component to manage
 * the countdown, then renders oxygen-ui styled text.
 */
export default function TimerAdapter({
  expiresIn,
  textTemplate = 'Time remaining: {time}',
}: TimerAdapterProps): JSX.Element {
  // The caller derives expiresIn from the clock on every render, so it collapses to zero once the
  // deadline passes and FlowTimer stops rendering. Hold the last active duration to keep the expired
  // state on screen while the step it belongs to is still being submitted. A new duration replaces
  // it, so a later step still gets its own countdown.
  const [activeExpiresIn, setActiveExpiresIn] = useState<number>(expiresIn);
  if (expiresIn > 0 && expiresIn !== activeExpiresIn) {
    setActiveExpiresIn(expiresIn);
  }

  return (
    <FlowTimer expiresIn={activeExpiresIn}>
      {({isExpired, formattedTime}: FlowTimerRenderProps) =>
        isExpired ? (
          <Alert className={cn('Flow--timer', 'Alert--root')} severity="warning" sx={{mt: 1}}>
            <Typography className={cn('Text--body2')} variant="body2">
              {formattedTime}
            </Typography>
          </Alert>
        ) : (
          <Typography className={cn('Flow--timer', 'Text--body2')} variant="body2" color="warning.main" sx={{mt: 1}}>
            {textTemplate.replace('{time}', formattedTime)}
          </Typography>
        )
      }
    </FlowTimer>
  );
}
