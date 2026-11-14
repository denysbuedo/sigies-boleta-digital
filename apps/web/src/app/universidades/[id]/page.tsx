'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  Building2,
  Check,
  ExternalLink,
  Globe2,
  GraduationCap,
  Landmark,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  School,
  Search,
  Wifi,
  X,
  Share2
} from 'lucide-react';
import { UniversityLogo } from '@/features/universities/components/UniversityLogo';
import type { Career, UniversityDetail } from '@/features/universities/types/mes';

function SocialIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  if (n.includes('facebook') || n.includes('fb')) {
    return (
      <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    );
  }
  if (n.includes('twitter') || n.includes(' x') || n === 'x') {
    return (
      <svg className="h-4 w-4 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }
  if (n.includes('telegram') || n.includes('tg')) {
    return (
      <svg className="h-4 w-4 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.83.941z"/>
      </svg>
    );
  }
  if (n.includes('instagram') || n.includes('ig')) {
    return (
      <svg className="h-4 w-4 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );
  }
  if (n.includes('youtube') || n.includes('yt')) {
    return (
      <svg className="h-4 w-4 text-[#FF0000]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  return <Share2 className="h-4 w-4 text-slate-500" />;
}

function safeExternalUrl(value?: string): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function CareerCard({ career }: { career: Career }) {
  const modalities = [
    { name: 'Diurno', enabled: career.dayMode, duration: career.dayModeDuration, Icon: GraduationCap },
    { name: 'Por encuentros', enabled: career.meetingMode, duration: career.meetingModeDuration, Icon: School },
    { name: 'A distancia', enabled: career.remoteMode, duration: undefined, Icon: Wifi },
  ];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#0B3C73]/30 hover:shadow-lg hover:shadow-slate-900/5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#0B3C73] border border-blue-100">
          {career.programType || 'Programa'}
        </span>
        {career.accreditationCategory && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            {career.accreditationCategory}
          </span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-extrabold text-slate-950">{career.name}</h3>
      {career.description && <p className="mt-2 text-sm leading-6 text-slate-600">{career.description}</p>}
      <div className="mt-5 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-3">
        {modalities.map(({ name, enabled, duration, Icon }) => (
          <div
            key={name}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
              enabled ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-slate-50 text-slate-400'
            }`}
          >
            {enabled ? <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" /> : <X className="h-3.5 w-3.5 shrink-0 text-slate-400" />}
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{name}{enabled && duration ? ` · ${duration} años` : ''}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function UniversityDetailPage() {
  const routeParams = useParams();
  const rawId = (routeParams?.id as string) || '';
  const abbreviation = decodeURIComponent(rawId).trim().toUpperCase();

  const [detail, setDetail] = useState<UniversityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'pregrado' | 'informacion'>('pregrado');
  const [careerSearch, setCareerSearch] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState('TODOS');

  useEffect(() => {
    if (!abbreviation) return;
    const controller = new AbortController();

    async function loadDetail() {
      try {
        setLoading(true);
        const response = await fetch(`/api/portal/universities/${encodeURIComponent(abbreviation)}`, {
          signal: controller.signal,
        });
        if (response.status === 404) throw new Error('No encontramos esta universidad en el catálogo.');
        if (!response.ok) throw new Error('No pudimos cargar la información de esta institución.');
        const result = (await response.json()) as UniversityDetail;
        if (!result.university) throw new Error('La respuesta no contiene los datos de la universidad.');
        setDetail(result);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'Ocurrió un error al cargar la universidad.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadDetail();
    return () => controller.abort();
  }, [abbreviation]);

  const programTypes = useMemo(() => {
    const types = Array.from(new Set((detail?.careers || []).map((c) => c.programType).filter(Boolean)));
    return ['TODOS', ...types];
  }, [detail]);

  const filteredCareers = useMemo(() => {
    return (detail?.careers || []).filter((career) => {
      const matchSearch =
        career.name.toLowerCase().includes(careerSearch.toLowerCase()) ||
        (career.description && career.description.toLowerCase().includes(careerSearch.toLowerCase()));
      const matchType = selectedProgramType === 'TODOS' || career.programType === selectedProgramType;
      return matchSearch && matchType;
    });
  }, [detail, careerSearch, selectedProgramType]);

  const mapQuery = useMemo(() => {
    const university = detail?.university;
    return (
      university?.headquartersCoordinates?.trim() ||
      university?.headquartersAddress?.trim() ||
      university?.nameProvince?.trim() ||
      university?.name ||
      ''
    );
  }, [detail]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-[#0B3C73]" aria-hidden="true" />
          <p className="mt-4 text-sm font-bold text-slate-700">Cargando información oficial…</p>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <Landmark className="h-7 w-7" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-950">Universidad no disponible</h1>
        <p className="mt-2 text-sm text-slate-600">{error || 'No hay información para mostrar.'}</p>
        <Link
          href="/universidades"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B3C73] px-4 py-3 text-sm font-bold text-white hover:bg-[#082C55]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al catálogo
        </Link>
      </div>
    );
  }

  const { university, socialMedia, municipalCenters, warnings } = detail;
  const website = safeExternalUrl(university.webSite);
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

  // Rector unificado
  const rectorFullName = [university.academicDegree, university.rector]
    .filter(Boolean)
    .join(' ')
    .trim();

  const facts = [
    { label: 'Siglas', value: university.abbreviation },
    { label: 'Categoría de acreditación', value: university.accreditationCategory },
    { label: 'Estructura superior', value: university.estructuraSuperior },
    { label: 'Provincia', value: university.nameProvince },
    { label: 'Rector(a)', value: rectorFullName },
    { label: 'Fecha de fundación', value: university.fundationDate },
    { label: 'Dirección de la sede principal', value: university.headquartersAddress },
    { label: 'Coordenadas de la sede', value: university.headquartersCoordinates },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value?.trim()));

  return (
    <div className="pb-16 bg-[#F8FAFC]">
      {/* Cabecera Principal */}
      <section className="bg-gradient-to-r from-[#082C55] to-[#0B3C73] text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-12 lg:px-8">
          <Link
            href="/universidades"
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver al catálogo
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <UniversityLogo university={university} size="large" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {university.nameProvince && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100">
                    {university.nameProvince}
                  </span>
                )}
                {university.accreditationCategory && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    {university.accreditationCategory}
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{university.name}</h1>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-blue-100">
                {rectorFullName && (
                  <span className="font-medium">
                    <strong className="text-sky-200">Rector(a):</strong> {rectorFullName}
                  </span>
                )}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-sky-200 underline decoration-white/30 underline-offset-4 hover:decoration-white hover:text-white"
                  >
                    <Globe2 className="h-4 w-4" aria-hidden="true" />
                    Sitio institucional
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navegación por Pestañas */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Secciones">
            <button
              type="button"
              onClick={() => setActiveTab('pregrado')}
              className={`flex items-center gap-2 py-4 px-1 text-sm font-bold border-b-2 transition ${
                activeTab === 'pregrado'
                  ? 'border-[#0B3C73] text-[#0B3C73]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <GraduationCap className="h-5 w-5" />
              <span>Pregrado (Oferta Académica)</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {detail.careers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('informacion')}
              className={`flex items-center gap-2 py-4 px-1 text-sm font-bold border-b-2 transition ${
                activeTab === 'informacion'
                  ? 'border-[#0B3C73] text-[#0B3C73]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Landmark className="h-5 w-5" />
              <span>Datos Generales e Institucionales</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {warnings.length > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
            {warnings.join(' ')}
          </div>
        )}

        {/* 1. SECCIÓN DE PREGRADO (CARRERAS) */}
        {activeTab === 'pregrado' && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                <div className="relative sm:col-span-8">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar carrera por nombre..."
                    value={careerSearch}
                    onChange={(e) => setCareerSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-[#0B3C73] focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  />
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={selectedProgramType}
                    onChange={(e) => setSelectedProgramType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-700 bg-white focus:border-[#0B3C73] focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
                  >
                    <option value="TODOS">Todos los tipos de programa</option>
                    {programTypes
                      .filter((t) => t !== 'TODOS')
                      .map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500">
                <span>
                  Mostrando <strong className="text-slate-900">{filteredCareers.length}</strong> de{' '}
                  {detail.careers.length} carreras autorizadas
                </span>
                {(careerSearch || selectedProgramType !== 'TODOS') && (
                  <button
                    type="button"
                    onClick={() => {
                      setCareerSearch('');
                      setSelectedProgramType('TODOS');
                    }}
                    className="font-semibold text-[#0B3C73] hover:underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
            </div>

            {filteredCareers.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredCareers.map((career, index) => (
                  <CareerCard key={`${career.name}-${index}`} career={career} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <BookOpen className="mx-auto h-9 w-9 text-slate-300" aria-hidden="true" />
                <h3 className="mt-4 font-bold text-slate-900">No se encontraron programas</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Prueba cambiando el término de búsqueda o seleccionando otro tipo de programa.
                </p>
              </div>
            )}
          </section>
        )}

        {/* 2. SECCIÓN DE DATOS GENERALES E INSTITUCIONALES */}
        {activeTab === 'informacion' && (
          <div className="space-y-8">
            {/* Bloque Misión Oficial */}
            {university.mission && (
              <section className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50/50 via-white to-slate-50 p-6 sm:p-10 shadow-sm">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/70 px-3 py-1 text-xs font-bold text-[#0B3C73]">
                    <span>Compromiso Institucional</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#082C55] tracking-tight">
                    Misión
                  </h2>
                  <p className="text-base sm:text-lg leading-relaxed text-slate-700 font-medium">
                    {university.mission}
                  </p>
                </div>
              </section>
            )}

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
              <main className="space-y-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0B3C73]">
                      <Landmark className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 className="text-lg font-extrabold text-slate-950">Datos institucionales</h2>
                      <p className="text-xs text-slate-500">Información certificada en el catálogo del MES</p>
                    </div>
                  </div>

                  <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {facts.map((fact) => (
                      <div key={fact.label} className="border-b border-slate-100 pb-4 last:border-0">
                        <dt className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                          {fact.label}
                        </dt>
                        <dd className="mt-1.5 break-words text-sm font-medium leading-6 text-slate-800">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                    {university.email && (
                      <div className="border-b border-slate-100 pb-4">
                        <dt className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                          Correo electrónico
                        </dt>
                        <dd className="mt-1.5 break-words text-sm font-medium leading-6">
                          <a
                            href={`mailto:${university.email}`}
                            className="text-[#0B3C73] underline decoration-blue-200 underline-offset-4 hover:decoration-[#0B3C73]"
                          >
                            {university.email}
                          </a>
                        </dd>
                      </div>
                    )}
                    {university.phone && (
                      <div className="border-b border-slate-100 pb-4">
                        <dt className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                          Teléfono
                        </dt>
                        <dd className="mt-1.5 text-sm font-medium leading-6">
                          <a
                            href={`tel:${university.phone.replace(/[^+\d]/g, '')}`}
                            className="text-[#0B3C73] underline decoration-blue-200 underline-offset-4 hover:decoration-[#0B3C73]"
                          >
                            {university.phone}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </section>
              </main>

              <aside className="space-y-5">
                {/* Redes Sociales Oficiales */}
                {socialMedia.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-extrabold text-slate-950 mb-3">Canales oficiales</h2>
                    <ul className="space-y-2">
                      {socialMedia.map((social, index) => {
                        const url = safeExternalUrl(social.profile);
                        return (
                          <li key={`${social.name}-${index}`}>
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-[#0B3C73]"
                              >
                                <div className="flex items-center gap-2.5">
                                  <SocialIcon name={social.name} />
                                  <span>{social.name}</span>
                                </div>
                                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                              </a>
                            ) : (
                              <span className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                                <SocialIcon name={social.name} />
                                <span>{social.name}: {social.profile}</span>
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                )}

                {/* Mapa */}
                {(mapQuery || university.headquartersAddress || university.nameProvince) && (
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between gap-3 p-5">
                      <div>
                        <h2 className="text-sm font-extrabold text-slate-950">Ubicación</h2>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {university.headquartersAddress || university.nameProvince || 'Sede principal'}
                        </p>
                      </div>
                      <MapPin className="h-5 w-5 shrink-0 text-[#0B3C73]" aria-hidden="true" />
                    </div>
                    <iframe
                      title={`Mapa de ${university.name}`}
                      src={mapUrl}
                      className="h-52 w-full border-0 bg-slate-100"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="flex items-center justify-between gap-3 p-4">
                      <span className="text-[11px] text-slate-500">Coordenadas del MES</span>
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#0B3C73] hover:underline"
                      >
                        Abrir mapa <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </section>
                )}

                {/* CUM */}
                {municipalCenters.length > 0 && (
                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4 text-[#0B3C73]" aria-hidden="true" />
                      <h2 className="text-sm font-extrabold text-slate-950">Sedes y CUM asociados</h2>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {municipalCenters.map((center) => (
                        <li key={center} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                          {center}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}