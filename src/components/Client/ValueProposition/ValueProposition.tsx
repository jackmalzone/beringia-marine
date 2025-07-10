import styles from './ValueProposition.module.css'

interface ValuePropositionProps {
  title?: string
  description?: string
  highlights?: string[]
}

export const ValueProposition = ({ title, description, highlights }: ValuePropositionProps) => {
  return (
    <section className={styles.value_proposition}>
      <div className={styles.value_proposition__container}>
        {title && <h2 className={styles.value_proposition__title}>{title}</h2>}
        {description && <p className={styles.value_proposition__description}>{description}</p>}
        {highlights && highlights.length > 0 && (
          <ul className={styles.value_proposition__highlights}>
            {highlights.map((highlight, index) => (
              <li key={index} className={styles.value_proposition__highlight}>{highlight}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
} 