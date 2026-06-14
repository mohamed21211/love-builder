import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, Sparkles, ImagePlus, Link as LinkIcon, Palette,
    MessageCircle, UserRound, ArrowRight, Copy, Check,
    ChevronRight, QrCode, ExternalLink, Smartphone,
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// ─── Sub-styles ───────────────────────────────────────────────────────────────

const subStyles = {
    romantic: [
        { id:"romantic_hearts", label:"Romantic Hearts", symbol:"❤️", accent:"from-pink-500 to-rose-500", pageBg:"bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200", previewBg:"from-pink-100 via-rose-50 to-pink-200", previewText:"text-slate-900", cardBg:"bg-white/75 border-pink-200/60 text-slate-900", panel:"border-pink-200/60 bg-white/80", glow:"shadow-pink-300/40", particle:"❤️", particleClass:"text-pink-300/80", openEffect:"envelope", title:"رسالة خاصة ليك", subtitle:"اضغط وشوف ❤️", isDark:false, accentHex:"#f43f5e" },
        { id:"romantic_roses", label:"Romantic Roses", symbol:"🌹", accent:"from-red-500 to-rose-600", pageBg:"bg-gradient-to-br from-red-50 via-rose-100 to-red-200", previewBg:"from-red-50 via-rose-100 to-red-200", previewText:"text-slate-900", cardBg:"bg-white/80 border-rose-200/60 text-slate-900", panel:"border-rose-200/60 bg-white/80", glow:"shadow-rose-400/40", particle:"🌹", particleClass:"text-rose-400/70", openEffect:"heartUnlock", title:"وردة ليكِ", subtitle:"فيه كلام يستاهل🌹", isDark:false, accentHex:"#e11d48" },
        { id:"romantic_night", label:"Romantic Night", symbol:"🌙", accent:"from-indigo-500 to-purple-600", pageBg:"bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800", previewBg:"from-slate-900 via-indigo-950 to-slate-800", previewText:"text-white", cardBg:"bg-white/5 border-indigo-500/20 text-white", panel:"border-indigo-500/20 bg-indigo-950/40", glow:"shadow-indigo-500/30", particle:"⭐", particleClass:"text-indigo-300/60", openEffect:"scratch", title:"رسالة الليل", subtitle:"تحت النجوم... 🌙", isDark:true, accentHex:"#6366f1" },
        { id:"romantic_luxury", label:"Romantic Luxury", symbol:"✨", accent:"from-yellow-400 to-amber-500", pageBg:"bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900", previewBg:"from-slate-950 via-slate-900 to-zinc-900", previewText:"text-white", cardBg:"bg-white/5 border-yellow-500/20 text-white", panel:"border-yellow-500/20 bg-black/40", glow:"shadow-yellow-500/20", particle:"✦", particleClass:"text-yellow-400/40", openEffect:"multiStep", title:"لحظة فاخرة", subtitle:"Premium Feeling ✨", isDark:true, accentHex:"#f59e0b" },
        { id:"romantic_wedding", label:"Romantic Wedding", symbol:"💍", accent:"from-amber-300 to-yellow-200", pageBg:"bg-gradient-to-br from-amber-50 via-white to-yellow-50", previewBg:"from-amber-50 via-white to-yellow-50", previewText:"text-slate-900", cardBg:"bg-white/90 border-amber-200/60 text-slate-900", panel:"border-amber-200/60 bg-white/90", glow:"shadow-amber-300/40", particle:"🤍", particleClass:"text-amber-200/80", openEffect:"envelope", title:"لحظة لا تُنسى", subtitle:"يوم يستحق الاحتفال 💍", isDark:false, accentHex:"#d97706" },
        { id:"romantic_valentine", label:"Romantic Valentine", symbol:"🎀", accent:"from-fuchsia-500 to-pink-500", pageBg:"bg-gradient-to-br from-fuchsia-100 via-pink-50 to-rose-100", previewBg:"from-fuchsia-100 via-pink-50 to-rose-100", previewText:"text-slate-900", cardBg:"bg-white/80 border-fuchsia-200/60 text-slate-900", panel:"border-fuchsia-200/60 bg-white/80", glow:"shadow-fuchsia-300/40", particle:"🎀", particleClass:"text-fuchsia-300/70", openEffect:"heartUnlock", title:"هدية الفلانتين", subtitle:"حاجة حلوة مستنياكِ 🎀", isDark:false, accentHex:"#d946ef" },
    ],
    birthday: [
        { id:"birthday_classic", label:"Classic Birthday", symbol:"🎂", accent:"from-violet-500 to-fuchsia-500", pageBg:"bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100", previewBg:"from-violet-100 via-fuchsia-50 to-pink-100", previewText:"text-slate-900", cardBg:"bg-white/80 border-violet-200/60 text-slate-900", panel:"border-violet-200/60 bg-white/80", glow:"shadow-violet-300/40", particle:"✨", particleClass:"text-violet-300/80", openEffect:"multiStep", title:"عيد ميلاد سعيد!", subtitle:"المفاجأة جواه 🎂", isDark:false, accentHex:"#8b5cf6" },
        { id:"birthday_balloons", label:"Balloons", symbol:"🎈", accent:"from-sky-400 to-blue-500", pageBg:"bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100", previewBg:"from-sky-100 via-blue-50 to-cyan-100", previewText:"text-slate-900", cardBg:"bg-white/80 border-sky-200/60 text-slate-900", panel:"border-sky-200/60 bg-white/80", glow:"shadow-sky-300/40", particle:"🎈", particleClass:"text-sky-300/80", openEffect:"scratch", title:"يوم مميز!", subtitle:"اضغط وافتح الهدية 🎈", isDark:false, accentHex:"#0ea5e9" },
        { id:"birthday_party", label:"Party", symbol:"🎉", accent:"from-orange-400 to-pink-500", pageBg:"bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100", previewBg:"from-orange-100 via-yellow-50 to-pink-100", previewText:"text-slate-900", cardBg:"bg-white/80 border-orange-200/60 text-slate-900", panel:"border-orange-200/60 bg-white/80", glow:"shadow-orange-300/40", particle:"🎉", particleClass:"text-orange-300/80", openEffect:"envelope", title:"حان وقت الاحتفال!", subtitle:"الباقة بتستناكِ 🎉", isDark:false, accentHex:"#f97316" },
        { id:"birthday_luxury", label:"Luxury Birthday", symbol:"🥂", accent:"from-yellow-400 to-amber-400", pageBg:"bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900", previewBg:"from-slate-950 via-slate-900 to-zinc-900", previewText:"text-white", cardBg:"bg-white/5 border-yellow-400/20 text-white", panel:"border-yellow-400/20 bg-black/40", glow:"shadow-yellow-400/20", particle:"✦", particleClass:"text-yellow-300/50", openEffect:"multiStep", title:"عيد ميلاد فاخر", subtitle:"تستاهل كل الفخامة 🥂", isDark:true, accentHex:"#fbbf24" },
        { id:"birthday_colorful", label:"Colorful Birthday", symbol:"🌈", accent:"from-green-400 to-teal-500", pageBg:"bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100", previewBg:"from-green-100 via-teal-50 to-cyan-100", previewText:"text-slate-900", cardBg:"bg-white/80 border-teal-200/60 text-slate-900", panel:"border-teal-200/60 bg-white/80", glow:"shadow-teal-300/40", particle:"🌈", particleClass:"text-teal-300/70", openEffect:"heartUnlock", title:"يوم ملون وجميل!", subtitle:"مليان ألوان وفرحة 🌈", isDark:false, accentHex:"#14b8a6" },
    ],
    cute: [
        { id:"cute_teddy", label:"Teddy", symbol:"🧸", accent:"from-amber-400 to-orange-400", pageBg:"bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50", previewBg:"from-amber-50 via-orange-50 to-yellow-50", previewText:"text-slate-900", cardBg:"bg-white/80 border-amber-200/60 text-slate-900", panel:"border-amber-200/60 bg-white/80", glow:"shadow-amber-300/40", particle:"🧸", particleClass:"text-amber-300/70", openEffect:"heartUnlock", title:"حاجة كيوت ليكِ", subtitle:"دبدوب صغير مستناكِ 🧸", isDark:false, accentHex:"#f59e0b" },
        { id:"cute_pastel", label:"Pastel", symbol:"🌸", accent:"from-pink-300 to-purple-300", pageBg:"bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50", previewBg:"from-pink-50 via-purple-50 to-blue-50", previewText:"text-slate-900", cardBg:"bg-white/85 border-pink-200/50 text-slate-900", panel:"border-pink-200/50 bg-white/85", glow:"shadow-pink-200/50", particle:"🌸", particleClass:"text-pink-200/80", openEffect:"envelope", title:"رسالة باستيل", subtitle:"ناعمة وحلوة 🌸", isDark:false, accentHex:"#f9a8d4" },
        { id:"cute_cloud", label:"Soft Cloud", symbol:"☁️", accent:"from-slate-300 to-sky-300", pageBg:"bg-gradient-to-br from-slate-50 via-sky-50 to-white", previewBg:"from-slate-50 via-sky-50 to-white", previewText:"text-slate-900", cardBg:"bg-white/90 border-slate-200/50 text-slate-900", panel:"border-slate-200/50 bg-white/90", glow:"shadow-slate-200/60", particle:"☁️", particleClass:"text-slate-200/80", openEffect:"scratch", title:"رسالة ناعمة", subtitle:"خفيفة زي السحاب ☁️", isDark:false, accentHex:"#94a3b8" },
        { id:"cute_bubbles", label:"Bubbles", symbol:"🫧", accent:"from-cyan-400 to-sky-400", pageBg:"bg-gradient-to-br from-cyan-100 via-sky-50 to-white", previewBg:"from-cyan-100 via-sky-50 to-white", previewText:"text-slate-900", cardBg:"bg-white/80 border-cyan-200/60 text-slate-900", panel:"border-cyan-200/60 bg-white/80", glow:"shadow-cyan-300/40", particle:"🫧", particleClass:"text-cyan-300/70", openEffect:"multiStep", title:"كلام فقاعات", subtitle:"فيه حاجة لطيفة جواه 🫧", isDark:false, accentHex:"#22d3ee" },
        { id:"cute_kawaii", label:"Kawaii", symbol:"🎀", accent:"from-fuchsia-400 to-pink-400", pageBg:"bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50", previewBg:"from-fuchsia-50 via-pink-50 to-rose-50", previewText:"text-slate-900", cardBg:"bg-white/85 border-fuchsia-200/60 text-slate-900", panel:"border-fuchsia-200/60 bg-white/85", glow:"shadow-fuchsia-200/60", particle:"🎀", particleClass:"text-fuchsia-200/80", openEffect:"heartUnlock", title:"كاواي رسالة", subtitle:"ستايل جذاب ولطيف 🎀", isDark:false, accentHex:"#e879f9" },
    ],
    dark: [
        { id:"dark_galaxy", label:"Galaxy", symbol:"🌌", accent:"from-purple-500 to-indigo-600", pageBg:"bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900", previewBg:"from-slate-950 via-purple-950 to-slate-900", previewText:"text-white", cardBg:"bg-white/5 border-purple-500/20 text-white", panel:"border-purple-500/20 bg-purple-950/40", glow:"shadow-purple-500/30", particle:"✦", particleClass:"text-purple-300/50", openEffect:"multiStep", title:"رسالة من المجرة", subtitle:"بعيد لكن قريب 🌌", isDark:true, accentHex:"#a855f7" },
        { id:"dark_neon", label:"Neon", symbol:"✨", accent:"from-green-400 to-emerald-500", pageBg:"bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900", previewBg:"from-slate-950 via-slate-900 to-zinc-900", previewText:"text-white", cardBg:"bg-white/5 border-green-400/20 text-white", panel:"border-green-400/20 bg-black/40", glow:"shadow-green-400/20", particle:"✦", particleClass:"text-green-400/40", openEffect:"scratch", title:"Neon Vibes", subtitle:"Glow في الظلام ✨", isDark:true, accentHex:"#4ade80" },
        { id:"dark_night", label:"Night", symbol:"🌙", accent:"from-blue-400 to-indigo-500", pageBg:"bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900", previewBg:"from-slate-950 via-blue-950 to-slate-900", previewText:"text-white", cardBg:"bg-white/5 border-blue-400/20 text-white", panel:"border-blue-400/20 bg-blue-950/40", glow:"shadow-blue-400/20", particle:"⭐", particleClass:"text-blue-200/50", openEffect:"envelope", title:"رسالة الليل", subtitle:"جاتك من بعيد 🌙", isDark:true, accentHex:"#60a5fa" },
        { id:"dark_stars", label:"Stars", symbol:"⭐", accent:"from-amber-300 to-yellow-200", pageBg:"bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900", previewBg:"from-slate-950 via-zinc-900 to-slate-900", previewText:"text-white", cardBg:"bg-white/5 border-amber-300/20 text-white", panel:"border-amber-300/20 bg-black/40", glow:"shadow-amber-300/20", particle:"⭐", particleClass:"text-amber-200/50", openEffect:"heartUnlock", title:"تحت النجوم", subtitle:"رسالة مضيئة ⭐", isDark:true, accentHex:"#fde68a" },
        { id:"dark_purple", label:"Purple Dark", symbol:"💜", accent:"from-fuchsia-500 to-purple-600", pageBg:"bg-gradient-to-br from-slate-950 via-fuchsia-950 to-purple-950", previewBg:"from-slate-950 via-fuchsia-950 to-purple-950", previewText:"text-white", cardBg:"bg-white/5 border-fuchsia-500/20 text-white", panel:"border-fuchsia-500/20 bg-fuchsia-950/40", glow:"shadow-fuchsia-500/20", particle:"💜", particleClass:"text-fuchsia-300/50", openEffect:"multiStep", title:"بنفسجي وهادئ", subtitle:"حاجة Mysterious 💜", isDark:true, accentHex:"#d946ef" },
    ],
};

