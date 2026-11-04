import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck, 
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-10 sm:py-16">
      
      {/* 1. SECCIÓN HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#082C55] via-[#0B3C73] to-[#1D4F79] p-8 text-white shadow-xl shadow-blue-950/15 sm:p-12 lg:p-16">
          
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-blue-300/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            
            {/* Badge de estado */}
            <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md border border-white/15">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400"></span>
              </span>
              <span className="text-blue-100">Aplicación en construcción • Próxima Convocatoria de Ingreso</span>
            </div>

            {/* Título Principal */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white">
              Portal del Aspirante
            </h1>

            {/* Subtítulo */}
            <p className="text-lg text-blue-100 sm:text-xl font-normal leading-relaxed">
              El canal digital oficial para consultar la oferta de carreras universitarias, organizar tus preferencias académicas y presentar tu solicitud de ingreso con validez y total transparencia.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/universidades"
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#0B3C73] shadow-md hover:bg-blue-50 transition active:scale-95"
              >
                <Building2 className="h-4 w-4" />
                <span>Explorar Universidades</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href="#como-funciona"
                className="flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3.5 text-sm font-semibold text-white border border-white/20 hover:bg-white/15 transition"
              >
                <span>¿Cómo funciona el proceso?</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PILARES CLAVE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0B3C73] mb-5">
              <Building2 className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Oferta Académica Oficial
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Accede al catálogo verificado de universidades de Cuba, sedes, modalidades de estudio y carreras aprobadas para la convocatoria.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 mb-5">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Identidad Digital Segura
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Autenticación ciudadana segura y directa. Tu habilitación y datos académicos se validan de forma oficial sin intermediarios.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 mb-5">
              <FileCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">
              Boleta Digital de 10 Preferencias
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ordena tus opciones con facilidad, guarda borradores desde cualquier dispositivo y recibe un comprobante verificable con código único.
            </p>
          </div>

        </div>
      </section>

      {/* 3. CÓMO FUNCIONA EL PROCESO */}
      <section id="como-funciona" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12">
          
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Paso a paso
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              ¿Cómo solicitarás tus carreras?
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Un proceso ágil, transparente y con total respaldo ministerial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="relative border-l-2 border-blue-500/40 pl-5 space-y-2">
              <span className="text-blue-400 font-mono text-xs font-bold">01</span>
              <h3 className="font-semibold text-white text-base">Consulta la Oferta</h3>
              <p className="text-xs text-slate-400">Explora las universidades, requisitos y planes de estudio disponibles.</p>
            </div>

            <div className="relative border-l-2 border-blue-500/40 pl-5 space-y-2">
              <span className="text-blue-400 font-mono text-xs font-bold">02</span>
              <h3 className="font-semibold text-white text-base">Acceso Ciudadano</h3>
              <p className="text-xs text-slate-400">Ingresa con tu identidad digital certificada en un entorno protegido.</p>
            </div>

            <div className="relative border-l-2 border-blue-500/40 pl-5 space-y-2">
              <span className="text-blue-400 font-mono text-xs font-bold">03</span>
              <h3 className="font-semibold text-white text-base">Selecciona tus Carreras</h3>
              <p className="text-xs text-slate-400">Elige y ordena hasta 10 preferencias según tus intereses vocacionales.</p>
            </div>

            <div className="relative border-l-2 border-emerald-500 pl-5 space-y-2">
              <span className="text-emerald-400 font-mono text-xs font-bold">04</span>
              <h3 className="font-semibold text-white text-base">Comprobante Oficial</h3>
              <p className="text-xs text-slate-400">Obtén tu comprobante oficial con código de comprobación y número de folio.</p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}