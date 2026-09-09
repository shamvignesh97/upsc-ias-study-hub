import Link from "next/link";
import OptionalClient from "@/components/OptionalClient";

export default function OptionalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Optional subjects</h1>
        <p className="mt-2 text-slate-600">
          Browse common optionals with brief notes. Focus one to keep it highlighted. See also{" "}
          <Link href="/topic/opt-overview" className="font-medium text-amber-800 underline">
            Choosing an optional
          </Link>
          .
        </p>
      </div>
      <OptionalClient />
    </div>
  );
}
