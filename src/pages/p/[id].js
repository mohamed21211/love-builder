import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PageView() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);

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
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!page) {
    return <div className="min-h-screen flex items-center justify-center">Page not found</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-pink-100">
      {!opened ? (
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center">
          {page.imageUrl && (
            <img
              src={page.imageUrl}
              alt="page"
              className="w-full h-80 object-cover rounded-3xl mb-6"
            />
          )}

          <h1 className="text-4xl font-black text-pink-600 mb-6">
            {page.name} ❤️
          </h1>

          <button
            onClick={() => setOpened(true)}
            className="bg-pink-500 text-white px-8 py-4 rounded-2xl font-bold"
          >
            {page.buttonText || "افتح الرسالة"}
          </button>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-xl text-center">
          <h2 className="text-3xl font-black text-pink-600 mb-6">
            رسالتك ❤️
          </h2>

          <p className="text-xl text-gray-700 leading-9">
            {page.message}
          </p>
        </div>
      )}
    </main>
  );
}