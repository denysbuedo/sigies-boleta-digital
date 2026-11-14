'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2, 
  Award, 
  Monitor, 
  Users, 
  Wifi, 
  Clock, 
  Check, 
  X, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { UniversityLogo } from '@/features/universities/components/UniversityLogo';
import type { University } from '@/features/universities/types/mes';

interface CareerDetail {
  name: string;
  programType: string;
  accreditationCategory?: string;
  description?: string;
  dayMode: boolean;
  dayModeDuration?: number;
  meetingMode: boolean;
  meetingModeDuration?: number;
  remoteMode: boolean;
  centroRector?: string;
  siglaCentroRector?: string;
}

// Convertidor de nombre a slug URL (ej: "Logofonoaudiología" -> "logofonoaudiologia")
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default function CareerDetailPage() {
  const params = useParams();
  const rawSlug = (params?.id as string) || '';

  const [career, setCareer] = useState<CareerDetail | null>(null);
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawSlug) return;
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch('/api/portal/pregrade').then((res) => (res.ok ? res.json() : Promise.reject('Error carreras'))),
      fetch('/api/portal/universities').then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([pregradeData, uniData]) => {
        if (!isMounted) return;

        const careersList: CareerDetail[] = pregradeData?.careers || [];
        const universitiesList: University[] = uniData?.universities || (Array.isArray(uniData) ? uniData : []);

        // Buscar la carrera por slug o por nombre
        const target = careersList.find(
          (c) => slugify(c.name) === rawSlug.toLowerCase() || c.name.toLowerCase() === decodeURIComponent(rawSlug).toLowerCase()
        );

        if (!target) {
          setError('No encontramos la carrera solicitada.');
          setLoading(false);
          return;
        }

        setCareer(target);

        // Buscar la universidad rectora
        if (target.siglaCentroRector) {
          const uni = universitiesList.find(
            (u) => u.abbreviation?.toUpperCase() === target.siglaCentroRector?.toUpperCase()
          );
          if (uni) setUniversity(uni);
        }

        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('No pudimos cargar la información de la carrera.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [rawSlug]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="mx-auto h-10 w-10 text-[#0B3C73] animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800">Cargando información del programa...</h2>
        <p className="text-xs text-slate-500 mt-1">Consultando detalles oficiales del MES</p>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Programa no disponible</h2>
        <p className="text-sm text-slate-600 mt-2 mb-6">{error || 'No hay información para mostrar.'}</p>
        <Link
          href="/pregrado"
          className="inline-flex items-center gap-2 rounded-xl bg-[#0B3C73] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#082C55]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al catálogo de pregrado</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-16 bg-[#F8FAFC]">
      {/* Barra de Retorno y Título Superior */}
      <section className="bg-gradient-to-r from-[#082C55] to-[#0B3C73] text-white py-10 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/pregrado"
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-200 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver a carreras de pregrado</span>
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sky-100 border border-white/15">
                {career.programType || 'Carrera Universitaria'}
              </span>
              {career.accreditationCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-400/30">
                  <Award className="h-3.5 w-3.5" />
                  {career.accreditationCategory}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mt-3">
              {career.name}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenido Principal en 2 Columnas (Idéntico a tu captura) */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Columna Izquierda: Información de la Carrera */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Tarjeta de Datos y Modalidades */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* Centro rector y acreditación */}
              <div className="space-y-3 pb-6 border-b border-slate-100 text-sm">
                {career.centroRector && (
                  <p className="text-slate-700">
                    <strong className="text-slate-900 font-extrabold">Centro rector:</strong>{' '}
                    {career.siglaCentroRector ? (
                      <Link
                        href={`/universidades/${career.siglaCentroRector}`}
                        className="text-[#0B3C73] font-bold hover:underline"
                      >
                        {career.centroRector}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[#0B3C73]">{career.centroRector}</span>
                    )}
                  </p>
                )}

                {career.accreditationCategory && (
                  <p className="text-slate-700">
                    <strong className="text-slate-900 font-extrabold">Categoría de acreditación:</strong>{' '}
                    <span className="font-semibold text-slate-800">{career.accreditationCategory}</span>
                  </p>
                )}
              </div>

              {/* Modalidades y Duración (idéntico a la captura) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Modalidades de estudio y duración
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Diurno */}
                  <div className={`p-4 rounded-2xl border ${career.dayMode ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="h-5 w-5 text-emerald-700" />
                      <span className="font-bold text-sm">Modalidad diurno</span>
                    </div>
                    {career.dayMode ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Duración de {career.dayModeDuration || 4} años</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No disponible</span>
                    )}
                  </div>

                  {/* Por Encuentros */}
                  <div className={`p-4 rounded-2xl border ${career.meetingMode ? 'bg-blue-50/60 border-blue-200 text-[#0B3C73]' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-[#0B3C73]" />
                      <span className="font-bold text-sm">Modalidad cursos por encuentros</span>
                    </div>
                    {career.meetingMode ? (
                      <div className="flex items-center gap-1.5 text-xs text-[#0B3C73] font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Duración de {career.meetingModeDuration || 4} años</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No disponible</span>
                    )}
                  </div>
                </div>

                {/* A distancia */}
                {career.remoteMode && (
                  <div className="mt-4 flex items-center gap-2.5 p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs font-medium">
                    <Wifi className="h-4 w-4 text-indigo-600 shrink-0" />
                    <span>Disponible en modalidad de curso a distancia</span>
                  </div>
                )}
              </div>

              {/* Descripción Oficial si existe */}
              {career.description && (
                <div className="pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-extrabold text-slate-950 mb-2">Descripción del programa</h3>
                  <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-line">
                    {career.description}
                  </p>
                </div>
              )}

            </div>
          </main>

          {/* Columna Derecha: Tarjeta Lateral de la Universidad / Centro Rector */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-5 sticky top-24">
              
              <div className="flex items-start gap-4">
                {university ? (
                  <UniversityLogo university={university} size="normal" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white font-black text-sm">
                    {career.siglaCentroRector || 'MES'}
                  </div>
                )}

                <div>
                  <h3 className="text-base font-extrabold text-slate-950 leading-snug">
                    {career.centroRector || 'Centro Rector'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Categoría de acreditación:{' '}
                    <strong className="text-slate-800 font-bold">
                      {university?.accreditationCategory || career.accreditationCategory || 'Oficial'}
                    </strong>
                  </p>
                </div>
              </div>

              {/* Enlace para ir a la universidad */}
              {career.siglaCentroRector && (
                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/universidades/${career.siglaCentroRector}`}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-slate-50 hover:bg-[#0B3C73] hover:text-white px-4 py-3 text-xs font-bold text-[#0B3C73] transition-colors"
                  >
                    <span>Conocer sede universitaria</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}