const themeGroups = [
    { id:"romantic", name:"رومانسي", symbol:"❤️", panel:"border-pink-200/60 bg-white/80", pageBg:"bg-gradient-to-br from-white via-pink-50 to-rose-100" },
    { id:"birthday", name:"عيد ميلاد", symbol:"🎉", panel:"border-violet-200/60 bg-white/80", pageBg:"bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-100" },
    { id:"cute", name:"كيوت", symbol:"🧸", panel:"border-cyan-200/60 bg-white/80", pageBg:"bg-gradient-to-br from-cyan-50 via-sky-50 to-white" },
    { id:"dark", name:"دارك", symbol:"✨", panel:"border-white/10 bg-white/5", pageBg:"bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" },
];

const openEffectLabels = {
    envelope: "💌 Envelope",
    heartUnlock: "❤️ Heart Unlock",
    scratch: "✏️ Scratch Reveal",
    multiStep: "🔢 Multi-Step",
};

const openEffectDesc = {
    envelope: "ظرف يفتح بضغطة",
    heartUnlock: "٣ ضغطات على القلب",
    scratch: "اكشط عشان تشوف",
    multiStep: "٥ خطوات للمفاجأة",
};

const loadingMessages = [
    "✨ Creating your page...",
    "❤️ Preparing the surprise...",
    "🎁 Almost ready...",
    "🚀 Publishing...",
];

