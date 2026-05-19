import React, { useMemo, useState } from "react";

// Inline SVG icons — no external dependency needed
const Heart = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);
const Sparkles = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/>
    <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75z"/>
    <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z"/>
  </svg>
);
const ImagePlus = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <path d="M21 15l-5-5L5 21"/><path d="M16 5h6m-3-3v6"/>
  </svg>
);
const LinkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
  </svg>
);
const Wand2 = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 4V2m0 14v-2M8 9H2m14 0h-2m-4.2 4.2L2 21M9.8 4.8 8 3M15 9l-6 6"/>
    <path d="m3 3 18 18"/>
  </svg>
);
const Palette = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125 0-.92.75-1.625 1.672-1.625H16c2.761 0 5-2.239 5-5 0-4.42-4.03-8-9-8z"/>
  </svg>
);
const MessageCircle = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const UserRound = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 10-16 0"/>
  </svg>
);
const ArrowRight = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);
const Copy = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
);
const Check = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const templates = [
  {
    id: "romantic",
    name: "رومانسي",
    accent: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    border: "border-pink-200",
    title: "مفاجأة من القلب",
    subtitle: "صفحة بسيطة وشيكّة للمشاعر والرسائل الخاصة.",
    button: "افتح الرسالة",
  },
  {
    id: "birthday",
    name: "عيد ميلاد",
    accent: "from-violet-500 to-fuchsia-500",
    bg: "bg-violet-50",
    border: "border-violet-200",
    title: "Happy Birthday!",
    subtitle: "مناسبة مبهجة مع ألوان احتفالية ولمسة خفيفة.",
    button: "شوف المفاجأة",
  },
  {
    id: "cute",
    name: "كيوت",
    accent: "from-cyan-500 to-sky-500",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    title: "أحلى صفحة كيوت",
    subtitle: "ستايل لطيف مناسب للصور الصغيرة والرسائل القصيرة.",
    button: "افتحي هنا",
  },
  {
    id: "dark",
    name: "دارك",
    accent: "from-slate-700 to-slate-900",
    bg: "bg-slate-900",
    border: "border-slate-700",
    title: "Elegant Dark",
    subtitle: "تصميم فخم وهادئ مناسب للستايل العصري.",
    button: "عرض الصفحة",
  },
];

const defaultImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80";

function slugify(text) {
  return (
    (text || "")
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 28) || "page"
  );
}

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
  const [generated, setGenerated] = useState(false);
  const [pageId, setPageId] = useState("love-123");

  const selected = templateById(theme);
  const previewTheme = selected.id === "dark";

  const shareLink = useMemo(() => {
    return `https://your-domain.com/p/${pageId}`;
  }, [pageId]);

  function handleGenerate() {
    const safeName = slugify(name || "page");
    const suffix = Math.random().toString(36).slice(2, 6);
    setPageId(`${safeName}-${suffix}`);
    setGenerated(true);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
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
        {/* Header */}
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
              المستخدم يختار الـ template، يكتب الرسالة، يرفع صورة، ويطلع له
              رابط جاهز للمشاركة فورًا.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5"
            >
              <Wand2 className="h-4 w-4" />
              Generate
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Controls */}
          <section className="space-y-6">
            {/* Template Picker */}
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
                        : `${t.bg} ${t.border}`
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
                          theme === t.id ? "bg-white/10 text-white" : "bg-white text-slate-700"
                        }`}
                      >
                        Template
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name + Button Text */}
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

            {/* Message */}
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

            {/* Image URL */}
            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <ImagePlus className="h-4 w-4" />
                رابط الصورة
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="حط رابط صورة أو خليها افتراضية"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-900"
              />
              <p className="mt-2 text-xs text-slate-500">
                في النسخة الجاية ممكن نضيف رفع صورة مباشر بدل الرابط.
              </p>
            </div>
          </section>

          {/* Right: Preview + Link */}
          <aside className="space-y-6">
            {/* Live Preview */}
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
                  className={`rounded-3xl p-5 text-center ${
                    previewTheme ? "bg-slate-800 text-white" : "bg-white"
                  }`}
                >
                  <div className="mx-auto mb-4 aspect-video w-full overflow-hidden rounded-2xl shadow-xl">
                    <img
                      src={imageUrl || defaultImage}
                      alt="preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultImage;
                      }}
                    />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight">
                    {name || "اسم المستخدم"}
                  </h2>
                  <p
                    className={`mx-auto mt-3 max-w-md text-sm leading-7 ${
                      previewTheme ? "text-white/70" : "text-slate-600"
                    }`}
                  >
                    {message || "الرسالة هتظهر هنا."}
                  </p>

                  <button
                    className={`mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r ${selected.accent} px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105`}
                  >
                    {buttonText || "افتح"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Link Section */}
            <div className="rounded-3xl border border-white/50 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center gap-2 text-lg font-bold">
                <LinkIcon className="h-5 w-5" />
                اللينك النهائي
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700 break-all">
                {generated ? shareLink : "اضغط Generate عشان يتولد لينك"}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleGenerate}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Link
                </button>
                <button
                  onClick={copyLink}
                  disabled={!generated}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-40"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                ده MVP أولي: الكود جاهز للتطوير. الخطوة الجاية الطبيعية هي
                ربطه بقاعدة بيانات وحفظ الصفحات ثم تشغيلها من اللينك نفسه.
              </div>
            </div>

            {/* Roadmap */}
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-600">
              <div className="mb-3 font-bold text-slate-900">
                خطة النسخة الجاية
              </div>
              <div className="space-y-2 leading-7">
                <div>1) إضافة رفع صور حقيقي بدل الرابط</div>
                <div>2) حفظ البيانات في Firebase</div>
                <div>3) صفحة /p/[id] للعرض العام</div>
                <div>4) تنزيل أو مشاركة الصفحة مباشرة</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}