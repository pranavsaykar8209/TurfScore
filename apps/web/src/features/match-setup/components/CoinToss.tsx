import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui';

interface CoinTossProps {
  onResult: (result: 'HEAD' | 'TAIL') => void;
}

export default function CoinToss({ onResult }: CoinTossProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'HEAD' | 'TAIL' | null>(null);

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);

    // Simulate flip
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'HEAD' : 'TAIL';
      setResult(outcome);
      setIsFlipping(false);
      onResult(outcome);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-fit">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isFlipping && !result && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-brand-green/20 dark:bg-brand-green/10 rounded-full border-2 border-brand-green/50 dark:border-brand-green/30 text-slate-800 dark:text-brand-green"
            >
              <Coins className="w-10 h-10 mb-2 opacity-60 dark:opacity-50" />
              <span className="text-xs font-medium text-center">Ready for<br/>Toss</span>
            </motion.div>
          )}

          {isFlipping && (
            <motion.div
              key="flipping"
              animate={{
                rotateY: [0, 180, 360, 540, 720, 900, 1080],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center bg-brand-green text-brand-dark rounded-full shadow-[0_0_20px_rgba(184,255,26,0.5)]"
            >
              <Coins className="w-12 h-12" />
            </motion.div>
          )}

          {!isFlipping && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-brand-green text-brand-dark rounded-full shadow-[0_0_20px_rgba(184,255,26,0.5)]"
            >
              <span className="text-2xl font-bold tracking-wider">{result}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button
        onClick={flipCoin}
        disabled={isFlipping}
        className="w-full max-w-[200px]"
        size="lg"
      >
        <Coins className="w-5 h-5 mr-2" />
        {isFlipping ? 'Flipping...' : result ? 'Flip Again' : 'Flip Coin'}
      </Button>
    </div>
  );
}
