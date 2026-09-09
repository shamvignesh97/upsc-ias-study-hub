import BookmarksClient from "@/components/BookmarksClient";

export default function BookmarksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookmarks</h1>
        <p className="mt-2 text-slate-600">Topics you saved for quick revision (localStorage).</p>
      </div>
      <BookmarksClient />
    </div>
  );
}
