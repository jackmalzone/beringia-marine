'use client';

/**
 * Contact Form Hook
 * Uses React Hook Form with Zod validation
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contactFormSchema, type ContactFormData } from '../validation';
import { submitContactForm } from '../submission';
import type { FormSubmissionState } from '../types';

export interface UseContactFormOptions {
  onSuccess?: () => void;
}

export function useContactForm(options?: UseContactFormOptions) {
  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
    });

    try {
      const response = await submitContactForm(data);

      if (response.success) {
        setState({
          isSubmitting: false,
          isSuccess: true,
          isError: false,
        });
        form.reset();
        options?.onSuccess?.();
      } else {
        setState({
          isSubmitting: false,
          isSuccess: false,
          isError: true,
          errorMessage: response.error?.message || 'Failed to submit form. Please try again.',
        });
      }
    } catch (error) {
      setState({
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    state,
  };
}
