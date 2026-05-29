import { useMemo, useState } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const templates = [
    {
        id: "romantic",
        name: "رومانسي",
        accent: "from-pink-500 to-rose-500",
        panel: "border-pink-200/60 bg-white/80",
        pageBg: "bg-gradient-to-br from-white via-pink-50 to-rose-100",
        previewBg: "bg-white",
        previewText: "text-slate-900",
        badge: "قلوب دافئة",
        symbol: "❤️",
        button: "افتح الرسالة",
        subtitle: "لمسة ناعمة وهادية مناسبة للمشاعر الخاصة.",
    },
    {
        id: "birthday",
        name: "عيد ميلاد",
        accent: "from-violet-500 to-fuchsia-500",
        panel: "border-violet-200/60 bg-white/80",
        pageBg: "bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-100",
        previewBg: "bg-white",
        previewText: "text-slate-900",
        badge: "احتفال ولمعة",
        symbol: "🎉",
        button: "شوف المفاجأة",
        subtitle: "ألوان مبهجة وتكوين مناسب للمناسبات السعيدة.",
    },
    {
        id: "cute",
        name: "كيوت",
        accent: "from-cyan-500 to-sky-500",
        panel: "border-cyan-200/60 bg-white/80",
        pageBg: "bg-gradient-to-br from-cyan-50 via-sky-50 to-white",
        previewBg: "bg-white",
        previewText: "text-slate-900",
        badge: "لطيف ومرِح",
        symbol: "🧸",
        button: "افتحي هنا",
        subtitle: "ستايل خفيف ومرن يناسب الرسائل اللطيفة.",
    },
    {
        id: "dark",
        name: "دارك",
        accent: "from-slate-300 to-fuchsia-400",
        panel: "border-white/10 bg-white/5",
        pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800",
        previewBg: "bg-slate-950/60",
        previewText: "text-white",
        badge: "فخم وهادئ",
        symbol: "✨",
        button: "عرض الصفحة",
        subtitle: "ستايل راقي بلمسة داكنة وهادئة.",
    },
];

function templateById(id) {
    return templates.find((t) => t.id === id) ?? templates[0];
}

