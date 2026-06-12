import { useMemo, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Sparkles,
    ImagePlus,
    Link as LinkIcon,
    Wand2,
    Palette,
    MessageCircle,
    UserRound,
    ArrowRight,
    Copy,
    Check,
    ChevronRight,
    QrCode,
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// ─── Sub-styles per theme ────────────────────────────────────────────────────

const subStyles = {
    romantic: [
        {
            id: "romantic_hearts",
            label: "Romantic Hearts",
            symbol: "❤️",
            accent: "from-pink-500 to-rose-500",
            pageBg: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/75 border-pink-200/60 text-slate-900",
            panel: "border-pink-200/60 bg-white/80",
            glow: "shadow-pink-300/40",
            particle: "❤️",
            particleClass: "text-pink-300/80",
            openEffect: "envelope",
            title: "رسالة خاصة ليك",
            subtitle: "اضغط وشوف ❤️",
        },
        {
            id: "romantic_roses",
            label: "Romantic Roses",
            symbol: "🌹",
            accent: "from-red-500 to-rose-600",
            pageBg: "bg-gradient-to-br from-red-50 via-rose-100 to-red-200",
            previewBg: "bg-rose-50",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-rose-200/60 text-slate-900",
            panel: "border-rose-200/60 bg-white/80",
            glow: "shadow-rose-400/40",
            particle: "🌹",
            particleClass: "text-rose-400/70",
            openEffect: "heartUnlock",
            title: "وردة ليكِ",
            subtitle: "فيه كلام يستاهل🌹",
        },
        {
            id: "romantic_night",
            label: "Romantic Night",
            symbol: "🌙",
            accent: "from-indigo-500 to-purple-600",
            pageBg: "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800",
            previewBg: "bg-indigo-950/70",
            previewText: "text-white",
            cardBg: "bg-white/5 border-indigo-500/20 text-white",
            panel: "border-indigo-500/20 bg-indigo-950/40",
            glow: "shadow-indigo-500/30",
            particle: "⭐",
            particleClass: "text-indigo-300/60",
            openEffect: "scratch",
            title: "رسالة الليل",
            subtitle: "تحت النجوم... 🌙",
        },
        {
            id: "romantic_luxury",
            label: "Romantic Luxury",
            symbol: "✨",
            accent: "from-yellow-400 to-amber-500",
            pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900",
            previewBg: "bg-black/60",
            previewText: "text-white",
            cardBg: "bg-white/5 border-yellow-500/20 text-white",
            panel: "border-yellow-500/20 bg-black/40",
            glow: "shadow-yellow-500/20",
            particle: "✦",
            particleClass: "text-yellow-400/40",
            openEffect: "multiStep",
            title: "لحظة فاخرة",
            subtitle: "Premium Feeling ✨",
        },
        {
            id: "romantic_wedding",
            label: "Romantic Wedding",
            symbol: "💍",
            accent: "from-amber-300 to-yellow-200",
            pageBg: "bg-gradient-to-br from-amber-50 via-white to-yellow-50",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/90 border-amber-200/60 text-slate-900",
            panel: "border-amber-200/60 bg-white/90",
            glow: "shadow-amber-300/40",
            particle: "🤍",
            particleClass: "text-amber-200/80",
            openEffect: "envelope",
            title: "لحظة لا تُنسى",
            subtitle: "يوم يستحق الاحتفال 💍",
        },
        {
            id: "romantic_valentine",
            label: "Romantic Valentine",
            symbol: "🎀",
            accent: "from-fuchsia-500 to-pink-500",
            pageBg: "bg-gradient-to-br from-fuchsia-100 via-pink-50 to-rose-100",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-fuchsia-200/60 text-slate-900",
            panel: "border-fuchsia-200/60 bg-white/80",
            glow: "shadow-fuchsia-300/40",
            particle: "🎀",
            particleClass: "text-fuchsia-300/70",
            openEffect: "heartUnlock",
            title: "هدية الفلانتين",
            subtitle: "حاجة حلوة مستنياكِ 🎀",
        },
    ],
    birthday: [
        {
            id: "birthday_classic",
            label: "Classic Birthday",
            symbol: "🎂",
            accent: "from-violet-500 to-fuchsia-500",
            pageBg: "bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-violet-200/60 text-slate-900",
            panel: "border-violet-200/60 bg-white/80",
            glow: "shadow-violet-300/40",
            particle: "✨",
            particleClass: "text-violet-300/80",
            openEffect: "multiStep",
            title: "عيد ميلاد سعيد!",
            subtitle: "المفاجأة جواه 🎂",
        },
        {
            id: "birthday_balloons",
            label: "Balloons",
            symbol: "🎈",
            accent: "from-sky-400 to-blue-500",
            pageBg: "bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-sky-200/60 text-slate-900",
            panel: "border-sky-200/60 bg-white/80",
            glow: "shadow-sky-300/40",
            particle: "🎈",
            particleClass: "text-sky-300/80",
            openEffect: "scratch",
            title: "يوم مميز!",
            subtitle: "اضغط وافتح الهدية 🎈",
        },
        {
            id: "birthday_party",
            label: "Party",
            symbol: "🎉",
            accent: "from-orange-400 to-pink-500",
            pageBg: "bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-orange-200/60 text-slate-900",
            panel: "border-orange-200/60 bg-white/80",
            glow: "shadow-orange-300/40",
            particle: "🎉",
            particleClass: "text-orange-300/80",
            openEffect: "envelope",
            title: "حان وقت الاحتفال!",
            subtitle: "الباقة بتستناكِ 🎉",
        },
        {
            id: "birthday_luxury",
            label: "Luxury Birthday",
            symbol: "🥂",
            accent: "from-yellow-400 to-amber-400",
            pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900",
            previewBg: "bg-black/50",
            previewText: "text-white",
            cardBg: "bg-white/5 border-yellow-400/20 text-white",
            panel: "border-yellow-400/20 bg-black/40",
            glow: "shadow-yellow-400/20",
            particle: "✦",
            particleClass: "text-yellow-300/50",
            openEffect: "multiStep",
            title: "عيد ميلاد فاخر",
            subtitle: "تستاهل كل الفخامة 🥂",
        },
        {
            id: "birthday_colorful",
            label: "Colorful Birthday",
            symbol: "🌈",
            accent: "from-green-400 to-teal-500",
            pageBg: "bg-gradient-to-br from-green-100 via-teal-50 to-cyan-100",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-teal-200/60 text-slate-900",
            panel: "border-teal-200/60 bg-white/80",
            glow: "shadow-teal-300/40",
            particle: "🌈",
            particleClass: "text-teal-300/70",
            openEffect: "heartUnlock",
            title: "يوم ملون وجميل!",
            subtitle: "مليان ألوان وفرحة 🌈",
        },
    ],
    cute: [
        {
            id: "cute_teddy",
            label: "Teddy",
            symbol: "🧸",
            accent: "from-amber-400 to-orange-400",
            pageBg: "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-amber-200/60 text-slate-900",
            panel: "border-amber-200/60 bg-white/80",
            glow: "shadow-amber-300/40",
            particle: "🧸",
            particleClass: "text-amber-300/70",
            openEffect: "heartUnlock",
            title: "حاجة كيوت ليكِ",
            subtitle: "دبدوب صغير مستناكِ 🧸",
        },
        {
            id: "cute_pastel",
            label: "Pastel",
            symbol: "🌸",
            accent: "from-pink-300 to-purple-300",
            pageBg: "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/85 border-pink-200/50 text-slate-900",
            panel: "border-pink-200/50 bg-white/85",
            glow: "shadow-pink-200/50",
            particle: "🌸",
            particleClass: "text-pink-200/80",
            openEffect: "envelope",
            title: "رسالة باستيل",
            subtitle: "ناعمة وحلوة 🌸",
        },
        {
            id: "cute_cloud",
            label: "Soft Cloud",
            symbol: "☁️",
            accent: "from-slate-300 to-sky-300",
            pageBg: "bg-gradient-to-br from-slate-50 via-sky-50 to-white",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/90 border-slate-200/50 text-slate-900",
            panel: "border-slate-200/50 bg-white/90",
            glow: "shadow-slate-200/60",
            particle: "☁️",
            particleClass: "text-slate-200/80",
            openEffect: "scratch",
            title: "رسالة ناعمة",
            subtitle: "خفيفة زي السحاب ☁️",
        },
        {
            id: "cute_bubbles",
            label: "Bubbles",
            symbol: "🫧",
            accent: "from-cyan-400 to-sky-400",
            pageBg: "bg-gradient-to-br from-cyan-100 via-sky-50 to-white",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/80 border-cyan-200/60 text-slate-900",
            panel: "border-cyan-200/60 bg-white/80",
            glow: "shadow-cyan-300/40",
            particle: "🫧",
            particleClass: "text-cyan-300/70",
            openEffect: "multiStep",
            title: "كلام فقاعات",
            subtitle: "فيه حاجة لطيفة جواه 🫧",
        },
        {
            id: "cute_kawaii",
            label: "Kawaii",
            symbol: "🎀",
            accent: "from-fuchsia-400 to-pink-400",
            pageBg: "bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50",
            previewBg: "bg-white",
            previewText: "text-slate-900",
            cardBg: "bg-white/85 border-fuchsia-200/60 text-slate-900",
            panel: "border-fuchsia-200/60 bg-white/85",
            glow: "shadow-fuchsia-200/60",
            particle: "🎀",
            particleClass: "text-fuchsia-200/80",
            openEffect: "heartUnlock",
            title: "كاواي رسالة",
            subtitle: "ستايل جذاب ولطيف 🎀",
        },
    ],
    dark: [
        {
            id: "dark_galaxy",
            label: "Galaxy",
            symbol: "🌌",
            accent: "from-purple-500 to-indigo-600",
            pageBg: "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900",
            previewBg: "bg-purple-950/50",
            previewText: "text-white",
            cardBg: "bg-white/5 border-purple-500/20 text-white",
            panel: "border-purple-500/20 bg-purple-950/40",
            glow: "shadow-purple-500/30",
            particle: "✦",
            particleClass: "text-purple-300/50",
            openEffect: "multiStep",
            title: "رسالة من المجرة",
            subtitle: "بعيد لكن قريب 🌌",
        },
        {
            id: "dark_neon",
            label: "Neon",
            symbol: "✨",
            accent: "from-green-400 to-emerald-500",
            pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-900",
            previewBg: "bg-black/60",
            previewText: "text-white",
            cardBg: "bg-white/5 border-green-400/20 text-white",
            panel: "border-green-400/20 bg-black/40",
            glow: "shadow-green-400/20",
            particle: "✦",
            particleClass: "text-green-400/40",
            openEffect: "scratch",
            title: "Neon Vibes",
            subtitle: "Glow في الظلام ✨",
        },
        {
            id: "dark_night",
            label: "Night",
            symbol: "🌙",
            accent: "from-blue-400 to-indigo-500",
            pageBg: "bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900",
            previewBg: "bg-blue-950/50",
            previewText: "text-white",
            cardBg: "bg-white/5 border-blue-400/20 text-white",
            panel: "border-blue-400/20 bg-blue-950/40",
            glow: "shadow-blue-400/20",
            particle: "⭐",
            particleClass: "text-blue-200/50",
            openEffect: "envelope",
            title: "رسالة الليل",
            subtitle: "جاتك من بعيد 🌙",
        },
        {
            id: "dark_stars",
            label: "Stars",
            symbol: "⭐",
            accent: "from-amber-300 to-yellow-200",
            pageBg: "bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900",
            previewBg: "bg-black/60",
            previewText: "text-white",
            cardBg: "bg-white/5 border-amber-300/20 text-white",
            panel: "border-amber-300/20 bg-black/40",
            glow: "shadow-amber-300/20",
            particle: "⭐",
            particleClass: "text-amber-200/50",
            openEffect: "heartUnlock",
            title: "تحت النجوم",
            subtitle: "رسالة مضيئة ⭐",
        },
        {
            id: "dark_purple",
            label: "Purple Dark",
            symbol: "💜",
            accent: "from-fuchsia-500 to-purple-600",
            pageBg: "bg-gradient-to-br from-slate-950 via-fuchsia-950 to-purple-950",
            previewBg: "bg-fuchsia-950/60",
            previewText: "text-white",
            cardBg: "bg-white/5 border-fuchsia-500/20 text-white",
            panel: "border-fuchsia-500/20 bg-fuchsia-950/40",
            glow: "shadow-fuchsia-500/20",
            particle: "💜",
            particleClass: "text-fuchsia-300/50",
            openEffect: "multiStep",
            title: "بنفسجي وهادئ",
            subtitle: "حاجة Mysterious 💜",
        },
    ],
};

const themeGroups = [
    { id: "romantic", name: "رومانسي", symbol: "❤️", accent: "from-pink-500 to-rose-500", panel: "border-pink-200/60 bg-white/80", pageBg: "bg-gradient-to-br from-white via-pink-50 to-rose-100" },
    { id: "birthday", name: "عيد ميلاد", symbol: "🎉", accent: "from-violet-500 to-fuchsia-500", panel: "border-violet-200/60 bg-white/80", pageBg: "bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-100" },
    { id: "cute", name: "كيوت", symbol: "🧸", accent: "from-cyan-500 to-sky-500", panel: "border-cyan-200/60 bg-white/80", pageBg: "bg-gradient-to-br from-cyan-50 via-sky-50 to-white" },
    { id: "dark", name: "دارك", symbol: "✨", accent: "from-slate-300 to-fuchsia-400", panel: "border-white/10 bg-white/5", pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" },
];

const openEffectLabels = {
    envelope: "💌 Envelope Opening",
    heartUnlock: "❤️ Heart Unlock",
    scratch: "✏️ Scratch Reveal",
    multiStep: "🔢 Multi-Step Reveal",
};

function getSubStyle(themeId, styleId) {
    const list = subStyles[themeId] ?? subStyles.romantic;
    return list.find((s) => s.id === styleId) ?? list[0];
}

export default function Home() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [themeGroup, setThemeGroup] = useState("romantic");
    const [styleId, setStyleId] = useState("romantic_hearts");
    const [buttonText, setButtonText] = useState("");
    const [copied, setCopied] = useState(false);
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [shareTab, setShareTab] = useState("link");

    const currentStyles = subStyles[themeGroup] ?? subStyles.romantic;
    const selected = getSubStyle(themeGroup, styleId);
    const activeGroup = themeGroups.find((g) => g.id === themeGroup) ?? themeGroups[0];

    const shareLink = useMemo(() => link || "اضغط Generate عشان يتولد لينك", [link]);
    const displayButtonText = buttonText.trim() || (selected.subtitle || "افتح الرسالة");

    const isDark = selected.pageBg.includes("slate-950") || selected.pageBg.includes("indigo-950") || selected.pageBg.includes("fuchsia-950") || selected.pageBg.includes("purple-950") || selected.pageBg.includes("blue-950");

    async function uploadImage(file) {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "lovebuilder");
            const res = await axios.post("https://api.cloudinary.com/v1_1/dznlcps4o/image/upload", formData);
            setImageUrl(res.data.secure_url);
        } catch (err) {
            console.error(err);
            alert("فشل رفع الصورة");
        }
        setUploading(false);
    }

    async function handleGenerate() {
        if (!name.trim() || !message.trim()) {
            alert("اكتب الاسم والرسالة الأول");
            return;
        }
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "pages"), {
                name: name.trim(),
                message: message.trim(),
                imageUrl: imageUrl.trim(),
                theme: selected.id,
                buttonText: displayButtonText,
                openEffect: selected.openEffect,
                createdAt: new Date(),
            });
            setLink(`${window.location.origin}/p/${docRef.id}`);
        } catch (error) {
            console.error(error);
            alert("حصل خطأ أثناء إنشاء الصفحة");
        }
        setLoading(false);
    }

    async function copyLink() {
        if (!link) return;
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    }

    return (
        <main className={`relative min-h-screen overflow-hidden transition-all duration-700 ${activeGroup.pageBg}`}>
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0">
                {[
                    { top: "5%", left: "8%", w: "w-40 h-40", delay: 0 },
                    { top: "15%", left: "75%", w: "w-32 h-32", delay: 0.8 },
                    { top: "65%", left: "10%", w: "w-48 h-48", delay: 1.4 },
                    { top: "72%", left: "80%", w: "w-28 h-28", delay: 2 },
                ].map((dot, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut", delay: dot.delay }}
                        className={`absolute ${dot.w} rounded-full bg-white/30 blur-3xl`}
                        style={{ top: dot.top, left: dot.left }}
                    />
                ))}
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8 overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-2xl"
                >
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        موقع إنشاء صفحات شخصية جاهزة
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                        اصنع صفحة جميلة بلينك واحد، وتكون جاهزة للمشاركة فورًا
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                        اختار الشكل والستايل، اكتب الرسالة، وخد صفحة أنيقة بتصميم متحرك ومريح للعين.
                    </p>
                </motion.header>

                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    {/* Left column */}
                    <section className="space-y-6">

                        {/* Step 1: Theme group */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.05 }}
                            className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
                        >
                            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <Palette className="h-5 w-5" />
                                اختر الثيم
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                {themeGroups.map((g) => {
                                    const active = themeGroup === g.id;
                                    return (
                                        <motion.button
                                            key={g.id}
                                            whileHover={{ y: -3, scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => {
                                                setThemeGroup(g.id);
                                                const firstStyle = subStyles[g.id][0];
                                                setStyleId(firstStyle.id);
                                            }}
                                            className={`flex flex-col items-center gap-2 rounded-[1.5rem] border p-4 text-center transition ${
                                                active
                                                    ? "border-slate-900 bg-slate-900 text-white shadow-xl"
                                                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-400 hover:shadow-md"
                                            }`}
                                        >
                                            <span className="text-3xl">{g.symbol}</span>
                                            <span className="text-sm font-bold">{g.name}</span>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Step 2: Sub-styles */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={themeGroup}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.45 }}
                                className={`rounded-[2rem] border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl ${activeGroup.panel}`}
                            >
                                <div className={`mb-4 flex items-center gap-2 text-base font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                                    <ChevronRight className="h-4 w-4" />
                                    اختر الستايل
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                                    {currentStyles.map((s) => {
                                        const active = styleId === s.id;
                                        return (
                                            <motion.button
                                                key={s.id}
                                                whileHover={{ y: -4, scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => setStyleId(s.id)}
                                                className={`relative overflow-hidden rounded-[1.5rem] border p-4 text-left transition ${
                                                    active
                                                        ? `bg-gradient-to-br ${s.accent} border-transparent text-white shadow-xl ${s.glow}`
                                                        : "border-slate-200/70 bg-white/90 text-slate-900 hover:shadow-md"
                                                }`}
                                            >
                                                {active && (
                                                    <motion.div
                                                        layoutId="styleActive"
                                                        className="absolute inset-0 rounded-[1.5rem] bg-white/10"
                                                    />
                                                )}
                                                <div className="relative">
                                                    <div className="mb-2 text-2xl">{s.symbol}</div>
                                                    <div className="text-sm font-bold">{s.label}</div>
                                                    <div className={`mt-1 text-xs ${active ? "text-white/80" : "text-slate-500"}`}>
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
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
                        >
                            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                <UserRound className="h-4 w-4 text-slate-500" />
                                الاسم
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="اكتب الاسم"
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-0"
                            />
                        </motion.div>

                        {/* Message */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
                        >
                            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                <MessageCircle className="h-4 w-4 text-slate-500" />
                                الرسالة
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="اكتب الرسالة هنا"
                                rows={6}
                                className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:ring-0 resize-none"
                            />
                        </motion.div>

                        {/* Image upload */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25 }}
                            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.07)]"
                        >
                            <label className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
                                <ImagePlus className="h-4 w-4 text-slate-500" />
                                الصورة
                            </label>
                            <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-100">
                                <ImagePlus className="h-6 w-6 text-slate-400" />
                                <span>اضغط لاختيار صورة</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadImage(file);
                                    }}
                                />
                            </label>
                            {uploading && <p className="mt-3 text-sm text-blue-600">جاري رفع الصورة...</p>}
                            {imageUrl && !uploading && (
                                <motion.p
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-3 text-sm text-emerald-600"
                                >
                                    ✅ تم رفع الصورة بنجاح
                                </motion.p>
                            )}
                        </motion.div>
                        {/* Generate CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.3 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 12px 40px rgba(15,23,42,0.3)" }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleGenerate}
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-3 rounded-[2rem] bg-slate-900 px-6 py-5 text-base font-bold text-white shadow-xl transition disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <Wand2 className="h-5 w-5" />
                                {loading ? "جاري إنشاء الصفحة..." : "أنشئ الصفحة واحصل على اللينك"}
                            </motion.button>
                        </motion.div>

                    </section>

                    {/* Right column: Preview + link */}
                    <aside className="space-y-6">
                        {/* Live preview */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className={`overflow-hidden rounded-[2rem] border shadow-[0_20px_60px_rgba(15,23,42,0.1)] backdrop-blur-xl ${selected.panel}`}
                        >
                            <div className="p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                                        المعاينة المباشرة
                                    </div>
                                    <div className={`text-xs font-medium ${isDark ? "text-white/60" : "text-slate-500"}`}>{selected.label}</div>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selected.id}
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.96 }}
                                        transition={{ duration: 0.4 }}
                                        className={`rounded-[2rem] p-5 text-center ${selected.previewBg} ${selected.previewText}`}
                                    >
                                        <div className="mb-4 flex items-center justify-center">
                                            <motion.div
                                                animate={{ scale: [1, 1.12, 1] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r ${selected.accent} text-3xl text-white shadow-xl ${selected.glow}`}
                                            >
                                                {selected.symbol}
                                            </motion.div>
                                        </div>

                                        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">معاينة</div>

                                        {imageUrl ? (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="mx-auto mb-4 aspect-[4/3] w-full max-w-md overflow-hidden rounded-[1.5rem] shadow-xl"
                                            >
                                                <img
                                                    src={imageUrl}
                                                    alt="preview"
                                                    className="w-full h-auto"                                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                                />
                                            </motion.div>
                                        ) : (
                                            <div className={`mx-auto mb-6 w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-2xl flex items-center justify-center py-8 border border-dashed ${isDark ? "border-white/20 text-white/40" : "border-slate-200 text-slate-400"}`}>
                                                <span className="text-sm">أضف صورة للمعاينة</span>
                                            </div>
                                        )}

                                        <h2 className={`text-2xl font-black tracking-tight md:text-3xl ${isDark ? "text-white" : "text-slate-900"}`}>
                                            {name || "اكتب الاسم"}
                                        </h2>

                                        <p className={`mx-auto mt-3 max-w-md text-sm leading-7 ${isDark ? "text-white/70" : "text-slate-600"}`}>
                                            {message || "اكتب الرسالة هنا وستظهر تلقائيًا في المعاينة."}
                                        </p>

                                        {/* Theme description */}
                                        <div className={`mx-auto mt-4 max-w-sm rounded-2xl px-4 py-3 text-xs leading-6 ${isDark ? "bg-white/10 text-white/60" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
                                            <span className="font-semibold">{selected.title}</span> — {selected.subtitle}
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
                                            whileTap={{ scale: 0.97 }}
                                            className={`mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${selected.accent} px-6 py-3 text-sm font-bold text-white shadow-lg`}
                                        >
                                            {displayButtonText}
                                            <ArrowRight className="h-4 w-4" />
                                        </motion.button>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Opening effect badge */}
                                <div className={`mt-3 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium backdrop-blur-sm ${isDark ? "bg-white/10 text-white/80" : "bg-white/60 text-slate-600"}`}>
                                    <span>طريقة الفتح:</span>
                                    <span className="font-bold">{openEffectLabels[selected.openEffect]}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Share card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.18 }}
                            className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                        >
                            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <LinkIcon className="h-5 w-5" />
                                شارك الصفحة
                            </div>

                            {/* Tabs */}
                            <div className="mb-4 flex gap-1 rounded-2xl bg-slate-100 p-1">
                                <button
                                    onClick={() => setShareTab("link")}
                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition ${shareTab === "link" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <LinkIcon className="h-3.5 w-3.5" />
                                    لينك
                                </button>
                                <button
                                    onClick={() => setShareTab("qr")}
                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition ${shareTab === "qr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <QrCode className="h-3.5 w-3.5" />
                                    QR كود
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {shareTab === "link" ? (
                                    <motion.div key="linktab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium break-all text-slate-700">
                                            {shareLink}
                                        </div>

                                        <div className="mt-4 flex gap-3">
                                            <motion.button
                                                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(15,23,42,0.25)" }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={handleGenerate}
                                                disabled={loading}
                                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                <Sparkles className="h-4 w-4" />
                                                {loading ? "جاري الإنشاء..." : "أنشئ اللينك"}
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={copyLink}
                                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                                            >
                                                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                                {copied ? "Copied" : "Copy"}
                                            </motion.button>
                                        </div>

                                        {link && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank")}
                                                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
                                            >
                                                <span>📲</span>
                                                شارك على واتساب
                                            </motion.button>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div key="qrtab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                                        {link ? (
                                            <>
                                                {/* Heart-shaped QR */}
                                                <div className="relative flex items-center justify-center" style={{ width: 220, height: 210 }}>
                                                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 220 210" fill="none">
                                                        <defs>
                                                            <linearGradient id="hGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#fb7185" />
                                                                <stop offset="100%" stopColor="#ec4899" />
                                                            </linearGradient>
                                                        </defs>
                                                        <path
                                                            d="M 110,178 C 80,158 12,122 12,68 C 12,33 43,13 110,48 C 177,13 208,33 208,68 C 208,122 140,158 110,178 Z"
                                                            fill="url(#hGrad)"
                                                        />
                                                    </svg>
                                                    <div
                                                        className="relative z-10 overflow-hidden rounded-2xl border-4 border-white shadow-xl"
                                                        style={{ width: 138, height: 138, marginTop: 8 }}
                                                    >
                                                        <img
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=276x276&data=${encodeURIComponent(link)}&bgcolor=ffffff&color=1a1a2e&margin=8`}
                                                            alt="QR Code"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                <p className="text-sm font-medium text-slate-600">📸 امسح الكود بالكاميرا لفتح الصفحة</p>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(link)}`, "_blank")}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600"
                                                >
                                                    <span>📲</span>
                                                    شارك على واتساب
                                                </motion.button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-3 py-6 text-center">
                                                <span className="text-4xl">🫀</span>
                                                <p className="text-sm text-slate-500">أنشئ الصفحة الأول عشان يظهر QR ❤️</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={handleGenerate}
                                                    disabled={loading}
                                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition disabled:opacity-70"
                                                >
                                                    <Sparkles className="h-4 w-4" />
                                                    {loading ? "جاري الإنشاء..." : "أنشئ اللينك"}
                                                </motion.button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                                الصفحات بتتحفظ في Firebase، والصورة بتظهر من رابط Cloudinary.
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </main>
    );
}