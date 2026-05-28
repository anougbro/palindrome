import { useState, useRef } from 'react'
import { usePalindrome } from './usePalindrome'
import { CharBox } from './CharBox'
import styles from './App.module.css'

export default function App() {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const {
    word,
    steps,
    stepIdx,
    done,
    history,
    currentStep,
    isAuto,
    check,
    nextStep,
    autoPlay,
    reset,
    replayFromHistory,
  } = usePalindrome()

  const chars = word ? word.toLowerCase().split('') : []

  /**
   * Détermine le statut visuel de chaque caractère
   * en fonction de l'étape courante.
   */
  function getCharStatus(i) {
    if (!currentStep) return 'idle'
    const { lo, hi, matched, type } = currentStep

    if (type === 'match' && (i === lo || i === hi)) return 'active'
    if (type === 'mismatch' && (i === lo || i === hi)) return 'mismatch'
    if (matched.includes(i)) return 'match'
    if (type === 'stop' && i === lo && lo === hi) return 'center'
    if (i > lo && i < hi && !matched.includes(i)) return 'inner'
    return 'idle'
  }

  function handleCheck() {
    if (!inputValue.trim()) return
    check(inputValue)
  }

  function handleReset() {
    reset()
    setInputValue('')
    inputRef.current?.focus()
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleCheck()
  }

  function handleHistoryClick(w) {
    setInputValue(w)
    replayFromHistory(w)
  }

  const finalResult = done && currentStep?.result !== undefined ? currentStep.result : null
  const canStep = !!word && !done
  const visibleSteps = steps.slice(0, stepIdx + 1).reverse()

  return (
    <div className={styles.app}>
      {/* En-tête */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          Palin<span className={styles.accent}>drome</span>
        </h1>
        <p className={styles.subtitle}>Vérificateur pas-à-pas</p>
      </header>

      {/* Zone de saisie */}
      <section className={styles.card}>
        <p className={styles.label}>Entrer un mot</p>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            type="text"
            placeholder="radar, kayak, php…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            autoComplete="off"
            spellCheck={false}
          />
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleCheck}>
            Vérifier
          </button>
          <button className={`${styles.btn} ${styles.btnGhost}`} onClick={handleReset} title="Réinitialiser">
            ↺
          </button>
        </div>
      </section>

      {/* Visualisation */}
      <section className={styles.card}>
        <p className={styles.label}>
          Visualisation{' '}
          {chars.length > 0 && (
            <span className={styles.accent}>— {chars.length} car.</span>
          )}
        </p>

        <div className={styles.charRow}>
          {chars.length === 0 ? (
            <span className={styles.placeholder}>En attente d'un mot…</span>
          ) : (
            chars.map((c, i) => (
              <CharBox key={i} char={c} index={i} status={getCharStatus(i)} />
            ))
          )}
        </div>

        {/* Légende */}
        <div className={styles.legend}>
          <span className={`${styles.dot} ${styles.dotActive}`} /> Comparaison
          <span className={`${styles.dot} ${styles.dotMatch}`} /> Match
          <span className={`${styles.dot} ${styles.dotMismatch}`} /> Différence
          <span className={`${styles.dot} ${styles.dotInner}`} /> En attente
        </div>

        {/* Résultat final */}
        {finalResult !== null && (
          <div className={`${styles.result} ${finalResult ? styles.resultYes : styles.resultNo}`}>
            {finalResult ? '✓ Palindrome !' : '✗ Pas un palindrome'}
          </div>
        )}
      </section>

      {/* Journal des étapes */}
      <section className={styles.card}>
        <div className={styles.stepsHeader}>
          <p className={styles.label}>Journal des étapes</p>
          {steps.length > 0 && (
            <span className={styles.stepCount}>
              {Math.max(0, stepIdx + 1)} / {steps.length}
            </span>
          )}
        </div>

        <div className={styles.stepList}>
          {steps.length === 0 ? (
            <p className={styles.empty}>Les étapes s'afficheront ici après la vérification.</p>
          ) : visibleSteps.length === 0 ? (
            <p className={styles.empty}>Appuyer sur "Étape suivante".</p>
          ) : (
            visibleSteps.map((s, i) => (
              <div
                key={i}
                className={`${styles.stepItem} ${i === 0 ? styles.stepCurrent : styles.stepPast}`}
              >
                <StepTag type={s.type} />
                {s.msg}
              </div>
            ))
          )}
        </div>

        <div className={styles.controls}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={nextStep}
            disabled={!canStep}
          >
            Étape suivante →
          </button>
          <button
            className={`${styles.btn} ${styles.btnGhost}`}
            onClick={autoPlay}
            disabled={!canStep && !isAuto}
          >
            {isAuto ? '⏸ Pause' : '▶ Auto'}
          </button>
        </div>
      </section>

      {/* Historique */}
      {history.length > 0 && (
        <section className={styles.card}>
          <p className={styles.label}>Historique</p>
          <div className={styles.historyList}>
            {[...history].reverse().slice(0, 8).map((h, i) => (
              <div
                key={i}
                className={styles.historyItem}
                onClick={() => handleHistoryClick(h.word)}
              >
                <span className={styles.historyWord}>{h.word}</span>
                <span className={`${styles.badge} ${h.result ? styles.badgeYes : styles.badgeNo}`}>
                  {h.result ? 'palindrome' : 'non'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function StepTag({ type }) {
  const labels = {
    start: 'début',
    match: 'match',
    mismatch: 'diff',
    stop: 'fin',
  }
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px 8px',
        borderRadius: '4px',
        fontSize: '0.6rem',
        marginRight: '0.5rem',
        fontWeight: 500,
        background:
          type === 'match' ? '#1a2400' :
          type === 'mismatch' ? '#2a0d0d' :
          type === 'stop' ? '#1a1a2e' :
          '#2a2a2a',
        color:
          type === 'match' ? '#c8f135' :
          type === 'mismatch' ? '#ff5252' :
          type === 'stop' ? '#8888ff' :
          '#888',
        border: `1px solid ${
          type === 'match' ? '#2a3a00' :
          type === 'mismatch' ? '#4a1a1a' :
          type === 'stop' ? '#2a2a4e' :
          '#3a3a3a'
        }`,
      }}
    >
      {labels[type] || type}
    </span>
  )
}
