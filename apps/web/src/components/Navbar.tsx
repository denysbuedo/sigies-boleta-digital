'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  GraduationCap, 
  Building2, 
  BookOpen, 
  FileText, 
  Lock, 
  Menu, 
  X,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

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

  // Cerrar el menú desplegable al hacer clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Iniciales del usuario para el avatar (ej: "Denys Pérez" -> "DP")
  const userInitials = user ? `${user.name[0] || ''}${user.lastName[0] || ''}`.toUpperCase() : 'U';

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

        {/* Enlaces de Navegación */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
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

        {/* Zona de Usuario / Login */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            /* Menú de Usuario Autenticado */
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-1.5 pr-3 shadow-xs hover:border-blue-300 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#082C55] to-[#0B3C73] text-white font-bold text-xs shadow-xs">
                  {userInitials}
                </div>
                <div className="text-left text-xs font-bold text-slate-800">
                  <span>{user.name}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Menú Desplegable */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-blue-950/10 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {user.identifier}
                    </p>
                    <span className="inline-block mt-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#0B3C73] border border-blue-100">
                      Aspirante activo
                    </span>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Botón de Iniciar Sesión para visitantes */
            <Link
              href="/auth"
              className="flex items-center gap-2 rounded-xl bg-[#0B3C73] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#082C55] transition active:scale-95"
            >
              <User className="h-4 w-4 text-blue-200" />
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>

        {/* Botón Menú Móvil */}
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

          <div className="mt-4 pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs">
                  <p className="font-bold text-slate-900">{user.name} {user.lastName}</p>
                  <p className="text-slate-500">{user.identifier}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0B3C73] px-4 py-3 text-sm font-bold text-white shadow-sm"
              >
                <User className="h-4 w-4" />
                <span>Iniciar Sesión / Registro</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}