function getSubStyle(themeId, styleId) {
    const list = subStyles[themeId] ?? subStyles.romantic;
    return list.find((s) => s.id === styleId) ?? list[0];
}

// ─── Mini Particles for preview ───────────────────────────────────────────────

function MiniParticles({ selected }) {
    const pts = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: 4 + ((i * 13) % 88),
        dur: 5 + (i % 4),
        delay: i * 0.4,
        size: 10 + (i % 3) * 4,
        top: 10 + ((i * 17) % 75),
    })), []);

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.25rem]">
            {pts.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: -40, opacity: [0, 0.7, 0.7, 0] }}
                    transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "linear" }}
                    className={`absolute select-none ${selected.particleClass}`}
                    style={{ left: `${p.left}%`, fontSize: p.size }}
                >
                    {selected.particle}
                </motion.div>
            ))}
        </div>
    );
}

// ─── Mini Opening Effect Previews ─────────────────────────────────────────────

function MiniEnvelope({ selected }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            onClick={() => setOpen(!open)}
            className="cursor-pointer flex flex-col items-center gap-2"
            whileTap={{ scale: 0.95 }}
        >
            <div className={`relative h-16 w-24 rounded-xl bg-gradient-to-br ${selected.accent} shadow-lg flex items-center justify-center overflow-visible`}>
                <motion.div
                    animate={open ? { rotateX: 160, y: -6 } : { rotateX: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformOrigin: "top center", position: "absolute", top: -8, left: 0, right: 0 }}
                >
                    <div className="h-8 w-24 opacity-80 rounded-t-xl"
                         style={{ background: `linear-gradient(135deg, ${selected.accentHex}cc, ${selected.accentHex})`, clipPath: "polygon(0 0, 50% 100%, 100% 0)" }} />
                </motion.div>
                <motion.span
                    animate={open ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
                    className="text-2xl z-10"
                >💌</motion.span>
            </div>
            <span className={`text-[10px] font-medium ${selected.isDark ? "text-white/60" : "text-slate-500"}`}>اضغط لتجربة الظرف</span>
        </motion.div>
    );
}

