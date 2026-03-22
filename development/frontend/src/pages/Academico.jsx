import { Link } from "react-router-dom";

/**
 * Tarjeta de carrera del área académica.
 * Muestra logo, información principal y acceso a la carrera.
 *
 * @param {string} title - Nombre de la carrera
 * @param {string} to - Ruta de navegación
 * @param {string} imageSrc - Imagen o logo de la carrera
 * @param {string} imageAlt - Texto alternativo
 * @param {string} description - Descripción breve
 * @param {string} accentColor - Color principal de la tarjeta
 */
function ProgramItem({
  title,
  to,
  imageSrc,
  imageAlt,
  description,
  accentColor = "#722b4d",
}) {
  const isExternal = to.startsWith("http");

  const Wrapper = ({ children }) =>
    isExternal ? (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {children}
      </a>
    ) : (
      <Link to={to} className="block h-full">
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <article className="h-full rounded-2xl border border-black/10 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
        <div className="flex h-full flex-col gap-6 md:flex-row md:items-stretch">
          <div className="flex w-full flex-shrink-0 items-center justify-center md:w-[130px]">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-[110px] w-auto object-contain"
              loading="lazy"
            />
          </div>

          <div className="flex h-full flex-1 flex-col">
            <span
              className="inline-block w-fit rounded px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{
                backgroundColor: `${accentColor}14`,
                color: accentColor,
              }}
            >
              Pregrado · 5 años
            </span>

            <h2
              className="mt-4 text-2xl font-bold leading-tight sm:text-3xl"
              style={{ color: accentColor }}
            >
              {title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
              {description}
            </p>

            <div className="mt-auto pt-6">
              <div className="mb-5 h-px w-full bg-gray-200" />
              <span
                className="inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
                style={{ backgroundColor: accentColor }}
              >
                Ver sitio de la carrera
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Wrapper>
  );
}

/**
 * Hero del área académica.
 */
function AcademicoHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 text-center lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#7ec3ff]">
            Área Académica
          </span>

          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Nuestras Carreras
          </h1>

          <p className="mt-6 text-base leading-8 text-white/85 sm:text-lg">
            El Departamento de Ingeniería Industrial imparte carreras de pregrado
            orientadas a formar profesionales con impacto real en la industria y
            la tecnología.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Página del área académica del departamento.
 */
export default function Academico() {
  const programs = [
    {
      title: (
        <>
          Ingeniería Civil <br />
          Industrial
        </>
      ),
      to: "https://userena.cl/carreras/ingenieria-civil-industrial",
      imageSrc: "/images/civil-industrial.jpg",
      imageAlt: "Logo de Ingeniería Civil Industrial",
      description:"Forma profesionales capaces de diseñar, optimizar y gestionar sistemas productivos y organizacionales, integrando herramientas de ingeniería, gestión y mejora continua para aportar valor a la industria y la sociedad.",
      accentColor: "#722b4d",
    },
    {
      title: "Ingeniería Civil en Computación e Informática",
      to: "",
      imageSrc: "/images/civil-computacion.png",
      imageAlt: "Logo de Ingeniería Civil en Computación e Informática",
      description:"Prepara especialistas en desarrollo tecnológico, sistemas de información y transformación digital, con herramientas para resolver desafíos complejos en distintos contextos.",
      accentColor: "#1f78c1",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <AcademicoHero />

      <section className="bg-[#f7f5f6] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-stretch gap-8 xl:grid-cols-2">
            {programs.map((program) => (
              <ProgramItem key={program.to} {...program} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}