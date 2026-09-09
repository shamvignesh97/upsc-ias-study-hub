import Link from "next/link";

export const metadata = {
  title: "Offline — UPSC IAS Study Hub",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-[#0f2744]">
        IAS
      </div>
      <h1 className="text-xl font-semibold text-slate-900">You&apos;re offline</h1>
      <p className="mt-2 text-sm text-slate-600">
        This page isn&apos;t cached yet. Open Dashboard, Syllabus, Quiz, or other
        sections while online once — they&apos;ll work offline after that.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="rounded-lg bg-[#0f2744] px-4 py-2 text-sm font-medium text-white"
        >
          Dashboard
        </Link>
        <Link
          href="/syllabus"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
        >
          Syllabus
        </Link>
        <Link
          href="/bookmarks"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800"
        >
          Bookmarks
        </Link>
      </div>
    </div>
  );
}
