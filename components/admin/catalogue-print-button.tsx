import { Download } from "lucide-react";
import Link from "next/link";

export function CataloguePrintButton() {
  return (
    <Link
      href="/admin/catalogue.pdf"
      target="_blank"
      className="fixed right-6 top-6 z-50 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs uppercase tracking-[0.14em] text-white shadow-lg print:hidden"
    >
      <Download size={15} /> Download PDF
    </Link>
  );
}
