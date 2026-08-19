// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {cn} from '@thunderid/utils';
import {FormControl, FormLabel, IconButton, InputAdornment, TextField} from '@wso2/oxygen-ui';
import {Eye, EyeClosed} from '@wso2/oxygen-ui-icons-react';
import type {JSX} from 'react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {FlowFieldProps} from '../../../models/flow';

export interface PasswordInputAdapterProps extends FlowFieldProps {
  /**
   * Browser autocomplete hint.
   * Use `'current-password'` for sign-in and `'new-password'` for sign-up / invite.
   * @default 'current-password'
   */
  passwordAutoComplete?: 'current-password' | 'new-password';
}

export default function PasswordInputAdapter({
  component,
  values,
  touched,
  fieldErrors,
  isLoading,
  resolve,
  onInputChange,
  onBlur,
  passwordAutoComplete = 'current-password',
}: PasswordInputAdapterProps): JSX.Element | null {
  const {t} = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {ref} = component;

  if (!ref || typeof ref !== 'string') return null;

  const hasError = !!(touched?.[ref] && fieldErrors?.[ref]);
  const value = values[ref] ?? '';
  const autoComplete = ref === 'password' ? (passwordAutoComplete ?? 'current-password') : 'off';

  return (
    <FormControl required={component.required} className={cn('Flow--passwordInput', 'FormControl--root')}>
      <FormLabel htmlFor={ref} className={cn('Label--root')}>
        {t(resolve(component.label)!)}
      </FormLabel>
      <TextField
        fullWidth
        className={cn('TextField--root')}
        id={ref}
        name={ref}
        type={showPassword ? 'text' : 'password'}
        placeholder={t(resolve(component.placeholder) ?? component.placeholder ?? '')}
        autoComplete={autoComplete}
        required={component.required}
        variant="outlined"
        disabled={isLoading}
        error={hasError}
        helperText={hasError ? fieldErrors?.[ref] : undefined}
        color={hasError ? 'error' : 'primary'}
        value={value}
        onChange={(e) => onInputChange(ref, e.target.value)}
        onBlur={() => onBlur?.(ref)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className={cn('IconButton--root', 'PasswordInput--toggle')}
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  disabled={isLoading}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </FormControl>
  );
}