export default function Home() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [theme, setTheme] = useState("romantic");
    const [buttonText, setButtonText] = useState("");
    const [copied, setCopied] = useState(false);
    const [link, setLink] = useState("");
    const [loading, setLoading] = useState(false);

    const selected = templateById(theme);

    const shareLink = useMemo(() => {
        return link || "اضغط Generate عشان يتولد لينك";
    }, [link]);

    const displayButtonText = buttonText.trim() || selected.button;

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
                theme,
                buttonText: displayButtonText,
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

    const backgroundDots = [
        { top: "8%", left: "10%", size: "w-28 h-28", delay: 0 },
        { top: "18%", left: "78%", size: "w-24 h-24", delay: 0.6 },
        { top: "68%", left: "12%", size: "w-32 h-32", delay: 1.2 },
        { top: "76%", left: "82%", size: "w-20 h-20", delay: 1.8 },
    ];

    return (
        <main className={`relative min-h-screen overflow-hidden ${selected.pageBg}`}>
            <div className="pointer-events-none absolute inset-0">
                {backgroundDots.map((dot, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
                        transition={{
                            duration: 7 + index,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: dot.delay,
                        }}
                        className={`absolute ${dot.size} rounded-full bg-white/30 blur-3xl`}
                        style={{ top: dot.top, left: dot.left }}
                    />
                ))}
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
                <motion.header
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mb-8 overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:flex md:items-center md:justify-between md:gap-6"
                >
                    <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white shadow-sm">
                            <Sparkles className="h-4 w-4" />
                            موقع إنشاء صفحات شخصية جاهزة
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                            اصنع صفحة جميلة بلينك واحد، وتكون جاهزة للمشاركة فورًا
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                            اختار الشكل، اكتب الرسالة، أضف رابط الصورة، وخد صفحة أنيقة بتصميم متحرك ومريح للعين.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate}
                        disabled={loading}
                        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition disabled:cursor-not-allowed disabled:opacity-70 md:mt-0"
                    >
                        <Wand2 className="h-4 w-4" />
                        {loading ? "جاري الإنشاء..." : "Generate"}
                    </motion.button>
                </motion.header>

                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                    <section className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className={`rounded-[2rem] border p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${selected.panel}`}
                        >
                            <div className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <Palette className="h-5 w-5" />
                                اختر الشكل
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                {templates.map((t) => {
                                    const active = theme === t.id;

                                    return (
                                        <motion.button
                                            key={t.id}
                                            whileHover={{ y: -4, scale: 1.01 }}
                                            whileTap={{ scale: 0.985 }}
                                            onClick={() => {
                                                setTheme(t.id);
                                                setButtonText(t.button);
                                            }}
                                            className={`rounded-[1.75rem] border p-4 text-left transition ${
                                                active
                                                    ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/15"
                                                    : `${t.panel} text-slate-900 hover:shadow-lg`
                                            }`}
                                        >
                                            <div className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${t.accent}`} />
                                            <div className="flex items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-lg font-bold">{t.name}</div>
                                                    <div className={`mt-1 text-sm ${active ? "text-white/80" : "text-slate-600"}`}>
                                                        {t.subtitle}
                                                    </div>
                                                </div>
                                                <div
                                                    className={`rounded-2xl px-3 py-1 text-xs font-bold ${
                                                        active ? "bg-white/10 text-white" : "bg-white text-slate-800"
                                                    }`}
                                                >
                                                    {t.badge}
                                                </div>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.1 }}
                                className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                            >
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <UserRound className="h-4 w-4" />
                                    الاسم
                                </label>

                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="اكتب الاسم"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.15 }}
                                className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                            >
                                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <MessageCircle className="h-4 w-4" />
                                    الزر
                                </label>

                                <input
                                    value={buttonText}
                                    onChange={(e) => setButtonText(e.target.value)}
                                    placeholder="نص الزر"
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.2 }}
                            className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                        >
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <MessageCircle className="h-4 w-4" />
                                الرسالة
                            </label>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="اكتب الرسالة هنا"
                                rows={6}
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25 }}
                            className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                        >
                            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                <ImagePlus className="h-4 w-4" />
                                رابط الصورة
                            </label>

                            <input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="حط رابط صورة مباشر"
                                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                            />

                            <p className="mt-2 text-xs leading-6 text-slate-500">
                                استخدم رابط صورة مباشر، والصورة هتظهر داخل الصفحة النهائية.
                            </p>
                        </motion.div>
                    </section>

                    <aside className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.1 }}
                            className={`overflow-hidden rounded-[2rem] border shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${selected.panel}`}
                        >
                            <div className="p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                                        <Heart className="h-4 w-4 text-rose-500" />
                                        المعاينة المباشرة
                                    </div>
                                    <div className="text-xs font-medium text-slate-500">{selected.name}</div>
                                </div>

                                <div className={`rounded-[2rem] p-5 text-center ${selected.previewBg} ${selected.previewText}`}>
                                    <div className="mb-4 flex items-center justify-center">
                                        <motion.div
                                            animate={{ scale: [1, 1.12, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r ${selected.accent} text-3xl text-white shadow-xl`}
                                        >
                                            {selected.symbol}
                                        </motion.div>
                                    </div>

                                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                                        Preview
                                    </div>

                                    {imageUrl ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="mx-auto mb-4 aspect-[4/3] w-full max-w-md overflow-hidden rounded-[1.5rem] shadow-xl"
                                        >
                                            <img
                                                src={imageUrl}
                                                alt="preview"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        </motion.div>
                                    ) : (
                                        <div className="mx-auto mb-4 flex aspect-[4/3] w-full max-w-md items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-white/70 text-sm text-slate-400">
                                            أضف صورة للمعاينة
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                                        {name || "اكتب الاسم"}
                                    </h2>

                                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                                        {message || "اكتب الرسالة وستظهر هنا بشكل جميل قبل إنشاء الرابط."}
                                    </p>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${selected.accent} px-6 py-3 text-sm font-bold text-white shadow-lg`}
                                    >
                                        {displayButtonText}
                                        <ArrowRight className="h-4 w-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.16 }}
                            className="rounded-[2rem] border border-white/50 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
                        >
                            <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
                                <LinkIcon className="h-5 w-5" />
                                اللينك النهائي
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium break-all text-slate-700">
                                {shareLink}
                            </div>

                            <div className="mt-4 flex gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    {loading ? "جاري الإنشاء..." : "Generate Link"}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={copyLink}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                                >
                                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                    {copied ? "Copied" : "Copy"}
                                </motion.button>
                            </div>

                            <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                                الصفحات بتتحفظ في Firebase، والصورة بتظهر من الرابط المباشر اللي تضيفه.
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </main>
    );
}