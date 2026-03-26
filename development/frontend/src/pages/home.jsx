import { Link } from "react-router-dom";
import Noticias from "./NoticiasHome.jsx";


/**
 * Renders the main hero section of the home page.
 * Includes the institutional image, headline, and primary actions.
 *
 * @returns {JSX.Element} Rendered hero section.
 */
function HeroSection() {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      <img
        src="/images/ejemplohome.jpg"
        alt="Departamento de Ingeniería Industrial"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[#722b4d]/60" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/90 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 pt-20 pb-16">
        <div className="max-w-3xl text-white">

          <h1 className="mt-8 text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
            Departamento de
            <span className="mt-2 block text-white">
              Ingeniería Industrial
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
            Formando profesionales de excelencia, impulsando la investigación
            y generando vínculos estratégicos con la industria y la sociedad.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
           <button
              onClick={scrollToAreas}
              className="inline-flex items-center rounded-lg border border-white/70 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#722b4d]"
            >
              Explorar
            </button>

            <Link
              to="/quienes-somos"
              className="inline-flex items-center rounded-lg border border-white/70 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#722b4d]"
            >
              Conocer más
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders a card representing one of the department areas.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - Area title.
 * @param {string} props.description - Area description.
 * @param {string} props.image - Path to the representative image.
 * @param {string} props.to - Navigation route associated with the area.
 * @returns {JSX.Element} Rendered area card.
 */
function AreaCard({ title, description, image, to }) {
  return (
    <Link to={to} className="block group w-full">
      <div
        className="relative mx-auto h-[360px] w-[300px] overflow-hidden shadow-lg transition duration-300 group-hover:-translate-y-2 sm:h-[400px] sm:w-[340px] lg:h-[470px] lg:w-[420px]"
        style={{
          clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        }}
      >

        <div className="h-[42%] overflow-hidden sm:h-[44%] lg:h-[45%]">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex h-[58%] flex-col items-center bg-[#722b4d] px-5 pt-2 text-center text-white sm:px-6 sm:pt-3 lg:h-[55%] lg:px-8 lg:pt-4">
          <h3 className="max-w-[260px] text-xl sm:text-2xl font-bold leading-tight">
            {title}
          </h3>

          <div className="my-2 h-[2px] w-16 bg-white/40" />
          <p className="max-w-[220px] text-[0.9rem] leading-7 text-white/95 sm:max-w-[240px] sm:text-[0.95rem] lg:max-w-[280px] lg:text-[1rem] lg:leading-8">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Renders the section that introduces the main department areas.
 *
 * @returns {JSX.Element} Rendered areas section.
 */
function AreasSection() {
  const areas = [
    {
      title: "Docencia",
      description:
        "Programas de formación de excelencia en ingeniería industrial con enfoque práctico y teórico.",
      image: "/images/academico2.jpg",
      to: "/academico",
    },
    {
      title: "Investigación",
      description:
        "Proyectos de investigación que impulsan la innovación y el desarrollo tecnológico en la industria.",
      image: "/images/investigacion2.png",
      to: "/investigaciones",
    },
    {
      title: "Vinculación con el Medio",
      description:
        "Conexiones estratégicas con la industria, el sector público y la comunidad para generar impacto.",
      image: "/images/vinculacion2.jpg",
      to: "/vinculacion-con-el-medio",
    },
  ];

  return (
    <section
      id="areas"
      className="bg-[#f7f5f6] py-24"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1f78c1]">
          Estructura Acádemica
        </p>

        <h2 className="mt-3 text-4xl font-extrabold text-[#722b4d] sm:text-5xl lg:text-6xl">
          Áreas del Departamento
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
          Tres ejes fundamentales que guían nuestra misión académica y de
          investigación.
        </p>

        <div className="mt-16 grid grid-cols-1 justify-items-center gap-14 sm:gap-16 lg:mt-20 lg:grid-cols-3 lg:gap-26">
          {areas.map((area) => (
            <AreaCard key={area.title} {...area} />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Performs a smooth scroll to the department areas section.
 */
const scrollToAreas = () => {
  const section = document.getElementById("areas");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

/**
 * Renders the main home page of the Department of Industrial Engineering website.
 *
 * @returns {JSX.Element} Rendered home page.
 */
export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />

      <AreasSection />
      
      <Noticias />
    </div>
  );
}