function MiniHeartUnlock({ selected }) {
    const [count, setCount] = useState(0);
    const total = 3;
    useEffect(() => { if (count >= total) { const t = setTimeout(() => setCount(0), 1500); return () => clearTimeout(t); } }, [count]);
    return (
        <div className="flex flex-col items-center gap-2">
            <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setCount(c => Math.min(c + 1, total))}
                className="text-4xl"
                animate={{ scale: count >= total ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
            >
                {count >= total ? "💖" : "🤍"}
            </motion.button>
            <div className="flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <motion.div key={i} animate={{ scale: i < count ? 1.2 : 1 }}
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${i < count ? "bg-pink-400" : selected.isDark ? "bg-white/20" : "bg-slate-200"}`} />
                ))}
            </div>
            <span className={`text-[10px] font-medium ${selected.isDark ? "text-white/60" : "text-slate-500"}`}>اضغط {total} مرات</span>
        </div>
    );
}

function MiniScratch({ selected }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`relative h-14 w-24 rounded-xl bg-gradient-to-br ${selected.accent} flex items-center justify-center`}>
                <div className="absolute inset-0 rounded-xl bg-slate-700/80 flex items-center justify-center">
                    <span className="text-white/60 text-[10px] font-bold">اكشط ✏️</span>
                </div>
                <span className="text-xl opacity-0">💌</span>
            </div>
            <span className={`text-[10px] font-medium ${selected.isDark ? "text-white/60" : "text-slate-500"}`}>اكشط لتكشف</span>
        </div>
    );
}

function MiniMultiStep({ selected }) {
    const [step, setStep] = useState(0);
    const total = 5;
    const emojis = ["💭","❤️","💌","✨","🎁"];
    useEffect(() => { if (step >= total) { const t = setTimeout(() => setStep(0), 1500); return () => clearTimeout(t); } }, [step]);
    const pct = step / total;
    const r = 22, circ = 2 * Math.PI * r;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative flex h-14 w-14 items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <motion.circle cx="28" cy="28" r={r} fill="none" stroke={selected.accentHex} strokeWidth="4"
                                   strokeLinecap="round" strokeDasharray={circ}
                                   animate={{ strokeDashoffset: circ * (1 - pct) }}
                                   transition={{ duration: 0.3 }} />
                </svg>
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setStep(s => Math.min(s + 1, total))}
                               className="z-10 text-xl">
                    <AnimatePresence mode="wait">
                        <motion.span key={step} initial={{ scale:0 }} animate={{ scale:1 }} exit={{ scale:0 }}>
                            {emojis[Math.min(step, total - 1)]}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>
            </div>
            <span className={`text-[10px] font-medium ${selected.isDark ? "text-white/60" : "text-slate-500"}`}>{step}/{total} خطوات</span>
        </div>
    );
}

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text, speed = 45) {
    const [displayed, setDisplayed] = useState("");
    const [idx, setIdx] = useState(0);
    useEffect(() => { setDisplayed(""); setIdx(0); }, [text]);
    useEffect(() => {
        if (!text || idx >= text.length) return;
        const t = setTimeout(() => { setDisplayed(text.slice(0, idx + 1)); setIdx(i => i + 1); }, speed);
        return () => clearTimeout(t);
    }, [text, idx, speed]);
    return { displayed, done: idx >= text.length };
}

// ─── Phone Mockup Preview ─────────────────────────────────────────────────────

function PhonePreview({ selected, name, message, imageUrl, previewTab }) {
    const { displayed, done } = useTypewriter(previewTab === "message" ? (message || "اكتب الرسالة هنا وهتظهر هنا مباشرة...") : "", 40);
    const isDark = selected.isDark;

    return (
        <div className="relative mx-auto" style={{ width: 240, height: 480 }}>
            {/* Phone shell */}
            <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-slate-800 bg-slate-900 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-5 w-20 rounded-b-xl bg-slate-900 z-20" />
                {/* Side buttons */}
                <div className="absolute -right-[8px] top-16 h-10 w-[5px] rounded-r-full bg-slate-700" />
                <div className="absolute -left-[8px] top-14 h-7 w-[5px] rounded-l-full bg-slate-700" />
                <div className="absolute -left-[8px] top-24 h-7 w-[5px] rounded-l-full bg-slate-700" />
            </div>

            {/* Screen content */}
            <div className={`absolute inset-[6px] rounded-[2rem] overflow-hidden bg-gradient-to-br ${selected.previewBg}`}>
                <MiniParticles selected={selected} />

                <AnimatePresence mode="wait">
                    {previewTab === "cover" ? (
                        <motion.div key="cover"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-3">
                            <motion.div
                                animate={{ scale: [1, 1.12, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${selected.accent} text-2xl shadow-lg`}
                            >
                                {selected.symbol}
                            </motion.div>
                            <div>
                                <div className={`text-sm font-black ${isDark ? "text-white" : "text-slate-900"}`}>{selected.title}</div>
                                <div className={`text-[10px] mt-1 ${isDark ? "text-white/60" : "text-slate-500"}`}>{selected.subtitle}</div>
                            </div>
                            {/* Mini opening effect */}
                            <div className="mt-2">
                                {selected.openEffect === "envelope" && <MiniEnvelope selected={selected} />}
                                {selected.openEffect === "heartUnlock" && <MiniHeartUnlock selected={selected} />}
                                {selected.openEffect === "scratch" && <MiniScratch selected={selected} />}
                                {selected.openEffect === "multiStep" && <MiniMultiStep selected={selected} />}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="message"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 overflow-y-auto p-4 flex flex-col items-center gap-3 pt-6">
                            {imageUrl ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-full rounded-2xl overflow-hidden shadow-xl"
                                >
                                    <img src={imageUrl} alt="preview" className="w-full h-auto object-contain"
                                         onError={(e) => { e.currentTarget.style.display = "none"; }} />
                                </motion.div>
                            ) : (
                                <div className={`w-full rounded-2xl border border-dashed flex items-center justify-center py-6 text-[10px] ${isDark ? "border-white/20 text-white/30" : "border-slate-200 text-slate-400"}`}>
                                    اضف صورة
                                </div>
                            )}
                            <div className={`text-sm font-black text-center ${isDark ? "text-white" : "text-slate-900"}`}>
                                {name || "الاسم"}
                            </div>
                            <div className={`text-[10px] leading-5 text-center min-h-[3rem] ${isDark ? "text-white/70" : "text-slate-600"}`} style={{ direction: "rtl" }}>
                                {displayed}
                                {!done && (
                                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                                                 className="inline-block w-px h-3 bg-current align-middle ml-0.5" />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ active }) {
    const [msgIdx, setMsgIdx] = useState(0);
    useEffect(() => {
        if (!active) { setMsgIdx(0); return; }
        const iv = setInterval(() => setMsgIdx(i => (i + 1) % loadingMessages.length), 900);
        return () => clearInterval(iv);
    }, [active]);
    if (!active) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}
                        className="text-6xl mb-6">💌</motion.div>
            <AnimatePresence mode="wait">
                <motion.p key={msgIdx}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          className="text-white text-lg font-semibold"
                >
                    {loadingMessages[msgIdx]}
                </motion.p>
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Success Card ─────────────────────────────────────────────────────────────

function SuccessCard({ link, onReset }) {
    const [copied, setCopied] = useState(false);
    const [shareTab, setShareTab] = useState("link");

    async function copyLink() {
        try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-[2rem] border border-white/50 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
            {/* Success header */}
            <div className="mb-5 text-center">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} className="text-4xl mb-2">🎉</motion.div>
                <div className="text-lg font-black text-slate-900">الصفحة اتعملت!</div>
                <div className="text-sm text-slate-500 mt-1">شارك اللينك مع اللي تحبه</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 mb-4">
                {[{ id:"link", label:"🔗 لينك" }, { id:"qr", label:"📱 QR" }].map(t => (
                    <button key={t.id} onClick={() => setShareTab(t.id)}
                            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${shareTab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {shareTab === "link" ? (
                    <motion.div key="link" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-mono break-all text-slate-600 leading-5">
                            {link}
                        </div>
                        <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                           onClick={copyLink}
                                           className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                                {copied ? <><Check className="h-4 w-4 text-emerald-400" /> تم النسخ</> : <><Copy className="h-4 w-4" /> نسخ اللينك</>}
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                           onClick={() => window.open(link, "_blank")}
                                           className="inline-flex items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                                <ExternalLink className="h-4 w-4" />
                            </motion.button>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                       onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank")}
                                       className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
                            📲 شارك على واتساب
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-4">
                        {/* Heart QR */}
                        <div className="relative flex items-center justify-center" style={{ width: 200, height: 190 }}>
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 190" fill="none">
                                <defs>
                                    <linearGradient id="hg" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fb7185" /><stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                                <path d="M 100,168 C 72,148 8,114 8,62 C 8,30 40,12 100,44 C 160,12 192,30 192,62 C 192,114 128,148 100,168 Z" fill="url(#hg)" />
                            </svg>
                            <div className="relative z-10 overflow-hidden rounded-xl border-4 border-white shadow-lg" style={{ width:128, height:128, marginTop:6 }}>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(link)}&bgcolor=ffffff&color=1a1a2e&margin=6`}
                                     alt="QR" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500">📸 امسح بالكاميرا لفتح الصفحة</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                       onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank")}
                                       className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white">
                            📲 شارك على واتساب
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={onReset} className="mt-4 w-full text-xs text-slate-400 hover:text-slate-600 transition text-center">
                + أنشئ صفحة جديدة
            </button>
        </motion.div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [themeGroup, setThemeGroup] = useState("romantic");
    const [styleId, setStyleId] = useState("romantic_hearts");
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previewTab, setPreviewTab] = useState("cover");

    const currentStyles = subStyles[themeGroup] ?? subStyles.romantic;
    const selected = getSubStyle(themeGroup, styleId);
    const activeGroup = themeGroups.find((g) => g.id === themeGroup) ?? themeGroups[0];
    const isDark = selected.isDark;

    async function uploadImage(file) {
        try {
            setUploading(true);
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", "lovebuilder");
            const res = await axios.post("https://api.cloudinary.com/v1_1/dznlcps4o/image/upload", fd);
            setImageUrl(res.data.secure_url);
        } catch { alert("فشل رفع الصورة"); }
        setUploading(false);
    }

    async function handleGenerate() {
        if (!name.trim() || !message.trim()) { alert("اكتب الاسم والرسالة الأول"); return; }
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "pages"), {
                name: name.trim(), message: message.trim(),
                imageUrl: imageUrl.trim(), theme: selected.id,
                buttonText: selected.subtitle, openEffect: selected.openEffect,
                createdAt: new Date(),
            });
            setLink(`${window.location.origin}/p/${docRef.id}`);
        } catch (e) { console.error(e); alert("حصل خطأ أثناء إنشاء الصفحة"); }
        setLoading(false);
    }

    return (
        <>
            <AnimatePresence>{loading && <LoadingOverlay active={loading} />}</AnimatePresence>

            <main className={`relative min-h-screen overflow-hidden transition-all duration-700 ${activeGroup.pageBg}`}>
                {/* Ambient blobs */}
                <div className="pointer-events-none absolute inset-0">
                    {[{t:"5%",l:"8%",s:"w-40 h-40",d:0},{t:"15%",l:"75%",s:"w-32 h-32",d:0.8},{t:"65%",l:"10%",s:"w-48 h-48",d:1.4},{t:"72%",l:"80%",s:"w-28 h-28",d:2}].map((b,i) => (
                        <motion.div key={i} animate={{ opacity:[0.2,0.45,0.2], scale:[1,1.1,1] }}
                                    transition={{ duration:8+i, repeat:Infinity, ease:"easeInOut", delay:b.d }}
                                    className={`absolute ${b.s} rounded-full bg-white/30 blur-3xl`}
                                    style={{ top:b.t, left:b.l }} />
                    ))}
                </div>

                <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8">
                    {/* Header */}
                    <motion.header initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                                   className="mb-8 overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white shadow-sm">
                            <Sparkles className="h-4 w-4" /> موقع إنشاء صفحات شخصية جاهزة
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                            اصنع صفحة جميلة بلينك واحد
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                            اختار الشكل والستايل، اكتب الرسالة، وخد صفحة أنيقة بتصميم متحرك ومريح للعين.
                        </p>
                    </motion.header>

                    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* Left: Form */}
                        <section className="space-y-5">
                            {/* Theme group */}
                            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.05 }}
                                        className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                                <div className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900">
                                    <Palette className="h-4 w-4" /> اختر الثيم
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {themeGroups.map((g) => {
                                        const active = themeGroup === g.id;
                                        return (
                                            <motion.button key={g.id} whileHover={{ y:-2, scale:1.03 }} whileTap={{ scale:0.96 }}
                                                           onClick={() => { setThemeGroup(g.id); setStyleId(subStyles[g.id][0].id); setLink(""); }}
                                                           className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition ${active ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-sm"}`}>
                                                <span className="text-2xl">{g.symbol}</span>
                                                <span className="text-xs font-bold">{g.name}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Sub-styles */}
                            <AnimatePresence mode="wait">
                                <motion.div key={themeGroup} initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                                            transition={{ duration:0.4 }}
                                            className={`rounded-[2rem] border p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl ${activeGroup.panel}`}>
                                    <div className={`mb-4 flex items-center gap-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                        <ChevronRight className="h-4 w-4" /> اختر الستايل
                                    </div>
                                    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                                        {currentStyles.map((s) => {
                                            const active = styleId === s.id;
                                            return (
                                                <motion.button key={s.id} whileHover={{ y:-3, scale:1.02 }} whileTap={{ scale:0.97 }}
                                                               onClick={() => { setStyleId(s.id); setLink(""); }}
                                                               className={`relative overflow-hidden rounded-2xl border p-3.5 text-left transition ${active ? `bg-gradient-to-br ${s.accent} border-transparent text-white shadow-xl ${s.glow}` : "border-slate-200/70 bg-white/90 text-slate-900 hover:shadow-md"}`}>
                                                    {active && <motion.div layoutId="styleActive" className="absolute inset-0 rounded-2xl bg-white/10" />}
                                                    <div className="relative">
                                                        <div className="mb-1.5 text-xl">{s.symbol}</div>
                                                        <div className="text-sm font-bold leading-tight">{s.label}</div>
                                                        <div className={`mt-1 text-[10px] font-medium ${active ? "text-white/75" : "text-slate-400"}`}>
                                                            {openEffectLabels[s.openEffect]}
                                                        </div>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Name */}
                            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}
                                        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)]">
                                <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <UserRound className="h-4 w-4 text-slate-400" /> الاسم
                                </label>
                                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="اكتب الاسم هنا"
                                       className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-800 focus:bg-white" />
                            </motion.div>

                            {/* Message */}
                            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.15 }}
                                        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)]">
                                <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <MessageCircle className="h-4 w-4 text-slate-400" /> الرسالة
                                </label>
                                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                                          placeholder="اكتب رسالتك هنا..." rows={5}
                                          className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-800 focus:bg-white resize-none" />
                            </motion.div>

                            {/* Image */}
                            <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.2 }}
                                        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)]">
                                <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                    <ImagePlus className="h-4 w-4 text-slate-400" /> الصورة (اختياري)
                                </label>
                                <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-100">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="preview" className="w-full max-h-36 object-contain rounded-xl" />
                                    ) : (
                                        <><ImagePlus className="h-6 w-6 text-slate-300" /><span className="text-xs">اضغط لاختيار صورة</span></>
                                    )}
                                    <input type="file" accept="image/*" className="hidden"
                                           onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} />
                                </label>
                                {uploading && <p className="mt-2 text-xs text-blue-500">جاري رفع الصورة...</p>}
                            </motion.div>

                            {/* Generate CTA */}
                            <motion.button initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.25 }}
                                           whileHover={{ scale:1.02, boxShadow:"0 12px 40px rgba(15,23,42,0.3)" }}
                                           whileTap={{ scale:0.97 }}
                                           onClick={handleGenerate} disabled={loading}
                                           className="inline-flex w-full items-center justify-center gap-3 rounded-[2rem] bg-slate-900 px-6 py-5 text-base font-bold text-white shadow-xl transition disabled:opacity-60">
                                <Sparkles className="h-5 w-5" />
                                أنشئ الصفحة واحصل على اللينك
                            </motion.button>
                        </section>

                        {/* Right: Preview + Share */}
                        <aside className="space-y-5">
                            {/* Phone preview card */}
                            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55, delay:0.1 }}
                                        className={`overflow-hidden rounded-[2rem] border shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl ${selected.panel}`}>
                                <div className="p-4">
                                    {/* Preview header */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                                            <Smartphone className="h-3 w-3" /> معاينة مباشرة
                                        </div>
                                        <div className={`text-xs font-semibold ${isDark ? "text-white/60" : "text-slate-500"}`}>{selected.label}</div>
                                    </div>

                                    {/* Cover / Message tabs */}
                                    <div className={`mb-4 flex gap-1 rounded-2xl p-1 ${isDark ? "bg-white/10" : "bg-slate-100/80"}`}>
                                        {[{ id:"cover", label:"🎁 Cover" }, { id:"message", label:"💌 Message" }].map(t => (
                                            <button key={t.id} onClick={() => setPreviewTab(t.id)}
                                                    className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition ${previewTab === t.id ? (isDark ? "bg-white/20 text-white" : "bg-white text-slate-900 shadow-sm") : (isDark ? "text-white/50" : "text-slate-500")}`}>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Phone mockup */}
                                    <AnimatePresence mode="wait">
                                        <motion.div key={selected.id} initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ duration:0.35 }}>
                                            <PhonePreview selected={selected} name={name} message={message} imageUrl={imageUrl} previewTab={previewTab} />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Opening effect info */}
                                    <div className={`mt-4 rounded-2xl px-3 py-2.5 text-xs font-medium flex items-center justify-between ${isDark ? "bg-white/10 text-white/70" : "bg-white/60 text-slate-600"}`}>
                                        <span>طريقة الفتح</span>
                                        <span className="font-bold">{openEffectLabels[selected.openEffect]}</span>
                                    </div>
                                    <div className={`mt-1.5 rounded-xl px-3 py-2 text-[10px] leading-5 ${isDark ? "bg-white/5 text-white/50" : "bg-slate-50/80 text-slate-400"}`}>
                                        {openEffectDesc[selected.openEffect]}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Share / Success card */}
                            <AnimatePresence mode="wait">
                                {link ? (
                                    <SuccessCard key="success" link={link} onReset={() => { setLink(""); setName(""); setMessage(""); setImageUrl(""); }} />
                                ) : (
                                    <motion.div key="hint" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55, delay:0.18 }}
                                                className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl text-center">
                                        <div className="text-3xl mb-3">🔗</div>
                                        <div className="text-sm font-bold text-slate-800 mb-1">جاهز للمشاركة؟</div>
                                        <div className="text-xs text-slate-500 mb-4">بعد ما تملا الفورم وتضغط Generate، هتظهر هنا خيارات المشاركة</div>
                                        <div className="flex flex-col gap-2 text-xs text-slate-400">
                                            <div className="flex items-center gap-2"><span>✅</span> لينك قابل للمشاركة</div>
                                            <div className="flex items-center gap-2"><span>📱</span> QR كود بشكل قلب</div>
                                            <div className="flex items-center gap-2"><span>📲</span> مشاركة واتساب مباشرة</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}