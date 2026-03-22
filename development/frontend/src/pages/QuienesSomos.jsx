/**
 * Renderiza una tarjeta con una de las funciones principales del departamento.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título de la función.
 * @param {string} props.description - Descripción de la función.
 * @param {string} props.accentColor - Color aplicado al ícono.
 * @param {JSX.Element} props.icon - Ícono representativo de la función.
 * @returns {JSX.Element} La tarjeta de función renderizada.
 */
function FunctionCard({ title, description, accentColor, icon }) {
  return (
    <article className="rounded-md border border-black/5 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-md text-white"
        style={{ backgroundColor: accentColor }}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-bold text-[#722b4d] sm:mt-5 sm:text-xl">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-600 sm:mt-4 sm:text-base sm:leading-8">
        {description}
      </p>
    </article>
  );
}

/**
 * Renderiza un bloque de actividades agrupadas bajo un mismo título.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título del bloque.
 * @param {string[]} props.items - Lista de actividades a mostrar.
 * @param {string} props.color - Color de acento aplicado al encabezado y viñetas.
 * @returns {JSX.Element} El bloque de actividades renderizado.
 */
function ActivityBlock({ title, items, color }) {
  return (
    <article className="overflow-hidden rounded-md border border-black/5 bg-white shadow-sm">
      <div
        className="px-4 py-3 text-white sm:px-5 sm:py-4"
        style={{ backgroundColor: color }}
      >
        <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
      </div>

      <div className="px-4 py-4 sm:px-5">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 h-2 w-2 flex-shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <p className="text-sm leading-7 text-gray-600 sm:text-base">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/**
 * Renderiza el hero principal de la página "Quiénes Somos".
 *
 * @returns {JSX.Element} La sección superior de presentación renderizada.
 */
function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/images/quienes-somos.jpg"
        alt="Departamento de Ingeniería Industrial"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#722b4d]/72" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-20 sm:px-6 sm:pt-28 sm:pb-24 lg:px-8 lg:pt-32 lg:pb-28">
        <div className="max-w-3xl text-white">
          <span className="inline-block rounded bg-[#1f78c1]/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.25em]">
            Universidad de La Serena
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:mt-6 sm:text-5xl lg:text-6xl">
            Quiénes Somos
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
            El Departamento de Ingeniería Industrial de la Universidad de La Serena forma
            profesionales capaces de liderar procesos productivos, organizacionales y
            tecnológicos, contribuyendo al desarrollo sostenible de la región y del país.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Renderiza una sección de equipamientos destacados del departamento.
 *
 * @returns {JSX.Element} La sección de equipamientos renderizada.
 */
function EquipmentSection() {
  /**
   * Lista de equipamientos destacados del departamento.
   */
  const equipmentItems = [
    {
      id: "01",
      title: "Impresora 3D",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      imageSrc: "/images/impresora3d.jpg",
      imageAlt: "Impresora 3D del Departamento de Ingeniería Industrial",
      accentColor: "#722b4d",
    },
    {
      id: "02",
      title: "Ejemplo ",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      imageSrc: "/images/",
      imageAlt: "ejemplo2",
      accentColor: "#1f78c1",
    },
  ];

  return (
    <section className="bg-[#f7f5f6] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-4xl sm:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#722b4d]/80">
            Equipamiento del Departamento
          </p>

          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#722b4d] sm:text-4xl lg:text-5xl">
            Infraestructura
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 lg:text-lg">
            El departamento cuenta con equipamiento Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="space-y-16">
          {equipmentItems.map((item, index) => {
            const isReverse = index % 2 !== 0;

            return (
              <article
                key={item.id}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                <div className={isReverse ? "lg:order-2" : ""}>
                  <div className="overflow-hidden rounded-lg bg-white shadow-md">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]"
                    />
                  </div>
                </div>

                <div className={isReverse ? "lg:order-1" : ""}>
                  <p
                    className="text-5xl font-extrabold leading-none opacity-15 sm:text-6xl"
                    style={{ color: item.accentColor }}
                  >
                    {item.id}
                  </p>

                  <h3 className="mt-4 text-2xl font-extrabold leading-tight text-[#1f1f1f] sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                    {item.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * Renderiza la página "Quiénes Somos" del departamento.
 *
 * Responsabilidades:
 * - Presentar la identidad y propósito del departamento.
 * - Mostrar su historia institucional.
 * - Destacar sus funciones principales.
 * - Exponer actividades que se realizan.
 *
 * @returns {JSX.Element} La página "Quiénes Somos" renderizada.
 */
export default function QuienesSomos() {
  /**
   * Lista de funciones estratégicas del departamento.
   */
  const functions = [
    {
      title: "Formación Académica de Excelencia",
      description:"El Departamento de Ingeniería Industrial forma profesionales con sólida base en ciencias básicas, ingeniería y gestión, preparados para analizar información, optimizar recursos y resolver problemas en organizaciones públicas y privadas.",
      accentColor: "#722b4d",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0112 20.055a12.083 12.083 0 01-6.16-9.477L12 14z"
          />
        </svg>
      ),
    },
    {
      title: "Investigación Científica y Aplicada",
      description:"El departamento desarrolla investigación aplicada en diversas áreas de la ingeniería industrial, promoviendo proyectos científicos, colaboración académica y generación de conocimiento.",
      accentColor: "#1f78c1",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19.428 15.428a4 4 0 00-5.656-5.656l-8.486 8.485a2 2 0 102.829 2.829l8.485-8.486"
          />
        </svg>
      ),
    },
    {
      title: "Vinculación con el Medio",
      description:"El departamento mantiene una relación activa con su entorno social y productivo mediante proyectos, programas e iniciativas que contribuyen al desarrollo de la región.",
      accentColor: "#722b4d",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7"
          />
        </svg>
      ),
    },
    {
      title: "Gestión Institucional",
      description:"El departamento gestiona recursos académicos, humanos y administrativos para desarrollar sus actividades de docencia, investigación y vinculación con el medio.",
      accentColor: "#1f78c1",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7h18M9 3v18m6-18v18"
          />
        </svg>
      ),
    },
    {
      title: "Internacionalización",
      description:"El departamento fomenta la colaboración académica y científica con instituciones nacionales e internacionales, fortaleciendo la investigación y la formación profesional.",
      accentColor: "#722b4d",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0c2.5 2.5 4 6 4 10s-1.5 7.5-4 10m0-20C9.5 4.5 8 8 8 12s1.5 7.5 4 10"
          />
        </svg>
      ),
    },
    {
      title: "Responsabilidad Social",
      description:"A través de sus actividades académicas y proyectos, el departamento contribuye al desarrollo social, tecnológico y productivo de la región.",
      accentColor: "#1f78c1",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  /**
   * Lista de actividades que representan la vida académica y profesional
   * desarrollada por el departamento.
   */
  const activities = [
    "Formación de ingenieros industriales mediante programas de pregrado y posgrado.",
    "Desarrollo de investigación científica y aplicada en áreas de la ingeniería industrial.",
    "Participación en proyectos de innovación y desarrollo tecnológico.",
    "Vinculación con el medio a través de colaboración con instituciones públicas y privadas.",
    "Transferencia de conocimiento hacia el sector productivo y la sociedad.",
    "Contribución al desarrollo regional mediante actividades académicas y profesionales.",
  ];

  return (
    <div className="min-h-screen bg-white">
      <AboutHero />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#722b4d]/80">
                Nuestra historia
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-[#722b4d] sm:text-4xl lg:text-5xl">
                Más de 40 años formando líderes de la ingeniería
              </h2>

              <div className="mt-6 space-y-5 text-gray-600 leading-8">
                <p>
                  El Departamento de Ingeniería Industrial de la Universidad de La Serena
                  tiene sus orígenes en la creación de la carrera de Ingeniería Civil
                  Industrial en el año 1984.
                </p>

                <p>
                  Posteriormente, en 1988, se estableció el Departamento de
                  Industrialización, el cual integraba áreas como Mecánica, Alimentos
                  e Industrial dentro de la Facultad de Ingeniería.
                </p>

                <p>
                  En 1993 se realizó una reorganización académica que dio origen al
                  Departamento de Ingeniería Civil Industrial. Finalmente, en el año
                  2007 la unidad adoptó su nombre actual:{" "}
                  <strong>Departamento de Ingeniería Industrial</strong>,
                  consolidándose como una unidad académica clave dentro de la Facultad
                  de Ingeniería de la Universidad de La Serena.
                </p>

                <p>
                  Actualmente el departamento desarrolla actividades de docencia,
                  investigación y vinculación con el medio, contribuyendo al desarrollo
                  tecnológico, productivo y social de la región y del país.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-lg bg-[#722b4d] p-6 text-white shadow-md">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  Misión
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                
                <div className="absolute right-0 top-0 h-16 w-16 bg-white/10"/>
              </div>
              
              <div className="relative overflow-hidden rounded-lg bg-[#1f78c1] p-6 text-white shadow-md">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  Visión
                </h3>
                
                <p className="mt-3 text-sm leading-7 text-white/90">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <div className="absolute right-0 top-0 h-16 w-16 bg-white/10"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-4xl sm:mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#722b4d]/80">
              Nuestras funciones
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#722b4d] sm:text-4xl lg:text-5xl">
              ¿Qué hace el Departamento?
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 lg:text-lg">
              El DII desarrolla sus actividades en torno a tres ejes estratégicos:
              docencia, investigación y vinculación con el medio, apoyados por una
              gestión institucional sólida.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">
            {functions.map((item) => (
              <FunctionCard
                key={item.title}
                title={item.title}
                description={item.description}
                accentColor={item.accentColor}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>
      <EquipmentSection />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="relative overflow-hidden rounded-lg shadow-md">
              <img
                src="/images/departamental.jpg"
                alt="Actividades del Departamento de Ingeniería Industrial"
                className="h-[300px] w-full object-cover sm:h-[420px] lg:h-full"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#722b4d]/80">
                Vida Departamental
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#722b4d] sm:text-4xl lg:text-5xl">
                Actividades que nos definen
              </h2>

              <div className="mt-6">
                <ActivityBlock
                  title="Principales actividades del departamento"
                  items={activities}
                  color="#722b4d"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}