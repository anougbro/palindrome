import styles from './CharBox.module.css'

/**
 * Affiche un seul caractère dans la visualisation.
 * La classe CSS change selon l'état de comparaison.
 */
export function CharBox({ char, index, status }) {
  // status: 'active' | 'match' | 'mismatch' | 'inner' | 'center' | 'idle'
  return (
    <div className={`${styles.box} ${styles[status] || ''}`}>
      {char}
      <span className={styles.idx}>{index}</span>
    </div>
  )
}
