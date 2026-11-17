'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, ChevronDown, MapPin, RefreshCw, Award } from 'lucide-react';
import { UniversityLogo } from '@/features/universities/components/UniversityLogo';
import type { University, UniversityCatalog } from '@/features/universities/types/mes';

export default function UniversidadesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState('TODAS');

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch('/api/portal/universities', { signal: controller.signal });
        if (!response.ok) {
          const failure = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(failure?.error || 'No pudimos cargar el catálogo. Intenta de nuevo.');
        }

        const result = (await response.json()) as UniversityCatalog;
        if (!Array.isArray(result.universities)) throw new Error('El catálogo recibido no tiene un formato válido.');

        setUniversities(result.universities);
        setError(null);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'Ocurrió un error al cargar el catálogo.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadCatalog();
    return () => controller.abort();
  }, []);

  const provinces = useMemo(() => {
    const unique = new Map<string, string>();
    universities.forEach((university) => {
      const province = university.nameProvince?.trim();
      if (province) unique.set(province.toLocaleLowerCase('es'), province);
    });
    const result: string[] = [];
    unique.forEach((province) => result.push(province));
    return result.sort((a, b) => a.localeCompare(b, 'es'));
  }, [universities]);

  const visibleUniversities = useMemo(() => {
    if (selectedProvince === 'TODAS') return universities;
    return universities.filter(
      (university) => university.nameProvince?.toLocaleLowerCase('es') === selectedProvince.toLocaleLowerCase('es')
    );
  }, [universities, selectedProvince]);

  const getBadgeStyle = (category?: string) => {
    switch (category) {
      case 'Excelencia':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Certificada':
        return 'bg-blue-50 text-[#0B3C73] border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="pb-16 bg-[#F8FAFC]">
      {/* Portada Superior */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#082C55] via-[#0B3C73] to-[#1D4F79] text-white shadow-sm">
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          <div className="max-w-3xl">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200 transition hover:text-white">
              <ArrowRight className="h-3.5 w-3.5 rotate-180" aria-hidden="true" />
              Inicio
            </Link>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.2em] text-blue-200">
              Red de Educación Superior de Cuba
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Universidades Oficiales
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Consulta las instituciones acreditadas por el Ministerio de Educación Superior, conoce sus sedes y explora la oferta académica autorizada.
            </p>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold">{loading ? '—' : universities.length}</div>
              <div className="mt-1 text-xs font-medium text-blue-100">Instituciones activas</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold">{loading ? '—' : provinces.length}</div>
              <div className="mt-1 text-xs font-medium text-blue-100">Provincias del país</div>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <div className="text-2xl font-extrabold">100%</div>
              <div className="mt-1 text-xs font-medium text-blue-100">Catálogo oficial MES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {/* Barra de Filtro */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block text-sm font-bold text-slate-900">Filtrar por territorio</span>
            <p className="text-xs text-slate-500">Selecciona una provincia para explorar su oferta universitaria.</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B3C73]" aria-hidden="true" />
            <select
              id="province-filter"
              value={selectedProvince}
              onChange={(event) => setSelectedProvince(event.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0B3C73] focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="TODAS">Todas las provincias ({universities.length})</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </div>
        </div>

        {/* Indicador de Estado y Conteo */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <p className="text-slate-600">
            Mostrando <strong className="font-extrabold text-slate-900">{visibleUniversities.length}</strong>{' '}
            {visibleUniversities.length === 1 ? 'institución' : 'instituciones'}
            {selectedProvince !== 'TODAS' && (
              <> en <strong className="text-[#0B3C73]">{selectedProvince}</strong></>
            )}
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-bold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Datos oficiales del Ministerio de Educación Superior</span>
          </div>
        </div>

        {/* Cuadrícula de Universidades */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-80 animate-pulse rounded-3xl border border-slate-200 bg-white p-6" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
            <p className="font-bold text-rose-950">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-900 px-4 py-2 text-xs font-bold text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reintentar
            </button>
          </div>
        ) : visibleUniversities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h2 className="text-base font-bold text-slate-900">No hay instituciones en esta provincia</h2>
            <button
              type="button"
              onClick={() => setSelectedProvince('TODAS')}
              className="mt-3 text-xs font-bold text-[#0B3C73] hover:underline"
            >
              Ver todas las provincias
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {visibleUniversities.map((university) => {
              // Asegurar identificador válido para que el Link nunca falle ni recargue
              const uniSlug = (university.abbreviation || university.name || '').trim();

              return (
                <article
                  key={university.abbreviation || university.name}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0B3C73]/40 hover:shadow-xl hover:shadow-blue-950/5"
                >
                  <div className="space-y-4">
                    {/* Fila Superior: Logo destacado y Badge de Acreditación */}
                    <div className="flex items-start justify-between gap-4">
                      <UniversityLogo university={university} />

                      {university.accreditationCategory && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border shrink-0 ${getBadgeStyle(
                            university.accreditationCategory
                          )}`}
                        >
                          <Award className="h-3.5 w-3.5 shrink-0" />
                          <span>{university.accreditationCategory}</span>
                        </span>
                      )}
                    </div>

                    {/* Nombre y Provincia */}
                    <div className="pt-1">
                      <h2 className="text-lg font-extrabold text-slate-950 group-hover:text-[#0B3C73] transition leading-snug line-clamp-2">
                        {university.name}
                      </h2>
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-[#0B3C73] shrink-0" />
                        <span>{university.nameProvince || 'Provincia no disponible'}</span>
                      </div>
                    </div>

                    {/* Dirección */}
                    {university.headquartersAddress && (
                      <p className="text-xs leading-relaxed text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {university.headquartersAddress}
                      </p>
                    )}
                  </div>

                  {/* Botón de Acción con navegación garantizada */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Link
                      href={`/universidades/${encodeURIComponent(uniSlug)}`}
                      className="inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-xs font-bold text-[#0B3C73] transition-colors duration-200 group-hover:bg-[#0B3C73] group-hover:text-white"
                    >
                      <span>Ver oferta y facultades</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}