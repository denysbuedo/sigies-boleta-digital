import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  Compass,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Terminal,
  HeartPulse,
  Scale,
  Wrench,
  Monitor,
  Users,
  MapPin,
  Award
} from 'lucide-react';

const steps = [
  { number: '01', title: 'Explora', text: 'Conoce las 38 universidades, sus sedes provinciales y su información institucional.' },
  { number: '02', title: 'Compara', text: 'Revisa las 138 carreras autorizadas, sus modalidades de estudio y duraciones en años.' },
  { number: '03', title: 'Prepárate', text: 'Organiza tus hasta 10 preferencias para la convocatoria oficial de ingreso.' },
];

// Carreras destacadas de muestra para el escaparate del Home
const featuredCareers = [
  {
    name: 'Ingeniería en Ciencias Informáticas',
    programType: 'Carrera Universitaria',
    university: 'Universidad de las Ciencias Informáticas (UCI)',
    province: 'La Habana',
    duration: '4 años',
    dayMode: true,
    meetingMode: true,
    Icon: Terminal,
    color: 'from-blue-600 to-indigo-700'
  },
  {
    name: 'Medicina',
    programType: 'Carrera Universitaria',
    university: 'Universidad de Ciencias Médicas de La Habana (UCMH)',
    province: 'La Habana',
    duration: '6 años',
    dayMode: true,
    meetingMode: false,
    Icon: HeartPulse,
    color: 'from-rose-600 to-red-700'
  },
  {
    name: 'Licenciatura en Derecho',
    programType: 'Carrera Universitaria',
    university: 'Universidad de La Habana (UH)',
    province: 'La Habana',
    duration: '4 años',
    dayMode: true,
    meetingMode: true,
    Icon: Scale,
    color: 'from-amber-600 to-orange-700'
  },
  {
    name: 'Ingeniería Civil',
    programType: 'Carrera Universitaria',
    university: 'Universidad Tecnológica de La Habana (CUJAE)',
    province: 'La Habana',
    duration: '4 años',
    dayMode: true,
    meetingMode: true,
    Icon: Wrench,
    color: 'from-emerald-600 to-teal-700'
  }
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-[#F8FAFC]">
      {/* 1. SECCIÓN HERO (PORTADA) */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
        <div className="absolute -right-28 top-10 -z-10 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl pointer-events-none" />
        <div className="absolute -left-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-amber-100/60 blur-3xl pointer-events-none" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3.5 py-1.5 text-xs font-bold text-[#0B3C73] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              <span>Prototipo · Aplicación en construcción</span>
            </div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#0B3C73]">
              Educación Superior · Cuba
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Portal del Aspirante
            </h1>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0B3C73] sm:text-4xl lg:text-5xl">
              Encuentra tu camino.
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Explora las instituciones de educación superior de toda Cuba, conoce las 138 carreras autorizadas y reúne la información oficial que necesitas para tu futuro académico.
            </p>

            {/* Botones de Navegación Directa */}
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/universidades"
                className="group inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#0B3C73] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-[#082C55]"
              >
                <Building2 className="h-4 w-4" aria-hidden="true" />
                Explorar universidades
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </Link>

              <Link
                href="/pregrado"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-[#0B3C73] shadow-sm transition hover:border-[#0B3C73] hover:bg-blue-50/50"
              >
                <BookOpen className="h-4 w-4 text-[#0B3C73]" aria-hidden="true" />
                Ver carreras de pregrado (138)
              </Link>
            </div>

            <p className="mt-5 text-xs text-slate-500">
              La consulta de universidades y carreras está disponible en vivo. La presentación digital de boletas se habilitará en la convocatoria.
            </p>
          </div>

          {/* Tarjeta Visual de Portada */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-3xl border border-blue-200 bg-blue-50" />
            <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-3xl bg-amber-100" />
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#04172E] via-[#082C55] to-[#0B3C73] p-7 text-white shadow-2xl shadow-blue-950/20 sm:p-9">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <GraduationCap className="h-6 w-6 text-blue-200" aria-hidden="true" />
                </div>
                <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-sky-200">
                  Convocatoria de Ingreso
                </p>
                <h2 className="mt-2 max-w-sm text-2xl sm:text-3xl font-extrabold leading-tight">
                  Una decisión informada empieza por conocer tus opciones.
                </h2>
                <div className="mt-7 space-y-3 border-t border-white/15 pt-5 text-sm text-blue-50">
                  {[
                    '38 instituciones en todas las provincias',
                    '138 carreras oficiales de pregrado',
                    'Modalidades diurnas, por encuentros y a distancia',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-sky-200" aria-hidden="true" />
                    <span className="text-sm font-semibold">Oferta oficial del MES</span>
                  </div>
                  <span className="text-xs font-bold text-sky-200 bg-white/10 px-2.5 py-1 rounded-lg">100% Verificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NUEVA SECCIÓN DE PREGRADO EN EL HOME */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-bold text-[#0B3C73] mb-3">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Oferta Académica Nacional</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Carreras de Pregrado Autorizadas
              </h2>
              <p className="mt-2 text-base text-slate-600 max-w-2xl">
                Descubre los programas universitarios y de ciclo corto aprobados por el Ministerio de Educación Superior para cada provincia de Cuba.
              </p>
            </div>

            <Link
              href="/pregrado"
              className="inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-slate-100 hover:bg-[#0B3C73] hover:text-white px-5 py-3 text-xs font-bold text-[#0B3C73] transition-colors"
            >
              <span>Ver las 138 carreras</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cuadrícula de Carreras de Muestra */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCareers.map((c) => {
              const IconComponent = c.Icon;

              return (
                <div
                  key={c.name}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:border-[#0B3C73]/40 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${c.color} text-white shadow-sm group-hover:scale-105 transition-transform`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                        {c.duration}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {c.programType}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0B3C73] transition line-clamp-2 mt-0.5">
                        {c.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {c.university}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Modalidad diurna</span>
                      </div>
                      {c.meetingMode && (
                        <div className="flex items-center gap-1.5 text-[#0B3C73] font-semibold text-[11px]">
                          <Check className="h-3.5 w-3.5 text-[#0B3C73]" />
                          <span>Por encuentros</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <Link
                      href="/pregrado"
                      className="text-xs font-bold text-[#0B3C73] group-hover:underline inline-flex items-center gap-1"
                    >
                      Consultar detalles <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Banner inferior de invitación a Pregrado */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#082C55] to-[#0B3C73] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">¿Buscas una carrera o provincia específica?</h3>
              <p className="text-sm text-blue-100 mt-1">Usa nuestro catálogo con buscador por nombre, tipo de programa y centro rector.</p>
            </div>
            <Link
              href="/pregrado"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#0B3C73] shadow-md hover:bg-blue-50 transition"
            >
              <span>Abrir Catálogo de Pregrado</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 3. CÓMO FUNCIONA EL PROCESO */}
      <section id="recorrido" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-9 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0B3C73]">
              Un recorrido sencillo
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Infórmate antes de elegir
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article key={step.number} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
                <span className="font-mono text-sm font-bold text-[#0B3C73]">{step.number}</span>
                <h3 className="mt-4 text-xl font-extrabold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl bg-slate-950 px-6 py-6 text-white sm:flex-row sm:items-center sm:px-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-200">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Información de referencia
              </div>
              <p className="mt-2 text-sm text-slate-300">Este prototipo no recibe ni presenta solicitudes oficiales todavía.</p>
            </div>
            <Link href="/universidades" className="inline-flex items-center gap-2 self-start rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-100 sm:self-auto">
              Ver universidades <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}