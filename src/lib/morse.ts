export const MORSE_DICT: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};

export const REVERSE_MORSE_DICT: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_DICT).map(([k, v]) => [v, k])
);

let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playTone = (durationMs: number): Promise<void> => {
  return new Promise((resolve) => {
    if (!audioCtx) initAudio();
    if (!audioCtx) return resolve();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // 600Hz

    // Smooth attack and release to avoid clicking
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime + (durationMs / 1000) - 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + (durationMs / 1000));

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + (durationMs / 1000));

    setTimeout(() => {
      resolve();
    }, durationMs);
  });
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const playMorseSequence = async (
  text: string,
  onLightChange: (active: boolean) => void,
  checkCancel: () => boolean = () => false
) => {
  initAudio();
  const words = text.toUpperCase().split(' ');
  
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    for (let j = 0; j < word.length; j++) {
      const char = word[j];
      const morse = MORSE_DICT[char];
      
      if (morse) {
        for (let k = 0; k < morse.length; k++) {
          if (checkCancel()) return;
          const symbol = morse[k];
          const duration = symbol === '.' ? 200 : 600;
          
          onLightChange(true);
          await playTone(duration);
          onLightChange(false);
          
          if (checkCancel()) return;
          // Gap between parts of the same letter
          if (k < morse.length - 1) {
            await sleep(200);
          }
        }
      }
      
      if (checkCancel()) return;
      // Gap between letters
      if (j < word.length - 1) {
        await sleep(600);
      }
    }
    
    if (checkCancel()) return;
    // Gap between words (7 dots = 1400ms, but we already waited 600ms after last letter, so wait 800ms more)
    if (i < words.length - 1) {
      await sleep(1400); // Or just 1400ms total gap between words
    }
  }
};
