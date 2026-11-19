export interface University {
  abbreviation: string;
  name: string;
  accreditationCategory?: string;
  academicDegree?: string;
  estructuraSuperior?: string;
  nameProvince?: string;
  logo?: string;
  rector?: string;
  email?: string;
  phone?: string;
  webSite?: string;
  fundationDate?: string;
  headquartersAddress?: string;
  headquartersCoordinates?: string;
  mission?: string;
  vision?: string;
}

export interface Career {
  name: string;
  programType: 'Carrera Universitaria' | 'Técnico Superior' | string;
  accreditationCategory: 'Excelencia' | 'Certificada' | 'Autorizada' | string;
  description?: string;
  dayMode: boolean;
  dayModeDuration: number;
  meetingMode: boolean;
  meetingModeDuration: number;
  remoteMode: boolean;
}

export interface SocialMedia {
  name: string;
  profile: string;
}

export interface UniversityDetail {
  university: University;
  careers: Career[];
  socialMedia: SocialMedia[];
  municipalCenters: string[];
  warnings: string[];
  source: 'mes' | 'fallback' | 'partial';
}

export interface UniversityCatalog {
  universities: University[];
  source: 'mes' | 'fallback';
  warning?: string;
}
