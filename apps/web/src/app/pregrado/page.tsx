'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Building2, 
  MapPin, 
  Award, 
  Monitor, 
  Users, 
  Wifi, 
  GraduationCap, 
  Check, 
  X, 
  ChevronDown,
  Stethoscope,
  Terminal,
  Cpu,
  Wrench,
  Scale,
  Sprout,
  Palette,
  Atom,
  HeartPulse,
  Languages,
  BookOpenCheck,
  Briefcase,
  Loader2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import type { University } from '@/features/universities/types/mes';

interface ApiPregradeCareer {
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getCareerIcon(careerName: string) {
  const name = careerName.toLowerCase();
  
  if (name.includes('enfermería') || name.includes('higiene') || name.includes('salud') || name.includes('epidemiología')) return Stethoscope;
  if (name.includes('medicina') || name.includes('estomatología') || name.includes('optometría') || name.includes('logofonoaudiología') || name.includes('rehabilitación') || name.includes('bioanálisis')) return HeartPulse;
  if (name.includes('informática') || name.includes('ciberseguridad') || name.includes('software') || name.includes('computación') || name.includes('redes') || name.includes('sistemas')) return Terminal;
  if (name.includes('telecomunicaciones') || name.includes('automática') || name.includes('bioinformática') || name.includes('electrónica')) return Cpu;
  if (name.includes('ingeniería') || name.includes('mecánica') || name.includes('civil') || name.includes('geológica') || name.includes('hidráulica') || name.includes('industrial') || name.includes('química') || name.includes('minas')) return Wrench;
  if (name.includes('profesor') || name.includes('educación') || name.includes('pedagogía') || name.includes('instructor')) return BookOpenCheck;
  if (name.includes('lengua') || name.includes('idioma') || name.includes('inglés') || name.includes('traducción') || name.includes('letras')) return Languages;
  if (name.includes('matemática') || name.includes('física') || name.includes('química') || name.includes('biología') || name.includes('geografía')) return Atom;
  if (name.includes('derecho') || name.includes('jurídica') || name.includes('leyes')) return Scale;
  if (name.includes('economía') || name.includes('contabilidad') || name.includes('finanzas') || name.includes('turismo') || name.includes('administración')) return Briefcase;
  if (name.includes('agronomía') || name.includes('veterinaria') || name.includes('forestal') || name.includes('zootecnia') || name.includes('agropecuario')) return Sprout;
  if (name.includes('diseño') || name.includes('arte') || name.includes('música') || name.includes('danza') || name.includes('teatro') || name.includes('comunicación')) return Palette;

  return GraduationCap;
}

export default function PregradoPage() {
  const [careers, setCareers] = useState<ApiPregradeCareer[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState('TODOS');
  const [selectedModality, setSelectedModality] = useState('TODAS');
  const [selectedProvince, setSelectedProvince] = useState('TODAS');
  const [selectedUniversity, setSelectedUniversity] = useState('TODAS');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch('/api/portal/pregrade').then((res) => (res.ok ? res.json() : Promise.reject('Error carreras'))),
      fetch('/api/portal/universities').then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([pregradeData, uniData]) => {
        if (!isMounted) return;
        const loadedCareers: ApiPregradeCareer[] = pregradeData?.careers || [];
        setCareers(loadedCareers);

        const loadedUnis: University[] = uniData?.universities || (Array.isArray(uniData) ? uniData : []);
        setUniversities(loadedUnis);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError('No pudimos sincronizar las carreras desde el servidor del MES.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const uniProvinceMap = useMemo(() => {
    const map = new Map<string, string>();
    universities.forEach((u) => {
      if (u.abbreviation && u.nameProvince) {
        map.set(u.abbreviation.toUpperCase(), u.nameProvince);
      }
    });
    return map;
  }, [universities]);

  const programTypes = useMemo(() => {
    const types = Array.from(new Set(careers.map((c) => c.programType).filter(Boolean)));
    return ['TODOS', ...types];
  }, [careers]);

  const provinces = useMemo(() => {
    const provSet = new Set<string>();
    careers.forEach((c) => {
      if (c.siglaCentroRector) {
        const prov = uniProvinceMap.get(c.siglaCentroRector.toUpperCase());
        if (prov) provSet.add(prov);
      }
    });
    return ['TODAS', ...Array.from(provSet).sort()];
  }, [careers, uniProvinceMap]);

  const universityOptions = useMemo(() => {
    const map = new Map<string, string>();
    careers.forEach((c) => {
      if (c.siglaCentroRector) {
        map.set(c.siglaCentroRector, c.centroRector || c.siglaCentroRector);
      }
    });
    const list: { abbr: string; name: string }[] = [];
    map.forEach((name, abbr) => list.push({ abbr, name }));
    return list.sort((a, b) => a.abbr.localeCompare(b.abbr));
  }, [careers]);

  const filteredCareers = useMemo(() => {
    return careers.filter((career) => {
      const name = career.name || '';
      const rector = career.centroRector || '';
      const sigla = career.siglaCentroRector || '';
      const prov = (career.siglaCentroRector && uniProvinceMap.get(career.siglaCentroRector.toUpperCase())) || '';

      const matchSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rector.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sigla.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProgram = selectedProgramType === 'TODOS' || career.programType === selectedProgramType;

      let matchModality = true;
      if (selectedModality === 'diurno') matchModality = career.dayMode;
      if (selectedModality === 'encuentros') matchModality = career.meetingMode;
      if (selectedModality === 'distancia') matchModality = career.remoteMode;

      const matchProvince = selectedProvince === 'TODAS' || prov.toLowerCase() === selectedProvince.toLowerCase();
      const matchUniversity = selectedUniversity === 'TODAS' || sigla.toUpperCase() === selectedUniversity.toUpperCase();

      return matchSearch && matchProgram && matchModality && matchProvince && matchUniversity;
    });
  }, [careers, searchTerm, selectedProgramType, selectedModality, selectedProvince, selectedUniversity, uniProvinceMap]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedProgramType !== 'TODOS' ||
    selectedModality !== 'TODAS' ||
    selectedProvince !== 'TODAS' ||
    selectedUniversity !== 'TODAS';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedProgramType('TODOS');
    setSelectedModality('TODAS');
    setSelectedProvince('TODAS');
    setSelectedUniversity('TODAS');
  };

  return (
    <div className="pb-16 bg-[#F8FAFC]">
      {/* Cabecera Superior */}
      <section className="bg-gradient-to-br from-[#082C55] via-[#0B3C73] to-[#1D4F79] text-white shadow-sm py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/15 text-blue-100 mb-4">
              <span>Ministerio de Educación Superior</span>
              <span>•</span>
              <span>Catálogo Nacional de Pregrado</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Oferta Académica de Pregrado
            </h1>
            <p className="mt-3 text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
              Explora las {loading ? '...' : careers.length} carreras universitarias y programas de ciclo corto autorizados en Cuba con sus modalidades de impartición, duraciones oficiales y centros rectores.
            </p>
          </div>
        </div>
      </section>

      {/* Panel de Filtros y Búsqueda */}
      <section className="mx-auto max-w-7xl px-4 -mt-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-lg shadow-blue-950/5 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por carrera (ej: Logofonoaudiología, Enfermería, Ciberseguridad, Matemática, Derecho)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 pl-12 pr-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#0B3C73] focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {/* 1. Tipo de programa */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Tipo de programa
              </label>
              <div className="relative">
                <select
                  value={selectedProgramType}
                  onChange={(e) => setSelectedProgramType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                >
                  <option value="TODOS">Todos los tipos</option>
                  {programTypes.filter((t) => t !== 'TODOS').map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* 2. Modalidad */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Modalidad
              </label>
              <div className="relative">
                <select
                  value={selectedModality}
                  onChange={(e) => setSelectedModality(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                >
                  <option value="TODAS">Todas las modalidades</option>
                  <option value="diurno">Modalidad diurna</option>
                  <option value="encuentros">Por encuentros</option>
                  <option value="distancia">A distancia</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* 3. Provincia */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Provincia
              </label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                >
                  <option value="TODAS">Todas las provincias</option>
                  {provinces.filter((p) => p !== 'TODAS').map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* 4. Centro Rector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Centro Rector
              </label>
              <div className="relative">
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                >
                  <option value="TODAS">Todos los centros</option>
                  {universityOptions.map((uni) => (
                    <option key={uni.abbr} value={uni.abbr}>
                      {uni.abbr} - {uni.name.length > 28 ? `${uni.name.substring(0, 28)}...` : uni.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>
              Mostrando <strong className="text-slate-900 font-bold">{filteredCareers.length}</strong> de {careers.length} carreras autorizadas
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[#0B3C73] font-bold hover:underline"
              >
                Limpiar todos los filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Lista de Carreras */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="mx-auto h-10 w-10 text-[#0B3C73] animate-spin mb-4" />
            <h2 className="text-base font-bold text-slate-800">Cargando las 138 carreras oficiales del MES...</h2>
            <p className="text-xs text-slate-500 mt-1">Sincronizando el catálogo nacional en vivo</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center max-w-md mx-auto">
            <p className="font-bold text-rose-950">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-900 px-4 py-2 text-xs font-bold text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reintentar conexión
            </button>
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No se encontraron carreras con esos filtros</h3>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0B3C73] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#082C55]"
            >
              Ver las 138 carreras
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {filteredCareers.map((career, index) => {
              const CareerIcon = getCareerIcon(career.name);
              const prov = career.siglaCentroRector ? uniProvinceMap.get(career.siglaCentroRector.toUpperCase()) : null;
              const careerSlug = slugify(career.name);

              return (
                <article
                  key={`${career.name}-${index}`}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:border-[#0B3C73]/40 transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Fila Superior: Icono de Especialidad + Badges */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0">
                        <CareerIcon className="h-7 w-7 text-blue-100" />
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700">
                          {career.programType || 'Carrera Universitaria'}
                        </span>
                        {career.accreditationCategory && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                            Categoría: <strong className="text-slate-800 font-bold">{career.accreditationCategory}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Título de la Carrera */}
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-950 group-hover:text-[#0B3C73] transition leading-snug">
                        {career.name}
                      </h2>

                      {/* Centro Rector */}
                      {career.centroRector && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center gap-1.5 text-slate-600">
                            <Building2 className="h-3.5 w-3.5 shrink-0 text-[#0B3C73]" />
                            <span>Centro rector: <strong className="text-slate-800">{career.centroRector}</strong></span>
                          </span>
                        </div>
                      )}

                      {prov && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>{prov}</span>
                        </div>
                      )}
                    </div>

                    {/* Modalidades y Duración */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`flex items-center gap-2 p-2 rounded-xl ${career.dayMode ? 'bg-emerald-50/80 text-emerald-950 border border-emerald-100' : 'bg-slate-50 text-slate-400'}`}>
                          {career.dayMode ? <Check className="h-4 w-4 text-emerald-600 shrink-0" /> : <X className="h-4 w-4 text-slate-400 shrink-0" />}
                          <Monitor className="h-4 w-4 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-bold">Modalidad diurno</span>
                            {career.dayMode && career.dayModeDuration ? (
                              <span className="text-[11px] text-emerald-800 font-medium">Duración de {career.dayModeDuration} años</span>
                            ) : null}
                          </div>
                        </div>

                        <div className={`flex items-center gap-2 p-2 rounded-xl ${career.meetingMode ? 'bg-blue-50/80 text-[#0B3C73] border border-blue-100' : 'bg-slate-50 text-slate-400'}`}>
                          {career.meetingMode ? <Check className="h-4 w-4 text-[#0B3C73] shrink-0" /> : <X className="h-4 w-4 text-slate-400 shrink-0" />}
                          <Users className="h-4 w-4 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-bold">Por encuentros</span>
                            {career.meetingMode && career.meetingModeDuration ? (
                              <span className="text-[11px] text-[#0B3C73] font-medium">Duración de {career.meetingModeDuration} años</span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {career.remoteMode && (
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-xs">
                          <Wifi className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="font-medium">Modalidad a distancia disponible</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de Acción hacia el detalle de la carrera */}
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      href={`/pregrado/${careerSlug}`}
                      className="inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-bold text-[#0B3C73] transition duration-200 group-hover:bg-[#0B3C73] group-hover:text-white"
                    >
                      <span>Ver información completa del programa</span>
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