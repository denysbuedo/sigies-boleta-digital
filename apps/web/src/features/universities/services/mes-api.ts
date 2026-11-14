import type {
  Career,
  University,
  UniversityCatalog,
  UniversityDetail,
} from '../types/mes';
import { MOCK_UNIVERSITIES, MOCK_CAREERS_BY_UNI } from '../data/mock-mes';

export class MesApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'MesApiError';
  }
}

const MES_API_BASE = process.env.MES_API_BASE || 'https://api.mes.gob.cu';
const TOKEN_URL = `${MES_API_BASE}/api/identity/oauth/token`;

const CLIENT_ID = process.env.MES_CLIENT_ID || 'boletadigitalclientid';
const CLIENT_SECRET = process.env.MES_CLIENT_SECRET || '';
const USERNAME = process.env.MES_USERNAME || 'boleta.digital@mes.gob.cu';
const PASSWORD = process.env.MES_PASSWORD || '';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Obtiene el token de acceso OAuth 2.0 (Password grant con Basic Auth obligatoria)
 */
async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', USERNAME);
    params.append('password', PASSWORD);
    params.append('scope', 'read');

    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[MES API] Fallo al autenticar OAuth (${res.status}): ${errText}`);
      return null;
    }

    const data = await res.json();
    cachedToken = data.access_token || data.token || null;
    tokenExpiresAt = Date.now() + 50 * 60 * 1000; // 50 minutos de vigencia en caché
    return cachedToken;
  } catch (error) {
    console.error('[MES API] Error de conexión con endpoint de token:', error);
    return null;
  }
}

/**
 * Genera las cabeceras requeridas por Swagger (Accept + JWT + Authorization)
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAccessToken();
  const headers: Record<string, string> = {
    'Accept': '*/*',
  };

  if (token) {
    headers['JWT'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Obtiene el catálogo completo de universidades (38 instituciones oficiales del MES)
 */
export async function getUniversityCatalog(): Promise<UniversityCatalog> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${MES_API_BASE}/api/portal/university`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (res.ok) {
      const data: University[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          universities: data,
          source: 'mes',
        };
      }
    }
  } catch (error) {
    console.warn('[MES API] Error consultando /api/portal/university, recurriendo al respaldo:', error);
  }

  // Respaldo de contingencia si el servidor externo no responde
  return {
    universities: MOCK_UNIVERSITIES,
    source: 'fallback',
  };
}

/**
 * Obtiene los detalles completos de una universidad y sus carreras
 */
export async function getUniversityDetail(initial: string): Promise<UniversityDetail | null> {
  const abbreviation = initial.trim().toUpperCase();
  const warnings: string[] = [];

  try {
    const headers = await getAuthHeaders();

    // 1. Cargar datos de la universidad
    let university: University | null = null;
    try {
      const uniRes = await fetch(
        `${MES_API_BASE}/api/portal/university/${encodeURIComponent(abbreviation)}`,
        { method: 'GET', headers, cache: 'no-store' }
      );
      if (uniRes.ok) {
        university = await uniRes.json();
      }
    } catch {
      warnings.push('No se pudieron actualizar los datos institucionales desde el MES.');
    }

    // Si la API del MES no devolvió la universidad, buscar en respaldo
    if (!university) {
      university =
        MOCK_UNIVERSITIES.find((u) => u.abbreviation.toUpperCase() === abbreviation) || null;
    }

    if (!university) {
      return null;
    }

    // 2. Cargar carreras de pregrado
    let careers: Career[] = [];
    try {
      const careersRes = await fetch(
        `${MES_API_BASE}/api/portal/university/careers/${encodeURIComponent(abbreviation)}`,
        { method: 'GET', headers, cache: 'no-store' }
      );
      if (careersRes.ok) {
        const rawCareers = await careersRes.json();
        if (Array.isArray(rawCareers)) {
          careers = rawCareers;
        }
      }
    } catch {
      warnings.push('No se pudo sincronizar la oferta académica.');
    }

    if (careers.length === 0 && MOCK_CAREERS_BY_UNI[abbreviation]) {
      careers = MOCK_CAREERS_BY_UNI[abbreviation];
    }

    // 3. Cargar Centros Universitarios Municipales (CUM)
    let municipalCenters: string[] = [];
    try {
      const cumRes = await fetch(
        `${MES_API_BASE}/api/portal/university/cum-one-university/${encodeURIComponent(abbreviation)}`,
        { method: 'GET', headers, cache: 'no-store' }
      );
      if (cumRes.ok) {
        const cumData = await cumRes.json();
        if (Array.isArray(cumData)) {
          municipalCenters = cumData.map((c: any) => (typeof c === 'string' ? c : c.name || c.nombre || String(c)));
        }
      }
    } catch {
      // Opcional: ignorar si no hay CUM
    }

    // 4. Cargar redes sociales
    let socialMedia: { name: string; profile: string }[] = [];
    try {
      const socialRes = await fetch(
        `${MES_API_BASE}/api/portal/university/social-media/${encodeURIComponent(abbreviation)}`,
        { method: 'GET', headers, cache: 'no-store' }
      );
      if (socialRes.ok) {
        const rawSocial = await socialRes.json();
        if (Array.isArray(rawSocial)) {
          socialMedia = rawSocial.map((s: any) => ({
            name: s.name || s.redSocial || 'Enlace',
            profile: s.profile || s.url || '',
          }));
        }
      }
    } catch {
      // Opcional: ignorar si no hay redes registradas
    }

    return {
      university,
      careers,
      socialMedia,
      municipalCenters,
      warnings,
      source: warnings.length === 0 ? 'mes' : 'fallback',
    };
  } catch (error) {
    console.error(`[MES API] Error cargando detalle de ${abbreviation}:`, error);

    const fallbackUni = MOCK_UNIVERSITIES.find((u) => u.abbreviation.toUpperCase() === abbreviation);
    if (!fallbackUni) return null;

    return {
      university: fallbackUni,
      careers: MOCK_CAREERS_BY_UNI[abbreviation] || [],
      socialMedia: [],
      municipalCenters: [],
      warnings: ['Datos mostrados desde el catálogo de contingencia.'],
      source: 'fallback',
    };
  }
}