import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// ─── Style registry (mirrors index.js) ───────────────────────────────────────

const styleRegistry = {
    // Romantic
    romantic_hearts: {
        pageBg: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200",
        cardBg: "bg-white/80 border-pink-200/60 text-slate-900",
        overlay: "bg-black/85",
        accent: "from-pink-500 to-rose-500",
        nameColor: "text-pink-600",
        msgColor: "text-slate-700",
        symbol: "❤️", particle: "❤️", particleClass: "text-pink-300/80",
        glow: "shadow-pink-300/40",
        coverTitle: "رسالة خاصة ليكِ",
        coverSub: "اضغط الزر وشوف المفاجأة",
    },
    romantic_roses: {
        pageBg: "bg-gradient-to-br from-red-50 via-rose-100 to-red-200",
        cardBg: "bg-white/80 border-rose-200/60 text-slate-900",
        overlay: "bg-black/85",
        accent: "from-red-500 to-rose-600",
        nameColor: "text-rose-600",
        msgColor: "text-slate-700",
        symbol: "🌹", particle: "🌹", particleClass: "text-rose-400/70",
        glow: "shadow-rose-400/40",
        coverTitle: "وردة ليكِ",
        coverSub: "فيه كلام يستاهل 🌹",
    },
    romantic_night: {
        pageBg: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800",
        cardBg: "bg-white/5 border-indigo-500/20 text-white",
        overlay: "bg-black/90",
        accent: "from-indigo-500 to-purple-600",
        nameColor: "text-indigo-300",
        msgColor: "text-white/80",
        symbol: "🌙", particle: "⭐", particleClass: "text-indigo-300/50",
        glow: "shadow-indigo-500/30",
        coverTitle: "رسالة الليل",
        coverSub: "تحت النجوم 🌙",
    },
    romantic_luxury: {
        pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900",
        cardBg: "bg-white/5 border-yellow-500/20 text-white",
        overlay: "bg-black/92",
        accent: "from-yellow-400 to-amber-500",
        nameColor: "text-yellow-300",
        msgColor: "text-white/80",
        symbol: "✨", particle: "✦", particleClass: "text-yellow-300/40",
        glow: "shadow-yellow-500/20",
        coverTitle: "لحظة فاخرة",
        coverSub: "Premium Feeling ✨",
    },
    romantic_wedding: {
        pageBg: "bg-gradient-to-br from-amber-50 via-white to-yellow-50",
        cardBg: "bg-white/90 border-amber-200/60 text-slate-900",
        overlay: "bg-white/90",
        accent: "from-amber-300 to-yellow-200",
        nameColor: "text-amber-700",
        msgColor: "text-slate-700",
        symbol: "💍", particle: "🤍", particleClass: "text-amber-200/80",
        glow: "shadow-amber-300/40",
        coverTitle: "لحظة لا تُنسى",
        coverSub: "يوم يستحق الاحتفال 💍",
    },
    romantic_valentine: {
        pageBg: "bg-gradient-to-br from-fuchsia-100 via-pink-50 to-rose-100",
        cardBg: "bg-white/80 border-fuchsia-200/60 text-slate-900",
        overlay: "bg-black/85",
        accent: "from-fuchsia-500 to-pink-500",
        nameColor: "text-fuchsia-600",
        msgColor: "text-slate-700",
        symbol: "🎀", particle: "🎀", particleClass: "text-fuchsia-300/70",
        glow: "shadow-fuchsia-300/40",
        coverTitle: "هدية الفلانتين",
        coverSub: "حاجة حلوة مستنياكِ 🎀",
    },
    // Birthday
    birthday_classic: {
        pageBg: "bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100",
        cardBg: "bg-white/80 border-violet-200/60 text-slate-900",
        overlay: "bg-slate-950/88",
        accent: "from-violet-500 to-fuchsia-500",
        nameColor: "text-violet-600",
        msgColor: "text-slate-700",
        symbol: "🎂", particle: "✨", particleClass: "text-violet-300/80",
        glow: "shadow-violet-300/40",
        coverTitle: "عيد ميلاد سعيد!",
        coverSub: "المفاجأة جواه 🎂",
    },
    birthday_balloons: {
        pageBg: "bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100",
        cardBg: "bg-white/80 border-sky-200/60 text-slate-900",
        overlay: "bg-sky-950/88",
        accent: "from-sky-400 to-blue-500",
        nameColor: "text-sky-600",
        msgColor: "text-slate-700",
        symbol: "🎈", particle: "🎈", particleClass: "text-sky-300/70",
        glow: "shadow-sky-300/40",
        coverTitle: "يوم مميز!",
        coverSub: "اضغط وافتح الهدية 🎈",
    },
    birthday_party: {
        pageBg: "bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100",
        cardBg: "bg-white/80 border-orange-200/60 text-slate-900",
        overlay: "bg-slate-950/88",
        accent: "from-orange-400 to-pink-500",
        nameColor: "text-orange-600",
        msgColor: "text-slate-700",
        symbol: "🎉", particle: "🎉", particleClass: "text-orange-300/80",
        glow: "shadow-orange-300/40",
        coverTitle: "حان وقت الاحتفال!",
        coverSub: "الباقة بتستناكِ 🎉",
    },
    birthday_luxury: {
        pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900",
        cardBg: "bg-white/5 border-yellow-400/20 text-white",
        overlay: "bg-black/92",
        accent: "from-yellow-400 to-amber-400",
        nameColor: "text-yellow-300",
        msgColor: "text-white/80",
        symbol: "🥂", particle: "✦", particleClass: "text-yellow-300/40",
        glow: "shadow-yellow-400/20",
        coverTitle: "عيد ميلاد فاخر",
        coverSub: "تستاهل كل الفخامة 🥂",
    },
    birthday_colorful: {
        pageBg: "bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100",
        cardBg: "bg-white/80 border-teal-200/60 text-slate-900",
        overlay: "bg-teal-950/88",
        accent: "from-green-400 to-teal-500",
        nameColor: "text-teal-600",
        msgColor: "text-slate-700",
        symbol: "🌈", particle: "🌈", particleClass: "text-teal-300/70",
        glow: "shadow-teal-300/40",
        coverTitle: "يوم ملون وجميل!",
        coverSub: "مليان ألوان وفرحة 🌈",
    },
    // Cute
    cute_teddy: {
        pageBg: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
        cardBg: "bg-white/80 border-amber-200/60 text-slate-900",
        overlay: "bg-amber-950/80",
        accent: "from-amber-400 to-orange-400",
        nameColor: "text-amber-600",
        msgColor: "text-slate-700",
        symbol: "🧸", particle: "🧸", particleClass: "text-amber-300/60",
        glow: "shadow-amber-300/40",
        coverTitle: "حاجة كيوت ليكِ",
        coverSub: "دبدوب صغير مستناكِ 🧸",
    },
    cute_pastel: {
        pageBg: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
        cardBg: "bg-white/85 border-pink-200/50 text-slate-900",
        overlay: "bg-purple-950/80",
        accent: "from-pink-300 to-purple-300",
        nameColor: "text-pink-500",
        msgColor: "text-slate-600",
        symbol: "🌸", particle: "🌸", particleClass: "text-pink-200/80",
        glow: "shadow-pink-200/50",
        coverTitle: "رسالة باستيل",
        coverSub: "ناعمة وحلوة 🌸",
    },
    cute_cloud: {
        pageBg: "bg-gradient-to-br from-slate-50 via-sky-50 to-white",
        cardBg: "bg-white/90 border-slate-200/50 text-slate-900",
        overlay: "bg-sky-950/80",
        accent: "from-slate-300 to-sky-300",
        nameColor: "text-sky-500",
        msgColor: "text-slate-600",
        symbol: "☁️", particle: "☁️", particleClass: "text-slate-300/70",
        glow: "shadow-slate-200/60",
        coverTitle: "رسالة ناعمة",
        coverSub: "خفيفة زي السحاب ☁️",
    },
    cute_bubbles: {
        pageBg: "bg-gradient-to-br from-cyan-100 via-sky-50 to-white",
        cardBg: "bg-white/80 border-cyan-200/60 text-slate-900",
        overlay: "bg-sky-950/88",
        accent: "from-cyan-400 to-sky-400",
        nameColor: "text-cyan-600",
        msgColor: "text-slate-700",
        symbol: "🫧", particle: "🫧", particleClass: "text-cyan-300/70",
        glow: "shadow-cyan-300/40",
        coverTitle: "كلام فقاعات",
        coverSub: "فيه حاجة لطيفة جواه 🫧",
    },
    cute_kawaii: {
        pageBg: "bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50",
        cardBg: "bg-white/85 border-fuchsia-200/60 text-slate-900",
        overlay: "bg-fuchsia-950/80",
        accent: "from-fuchsia-400 to-pink-400",
        nameColor: "text-fuchsia-500",
        msgColor: "text-slate-600",
        symbol: "🎀", particle: "🎀", particleClass: "text-fuchsia-200/70",
        glow: "shadow-fuchsia-200/60",
        coverTitle: "كاواي رسالة",
        coverSub: "ستايل جذاب ولطيف 🎀",
    },
    // Dark
    dark_galaxy: {
        pageBg: "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900",
        cardBg: "bg-white/5 border-purple-500/20 text-white",
        overlay: "bg-black/90",
        accent: "from-purple-500 to-indigo-600",
        nameColor: "text-purple-300",
        msgColor: "text-white/80",
        symbol: "🌌", particle: "✦", particleClass: "text-purple-300/50",
        glow: "shadow-purple-500/30",
        coverTitle: "رسالة من المجرة",
        coverSub: "بعيد لكن قريب 🌌",
    },
    dark_neon: {
        pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900",
        cardBg: "bg-white/5 border-green-400/20 text-white",
        overlay: "bg-black/92",
        accent: "from-green-400 to-emerald-500",
        nameColor: "text-green-400",
        msgColor: "text-white/80",
        symbol: "✨", particle: "✦", particleClass: "text-green-400/40",
        glow: "shadow-green-400/20",
        coverTitle: "Neon Vibes",
        coverSub: "Glow في الظلام ✨",
    },
    dark_night: {
        pageBg: "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900",
        cardBg: "bg-white/5 border-blue-400/20 text-white",
        overlay: "bg-black/90",
        accent: "from-blue-400 to-indigo-500",
        nameColor: "text-blue-300",
        msgColor: "text-white/80",
        symbol: "🌙", particle: "⭐", particleClass: "text-blue-200/50",
        glow: "shadow-blue-400/20",
        coverTitle: "رسالة الليل",
        coverSub: "جاتك من بعيد 🌙",
    },
    dark_stars: {
        pageBg: "bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900",
        cardBg: "bg-white/5 border-amber-300/20 text-white",
        overlay: "bg-black/90",
        accent: "from-amber-300 to-yellow-200",
        nameColor: "text-amber-300",
        msgColor: "text-white/80",
        symbol: "⭐", particle: "⭐", particleClass: "text-amber-200/50",
        glow: "shadow-amber-300/20",
        coverTitle: "تحت النجوم",
        coverSub: "رسالة مضيئة ⭐",
    },
    dark_purple: {
        pageBg: "bg-gradient-to-br from-slate-950 via-fuchsia-950 to-purple-950",
        cardBg: "bg-white/5 border-fuchsia-500/20 text-white",
        overlay: "bg-black/92",
        accent: "from-fuchsia-500 to-purple-600",
        nameColor: "text-fuchsia-300",
        msgColor: "text-white/80",
        symbol: "💜", particle: "💜", particleClass: "text-fuchsia-300/50",
        glow: "shadow-fuchsia-500/20",
        coverTitle: "بنفسجي وهادئ",
        coverSub: "حاجة Mysterious 💜",
    },
};

