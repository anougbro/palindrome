import { useState, useRef, useCallback } from 'react'

/**
 * Construit la liste de toutes les étapes de l'algorithme
 * de détection de palindrome (deux pointeurs).
 */
function buildSteps(word) {
  const chars = word.toLowerCase().split('')
  const n = chars.length
  const steps = []

  steps.push({
    type: 'start',
    msg: `Mot "${word}" — ${n} caractère${n > 1 ? 's' : ''}. Début de l'analyse.`,
    lo: 0,
    hi: n - 1,
    matched: [],
  })

  if (n <= 1) {
    steps.push({
      type: 'stop',
      msg: `Un seul caractère → palindrome par définition.`,
      result: true,
      lo: 0,
      hi: n - 1,
      matched: n === 1 ? [0] : [],
    })
    return steps
  }

  let lo = 0
  let hi = n - 1
  const matched = []

  while (lo < hi) {
    if (chars[lo] === chars[hi]) {
      steps.push({
        type: 'match',
        msg: `'${chars[lo]}' (pos ${lo}) = '${chars[hi]}' (pos ${hi}) → égaux, on avance vers le centre.`,
        lo,
        hi,
        matched: [...matched],
      })
      matched.push(lo, hi)
      lo++
      hi--

      if (lo >= hi) {
        const m = [...matched]
        if (lo === hi) m.push(lo)
        steps.push({
          type: 'stop',
          msg:
            lo > hi
              ? `Toutes les paires correspondent → palindrome !`
              : `Caractère central '${chars[lo]}' → palindrome !`,
          result: true,
          lo,
          hi,
          matched: m,
        })
        return steps
      }
    } else {
      steps.push({
        type: 'mismatch',
        msg: `'${chars[lo]}' (pos ${lo}) ≠ '${chars[hi]}' (pos ${hi}) → différents, arrêt.`,
        result: false,
        lo,
        hi,
        matched: [...matched],
      })
      return steps
    }
  }

  const m = [...matched]
  if (lo === hi) m.push(lo)
  steps.push({
    type: 'stop',
    msg: `Toutes les paires correspondent → palindrome !`,
    result: true,
    lo,
    hi,
    matched: m,
  })
  return steps
}

export function usePalindrome() {
  const [word, setWord] = useState('')
  const [steps, setSteps] = useState([])
  const [stepIdx, setStepIdx] = useState(-1)
  const [done, setDone] = useState(false)
  const [history, setHistory] = useState([])
  const autoRef = useRef(null)

  const stopAuto = useCallback(() => {
    if (autoRef.current) {
      clearInterval(autoRef.current)
      autoRef.current = null
    }
  }, [])

  const finalize = useCallback((allSteps) => {
    stopAuto()
    setDone(true)
    const last = allSteps[allSteps.length - 1]
    if (last && last.result !== undefined) {
      setHistory((prev) => {
        const w = word || ''
        if (prev.find((h) => h.word === w)) return prev
        return [...prev, { word: w, result: last.result }]
      })
    }
  }, [stopAuto, word])

  const check = useCallback((inputWord) => {
    stopAuto()
    const w = inputWord.trim()
    if (!w) return
    setWord(w)
    const s = buildSteps(w)
    setSteps(s)
    setStepIdx(0)
    setDone(false)
  }, [stopAuto])

  const nextStep = useCallback(() => {
    setStepIdx((prev) => {
      const next = prev + 1
      if (next >= steps.length - 1) {
        // We'll finalize after state update
        setTimeout(() => finalize(steps), 0)
        return steps.length - 1
      }
      return next
    })
  }, [steps, finalize])

  const autoPlay = useCallback(() => {
    if (autoRef.current) {
      stopAuto()
      return
    }
    autoRef.current = setInterval(() => {
      setStepIdx((prev) => {
        const next = prev + 1
        if (next >= steps.length - 1) {
          setTimeout(() => finalize(steps), 0)
          return steps.length - 1
        }
        return next
      })
    }, 700)
  }, [steps, finalize, stopAuto])

  const reset = useCallback(() => {
    stopAuto()
    setWord('')
    setSteps([])
    setStepIdx(-1)
    setDone(false)
  }, [stopAuto])

  const replayFromHistory = useCallback((w) => {
    stopAuto()
    const s = buildSteps(w)
    setWord(w)
    setSteps(s)
    setStepIdx(0)
    setDone(false)
  }, [stopAuto])

  const currentStep = stepIdx >= 0 && steps[stepIdx] ? steps[stepIdx] : null
  const isAuto = !!autoRef.current

  return {
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
  }
}
