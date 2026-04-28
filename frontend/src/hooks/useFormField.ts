import { useState, useCallback } from 'react';
import { ValidationResult } from '../lib/validation';

type ValidatorFn = (value: string) => ValidationResult;

interface FieldState {
  value: string;
  error: string;
  touched: boolean;
}

interface UseFormFieldReturn extends FieldState {
  setValue: (text: string) => void;
  validate: () => boolean;
  onBlur: () => void;
  reset: () => void;
}

/**
 * Custom hook for managing a single form field with validation.
 * - Shows errors only after the user has interacted (touched/blur).
 * - Provides `validate()` for on-submit validation.
 */
export function useFormField(validator: ValidatorFn): UseFormFieldReturn {
  const [state, setState] = useState<FieldState>({
    value: '',
    error: '',
    touched: false,
  });

  const setValue = useCallback(
    (text: string) => {
      setState((prev) => {
        const result = validator(text);
        return {
          value: text,
          // Only show errors if the field was already touched
          error: prev.touched ? result.message : '',
          touched: prev.touched,
        };
      });
    },
    [validator],
  );

  const onBlur = useCallback(() => {
    setState((prev) => {
      const result = validator(prev.value);
      return { ...prev, touched: true, error: result.message };
    });
  }, [validator]);

  const validate = useCallback((): boolean => {
    const result = validator(state.value);
    setState((prev) => ({ ...prev, touched: true, error: result.message }));
    return result.isValid;
  }, [validator, state.value]);

  const reset = useCallback(() => {
    setState({ value: '', error: '', touched: false });
  }, []);

  return {
    value: state.value,
    error: state.error,
    touched: state.touched,
    setValue,
    validate,
    onBlur,
    reset,
  };
}