// Fallback for legacy "romantic" / "birthday" / "cute" / "dark" theme ids
const legacyThemeMap = {
    romantic: "romantic_hearts",
    birthday: "birthday_classic",
    cute: "cute_bubbles",
    dark: "dark_galaxy",
};

function resolveStyle(themeId) {
    const key = legacyThemeMap[themeId] ?? themeId;
    return styleRegistry[key] ?? styleRegistry.romantic_hearts;
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text, started, speed = 38) {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        if (!started || !text) return;
        setDisplayed("");
        let i = 0;
        const tick = () => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i < text.length) setTimeout(tick, speed);
        };
        setTimeout(tick, speed);
    }, [text, started, speed]);
    return displayed;
}

// ─── Particle system ──────────────────────────────────────────────────────────

function Particles({ theme }) {
    const particles = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${6 + ((i * 11) % 88)}%`,
        duration: 7 + (i % 5),
        delay: i * 0.32,
        size: 13 + (i % 4) * 6,
    }));
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: 800, opacity: 0 }}
                    animate={{ y: -200, opacity: [0, 0.85, 0.85, 0], rotate: [0, 15, -10, 0] }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" }}
                    className={`absolute select-none ${theme.particleClass}`}
                    style={{ left: p.left, fontSize: p.size }}
                >
                    {theme.particle}
                </motion.div>
            ))}
        </div>
    );
}

// ─── Tilt image ───────────────────────────────────────────────────────────────

function TiltImage({ src }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

    function handleMouse(e) {
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    }
    function handleLeave() { x.set(0); y.set(0); }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={handleLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="mx-auto mb-6 aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-2xl"
        >
            <motion.img
                src={src}
                alt="page"
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.4 }}
            />
        </motion.div>
    );
}

// ─── Opening effects ──────────────────────────────────────────────────────────

function EnvelopeOpening({ theme, onOpen }) {
    const [flap, setFlap] = useState(false);
    const [done, setDone] = useState(false);

    function handleClick() {
        if (done) return;
        setFlap(true);
        setTimeout(() => { setDone(true); onOpen(); }, 900);
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <motion.div
                onClick={handleClick}
                className="relative cursor-pointer select-none"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
            >
                <div className={`relative h-44 w-72 overflow-visible rounded-3xl bg-gradient-to-br ${theme.accent} shadow-2xl ${theme.glow}`}>
                    {/* Envelope body */}
                    <div className="absolute inset-0 rounded-3xl" />
                    {/* Bottom flaps */}
                    <div className="absolute bottom-0 left-0 h-24 w-1/2 origin-bottom-left rotate-0 skew-x-6 rounded-bl-3xl bg-white/10" />
                    <div className="absolute bottom-0 right-0 h-24 w-1/2 origin-bottom-right rotate-0 -skew-x-6 rounded-br-3xl bg-white/10" />
                    {/* Top flap */}
                    <motion.div
                        animate={flap ? { rotateX: 180, y: -10 } : { rotateX: 0 }}
                        transition={{ duration: 0.7, ease: "easeInOut" }}
                        style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                        className="absolute -top-4 left-0 right-0 mx-auto h-24 w-72 origin-top"
                    >
                        <div className={`h-full w-full bg-gradient-to-br ${theme.accent} opacity-80 rounded-t-3xl`}
                             style={{ clipPath: "polygon(0 0, 50% 100%, 100% 0)" }}
                        />
                    </motion.div>
                    {/* Heart inside */}
                    <motion.div
                        animate={flap ? { y: [-10, -50, -80], opacity: [1, 1, 0] } : { y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center text-5xl"
                    >
                        💌
                    </motion.div>
                </div>
            </motion.div>
            <motion.p
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-sm font-medium text-white/70"
            >
                اضغط على الظرف لفتحه
            </motion.p>
        </div>
    );
}

function HeartUnlock({ theme, onOpen }) {
    const [pressed, setPressed] = useState(0);
    const total = 3;

    function handlePress() {
        const next = pressed + 1;
        setPressed(next);
        if (next >= total) setTimeout(onOpen, 400);
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-center">
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePress}
                    className="relative flex h-36 w-36 items-center justify-center"
                >
                    {/* Rings */}
                    {Array.from({ length: pressed }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className={`absolute inset-0 rounded-full bg-gradient-to-br ${theme.accent} opacity-30`}
                        />
                    ))}
                    <motion.div
                        animate={{ scale: pressed >= total ? [1, 1.4, 1] : [1, 1.08, 1] }}
                        transition={{ duration: 0.4 }}
                        className="text-7xl"
                    >
                        {pressed >= total ? "💖" : "🤍"}
                    </motion.div>
                </motion.button>
                <div className="mt-4 flex justify-center gap-2">
                    {Array.from({ length: total }).map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ scale: i < pressed ? 1.2 : 1 }}
                            className={`h-2 w-2 rounded-full transition-colors ${i < pressed ? `bg-gradient-to-r ${theme.accent}` : "bg-white/30"}`}
                        />
                    ))}
                </div>
            </div>
            <p className="text-sm font-medium text-white/70">اضغط القلب {total} مرات</p>
        </div>
    );
}

function ScratchReveal({ theme, onOpen }) {
    const canvasRef = useRef(null);
    const [scratched, setScratched] = useState(0);
    const isDrawing = useRef(false);
    const THRESHOLD = 55;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#374151";
        ctx.beginPath();
        ctx.roundRect(0, 0, canvas.width, canvas.height, 20);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("اكشط هنا ✏️", canvas.width / 2, canvas.height / 2);
    }, []);

    function scratch(e) {
        if (!isDrawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 28, 0, Math.PI * 2);
        ctx.fill();

        // measure transparency
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparent = 0;
        for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++;
        const pct = Math.round((transparent / (data.length / 4)) * 100);
        setScratched(pct);
        if (pct >= THRESHOLD) onOpen();
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-72 h-40 rounded-2xl overflow-hidden">
                {/* Hint underneath */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${theme.accent} text-white text-xl font-bold`}>
                    💌 رسالة لك
                </div>
                <canvas
                    ref={canvasRef}
                    width={288} height={160}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    onMouseDown={() => { isDrawing.current = true; }}
                    onMouseUp={() => { isDrawing.current = false; }}
                    onMouseLeave={() => { isDrawing.current = false; }}
                    onMouseMove={scratch}
                    onTouchStart={() => { isDrawing.current = true; }}
                    onTouchEnd={() => { isDrawing.current = false; }}
                    onTouchMove={scratch}
                />
            </div>
            <div className="h-1 w-72 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${theme.accent}`}
                    animate={{ width: `${Math.min(scratched, 100)}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>
            <p className="text-sm font-medium text-white/70">{scratched < THRESHOLD ? "اكشط لتكشف الرسالة" : "مبروك! 🎉"}</p>
        </div>
    );
}

function MultiStepReveal({ theme, onOpen }) {
    const [step, setStep] = useState(0);
    const total = 5;
    const messages = ["💭", "❤️", "💌", "✨", "🎁"];

    function handlePress() {
        const next = step + 1;
        setStep(next);
        if (next >= total) setTimeout(onOpen, 500);
    }

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative flex h-40 w-40 items-center justify-center">
                {/* Progress ring */}
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <motion.circle
                        cx="50" cy="50" r="44"
                        fill="none"
                        stroke="url(#grad)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 44}`}
                        animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - step / total) }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <defs>
                        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>
                </svg>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={handlePress}
                    disabled={step >= total}
                    className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={step}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="text-4xl"
                        >
                            {messages[Math.min(step, total - 1)]}
                        </motion.span>
                    </AnimatePresence>
                    <span className="mt-1 text-xs font-bold text-white/70">{step}/{total}</span>
                </motion.button>
            </div>
            <p className="text-sm font-medium text-white/70">
                {step < total ? `اضغط ${total - step} مرة أخرى` : "افتح الرسالة! 🎉"}
            </p>
        </div>
    );
}

