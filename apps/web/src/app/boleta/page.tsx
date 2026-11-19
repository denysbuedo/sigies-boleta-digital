'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight,
  GripVertical, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Building2, 
  GraduationCap, 
  Save, 
  Loader2, 
  Clock, 
  Send,
  Monitor,
  Users,
  Wifi,
  Award,
  MapPin,
  X,
  ChevronDown,
  Eye,
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
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { University } from '@/features/universities/types/mes';

interface CareerItem {
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

interface PreferenceSlot {
  careerName: string;
  universityName: string;
  universityAbbr: string;
  programType: string;
}

// Icono temático dinámico según la carrera
function getCareerIcon(careerName: string) {
  const name = careerName.toLowerCase();
  if (name.includes('enfermería') || name.includes('higiene') || name.includes('salud') || name.includes('epidemiología')) return Stethoscope;
  if (name.includes('medicina') || name.includes('estomatología') || name.includes('optometría') || name.includes('logofonoaudiología')) return HeartPulse;
  if (name.includes('informática') || name.includes('ciberseguridad') || name.includes('software') || name.includes('computación') || name.includes('redes')) return Terminal;
  if (name.includes('telecomunicaciones') || name.includes('automática') || name.includes('bioinformática')) return Cpu;
  if (name.includes('ingeniería') || name.includes('mecánica') || name.includes('civil') || name.includes('geológica') || name.includes('industrial')) return Wrench;
  if (name.includes('profesor') || name.includes('educación') || name.includes('pedagogía')) return BookOpenCheck;
  if (name.includes('lengua') || name.includes('idioma') || name.includes('inglés')) return Languages;
  if (name.includes('matemática') || name.includes('física') || name.includes('química') || name.includes('biología')) return Atom;
  if (name.includes('derecho') || name.includes('jurídica')) return Scale;
  if (name.includes('economía') || name.includes('contabilidad') || name.includes('turismo')) return Briefcase;
  if (name.includes('agronomía') || name.includes('veterinaria')) return Sprout;
  if (name.includes('diseño') || name.includes('arte') || name.includes('comunicación')) return Palette;
  return GraduationCap;
}

export default function BoletaPage() {
  const { user, loading: authLoading } = useAuth();

  // Estados de catálogo y universidades
  const [catalog, setCatalog] = useState<CareerItem[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  // Filtros de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgramType, setSelectedProgramType] = useState('TODOS');
  const [selectedModality, setSelectedModality] = useState('TODAS');
  const [selectedProvince, setSelectedProvince] = useState('TODAS');
  const [selectedUniversity, setSelectedUniversity] = useState('TODAS');

  // Boleta virtual (hasta 10)
  const [selectedOptions, setSelectedOptions] = useState<PreferenceSlot[]>([]);
  const [boletaStatus, setBoletaStatus] = useState<string>('DRAFT');
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal de vista previa detallada
  const [previewCareer, setPreviewCareer] = useState<CareerItem | null>(null);

  // Arrastrar y soltar
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Cargar catálogo de carreras, universidades y boleta previa
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [catRes, uniRes] = await Promise.all([
          fetch('/api/portal/pregrade'),
          fetch('/api/portal/universities'),
        ]);

        if (catRes.ok && isMounted) {
          const catData = await catRes.json();
          setCatalog(catData.careers || []);
        }

        if (uniRes.ok && isMounted) {
          const uniData = await uniRes.json();
          setUniversities(uniData.universities || (Array.isArray(uniData) ? uniData : []));
        }

        // Cargar boleta guardada del usuario
        if (user) {
          const bolRes = await fetch('/api/boleta');
          if (bolRes.ok && isMounted) {
            const bolData = await bolRes.json();
            if (bolData.hasBoleta && bolData.preferences) {
              setSelectedOptions(
                bolData.preferences.map((p: any) => ({
                  careerName: p.careerName,
                  universityName: p.universityName,
                  universityAbbr: p.universityAbbr,
                  programType: p.programType,
                }))
              );
              setBoletaStatus(bolData.boleta.status || 'DRAFT');
            }
          }
        }
      } catch (err) {
        console.error('Error al inicializar boleta:', err);
      } finally {
        if (isMounted) {
          setCatalogLoading(false);
          setInitialLoading(false);
        }
      }
    }

