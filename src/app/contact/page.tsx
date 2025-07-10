'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.name.trim() || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim() || formData.subject.length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters'
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSubmitStatus('success')
      setSubmitMessage('Thank you! Your message has been sent successfully.')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Sorry, there was an error sending your message. Please try again.')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.contact}>
      <div className={styles.contact__container}>
        <div className={styles.contact__card}>
          <div className={styles.contact__info}>
            <h2 className={styles.contact__title}>Contact Us</h2>
            <p className={styles.contact__intro}>
              Whether you have a project in mind, need expert insights, or just want to learn more about what we do, we'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
            </p>
            <p className={styles.contact__intro}>
              If you prefer, you can also reach us directly via{' '}
              <a href="mailto:info@beringia-marine.com" className={styles.contact__link}>info@beringia-marine.com</a>
              {' '}or{' '}
              <a href="tel:+18057040462" className={styles.contact__link}>+1 805 316 1417</a>.
              Let's build something great together.
            </p>
          </div>

          <form className={styles.contact__form} onSubmit={handleSubmit}>
            <div className={styles.contact__input_group}>
              <input
                type="text"
                placeholder="Name"
                className={`${styles.contact__input} ${errors.name ? styles.contact__input_error : ''}`}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
              {errors.name && <span className={styles.contact__error}>{errors.name}</span>}
            </div>

            <div className={styles.contact__input_group}>
              <input
                type="email"
                placeholder="Email"
                className={`${styles.contact__input} ${errors.email ? styles.contact__input_error : ''}`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
              {errors.email && <span className={styles.contact__error}>{errors.email}</span>}
            </div>

            <div className={styles.contact__input_group}>
              <input
                type="text"
                placeholder="Subject"
                className={`${styles.contact__input} ${errors.subject ? styles.contact__input_error : ''}`}
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
              />
              {errors.subject && <span className={styles.contact__error}>{errors.subject}</span>}
            </div>

            <div className={styles.contact__input_group}>
              <textarea
                placeholder="Message"
                className={`${styles.contact__input} ${styles.contact__input_textarea} ${errors.message ? styles.contact__input_error : ''}`}
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
              />
              {errors.message && <span className={styles.contact__error}>{errors.message}</span>}
            </div>

            {submitStatus !== 'idle' && (
              <div className={`${styles.contact__submit_message} ${styles[submitStatus]}`}>
                {submitMessage}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.contact__submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
} 