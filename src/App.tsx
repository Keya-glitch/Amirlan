import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Heart, Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import YouTube, { YouTubeProps } from 'react-youtube';

const Eye = ({ top, left, size, delay, duration }: { top: string, left: string, size: number, delay: number, duration: number }) => {
  const eyeRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - eyeCenterX;
      const dy = e.clientY - eyeCenterY;
      const angle = Math.atan2(dy, dx);
      
      const maxDistance = size / 4;
      const distance = Math.min(maxDistance, Math.hypot(dx, dy) / 10);

      mouseX.set(Math.cos(angle) * distance);
      mouseY.set(Math.sin(angle) * distance);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, size]);

  return (
    <div
      className="absolute z-0 pointer-events-none"
      style={{ top, left, width: size, height: size / 1.4 }}
    >
      <motion.div
        ref={eyeRef}
        className="w-full h-full bg-[#1a0505] rounded-[50%] overflow-hidden relative flex items-center justify-center border border-red-900/40 shadow-[0_0_25px_rgba(220,38,38,0.2)] backdrop-blur-[2px]"
        animate={{ scaleY: [1, 1, 0, 1, 1] }}
        transition={{
          duration: duration,
          times: [0, 0.45, 0.48, 0.52, 1],
          repeat: Infinity,
          repeatDelay: delay,
          ease: "easeInOut"
        }}
      >
        {/* Eye veins effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,transparent_40%,#7f1d1d_100%)]"></div>
        
        <motion.div
          className="rounded-full relative flex items-center justify-center"
          style={{
            width: size / 1.8,
            height: size / 1.8,
            x: smoothX,
            y: smoothY,
            backgroundColor: '#000',
            border: '1px solid #450a0a'
          }}
        >
          {/* Iris Glow */}
          <div className="absolute inset-0 rounded-full bg-red-900/30 blur-[2px]" />
          
          {/* Pupil */}
          <div className="w-[45%] h-[45%] bg-red-600 rounded-full shadow-[0_0_10px_#ef4444] relative overflow-hidden">
             {/* Pupil highlight */}
             <div className="absolute top-[15%] left-[15%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[0.5px]" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const BackgroundEyes = () => {
  const eyes = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 96 + 2}%`,
    left: `${Math.random() * 96 + 2}%`,
    size: Math.random() * 35 + 20, // 20px to 55px
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2, // 2 to 5 seconds
  })), []);

  return (
    <>
      {eyes.map((eye) => (
        <Eye key={eye.id} {...eye} />
      ))}
    </>
  );
};

export default function App() {
  const [step, setStep] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const [bouquetRevealed, setBouquetRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setYoutubePlayer(event.target);
    // Set initial state
    if (isMuted) {
      event.target.mute();
    } else {
      event.target.unMute();
    }
  };

  const startMusic = () => {
    if (youtubePlayer && !isPlaying) {
      youtubePlayer.playVideo();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (youtubePlayer) {
      if (isMuted) {
        youtubePlayer.unMute();
      } else {
        youtubePlayer.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleNoHover = () => {
    setNoPosition({
      x: Math.random() * 250 - 125,
      y: Math.random() * 150 - 75,
    });
  };

  const handleYesClick = () => {
    setStep(3);
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#450a0a', '#7f1d1d', '#991b1b', '#000000']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#450a0a', '#7f1d1d', '#991b1b', '#000000']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* YouTube Background Player (Hidden) */}
      <div className="fixed opacity-0 pointer-events-none -z-50">
        <YouTube 
          videoId="-jRKsiAOAA8" 
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              loop: 1,
              playlist: '-jRKsiAOAA8',
              controls: 0,
            },
          }} 
          onReady={onPlayerReady}
        />
      </div>

      {/* Background Decorative Shapes */}
      <div className="absolute top-[-50px] left-[-50px] w-64 md:w-96 h-64 md:h-96 bg-red-950 rounded-full mix-blend-screen filter blur-[100px] opacity-40 pointer-events-none z-0"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-72 md:w-[400px] h-72 md:h-[400px] bg-red-900 rounded-full mix-blend-screen filter blur-[100px] opacity-30 pointer-events-none z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-red-800 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none z-0"></div>

      {/* Pinterest GIF Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'url("https://i.pinimg.com/originals/33/4e/ba/334eba587e75f97ff0ebcdefc484496c.gif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'hue-rotate(130deg) saturate(3) brightness(0.6) contrast(1.2)'
        }}
      />

      {/* Creepy but cool blinking eyes */}
      <BackgroundEyes />

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center cursor-pointer z-10"
            onClick={() => {
              setStep(1);
              startMusic();
            }}
          >
            <div className="relative group p-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative z-10"
              >
                {/* Outer Sigil Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                  className="absolute -inset-6 md:-inset-8 rounded-full border-[2px] border-dashed border-red-600/70"
                ></motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                  className="absolute -inset-3 md:-inset-4 rounded-full border-[3px] border-dotted border-red-500/60"
                ></motion.div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                  className="absolute -inset-1 rounded-full border-[1px] border-red-400/40"
                ></motion.div>

                {/* Main Image Container */}
                <div className="bg-slate-950 p-2 md:p-3 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.5)] border-2 border-red-800 relative z-10 transition-all duration-500 group-hover:shadow-[0_0_80px_rgba(220,38,38,0.8)] group-hover:border-red-500">
                  <img 
                    src="https://i.pinimg.com/736x/69/63/3f/69633f4f7c4f37e642b9351f5d36963d.jpg" 
                    alt="Sigil preview" 
                    className="w-48 md:w-64 h-48 md:h-64 object-cover rounded-full mix-blend-screen opacity-90" 
                    referrerPolicy="no-referrer" 
                  />
                  {/* Inner overlay glow */}
                  <div className="absolute inset-0 rounded-full shadow-[inset_0_0_40px_rgba(220,38,38,0.6)] mix-blend-screen pointer-events-none border border-red-500/20"></div>
                </div>
                
                <motion.div
                  className="absolute top-0 right-0 md:-top-2 md:-right-2 bg-red-950 rounded-full p-2 md:p-3 shadow-lg shadow-red-900/80 z-20 border border-red-600/50"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Heart className="w-6 h-6 text-red-200 fill-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                </motion.div>
              </motion.div>
            </div>
            <p className="mt-12 text-6xl md:text-8xl font-black text-red-700 tracking-[0.1em] drop-shadow-[0_0_20px_rgba(185,28,28,0.5)] text-center uppercase italic font-sans">
              KEYA
            </p>
            <div className="mt-8 inline-block px-6 py-2 bg-red-800/80 text-white text-sm font-bold rounded-sm uppercase tracking-[0.2em] animate-pulse shadow-xl shadow-red-950/80 border border-red-600/30 backdrop-blur-sm">
              энийг Дарж үзвэл
              нэг бол инээд чинь хүрнэ 
              нэг бол гайхна
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative max-w-xl w-full z-10"
          >
            {/* Gothic Letter/Envelope Wrapper */}
            <div className="bg-[#1a0505] p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,1),0_0_30px_rgba(220,38,38,0.3)] border-2 border-red-950 relative overflow-hidden">
              {/* Parchment Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none"></div>
              
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-red-900"></div>
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-red-900"></div>
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-red-900"></div>
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-red-900"></div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-10 text-center"
              >
                <div className="inline-block px-4 py-1 bg-red-950/80 text-red-500 text-xs font-bold rounded-sm uppercase tracking-[0.2em] mb-6 border border-red-900 shadow-sm shadow-red-950">~ For My Dearest ~</div>
                <h2 className="text-4xl md:text-5xl font-black text-red-700 mb-10 italic uppercase leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider">Aloha </h2>
                
                <div className="space-y-6 text-left border-l border-red-900/40 pl-6 ml-2">
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="group">
                    <p className="font-bold text-red-800 text-sm uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">The way you shine</p>
                    <p className="text-lg text-slate-300 font-medium leading-relaxed italic">Магадгүй чи анзаараагүй байж магадгүй л дээ ...гэхдээ ядаж ингэж чамд сэтгэлтэй байсан аа илэрхийлэхийг хүссэн юм.</p>
                  </motion.div>
                  
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.6 }} className="group">
                    <p className="font-bold text-red-800 text-sm uppercase tracking-widest mb-1 group-hover:text-red-600 transition-colors">Always on my mind</p>
                    <p className="text-lg text-slate-300 font-medium leading-relaxed italic">Анх зүгээр харчаад ямар  хөөрхөн охин бэ гэж  хараад л яваад л байсан надад танилцах зориг байгаагүй ингэж явсаар жил хагас болсон байна DDx^^ .</p>
                  </motion.div>
                </div>

                <div className="mt-12 flex flex-col items-center">
                  {/* Wax Seal like design */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.8, type: "spring" }}
                    className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center shadow-lg shadow-black border-2 border-red-950 mb-4"
                  >
                    <div className="text-red-600 font-bold select-none text-lg">⛧</div>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.5 }}
                    onClick={() => setStep(2)}
                    className="group relative px-8 py-3 overflow-hidden font-bold text-red-700 uppercase tracking-widest transition-all"
                  >
                    <span className="relative z-10">ЦААШ...</span>
                    <div className="absolute inset-0 border-b border-red-900 group-hover:border-red-600 transition-colors"></div>
                    <motion.div 
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/70 backdrop-blur-xl p-10 md:p-14 rounded-[40px] shadow-2xl shadow-red-950/40 max-w-xl w-full text-center border border-red-500/20 z-10"
            ref={containerRef}
          >
            <div className="inline-block px-4 py-1 bg-red-700 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-6 shadow-md"> </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mx-auto mb-8 flex justify-center z-10 relative"
            >
              <img 
                src="https://i.pinimg.com/originals/38/8d/fe/388dfeef3b9a1df894c1d05158eafee4.gif" 
                alt="Please?" 
                className="w-32 md:w-48 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500/30" 
                referrerPolicy="no-referrer" 
              />
            </motion.div>
            <h2 className="text-3xl md:text-5xl font-black text-red-600 mb-12 italic uppercase leading-tight drop-shadow-md">
               Надтай ядаж найз байж болох уу? ⛧⸸
            </h2>

            <div className="flex items-center justify-center gap-4 relative h-32 md:h-24">
              <motion.button
                onClick={handleYesClick}
                className="bg-gradient-to-r from-red-900 to-red-600 text-white px-10 py-4 rounded-full font-bold text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)] hover:from-red-800 hover:to-red-500 active:scale-95 transition-all z-20 w-40 border border-red-400/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                За! 🥰
              </motion.button>

              <motion.button
                animate={{ x: noPosition.x, y: noPosition.y }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                onMouseEnter={handleNoHover}
                onClick={handleNoHover}
                className="absolute bg-slate-800/90 backdrop-blur text-slate-300 px-8 py-4 rounded-full font-bold text-xl shadow-md border border-slate-700 z-10 whitespace-nowrap"
                style={{ left: "calc(50% + 10px)" }}
              >
                NO☠
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-slate-900/70 backdrop-blur-xl p-10 md:p-14 rounded-[40px] shadow-2xl shadow-red-950/40 max-w-xl w-full text-center border border-red-500/20 z-10"
          >
            <div className="inline-block px-4 py-1 bg-red-700 text-white text-xs font-bold rounded-full uppercase tracking-widest mb-6 shadow-md">Success</div>
            
            <motion.div
              animate={{ 
                scale: bouquetRevealed ? [1, 1.2, 1] : [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: bouquetRevealed ? 1.5 : 3, 
                ease: "easeInOut" 
              }}
              className="mb-8 relative w-32 h-32 mx-auto flex items-center justify-center bg-red-950/30 rounded-full border border-red-500/20"
            >
              {bouquetRevealed ? (
                <span className="text-6xl drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] z-10">💐</span>
              ) : (
                <Heart className="w-16 h-16 text-red-600 fill-red-700 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] z-10" />
              )}
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl opacity-60"></div>
            </motion.div>
            
            {!bouquetRevealed ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setBouquetRevealed(true);
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff0000', '#ff6666', '#ffcccc']
                  });
                }}
                className="text-4xl md:text-5xl font-bold text-red-600 mb-6 italic uppercase leading-tight drop-shadow-md tracking-wide bg-transparent border-none cursor-pointer hover:text-red-500 transition-colors"
              >
                Баярлалаа ❤️
              </motion.button>
            ) : (
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-red-600 mb-6 italic uppercase leading-tight drop-shadow-md tracking-wide"
              >
                Чамд зориулав! ✨
              </motion.h2>
            )}

            <div className="bg-red-950/50 p-6 md:p-8 rounded-3xl border border-red-800/40 mt-8 shadow-inner">
              <p className="text-lg md:text-xl text-red-100 font-medium mb-3 leading-relaxed">
                {bouquetRevealed 
                  ? "энэ бүх зүйлийг тоохгүй байж болноо гэхдээ энэ цэцэгийг чамд" 
                  : "ядаж хүсвэл над руу бичээрэй, эсвэл гунигтай үедээ бичээрэй хүсэхгүй байвал зүгээр л тоохгүй хаясан ч болно шүү !"}
              </p>
              <p className="text-red-400/50 font-normal text-xs md:text-sm italic">
                (You made me the happiest person today)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer Label */}
      <p className="absolute bottom-6 text-red-900/40 font-bold text-xs tracking-widest uppercase z-0">
        Made with a lot of thinking of you
      </p>

      {/* Audio Toggle */}
      {isPlaying && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-50 p-3 bg-red-950/80 border border-red-800/50 rounded-full text-red-500 hover:text-red-400 hover:bg-red-900 transition-all shadow-lg"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      )}
    </div>
  );
}
