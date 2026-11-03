export interface University {
  abbreviation: string;
  name: string;
  accreditationCategory: 'Excelencia' | 'Certificada' | 'Autorizada' | string;
  nameProvince: string;
  logo?: string;
  rector?: string;
  email?: string;
  phone?: string;
  webSite?: string;
  fundationDate?: string;
  headquartersAddress?: string;
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