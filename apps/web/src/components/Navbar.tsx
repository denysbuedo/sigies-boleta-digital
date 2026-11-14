'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Identidad y Logotipo */}
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

        {/* Enlaces de Navegación de Escritorio */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  active
                    ? 'bg-blue-50 text-[#0B3C73] shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-[#0B3C73]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
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
            onClick={() => alert('El acceso seguro con Identidad Digital estará habilitado al iniciar la convocatoria.')}
          >
            <Lock className="h-4 w-4 text-blue-200" />
            <span>Acceso Seguro</span>
          </button>
        </div>

        {/* Menú Móvil */}
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
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-4 md:hidden">
          <div className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-base font-bold ${
                    active ? 'bg-blue-50 text-[#0B3C73]' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}