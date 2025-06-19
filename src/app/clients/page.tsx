import Link from 'next/link'
import Image from 'next/image'
import { fetchClients } from '@/lib/sanity'
import { ClientListItem } from '@/types'
import styles from './page.module.css'

// Revalidate every hour
export const revalidate = 3600

export default async function ClientsPage() {
  const clients: ClientListItem[] = await fetchClients()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Our Clients</h1>
      <div className={styles.clientsGrid}>
        {clients.map((client) => (
          <Link 
            key={client._id} 
            href={`/clients/${client.slug.current}`}
            className={styles.clientCard}
          >
            {client.logo?.asset?.url && (
              <div className={styles.clientLogo}>
                <Image 
                  src={client.logo.asset.url}
                  alt={client.logo.alt || `${client.name} logo`}
                  width={150}
                  height={80}
                  className={styles.logoImage}
                />
              </div>
            )}
            <h2 className={styles.clientName}>{client.name}</h2>
            {client.overview?.description && (
              <p className={styles.clientDescription}>{client.overview.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
} 