// ─── Message card ─────────────────────────────────────────────────────────────

function MessageCard({ page, theme }) {
    const [showText, setShowText] = useState(false);
    const displayedMsg = useTypewriter(page.message, showText, 35);

    useEffect(() => {
        const t = setTimeout(() => setShowText(true), 600);
        return () => clearTimeout(t);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.84, y: 36 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className={`relative w-full max-w-2xl overflow-hidden rounded-[2.25rem] border backdrop-blur-2xl ${theme.cardBg} shadow-2xl ${theme.glow}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />

            <div className="relative p-6 md:p-10 text-center">
                {page.imageUrl && <TiltImage src={page.imageUrl} />}

                {page.name && (
                    <motion.h2
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className={`text-4xl font-black tracking-tight md:text-5xl ${theme.nameColor}`}
                    >
                        {page.name}
                    </motion.h2>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`mx-auto mt-5 min-h-[4rem] max-w-2xl text-xl leading-[2.2] md:text-2xl ${theme.msgColor}`}
                    style={{ direction: "rtl" }}
                >
                    {displayedMsg}
                    {showText && displayedMsg.length < (page.message?.length ?? 0) && (
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="inline-block ml-1 w-0.5 h-6 bg-current align-middle"
                        />
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.55, delay: 0.5 }}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70"
                >
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Opened with love
                </motion.div>
            </div>
        </motion.div>
    );
}

// ─── Cover card (before opening) ─────────────────────────────────────────────

function CoverCard({ page, theme, onOpen }) {
    const effect = page.openEffect ?? "envelope";

    return (
        <motion.div
            key="cover"
            initial={{ opacity: 0, scale: 0.87, y: 22 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.06, y: -10 }}
            transition={{ duration: 0.55 }}
            className={`relative w-full max-w-xl overflow-hidden rounded-[2.25rem] border backdrop-blur-2xl ${theme.cardBg} shadow-2xl ${theme.glow}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />

            <div className="relative p-10 text-center">
                <motion.div
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-6 flex justify-center text-7xl"
                >
                    {theme.symbol}
                </motion.div>

                <h1 className={`text-4xl font-black tracking-tight md:text-5xl ${theme.nameColor}`}>
                    {theme.coverTitle}
                </h1>

                <p className={`mt-3 text-sm leading-7 ${theme.msgColor}`}>
                    {theme.coverSub}
                </p>

                <div className="mt-10">
                    {effect === "envelope" && <EnvelopeOpening theme={theme} onOpen={onOpen} />}
                    {effect === "heartUnlock" && <HeartUnlock theme={theme} onOpen={onOpen} />}
                    {effect === "scratch" && <ScratchReveal theme={theme} onOpen={onOpen} />}
                    {effect === "multiStep" && <MultiStepReveal theme={theme} onOpen={onOpen} />}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Page view ────────────────────────────────────────────────────────────────

export default function PageView() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState(false);

    useEffect(() => {
        async function loadPage() {
            const id = window.location.pathname.split("/").pop();
            const snap = await getDoc(doc(db, "pages", id));
            if (snap.exists()) setPage(snap.data());
            setLoading(false);
        }
        loadPage();
    }, []);

    const theme = page ? resolveStyle(page.theme) : resolveStyle("romantic_hearts");

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-5xl"
                >
                    💌
                </motion.div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
                الصفحة مش موجودة 😔
            </div>
        );
    }

    return (
        <main className={`relative min-h-screen overflow-hidden ${theme.pageBg} flex items-center justify-center p-6`}>
            <Particles theme={theme} />

            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.35, 0.15] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-fuchsia-300/15 blur-3xl"
                />
            </div>

            <AnimatePresence mode="wait">
                {!opened ? (
                    <CoverCard key="cover" page={page} theme={theme} onOpen={() => setOpened(true)} />
                ) : (
                    <MessageCard key="message" page={page} theme={theme} />
                )}
            </AnimatePresence>
        </main>
    );
}