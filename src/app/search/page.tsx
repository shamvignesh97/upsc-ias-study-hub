import SearchClient from "@/components/SearchClient";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="mt-2 text-slate-600">Find topics across the entire syllabus seed data.</p>
      </div>
      <SearchClient />
    </div>
  );
}
