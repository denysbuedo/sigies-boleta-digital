import Link from 'next/link';
import { ArrowUpRight, GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-9 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mes-50 text-mes-800"><GraduationCap className="h-5 w-5" aria-hidden="true" /></span>
          <div>
            <p className="text-sm font-extrabold text-slate-950">Portal del Aspirante a la Educación Superior</p>
            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">Prototipo de consulta de instituciones universitarias. Los datos de demostración se identifican en el catálogo.</p>
          </div>
        </div>
        <Link href="https://www.mes.gob.cu/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-mes-800 hover:underline">
          Sitio del MES <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} República de Cuba · Prototipo en desarrollo
      </div>
    </footer>
  );
}
