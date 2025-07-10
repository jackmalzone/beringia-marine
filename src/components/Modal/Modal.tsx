'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'small' | 'medium' | 'large' | 'full'
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'medium',
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Store the previously focused element
      previousActiveElement.current = document.activeElement as HTMLElement
      // Focus the modal
      modalRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  // Handle modal content click
  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  if (!isOpen) return null

  const modalContent = (
    <div 
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      ref={modalRef}
      tabIndex={-1}
    >
      <div 
        className={styles.modalOverlay}
        onClick={handleOverlayClick}
        aria-hidden="true"
      >
        <div 
          className={`${styles.modalContent} ${styles[`modalContent${size.charAt(0).toUpperCase() + size.slice(1)}`]}`}
          onClick={handleModalClick}
        >
          {showCloseButton && (
            <button 
              className={styles.modalClose}
              onClick={onClose}
              aria-label="Close modal"
              type="button"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {title && (
            <h2 
              id="modal-title" 
              className={styles.modalTitle}
            >
              {title}
            </h2>
          )}
          
          <div className={styles.modalBody}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at the end of body
  return createPortal(modalContent, document.body)
} 