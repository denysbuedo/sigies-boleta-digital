import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 text-slate-600 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[#0B3C73]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Portal del Aspirante a la Educación Superior
              </p>
              <p className="text-xs text-slate-500">
                Canal oficial de consulta y solicitud de carreras universitarias | Cuba
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Sistema oficial del Ministerio de Educación Superior</span>
          </div>

        </div>

        <div className="mt-6 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} República de Cuba. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}