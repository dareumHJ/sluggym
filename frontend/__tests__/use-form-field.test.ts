import { act, renderHook } from '@testing-library/react-native';
import { useFormField } from '../src/hooks/useFormField';
import { validateEmail, validatePassword } from '../src/lib/validation';

describe('useFormField', () => {
  it('initialises with empty value, no error, and untouched state', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.touched).toBe(false);
  });

  it('updates value but suppresses error when the field has not been touched yet', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    act(() => {
      result.current.setValue('notanemail');
    });

    expect(result.current.value).toBe('notanemail');
    expect(result.current.error).toBe('');  // no error before touch
    expect(result.current.touched).toBe(false);
  });

  it('shows the validation error inline on setValue after the field has been touched', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    // First touch the field
    act(() => {
      result.current.onBlur();
    });

    // Now type an invalid value — error should appear immediately
    act(() => {
      result.current.setValue('notanemail');
    });

    expect(result.current.value).toBe('notanemail');
    expect(result.current.error).toBe('Please enter a valid email address');
    expect(result.current.touched).toBe(true);
  });

  it('clears the error message when the value becomes valid after a previous touch', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    act(() => {
      result.current.onBlur();
      result.current.setValue('invalid');
    });
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.setValue('valid@ucsc.edu');
    });

    expect(result.current.value).toBe('valid@ucsc.edu');
    expect(result.current.error).toBe('');
  });

  it('onBlur marks the field as touched and evaluates the current error', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    act(() => {
      result.current.setValue('notanemail');
    });
    expect(result.current.touched).toBe(false);
    expect(result.current.error).toBe('');

    act(() => {
      result.current.onBlur();
    });

    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('Please enter a valid email address');
  });

  it('onBlur on a valid value does not set an error message', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    act(() => {
      result.current.setValue('slug@ucsc.edu');
    });
    act(() => {
      result.current.onBlur();
    });

    expect(result.current.touched).toBe(true);
    expect(result.current.error).toBe('');
  });

  it('validate() returns true and clears error for a valid value', () => {
    const { result } = renderHook(() => useFormField(validateEmail));
    let isValid: boolean;

    // setValue must be in a separate act so React flushes the state update
    // before validate() reads state.value from its closure.
    act(() => {
      result.current.setValue('slug@ucsc.edu');
    });
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid!).toBe(true);
    expect(result.current.error).toBe('');
    expect(result.current.touched).toBe(true);
  });

  it('validate() returns false and surfaces the error even before the field was touched', () => {
    const { result } = renderHook(() => useFormField(validateEmail));
    let isValid: boolean;

    // Never called onBlur or setValue
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid!).toBe(false);
    expect(result.current.error).toBe('Email is required');
    expect(result.current.touched).toBe(true);
  });

  it('validate() uses the current value at the time of the call', () => {
    const { result } = renderHook(() => useFormField(validatePassword));
    let isValid: boolean;

    act(() => {
      result.current.setValue('SecurePass1');
    });
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid!).toBe(true);
    expect(result.current.error).toBe('');
  });

  it('reset() restores the field to its initial pristine state', () => {
    const { result } = renderHook(() => useFormField(validateEmail));

    act(() => {
      result.current.setValue('test@ucsc.edu');
      result.current.onBlur();
    });

    // Confirm state has changed
    expect(result.current.value).toBe('test@ucsc.edu');
    expect(result.current.touched).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.value).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.touched).toBe(false);
  });

  it('reset() after a validation error clears both error and touched flag', () => {
    const { result } = renderHook(() => useFormField(validatePassword));

    act(() => {
      result.current.validate();
    });
    expect(result.current.error).toBeTruthy();

    act(() => {
      result.current.reset();
    });

    expect(result.current.error).toBe('');
    expect(result.current.touched).toBe(false);
  });
});
