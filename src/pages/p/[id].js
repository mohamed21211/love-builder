import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const themes = {
    romantic: {
        pageBg: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200",
        cardBg: "bg-white/75 border-pink-200/60 text-slate-900",
        overlay: "bg-black/85 text-white",
        accent: "from-pink-500 to-rose-500",
        symbol: "❤️",
        title: "رسالة خاصة ليك",
        subtitle: "اضغط الزر وشوف المفاجأة",
        particle: "❤️",
        particleClass: "text-pink-300/80",
        glow: "shadow-pink-300/30",
    },
    birthday: {
        pageBg: "bg-gradient-to-br from-violet-100 via-fuchsia-50 to-pink-100",
        cardBg: "bg-white/80 border-violet-200/60 text-slate-900",
        overlay: "bg-slate-950/88 text-white",
        accent: "from-violet-500 to-fuchsia-500",
        symbol: "🎉",
        title: "مفاجأة عيد ميلاد",
        subtitle: "الهدية الحقيقية مستنياك جوه",
        particle: "✨",
        particleClass: "text-violet-300/80",
        glow: "shadow-violet-300/30",
    },
    cute: {
        pageBg: "bg-gradient-to-br from-cyan-100 via-sky-50 to-white",
        cardBg: "bg-white/80 border-cyan-200/60 text-slate-900",
        overlay: "bg-sky-950/88 text-white",
        accent: "from-cyan-500 to-sky-500",
        symbol: "🧸",
        title: "رسالة كيوت",
        subtitle: "فيه كلام لطيف ورا الزر",
        particle: "🫧",
        particleClass: "text-cyan-300/80",
        glow: "shadow-cyan-300/30",
    },
    dark: {
        pageBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800",
        cardBg: "bg-white/5 border-white/10 text-white",
        overlay: "bg-black/90 text-white",
        accent: "from-slate-300 to-fuchsia-400",
        symbol: "✨",
        title: "رسالة خاصة",
        subtitle: "اللمسة الجميلة مستنياك",
        particle: "✦",
        particleClass: "text-white/30",
        glow: "shadow-fuchsia-500/20",
    },
};

function themeByName(name) {
    return themes[name] ?? themes.romantic;
}

export default function PageView() {
    const [page, setPage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [opened, setOpened] = useState(false);
    const [showSurprise, setShowSurprise] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        async function loadPage() {
            const id = window.location.pathname.split("/").pop();
            const docRef = doc(db, "pages", id);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                setPage(snap.data());
            }

            setLoading(false);
        }

        loadPage();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const theme = themeByName(page?.theme);

    const particles = Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: `${8 + ((index * 11) % 84)}%`,
        duration: 7 + (index % 5),
        delay: index * 0.35,
        size: 14 + (index % 4) * 6,
    }));

    function handleOpen() {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        setShowSurprise(true);

        timerRef.current = window.setTimeout(() => {
            setOpened(true);
            setShowSurprise(false);
        }, 1400);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Loading...
            </div>
        );
    }

    if (!page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Page not found
            </div>
        );
    }

    return (
        <main className={`relative min-h-screen overflow-hidden ${theme.pageBg} flex items-center justify-center p-6`}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {particles.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ y: 720, opacity: 0, rotate: 0 }}
                        animate={{
                            y: -220,
                            opacity: [0, 0.9, 0.9, 0],
                            rotate: [0, 18, -8, 0],
                        }}
                        transition={{
                            duration: item.duration,
                            repeat: Infinity,
                            delay: item.delay,
                            ease: "linear",
                        }}
                        className={`absolute ${theme.particleClass}`}
                        style={{
                            left: item.left,
                            fontSize: item.size,
                        }}
                    >
                        {theme.particle}
                    </motion.div>
                ))}
            </div>

            <div className="pointer-events-none absolute inset-0">
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/25 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl"
                />
            </div>

            <AnimatePresence mode="wait">
                {!opened ? (
                    <motion.div
                        key="cover"
                        initial={{ opacity: 0, scale: 0.85, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.06 }}
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

                            <h1 className={`text-4xl font-black tracking-tight md:text-5xl ${theme.accent.includes("slate") ? "text-white" : "text-pink-600"}`}>
                                {theme.title}
                            </h1>

                            <p className={`mt-3 text-sm leading-7 ${page.theme === "dark" ? "text-white/75" : "text-slate-500"}`}>
                                {theme.subtitle}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleOpen}
                                className={`mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${theme.accent} px-10 py-4 text-sm font-bold text-white shadow-xl`}
                            >
                                {page.buttonText || "افتح الرسالة"}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="message"
                        initial={{ opacity: 0, scale: 0.82, y: 38 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                        className={`relative w-full max-w-2xl overflow-hidden rounded-[2.25rem] border backdrop-blur-2xl ${theme.cardBg} shadow-2xl ${theme.glow}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />

                        <div className="relative p-6 md:p-10 text-center">
                            {page.imageUrl && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="mx-auto mb-6 aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[1.75rem] shadow-2xl"
                                >
                                    <img src={page.imageUrl} alt="page" className="h-full w-full object-cover" />
                                </motion.div>
                            )}

                            {page.name && (
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.12 }}
                                    className={`text-4xl font-black tracking-tight md:text-5xl ${page.theme === "dark" ? "text-white" : "text-pink-600"}`}
                                >
                                    {page.name}
                                </motion.h2>
                            )}

                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.24 }}
                                className={`mx-auto mt-5 max-w-2xl text-xl leading-[2.2] md:text-2xl ${page.theme === "dark" ? "text-white/85" : "text-slate-700"}`}
                            >
                                {page.message}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.55, delay: 0.35 }}
                                className={`mt-8 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${page.theme === "dark" ? "border-white/10 bg-white/5 text-white/70" : "border-slate-200 bg-white/70 text-slate-500"}`}
                            >
                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                Opened with love
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showSurprise && !opened && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`fixed inset-0 z-50 flex items-center justify-center ${theme.overlay}`}
                >
                    <motion.div
                        animate={{ scale: [1, 1.12, 1], rotate: [0, 1.5, -1.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                        className="text-center"
                    >
                        <div className="mb-5 text-8xl">{theme.symbol}</div>
                        <h2 className="text-3xl font-black md:text-5xl">جاري فتح المفاجأة...</h2>
                        <p className="mt-3 text-sm text-white/75">انتظر لحظة واحدة</p>
                    </motion.div>
                </motion.div>
            )}
        </main>
    );
}