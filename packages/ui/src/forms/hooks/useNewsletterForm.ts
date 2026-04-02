'use client';

/**
 * React Hook Form hook for Newsletter Form
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { newsletterFormSchema, type NewsletterFormData } from '../validation';
import { submitNewsletterForm } from '../submission';
import type { FormSubmissionState } from '../types';

export interface UseNewsletterFormOptions {
  onSuccess?: () => void;
}

export function useNewsletterForm(options?: UseNewsletterFormOptions) {
  const [state, setState] = useState<FormSubmissionState>({
    isSubmitting: false,
    isSuccess: false,
    isError: false,
  });

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      referralSource: '',
      sendScheduleEmails: true,
      sendScheduleTexts: true,
      sendPromotionalEmails: true,
      sendPromotionalTexts: true,
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      isError: false,
    });

    try {
      const response = await submitNewsletterForm(data);

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
          errorMessage: response.error?.message || 'Failed to submit form',
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

