'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  FileText, 
  Lock, 
  Menu, 
  X 
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Inicio', icon: GraduationCap },
    { href: '/universidades', label: 'Universidades', icon: Building2 },
    { href: '/pregrado', label: 'Pregrado', icon: BookOpen },
    { 
      href: '#', 
      label: 'Mi Boleta', 
      icon: FileText,
      badge: 'Próximamente'
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logotipo e Identidad */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white shadow-md shadow-blue-950/20 transition group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-base font-bold tracking-tight text-slate-900 group-hover:text-[#0B3C73] transition">
              Portal del Aspirante
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Ministerio de Educación Superior
            </span>
          </div>
        </Link>

        {/* Enlaces de Escritorio */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#0B3C73]"
              >
                <Icon className="h-4 w-4 text-slate-400" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0B3C73] border border-blue-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Botón de Acceso Seguro */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C73] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#082C55] transition active:scale-95"
            onClick={() => alert('El acceso con Identidad Digital estará habilitado al iniciar formalmente el calendario de la convocatoria.')}
          >
            <Lock className="h-4 w-4 text-blue-200" />
            <span>Acceso Seguro</span>
          </button>
        </div>

        {/* Botón Móvil */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menú"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-slate-700" />}
        </button>
      </div>

      {/* Menú Móvil Desplegable */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-4 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-base font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-[#0B3C73]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B3C73] px-4 py-3 text-sm font-semibold text-white"
              onClick={() => alert('El acceso con Identidad Digital estará habilitado al iniciar formalmente el calendario de la convocatoria.')}
            >
              <Lock className="h-4 w-4" />
              <span>Acceso con Identidad Digital</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}