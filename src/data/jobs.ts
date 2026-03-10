export interface Job {
  id: number;
  title: string;
  location: string;
  department: string;
  area: string;
  type: string;
  date: string;
  refId: string;
  description: string;
  functions: string[];
  requirements: string[];
  idealCandidate: {
    label: string;
    text: string;
  }[];
}

export const allJobs: Job[] = [
  {
    id: 1,
    title: "Barista – Tienda Parque del Café",
    location: "Montenegro",
    department: "Quindío",
    area: "Tiendas",
    type: "Término Indefinido",
    date: "08/03/2026",
    refId: "req10201",
    description:
      "En Café Quindío buscamos personas apasionadas por el café, con vocación de servicio y ganas de ofrecer experiencias memorables a nuestros clientes. ¡Únete a nuestro equipo y comparte la cultura cafetera del Quindío!",
    functions: [
      "Preparar bebidas a base de café de especialidad siguiendo los estándares de calidad de la marca.",
      "Brindar atención al cliente excepcional, asesorando en la selección de productos.",
      "Mantener la limpieza y organización del área de trabajo y la tienda.",
      "Realizar el manejo de caja y facturación de ventas.",
      "Participar en inventarios periódicos y control de insumos.",
    ],
    requirements: [
      "Bachiller académico o técnico en áreas afines a servicio al cliente o alimentos.",
      "Mínimo 6 meses de experiencia en preparación de bebidas o atención al público.",
      "Disponibilidad para trabajar en horarios rotativos incluyendo fines de semana y festivos.",
    ],
    idealCandidate: [
      { label: "Apasionado por el café", text: "Conocer y valorar la cultura cafetera colombiana, mostrando entusiasmo genuino por cada taza." },
      { label: "Orientado al servicio", text: "Disfrutar de interactuar con las personas, ofrecer recomendaciones y crear experiencias positivas." },
      { label: "Trabajo en equipo", text: "Colaborar con los compañeros para mantener un ambiente de trabajo armónico y eficiente." },
      { label: "Atención al detalle", text: "Cuidar cada paso en la preparación y presentación de los productos." },
    ],
  },
  {
    id: 2,
    title: "Coordinador de Producción",
    location: "Armenia",
    department: "Quindío",
    area: "Producción",
    type: "Término Indefinido",
    date: "06/03/2026",
    refId: "req10185",
    description:
      "Buscamos un líder con experiencia en procesos de producción para coordinar las operaciones de nuestra planta de tostión y empaque, garantizando la calidad del café desde el grano hasta el producto final.",
    functions: [
      "Planear y supervisar el proceso de tostión, molienda y empaque del café.",
      "Coordinar al equipo operativo asegurando el cumplimiento de metas de producción.",
      "Garantizar el cumplimiento de normas BPM e inocuidad alimentaria.",
      "Gestionar inventarios de materia prima y producto terminado.",
      "Generar reportes de producción y proponer mejoras continuas en los procesos.",
    ],
    requirements: [
      "Profesional en Ingeniería Industrial, Ingeniería de Alimentos o áreas afines.",
      "Mínimo 3 años de experiencia en coordinación de producción en industria de alimentos.",
      "Conocimiento en normas BPM, HACCP y sistemas de gestión de calidad.",
    ],
    idealCandidate: [
      { label: "Liderazgo", text: "Capacidad para dirigir equipos, motivar al personal y resolver conflictos de manera efectiva." },
      { label: "Orientado a resultados", text: "Enfocarse en el cumplimiento de indicadores de producción manteniendo altos estándares de calidad." },
      { label: "Pensamiento analítico", text: "Identificar oportunidades de mejora y tomar decisiones basadas en datos." },
    ],
  },
  {
    id: 3,
    title: "Analista de Marketing Digital",
    location: "Bogotá",
    department: "Bogotá D.C.",
    area: "Marketing",
    type: "Término Indefinido",
    date: "05/03/2026",
    refId: "req10170",
    description:
      "¡Queremos llevar la marca Café Quindío a nuevas audiencias! Buscamos un analista creativo y estratégico para fortalecer nuestra presencia digital y conectar con los amantes del café en todo el país.",
    functions: [
      "Diseñar y ejecutar estrategias de marketing digital en redes sociales y plataformas web.",
      "Crear contenido atractivo alineado con la identidad de marca.",
      "Analizar métricas de rendimiento y generar reportes de campañas.",
      "Gestionar pauta digital y optimizar el retorno de inversión publicitaria.",
      "Coordinar con agencias y proveedores externos.",
    ],
    requirements: [
      "Profesional en Marketing, Comunicación Social, Publicidad o áreas afines.",
      "Mínimo 2 años de experiencia en marketing digital.",
      "Manejo avanzado de Meta Business Suite, Google Analytics y herramientas de pauta digital.",
    ],
    idealCandidate: [
      { label: "Creatividad", text: "Generar ideas frescas y contenido que conecte emocionalmente con la audiencia." },
      { label: "Analítico", text: "Interpretar datos para optimizar estrategias y maximizar resultados." },
      { label: "Proactividad", text: "Estar al tanto de tendencias digitales y proponer innovaciones constantemente." },
    ],
  },
  {
    id: 4,
    title: "Supervisor de Logística",
    location: "Cali",
    department: "Valle del Cauca",
    area: "Logística",
    type: "Término Indefinido",
    date: "04/03/2026",
    refId: "req10155",
    description:
      "Buscamos un profesional con experiencia en cadena de suministro para supervisar la distribución de nuestros productos en la región, asegurando entregas oportunas y eficientes.",
    functions: [
      "Supervisar y coordinar las rutas de distribución en la zona asignada.",
      "Administrar los recursos de transporte y personal de logística.",
      "Controlar inventarios en bodega y gestionar despachos.",
      "Revisar el retorno de equipos y la recepción de devoluciones.",
      "Optimizar procesos logísticos reduciendo costos y tiempos de entrega.",
    ],
    requirements: [
      "Profesional en Logística, Ingeniería Industrial, Administración o áreas afines.",
      "Mínimo 2 años de experiencia en supervisión logística o distribución.",
      "Licencia de conducción vigente (categoría B1 o superior).",
    ],
    idealCandidate: [
      { label: "Organizado", text: "Planificar y priorizar tareas para garantizar la eficiencia operativa." },
      { label: "Resolución de problemas", text: "Reaccionar rápidamente ante imprevistos en la cadena de distribución." },
      { label: "Orientado al detalle", text: "Controlar cada aspecto del proceso logístico para minimizar errores." },
    ],
  },
  {
    id: 5,
    title: "Ingeniero de Procesos",
    location: "Armenia",
    department: "Quindío",
    area: "Producción",
    type: "Término Indefinido",
    date: "03/03/2026",
    refId: "req10140",
    description:
      "Únete a nuestro equipo de producción para diseñar e implementar mejoras en los procesos de transformación del café, desde la tostión hasta el empaque final.",
    functions: [
      "Analizar y optimizar los procesos productivos de la planta.",
      "Implementar metodologías de mejora continua (Lean, Six Sigma).",
      "Diseñar indicadores de eficiencia y calidad.",
      "Documentar procesos y procedimientos operativos estándar.",
      "Coordinar proyectos de automatización y modernización de equipos.",
    ],
    requirements: [
      "Profesional en Ingeniería Industrial, Ingeniería de Procesos o áreas afines.",
      "Mínimo 2 años de experiencia en mejora de procesos en industria manufacturera.",
      "Conocimiento en herramientas de Lean Manufacturing.",
    ],
    idealCandidate: [
      { label: "Innovador", text: "Proponer soluciones creativas para mejorar la productividad y calidad." },
      { label: "Metódico", text: "Aplicar metodologías estructuradas para la resolución de problemas." },
      { label: "Colaborativo", text: "Trabajar de la mano con los equipos operativos para implementar cambios." },
    ],
  },
  {
    id: 6,
    title: "Auxiliar Administrativo",
    location: "Bogotá",
    department: "Bogotá D.C.",
    area: "Administración",
    type: "Término Fijo",
    date: "01/03/2026",
    refId: "req10128",
    description:
      "Apoyar las actividades administrativas y de gestión documental de la sede de Bogotá, contribuyendo al buen funcionamiento de las operaciones diarias.",
    functions: [
      "Gestionar correspondencia, archivo y documentación interna.",
      "Apoyar la coordinación de agendas y reuniones.",
      "Elaborar reportes e informes administrativos.",
      "Realizar seguimiento a órdenes de compra y proveedores.",
      "Atender llamadas y gestionar solicitudes internas.",
    ],
    requirements: [
      "Técnico o tecnólogo en Administración, Secretariado o áreas afines.",
      "Mínimo 1 año de experiencia en funciones administrativas.",
      "Manejo intermedio de herramientas ofimáticas (Excel, Word, Outlook).",
    ],
    idealCandidate: [
      { label: "Organizado", text: "Manejar múltiples tareas simultáneamente con orden y precisión." },
      { label: "Comunicación efectiva", text: "Relacionarse de manera clara y cordial con compañeros y proveedores." },
    ],
  },
  {
    id: 7,
    title: "Practicante de Recursos Humanos",
    location: "Armenia",
    department: "Quindío",
    area: "Recursos Humanos",
    type: "Practicante",
    date: "28/02/2026",
    refId: "req10115",
    description:
      "Buscamos un estudiante entusiasta para realizar su práctica profesional en el área de Recursos Humanos, apoyando procesos de selección, bienestar y desarrollo organizacional.",
    functions: [
      "Apoyar en procesos de reclutamiento y selección de personal.",
      "Colaborar en la organización de actividades de bienestar.",
      "Gestionar documentación y archivo del área de talento humano.",
      "Participar en la inducción de nuevos colaboradores.",
      "Apoyar la actualización de bases de datos de personal.",
    ],
    requirements: [
      "Estudiante de últimos semestres de Psicología, Administración de Empresas o áreas afines.",
      "Aval de la universidad para realizar práctica profesional.",
      "Disponibilidad de tiempo completo.",
    ],
    idealCandidate: [
      { label: "Interés en personas", text: "Genuina motivación por el bienestar y desarrollo del talento humano." },
      { label: "Iniciativa", text: "Proponer ideas y participar activamente en los proyectos del área." },
    ],
  },
  {
    id: 8,
    title: "Barista – Tienda Centro Comercial",
    location: "Medellín",
    department: "Antioquia",
    area: "Tiendas",
    type: "Término Indefinido",
    date: "26/02/2026",
    refId: "req10102",
    description:
      "Buscamos un barista con pasión por el café de especialidad para nuestra tienda en Medellín. Si te encanta compartir la cultura cafetera, ¡esta oportunidad es para ti!",
    functions: [
      "Preparar bebidas calientes y frías siguiendo recetas y estándares de la marca.",
      "Ofrecer degustaciones y asesorar a los clientes en la selección de productos.",
      "Mantener el orden y limpieza del punto de venta.",
      "Cumplir con los protocolos de manipulación de alimentos.",
      "Contribuir al cumplimiento de metas de venta del punto.",
    ],
    requirements: [
      "Bachiller académico.",
      "Experiencia mínima de 6 meses como barista o en atención al cliente en alimentos.",
      "Disponibilidad para horarios rotativos.",
    ],
    idealCandidate: [
      { label: "Amante del café", text: "Valorar y conocer los orígenes y métodos de preparación del café." },
      { label: "Servicio al cliente", text: "Disfrutar atendiendo personas y generando experiencias positivas." },
    ],
  },
  {
    id: 9,
    title: "Analista de Calidad",
    location: "Armenia",
    department: "Quindío",
    area: "Producción",
    type: "Término Indefinido",
    date: "24/02/2026",
    refId: "req10090",
    description:
      "Garantizar que cada producto de Café Quindío cumpla con los más altos estándares de calidad, desde la materia prima hasta el producto final en el estante.",
    functions: [
      "Realizar análisis sensoriales y fisicoquímicos del café.",
      "Verificar el cumplimiento de estándares de calidad en cada lote de producción.",
      "Documentar y reportar no conformidades.",
      "Participar en auditorías internas y externas de calidad.",
      "Apoyar la implementación de sistemas de gestión de calidad.",
    ],
    requirements: [
      "Profesional en Ingeniería de Alimentos, Química o áreas afines.",
      "Mínimo 1 año de experiencia en control de calidad en industria de alimentos.",
      "Conocimiento en normas ISO 9001 y BPM.",
    ],
    idealCandidate: [
      { label: "Riguroso", text: "Mantener la disciplina en los protocolos de análisis y control." },
      { label: "Curioso", text: "Interés por aprender sobre el mundo del café y sus perfiles de sabor." },
    ],
  },
  {
    id: 10,
    title: "Jefe de Tienda",
    location: "Bogotá",
    department: "Bogotá D.C.",
    area: "Tiendas",
    type: "Término Indefinido",
    date: "22/02/2026",
    refId: "req10078",
    description:
      "Liderar la operación de una de nuestras tiendas insignia en Bogotá, asegurando una experiencia de marca excepcional y el cumplimiento de los objetivos comerciales.",
    functions: [
      "Administrar la operación integral del punto de venta.",
      "Liderar y desarrollar al equipo de baristas y asesores.",
      "Asegurar el cumplimiento de metas de ventas y rentabilidad.",
      "Gestionar inventarios, pedidos y relación con proveedores.",
      "Implementar estrategias de visual merchandising y experiencia del cliente.",
    ],
    requirements: [
      "Profesional o tecnólogo en Administración, Mercadeo o áreas afines.",
      "Mínimo 2 años de experiencia liderando puntos de venta retail o food service.",
      "Habilidades de liderazgo y manejo de indicadores comerciales.",
    ],
    idealCandidate: [
      { label: "Líder inspirador", text: "Motivar al equipo y fomentar un ambiente de trabajo positivo." },
      { label: "Visión comercial", text: "Identificar oportunidades de negocio y maximizar resultados de la tienda." },
    ],
  },
  {
    id: 11,
    title: "Conductor de Distribución",
    location: "Cali",
    department: "Valle del Cauca",
    area: "Logística",
    type: "Término Indefinido",
    date: "20/02/2026",
    refId: "req10065",
    description:
      "Realizar la distribución de productos de Café Quindío en la zona asignada, garantizando entregas completas, a tiempo y en condiciones óptimas.",
    functions: [
      "Realizar las rutas de entrega asignadas cumpliendo los horarios establecidos.",
      "Verificar la carga y descarga de productos.",
      "Gestionar la documentación de entrega y cobro.",
      "Mantener el vehículo asignado en óptimas condiciones.",
      "Reportar novedades de la ruta y retroalimentar al equipo logístico.",
    ],
    requirements: [
      "Bachiller académico con licencia de conducción categoría C1 o C2.",
      "Mínimo 2 años de experiencia en distribución o transporte de mercancía.",
      "Conocimiento de la malla vial de Cali y zona metropolitana.",
    ],
    idealCandidate: [
      { label: "Responsable", text: "Cumplir con las entregas y cuidar los activos de la empresa." },
      { label: "Puntual", text: "Respetar horarios y compromisos con clientes." },
    ],
  },
  {
    id: 12,
    title: "Community Manager",
    location: "Bogotá",
    department: "Bogotá D.C.",
    area: "Marketing",
    type: "Término Fijo",
    date: "18/02/2026",
    refId: "req10050",
    description:
      "Gestionar las comunidades digitales de Café Quindío, creando contenido auténtico que conecte con los amantes del café y fortalezca el posicionamiento de la marca.",
    functions: [
      "Administrar las redes sociales de la marca (Instagram, Facebook, TikTok).",
      "Crear contenido fotográfico, audiovisual y escrito para redes.",
      "Interactuar con la comunidad: responder comentarios, mensajes y generar conversación.",
      "Monitorear tendencias y proponer contenido relevante.",
      "Generar reportes mensuales de engagement y crecimiento.",
    ],
    requirements: [
      "Profesional o tecnólogo en Comunicación Social, Marketing Digital o áreas afines.",
      "Mínimo 1 año de experiencia gestionando redes sociales corporativas.",
      "Habilidades de fotografía, redacción creativa y manejo de herramientas como Canva o Adobe.",
    ],
    idealCandidate: [
      { label: "Creativo", text: "Capacidad para generar contenido original y atractivo." },
      { label: "Empático", text: "Conectar genuinamente con la audiencia y representar los valores de la marca." },
    ],
  },
  {
    id: 13,
    title: "Operario de Tostión",
    location: "Armenia",
    department: "Quindío",
    area: "Producción",
    type: "Término Indefinido",
    date: "15/02/2026",
    refId: "req10038",
    description:
      "Operar los equipos de tostión de café garantizando perfiles de tueste consistentes y de alta calidad, contribuyendo a la excelencia del producto final.",
    functions: [
      "Operar y monitorear las máquinas tostadoras según los perfiles de tueste establecidos.",
      "Realizar control de calidad visual y sensorial durante el proceso de tostión.",
      "Registrar los parámetros de cada lote procesado.",
      "Mantener la limpieza y mantenimiento preventivo de los equipos.",
      "Cumplir con los protocolos de seguridad industrial y BPM.",
    ],
    requirements: [
      "Bachiller académico o técnico en procesos industriales.",
      "Experiencia de 1 año en operación de equipos industriales (preferiblemente tostión de café).",
      "Conocimiento básico de control de calidad y buenas prácticas de manufactura.",
    ],
    idealCandidate: [
      { label: "Detallista", text: "Prestar atención a cada variable del proceso para garantizar la calidad." },
      { label: "Disciplinado", text: "Seguir procedimientos y protocolos con consistencia." },
    ],
  },
  {
    id: 14,
    title: "Practicante de Logística",
    location: "Armenia",
    department: "Quindío",
    area: "Logística",
    type: "Practicante",
    date: "12/02/2026",
    refId: "req10025",
    description:
      "Oportunidad de práctica profesional en el área logística de Café Quindío, apoyando la gestión de inventarios, despachos y optimización de la cadena de suministro.",
    functions: [
      "Apoyar el control y seguimiento de inventarios en bodega.",
      "Colaborar en la coordinación de despachos y entregas.",
      "Actualizar bases de datos logísticas y generar reportes.",
      "Participar en proyectos de mejora de procesos logísticos.",
      "Apoyar en la gestión documental del área.",
    ],
    requirements: [
      "Estudiante de últimos semestres de Logística, Ingeniería Industrial o áreas afines.",
      "Aval universitario para práctica profesional.",
      "Manejo básico de Excel y herramientas de gestión.",
    ],
    idealCandidate: [
      { label: "Organizado", text: "Manejar información y tareas de manera estructurada." },
      { label: "Curioso", text: "Interés por aprender sobre cadena de suministro y operaciones." },
    ],
  },
  {
    id: 15,
    title: "Ejecutivo Comercial",
    location: "Medellín",
    department: "Antioquia",
    area: "Administración",
    type: "Término Indefinido",
    date: "10/02/2026",
    refId: "req10012",
    description:
      "Impulsar las ventas de los productos de Café Quindío en el canal institucional y retail de Antioquia, desarrollando relaciones comerciales sólidas y duraderas.",
    functions: [
      "Prospectar y gestionar clientes del canal institucional y retail.",
      "Cumplir con las metas de ventas asignadas para la zona.",
      "Realizar visitas comerciales y presentaciones de producto.",
      "Negociar condiciones comerciales y cerrar acuerdos de venta.",
      "Generar reportes de gestión comercial y forecast de ventas.",
    ],
    requirements: [
      "Profesional o tecnólogo en Administración, Mercadeo, Negocios o áreas afines.",
      "Mínimo 2 años de experiencia en ventas B2B o canal institucional.",
      "Disponibilidad para desplazamiento en la zona metropolitana de Medellín.",
    ],
    idealCandidate: [
      { label: "Persuasivo", text: "Habilidad para comunicar el valor del producto y generar confianza." },
      { label: "Orientado a metas", text: "Compromiso con el cumplimiento de objetivos comerciales." },
      { label: "Relacional", text: "Construir relaciones de largo plazo con los clientes." },
    ],
  },
];