    if (!authLoading) {
      loadData();
    }

    return () => { isMounted = false; };
  }, [user, authLoading]);

  // Mapa de sigla -> provincia
  const uniProvinceMap = useMemo(() => {
    const map = new Map<string, string>();
    universities.forEach((u) => {
      if (u.abbreviation && u.nameProvince) {
        map.set(u.abbreviation.toUpperCase(), u.nameProvince);
      }
    });
    return map;
  }, [universities]);

  // Listas de filtros dinámicas
  const programTypes = useMemo(() => {
    return ['TODOS', ...Array.from(new Set(catalog.map((c) => c.programType).filter(Boolean)))];
  }, [catalog]);

  const provinces = useMemo(() => {
    const provSet = new Set<string>();
    catalog.forEach((c) => {
      if (c.siglaCentroRector) {
        const prov = uniProvinceMap.get(c.siglaCentroRector.toUpperCase());
        if (prov) provSet.add(prov);
      }
    });
    return ['TODAS', ...Array.from(provSet).sort()];
  }, [catalog, uniProvinceMap]);

  const universityOptions = useMemo(() => {
    const map = new Map<string, string>();
    catalog.forEach((c) => {
      if (c.siglaCentroRector) {
        map.set(c.siglaCentroRector, c.centroRector || c.siglaCentroRector);
      }
    });
    const list: { abbr: string; name: string }[] = [];
    map.forEach((name, abbr) => list.push({ abbr, name }));
    return list.sort((a, b) => a.abbr.localeCompare(b.abbr));
  }, [catalog]);

  // Filtrado reactivo en tiempo real
  const filteredCatalog = useMemo(() => {
    return catalog.filter((career) => {
      const q = searchTerm.toLowerCase();
      const name = (career.name || '').toLowerCase();
      const rector = (career.centroRector || '').toLowerCase();
      const sigla = (career.siglaCentroRector || '').toLowerCase();
      const prov = (career.siglaCentroRector && uniProvinceMap.get(career.siglaCentroRector.toUpperCase())) || '';

      const matchSearch = name.includes(q) || rector.includes(q) || sigla.includes(q);
      const matchProgram = selectedProgramType === 'TODOS' || career.programType === selectedProgramType;

      let matchModality = true;
      if (selectedModality === 'diurno') matchModality = career.dayMode;
      if (selectedModality === 'encuentros') matchModality = career.meetingMode;
      if (selectedModality === 'distancia') matchModality = career.remoteMode;

      const matchProvince = selectedProvince === 'TODAS' || prov.toLowerCase() === selectedProvince.toLowerCase();
      const matchUniversity = selectedUniversity === 'TODAS' || sigla.toUpperCase() === selectedUniversity.toUpperCase();

      return matchSearch && matchProgram && matchModality && matchProvince && matchUniversity;
    });
  }, [catalog, searchTerm, selectedProgramType, selectedModality, selectedProvince, selectedUniversity, uniProvinceMap]);

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

  // Comprobar si ya está agregada
  const isCareerSelected = (careerName: string, uniAbbr?: string) => {
    return selectedOptions.some(
      (opt) => opt.careerName.toLowerCase() === careerName.toLowerCase() &&
               opt.universityAbbr.toLowerCase() === (uniAbbr || '').toLowerCase()
    );
  };

  // Agregar opción
  const handleAddOption = (career: CareerItem) => {
    if (selectedOptions.length >= 10) {
      setNotification({ type: 'error', message: 'La boleta ya tiene las 10 preferencias completas.' });
      return;
    }

    const uniAbbr = career.siglaCentroRector || 'MES';
    if (isCareerSelected(career.name, uniAbbr)) {
      setNotification({ type: 'error', message: 'Esta opción ya está incluida en tu boleta.' });
      return;
    }

    const newSlot: PreferenceSlot = {
      careerName: career.name,
      universityName: career.centroRector || 'Ministerio de Educación Superior',
      universityAbbr: uniAbbr,
      programType: career.programType || 'Carrera Universitaria',
    };

    setSelectedOptions([...selectedOptions, newSlot]);
    setNotification(null);
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setSelectedOptions(selectedOptions.filter((_, idx) => idx !== indexToRemove));
    setNotification(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= selectedOptions.length) return;

    const updated = [...selectedOptions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSelectedOptions(updated);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...selectedOptions];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    setSelectedOptions(updated);
    setDraggedIndex(null);
  };

  const handleSaveBoleta = async (newStatus: 'DRAFT' | 'SUBMITTED') => {
    if (selectedOptions.length === 0) {
      setNotification({ type: 'error', message: 'Debes seleccionar al menos una preferencia.' });
      return;
    }

    setSaving(true);
    setNotification(null);

    try {
      const res = await fetch('/api/boleta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: selectedOptions,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar la boleta');

      setBoletaStatus(newStatus);
      setNotification({
        type: 'success',
        message: newStatus === 'SUBMITTED' 
          ? '¡Boleta presentada oficialmente en la base de datos!' 
          : 'Borrador de boleta guardado con éxito.',
      });
    } catch (err) {
      setNotification({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error de conexión',
      });
    } finally {
      setSaving(false);
    }
  };

  // Pantalla de bloqueo si no está autenticado
  if (!authLoading && !user) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-[#0B3C73] shadow-sm mb-5">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Acceso restringido a la Boleta Digital</h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm">
          Debes iniciar sesión con tu cuenta de aspirante para confeccionar, ordenar y presentar tu boleta oficial de 10 preferencias.
        </p>
        <Link
          href="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#0B3C73] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#082C55] transition"
        >
          <span>Iniciar Sesión / Registrarme</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  if (initialLoading || authLoading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="mx-auto h-10 w-10 text-[#0B3C73] animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800">Cargando tu boleta digital...</h2>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-[#F8FAFC]">
      {/* Cabecera */}
      <section className="bg-gradient-to-r from-[#082C55] to-[#0B3C73] text-white py-8 sm:py-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                <GraduationCap className="h-4 w-4" />
                <span>Aspirante: {user?.name} {user?.lastName}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
                Boleta Digital de Preferencias
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                boletaStatus === 'SUBMITTED' 
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30'
                  : 'bg-amber-400/20 text-amber-200 border-amber-300/30'
              }`}>
                {boletaStatus === 'SUBMITTED' ? '✓ Boleta Presentada' : 'Modo Borrador'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contenedor Principal */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        
        {/* Notificaciones */}
        {notification && (
          <div className={`mb-6 flex items-center justify-between gap-3 rounded-2xl p-4 text-xs font-bold border animate-in fade-in ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" /> : <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />}
              <span>{notification.message}</span>
            </div>
            <button type="button" onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Catálogo de Carreras con Filtros y Tarjetas Enriquecidas */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    Oferta de Carreras Disponibles
                  </h2>
                  <p className="text-xs text-slate-500">
                    Explora las carreras autorizadas y pulsa <strong>&quot;+ Agregar&quot;</strong> para incluirlas en tu boleta.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0B3C73] bg-blue-50 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  {filteredCatalog.length} de {catalog.length}
                </span>
              </div>

              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar carrera por nombre o centro rector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none focus:border-[#0B3C73] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 4 Filtros Desplegables */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* 1. Tipo de Programa */}
                <div className="relative">
                  <select
                    value={selectedProgramType}
                    onChange={(e) => setSelectedProgramType(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-2.5 pr-6 text-[11px] font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                  >
                    <option value="TODOS">Todos los tipos</option>
                    {programTypes.filter((t) => t !== 'TODOS').map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* 2. Modalidad */}
                <div className="relative">
                  <select
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-2.5 pr-6 text-[11px] font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                  >
                    <option value="TODAS">Modalidades</option>
                    <option value="diurno">Diurno</option>
                    <option value="encuentros">Encuentros</option>
                    <option value="distancia">A distancia</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* 3. Provincia */}
                <div className="relative">
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-2.5 pr-6 text-[11px] font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                  >
                    <option value="TODAS">Provincias</option>
                    {provinces.filter((p) => p !== 'TODAS').map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>

                {/* 4. Universidad */}
                <div className="relative">
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2 pl-2.5 pr-6 text-[11px] font-semibold text-slate-700 outline-none focus:border-[#0B3C73] focus:bg-white"
                  >
                    <option value="TODAS">Centros rectores</option>
                    {universityOptions.map((u) => (
                      <option key={u.abbr} value={u.abbr}>{u.abbr}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-[#0B3C73] hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}

              {/* Lista de Carreras en Tarjetas Enriquecidas */}
              <div className="max-h-[680px] overflow-y-auto space-y-3 pr-1 pt-1">
                {catalogLoading ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2 text-[#0B3C73]" />
                    <span>Cargando carreras oficiales...</span>
                  </div>
                ) : filteredCatalog.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">No hay carreras que coincidan con los filtros.</p>
                ) : (
                  filteredCatalog.map((career, idx) => {
                    const uniAbbr = career.siglaCentroRector || 'MES';
                    const alreadyIn = isCareerSelected(career.name, uniAbbr);
                    const CareerIcon = getCareerIcon(career.name);
                    const prov = career.siglaCentroRector ? uniProvinceMap.get(career.siglaCentroRector.toUpperCase()) : null;

                    return (
                      <article
                        key={`${career.name}-${idx}`}
                        className={`group flex flex-col justify-between p-4 rounded-2xl border transition-all ${
                          alreadyIn
                            ? 'bg-slate-50/70 border-slate-200 opacity-60'
                            : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="space-y-3">
                          
                          {/* Fila superior: Icono temático + Badges */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white shadow-2xs shrink-0">
                                <CareerIcon className="h-5 w-5 text-blue-100" />
                              </div>

                              <div>
                                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#0B3C73] transition leading-snug">
                                  {career.name}
                                </h3>
                                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                  <Building2 className="h-3 w-3 text-[#0B3C73] shrink-0" />
                                  <span className="font-semibold text-slate-700">{career.centroRector || uniAbbr}</span>
                                  {prov && <span>• {prov}</span>}
                                </p>
                              </div>
                            </div>

                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 shrink-0">
                              {career.programType}
                            </span>
                          </div>

                          {/* Modalidades y Duración */}
                          <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
                            {career.dayMode && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-0.5 text-emerald-800 font-medium border border-emerald-100">
                                <Monitor className="h-3 w-3 text-emerald-600" />
                                <span>Diurno ({career.dayModeDuration || 4} años)</span>
                              </span>
                            )}
                            {career.meetingMode && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-[#0B3C73] font-medium border border-blue-100">
                                <Users className="h-3 w-3 text-[#0B3C73]" />
                                <span>Encuentros ({career.meetingModeDuration || 4} años)</span>
                              </span>
                            )}
                            {career.remoteMode && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 text-indigo-800 font-medium border border-indigo-100">
                                <Wifi className="h-3 w-3 text-indigo-600" />
                                <span>A distancia</span>
                              </span>
                            )}
                          </div>

                        </div>

                        {/* Botones de acción: Ver Ficha Detallada + Agregar */}
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewCareer(career)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-[#0B3C73] transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Ver detalles</span>
                          </button>

                          <button
                            type="button"
                            disabled={alreadyIn || selectedOptions.length >= 10}
                            onClick={() => handleAddOption(career)}
                            className={`flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold transition shadow-2xs ${
                              alreadyIn
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-[#0B3C73] text-white hover:bg-[#082C55] active:scale-95'
                            }`}
                          >
                            {alreadyIn ? '✓ En tu boleta' : <><Plus className="h-3.5 w-3.5" /> Agregar a mi boleta</>}
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

            </div>
          </div>

          {/* COLUMNA DERECHA: Boleta Virtual (10 Preferencias con Drag & Drop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 sticky top-20">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#0B3C73]" />
                    <span>Mi Boleta Oficial</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    1 es tu máxima prioridad. Arrastra o usa las flechas para ordenar.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black text-[#0B3C73]">
                    {selectedOptions.length}
                    <span className="text-xs font-semibold text-slate-400">/10</span>
                  </span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Opciones</span>
                </div>
              </div>

              {/* Casillas Numeradas 1 a 10 */}
              <div className="space-y-2">
                {[...Array(10)].map((_, index) => {
                  const option = selectedOptions[index];
                  const positionNumber = index + 1;

                  if (option) {
                    return (
                      <div
                        key={`${option.careerName}-${index}`}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`group flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all ${
                          draggedIndex === index 
                            ? 'opacity-40 border-dashed border-[#0B3C73]' 
                            : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-1 shrink-0">
                          <GripVertical className="h-4 w-4 text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500" />
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white font-black text-xs shadow-2xs">
                            {positionNumber}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {option.careerName}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            {option.universityName} ({option.universityAbbr})
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMove(index, 'up')}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20"
                            title="Subir prioridad"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={index === selectedOptions.length - 1}
                            onClick={() => handleMove(index, 'down')}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-20"
                            title="Bajar prioridad"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 ml-1"
                            title="Quitar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`empty-slot-${index}`}
                      className="flex items-center gap-3 p-2.5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 text-slate-300"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-200/80 text-slate-500 font-bold text-xs">
                        {positionNumber}
                      </span>
                      <span className="text-xs font-medium text-slate-400 italic">
                        Opción disponible (vacía)
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Botones de Guardar y Presentar */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  disabled={saving || selectedOptions.length === 0}
                  onClick={() => handleSaveBoleta('DRAFT')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
                >
                  <Save className="h-4 w-4 text-slate-500" />
                  <span>Guardar Borrador</span>
                </button>

                <button
                  type="button"
                  disabled={saving || selectedOptions.length === 0}
                  onClick={() => handleSaveBoleta('SUBMITTED')}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#0B3C73] py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#082C55] disabled:opacity-50 transition"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>{boletaStatus === 'SUBMITTED' ? 'Actualizar Boleta' : 'Presentar Boleta'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MODAL INTERACTIVO: FICHA DETALLADA DE LA CARRERA */}
      {previewCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Cabecera del Modal */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#0B3C73]">
                  {previewCareer.programType || 'Carrera Universitaria'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
                  {previewCareer.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Centro rector: <strong className="text-slate-800">{previewCareer.centroRector}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCareer(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modalidades y Duración Oficial */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Modalidades de estudio autorizadas
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3 rounded-xl border ${previewCareer.dayMode ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Monitor className="h-4 w-4 text-emerald-700" />
                    <span className="font-bold">Modalidad diurna</span>
                  </div>
                  {previewCareer.dayMode ? (
                    <span className="text-[11px] text-emerald-800">Duración de {previewCareer.dayModeDuration || 4} años</span>
                  ) : (
                    <span className="text-[11px] text-slate-400">No ofertada</span>
                  )}
                </div>

                <div className={`p-3 rounded-xl border ${previewCareer.meetingMode ? 'bg-blue-50/60 border-blue-200 text-[#0B3C73]' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-[#0B3C73]" />
                    <span className="font-bold">Por encuentros</span>
                  </div>
                  {previewCareer.meetingMode ? (
                    <span className="text-[11px] text-[#0B3C73]">Duración de {previewCareer.meetingModeDuration || 4} años</span>
                  ) : (
                    <span className="text-[11px] text-slate-400">No ofertada</span>
                  )}
                </div>
              </div>

              {previewCareer.remoteMode && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs">
                  <Wifi className="h-4 w-4 text-indigo-600 shrink-0" />
                  <span>Disponible en modalidad de curso a distancia</span>
                </div>
              )}
            </div>

            {/* Descripción Oficial si existe */}
            {previewCareer.description && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Descripción del programa
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 max-h-48 overflow-y-auto">
                  {previewCareer.description}
                </p>
              </div>
            )}

            {/* Pie del modal: botón de agregar directo */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewCareer(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cerrar
              </button>

              <button
                type="button"
                disabled={isCareerSelected(previewCareer.name, previewCareer.siglaCentroRector) || selectedOptions.length >= 10}
                onClick={() => {
                  handleAddOption(previewCareer);
                  setPreviewCareer(null);
                }}
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold shadow-md ${
                  isCareerSelected(previewCareer.name, previewCareer.siglaCentroRector)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0B3C73] text-white hover:bg-[#082C55]'
                }`}
              >
                {isCareerSelected(previewCareer.name, previewCareer.siglaCentroRector)
                  ? '✓ Ya está en tu boleta'
                  : <><Plus className="h-4 w-4" /> Agregar a mi boleta</>}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}