'use client';

import React, { useState } from 'react';
import type { University } from '../types/mes';

interface Props {
  university: University;
  size?: 'normal' | 'large';
}

const WP_MONTHS = ['2024/03', '2024/04', '2024/02', '2024/05', '2024/01', '2023/12', '2023/11'];

export function UniversityLogo({ university, size = 'normal' }: Props) {
  const [monthIndex, setMonthIndex] = useState(0);
  const [failedAll, setFailedAll] = useState(false);

  const rawLogo = university.logo?.trim() || '';

  // Determinar la URL según si es absoluta, base64 o nombre de archivo
  let currentSrc: string | null = null;
  if (rawLogo) {
    if (/^https?:\/\//i.test(rawLogo) || rawLogo.startsWith('data:image')) {
      currentSrc = rawLogo;
    } else {
      const cleanName = rawLogo.replace(/^\//, '');
      currentSrc = `https://www.mes.gob.cu/wp-content/uploads/${WP_MONTHS[monthIndex]}/${cleanName}`;
    }
  }

  const isLarge = size === 'large';
  // Medidas generosas para presencia visual real
  const containerClasses = isLarge
    ? 'h-24 w-24 sm:h-28 sm:w-28'
    : 'h-20 w-20 sm:h-24 sm:w-24';

  const handleError = () => {
    // Si falla un mes, prueba el siguiente de la lista
    if (monthIndex < WP_MONTHS.length - 1) {
      setMonthIndex((prev) => prev + 1);
    } else {
      setFailedAll(true);
    }
  };

  if (currentSrc && !failedAll) {
    return (
      <div
        className={`relative flex ${containerClasses} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md`}
      >
        <img
          key={currentSrc}
          src={currentSrc}
          alt={`Logo de ${university.name}`}
          className="h-full w-full object-contain"
          onError={handleError}
          loading="lazy"
        />
      </div>
    );
  }

  // Emblema con siglas oficiales estilizado
  return (
    <div
      className={`flex ${containerClasses} shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white shadow-sm font-black tracking-wider transition-all duration-200 group-hover:scale-105 group-hover:shadow-md ${
        isLarge ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
      }`}
      title={university.name}
    >
      {university.abbreviation || 'MES'}
    </div>
  );
}