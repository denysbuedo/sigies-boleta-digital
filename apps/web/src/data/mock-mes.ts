import { University, Career } from '@/types/mes';

export const MOCK_UNIVERSITIES: University[] = [
  {
    abbreviation: 'UCI',
    name: 'Universidad de las Ciencias Informáticas',
    accreditationCategory: 'Certificada',
    nameProvince: 'La Habana',
    rector: 'Dr. C. Raydel Montesino Perurena',
    email: 'uci@uci.cu',
    phone: '(53) 7 837 2500',
    webSite: 'https://www.uci.cu',
    fundationDate: '12/12/2002',
    headquartersAddress: 'Carretera a San Antonio de los Baños, Km 2 ½, Torrens, Boyeros',
    mission: 'Formar profesionales comprometidos con la informatización de la sociedad cubana y la transformación digital.'
  },
  {
    abbreviation: 'UH',
    name: 'Universidad de La Habana',
    accreditationCategory: 'Excelencia',
    nameProvince: 'La Habana',
    rector: 'Dra. C. Miriam Nicado García',
    email: 'rectoria@rect.uh.cu',
    phone: '(53) 7 878 1234',
    webSite: 'https://www.uh.cu',
    fundationDate: '05/01/1728',
    headquartersAddress: 'Colina Universitaria, Calle San Lázaro y L, Vedado',
    mission: 'Institución insigne de la educación superior cubana con excelencia en docencia e investigación.'
  },
  {
    abbreviation: 'UCLV',
    name: 'Universidad Central Marta Abreu de Las Villas',
    accreditationCategory: 'Excelencia',
    nameProvince: 'Villa Clara',
    rector: 'Dr. C. Osana Molerio Pérez',
    email: 'uclv@uclv.edu.cu',
    phone: '(53) 42 28 1100',
    webSite: 'https://www.uclv.edu.cu',
    fundationDate: '30/11/1952',
    headquartersAddress: 'Carretera a Camajuaní Km 5 ½, Santa Clara',
    mission: 'Centro multidisciplinario de excelencia líder en la región central de Cuba.'
  },
  {
    abbreviation: 'UO',
    name: 'Universidad de Oriente',
    accreditationCategory: 'Excelencia',
    nameProvince: 'Santiago de Cuba',
    rector: 'Dra. C. Diana Sedal Yanes',
    email: 'comunicacion@uo.edu.cu',
    phone: '(53) 22 64 2100',
    webSite: 'https://www.uo.edu.cu',
    fundationDate: '10/10/1947',
    headquartersAddress: 'Patricio Lumumba s/n, Santiago de Cuba',
    mission: 'Forjadora de ciencia, cultura e identidad en el oriente cubano.'
  },
  {
    abbreviation: 'UM',
    name: 'Universidad de Matanzas',
    accreditationCategory: 'Excelencia',
    nameProvince: 'Matanzas',
    rector: 'Dra. C. Leyda Finalé de la Cruz',
    email: 'rectoria@umcc.cu',
    phone: '(53) 45 26 1234',
    webSite: 'https://www.umcc.cu',
    fundationDate: '09/05/1972',
    headquartersAddress: 'Autopista a Varadero km 3 ½, Matanzas',
    mission: 'Impulsar el desarrollo socioeconómico de la provincia y el país con calidad certificada.'
  },
  {
    abbreviation: 'UCF',
    name: 'Universidad de Cienfuegos Carlos Rafael Rodríguez',
    accreditationCategory: 'Certificada',
    nameProvince: 'Cienfuegos',
    rector: 'Dra. C. Orquidea Urquiola Sánchez',
    email: 'rector@ucf.edu.cu',
    phone: '(53) 43 51 5500',
    webSite: 'https://www.ucf.edu.cu',
    fundationDate: '06/12/1979',
    headquartersAddress: 'Cuatro Caminos, Carretera a Rodas Km 4, Cienfuegos',
    mission: 'Promover la innovación y la formación integral en el centro sur de la nación.'
  }
];

export const MOCK_CAREERS_BY_UNI: Record<string, Career[]> = {
  UCI: [
    {
      name: 'Ingeniería en Ciencias Informáticas',
      programType: 'Carrera Universitaria',
      accreditationCategory: 'Certificada',
      description: 'Formación integral en desarrollo de software, arquitectura de sistemas y gestión de proyectos tecnológicos.',
      dayMode: true,
      dayModeDuration: 4,
      meetingMode: true,
      meetingModeDuration: 4,
      remoteMode: true
    },
    {
      name: 'Ingeniería en Ciberseguridad',
      programType: 'Carrera Universitaria',
      accreditationCategory: 'Autorizada',
      description: 'Especialización en defensa de infraestructuras críticas, auditoría y seguridad de redes.',
      dayMode: true,
      dayModeDuration: 4,
      meetingMode: false,
      meetingModeDuration: 0,
      remoteMode: false
    },
    {
      name: 'Ingeniería en Bioinformática',
      programType: 'Carrera Universitaria',
      accreditationCategory: 'Autorizada',
      description: 'Aplicación de ciencias de la computación a la biotecnología, genómica y salud.',
      dayMode: true,
      dayModeDuration: 4,
      meetingMode: false,
      meetingModeDuration: 0,
      remoteMode: false
    },
    {
      name: 'Administración de Redes y Seguridad Informática',
      programType: 'Técnico Superior',
      accreditationCategory: 'Autorizada',
      description: 'Formación técnica de ciclo corto para gestión y soporte de redes de telecomunicaciones.',
      dayMode: true,
      dayModeDuration: 2,
      meetingMode: true,
      meetingModeDuration: 2,
      remoteMode: true
    }
  ],
  UH: [
    {
      name: 'Licenciatura en Ciencias de la Computación',
      programType: 'Carrera Universitaria',
      accreditationCategory: 'Excelencia',
      description: 'Fundamentos matemáticos y algorítmicos para investigación y desarrollo avanzado de software.',
      dayMode: true,
      dayModeDuration: 4,
      meetingMode: false,
      meetingModeDuration: 0,
      remoteMode: false
    },
    {
      name: 'Licenciatura en Física',
      programType: 'Carrera Universitaria',
      accreditationCategory: 'Excelencia',
      description: 'Estudio de las leyes fundamentales del universo y modelación científica.',
      dayMode: true,
      dayModeDuration: 4,
      meetingMode: false,
      meetingModeDuration: 0,
      remoteMode: false
    },
    {
      name: 'Licenciatura en Derecho',
      programType: 'Carrera Universitaria',
      accreditationCategory: 'Excelencia',
      description: 'Formación jurídica de alto nivel para el ejercicio de la abogacía, judicatura y asesoría.',
      dayMode: true,
      dayModeDuration: 4,
      meetingMode: true,
      meetingModeDuration: 5,
      remoteMode: true
    }
  ]
};