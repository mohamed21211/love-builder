import { useMemo, useState } from "react";
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
    bg: "bg-[#fff5f7]",
    border: "border-pink-200",
    subtitle: "صفحة بسيطة وشيكّة للمشاعر والرسائل الخاصة.",
    button: "افتح الرسالة",
  },
  {
    id: "birthday",
    name: "عيد ميلاد",
    accent: "from-violet-500 to-fuchsia-500",
    bg: "bg-[#f8f3ff]",
    border: "border-violet-200",
    subtitle: "مناسبة مبهجة مع ألوان احتفالية ولمسة خفيفة.",
    button: "شوف المفاجأة",
  },
  {
    id: "cute",
    name: "كيوت",
    accent: "from-cyan-500 to-sky-500",
    bg: "bg-[#f2fbff]",
    border: "border-cyan-200",
    subtitle: "ستايل لطيف مناسب للصور الصغيرة والرسائل القصيرة.",
    button: "افتحي هنا",
  },
  {
    id: "dark",
    name: "دارك",
    accent: "from-slate-700 to-slate-900",
    bg: "bg-[#0f172a]",
    border: "border-slate-800",
    subtitle: "تصميم فخم وهادئ مناسب للستايل العصري.",
    button: "عرض الصفحة",
  },
];

const defaultImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80";

function templateById(id) {
  return templates.find((t) => t.id === id) ?? templates[0];
}

export default function Home() {
  const [name, setName] = useState("محمد");
  const [message, setMessage] = useState("أنا عامل الصفحة دي مخصوص ليك ❤️");
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [theme, setTheme] = useState("romantic");
  const [buttonText, setButtonText] = useState("افتح الرسالة");
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = templateById(theme);
  const previewTheme = selected.id === "dark";

  const shareLink = useMemo(() => {
    return link || "اضغط Generate عشان يتولد لينك";
  }, [link]);

  async function handleGenerate() {
    if (!name || !message) {
      alert("اكتب الاسم والرسالة الأول");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "pages"), {
        name,
        message,
        imageUrl,
        theme,
        buttonText,
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
    <div
      className={`min-h-screen ${
        previewTheme
          ? "bg-slate-950 text-white"
          : "bg-gradient-to-br from-white via-pink-50 to-violet-50 text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 lg:px-10">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/70 p-5 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
              <Sparkles className="h-4 w-4" />
              موقع إنشاء صفحات شخصية جاهزة
            </div>

            <h1 className="text-2xl font-black tracking-tight md:text-4xl">
              ابني صفحة كاملة من شكل جاهز وشاركها بلينك
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-600 md:text-base">
              المستخدم يختار الـ template، يكتب الرسالة، يضيف رابط صورة، ويطلع له رابط جاهز للمشاركة فورًا.
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
          >
            <Wand2 className="h-4 w-4" />
            {loading ? "جاري الإنشاء..." : "Generate"}
          </button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-5 flex items-center gap-2 text-lg font-bold">
                <Palette className="h-5 w-5" />
                اختر الشكل
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setButtonText(t.button);
                    }}
                    className={`group rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      theme === t.id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : `${t.bg} ${t.border} bg-white`
                    }`}
                  >
                    <div
                      className={`mb-3 h-2 w-20 rounded-full bg-gradient-to-r ${t.accent}`}
                    />

                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-lg font-bold">{t.name}</div>
                        <div
                          className={`mt-1 text-sm ${
                            theme === t.id ? "text-white/80" : "text-slate-600"
                          }`}
                        >
                          {t.subtitle}
                        </div>
                      </div>

                      <div
                        className={`rounded-2xl px-3 py-1 text-xs font-bold ${
                          theme === t.id ? "bg-white/10" : "bg-white"
                        }`}
                      >
                        Template
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <UserRound className="h-4 w-4" />
                  الاسم
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اكتب الاسم"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>

              <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageCircle className="h-4 w-4" />
                  الزر
                </label>

                <input
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="نص الزر"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MessageCircle className="h-4 w-4" />
                الرسالة
              </label>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب الرسالة هنا"
                rows={5}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
              />
            </div>

            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ImagePlus className="h-4 w-4" />
                رابط الصورة
              </label>

              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="حط رابط صورة مباشر"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
              />

              <p className="mt-2 text-xs text-slate-500">
                لازم يكون رابط صورة مباشر أونلاين عشان يظهر في اللينك.
              </p>
            </div>
          </section>

          <aside className="space-y-6">
            <div
              className={`overflow-hidden rounded-3xl border shadow-sm ${selected.border} ${selected.bg}`}
            >
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow-sm">
                    <Heart className="h-4 w-4 text-rose-500" />
                    المعاينة المباشرة
                  </div>

                  <div className="text-xs font-medium text-slate-500">
                    {selected.name}
                  </div>
                </div>

                <div
                  className={`rounded-[2rem] p-5 text-center ${
                    previewTheme ? "bg-slate-900 text-white" : "bg-white"
                  }`}
                >
                  <div className="mx-auto mb-4 aspect-[4/3] w-full max-w-md overflow-hidden rounded-[1.5rem] shadow-xl">
                    <img
                      src={imageUrl || defaultImage}
                      alt="preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultImage;
                      }}
                    />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight md:text-3xl">
                    {name || "اسم المستخدم"}
                  </h2>

                  <p
                    className={`mx-auto mt-3 max-w-md text-sm leading-7 ${
                      previewTheme ? "text-white/80" : "text-slate-600"
                    }`}
                  >
                    {message || "الرسالة هتظهر هنا."}
                  </p>

                  <button
                    className={`mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${selected.accent} px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]`}
                  >
                    {buttonText || "افتح"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-lg font-bold">
                <LinkIcon className="h-5 w-5" />
                اللينك النهائي
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 break-all">
                {shareLink}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4" />
                  {loading ? "جاري الإنشاء..." : "Generate Link"}
                </button>

                <button
                  onClick={copyLink}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                الصفحة بتتحفظ في Firebase، واللينك بيتولد حقيقي. الصور تكون برابط مباشر فقط.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}