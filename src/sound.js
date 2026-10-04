// Small synthesised sounds: no audio files, no network, and silent until the learner interacts.
export const SOUND_KEY = 'case-prep-sound-v1'
let context

export function soundOn(storage) {
  try { return ((storage ?? globalThis.localStorage).getItem(SOUND_KEY) ?? 'on') === 'on' }
  catch { return true }
}

export function setSoundOn(on, storage) {
  try { (storage ?? globalThis.localStorage).setItem(SOUND_KEY, on ? 'on' : 'off'); return true }
  catch { return false }
}

// Each note: frequency in hertz, start offset and length in seconds.
export function notes(kind) {
  return {
    correct: [[587.33, 0, 0.09], [880, 0.07, 0.13]],
    wrong: [[233.08, 0, 0.13], [185, 0.1, 0.18]],
    done: [[587.33, 0, 0.1], [739.99, 0.09, 0.1], [987.77, 0.18, 0.26]],
    tick: [[440, 0, 0.05]],
  }[kind] ?? []
}

function play(kind) {
  if (!soundOn()) return false
  try {
    const Ctor = globalThis.AudioContext ?? globalThis.webkitAudioContext
    if (!Ctor) return false
    context ??= new Ctor()
    if (context.state === 'suspended') context.resume()
    const now = context.currentTime
    for (const [frequency, offset, length] of notes(kind)) {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      // Fade in and out so the note never clicks.
      gain.gain.setValueAtTime(0.0001, now + offset)
      gain.gain.exponentialRampToValueAtTime(0.09, now + offset + 0.015)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + length)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now + offset)
      oscillator.stop(now + offset + length + 0.02)
    }
    return true
  } catch { return false }
}

export const playCorrect = () => play('correct')
export const playWrong = () => play('wrong')
export const playDone = () => play('done')
