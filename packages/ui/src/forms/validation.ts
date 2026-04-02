/**
 * Form Validation Schemas using Zod
 */

import { z } from 'zod';

/**
 * Base contact form schema
 */
const baseContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)]+$/.test(val),
      'Please enter a valid phone number'
    )
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 10,
      'Phone number must be at least 10 digits'
    ),
});

/**
 * Contact form schema
 */
export const contactFormSchema = baseContactSchema.extend({
  message: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Newsletter form schema (minimal prospect form)
 */
export const newsletterFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\(\)]+$/.test(val),
      'Please enter a valid phone number'
    )
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 10,
      'Phone number must be at least 10 digits'
    ),
  referralSource: z.string().optional(),
  sendScheduleEmails: z.boolean().default(true),
  sendScheduleTexts: z.boolean().default(true),
  sendPromotionalEmails: z.boolean().default(true),
  sendPromotionalTexts: z.boolean().default(true),
});

export type NewsletterFormData = z.infer<typeof newsletterFormSchema>;
