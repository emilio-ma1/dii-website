import { Link } from "react-router-dom";

/**
 * Noticias destacadas mostradas en la página de inicio.
 * Cada elemento contiene la información básica para
 * mostrar una tarjeta de noticia.
 */
const NEWS_PREVIEW_ITEMS = [
  {
    id: 1,
    title: "Ejemplo 1",
    summary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    imageSrc: "/images/seminario.jpg",
    imageAlt: "Seminario",
    category: "Categoria",
    categoryColor: "bg-[#8f2f6b]",
    date: "28 de Febrero, 2026",
    to: "/noticias",
  },
  {
    id: 2,
    title: "Ejemplo 2",
    summary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    imageSrc: "/images/noticiabiblioteca.jpg",
    imageAlt: "Bibilioteca",
    category: "Categoria",
    categoryColor: "bg-[#1f78c1]",
    date: "15 de Febrero, 2026",
    to: "/noticias",
  },
  {
    id: 3,
    title: "Ejemplo 3",
    summary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam",
    imageSrc: "/images/reunion.png",
    imageAlt: "Reunión",
    category: "Categoria",
    categoryColor: "bg-gray-500",
    date: "5 de Febrero, 2026",
    to: "/noticias",
  },
];

/**
 * Renderiza el ícono de calendario utilizado para mostrar la fecha de la noticia.
 *
 * @returns {JSX.Element} El ícono de calendario renderizado.
 */
function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z"
      />
    </svg>
  );
}

/**
 * Renderiza una tarjeta individual de noticia.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.item - Información de la noticia.
 * @param {number} props.item.id - Identificador único de la noticia.
 * @param {string} props.item.title - Título de la noticia.
 * @param {string} props.item.summary - Resumen breve de la noticia.
 * @param {string} props.item.imageSrc - Ruta de la imagen principal.
 * @param {string} props.item.imageAlt - Texto alternativo de la imagen.
 * @param {string} props.item.category - Categoría de la noticia.
 * @param {string} props.item.categoryColor - Color visual de la categoría.
 * @param {string} props.item.date - Fecha de publicación de la noticia.
 * @param {string} props.item.to - Ruta de navegación al detalle o listado de noticias.
 * @returns {JSX.Element} La tarjeta de noticia renderizada.
 */
function NewsCard({ item }) {
  return (
    <article className="group overflow-hidden rounded-md bg-white shadow-md border-2 border-[#722b4d]/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#722b4d]">
      <Link to={item.to} className="block">
        <div className="relative h-64 overflow-hidden lg:h-80">
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span
            className={`absolute left-4 top-4 rounded px-3 py-1 text-sm font-semibold text-white ${item.categoryColor}`}
          >
            {item.category}
          </span>
        </div>

        <div className="px-5 py-5">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon />
            <span>{item.date}</span>
          </div>

          <h3 className="line-clamp-2 text-[1.9rem] font-bold leading-tight text-[#722b4d] md:text-[2rem] lg:text-[2.1rem]">
            {item.title}
          </h3>

          <p className="mt-4 line-clamp-3 text-base leading-8 text-gray-600">
            {item.summary}
          </p>

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 text-base font-semibold text-[#1f78c1] transition group-hover:gap-3">
              Leer más
              <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * Renderiza la sección de noticias mostrada en la página de inicio.
 *
 * Responsabilidades:
 * - Mostrar una vista previa de noticias destacadas.
 * - Presentar un encabezado de contexto para la sección.
 * - Renderizar una grilla con tarjetas de noticias.
 *
 * @returns {JSX.Element} La sección de noticias renderizada.
 */
export default function NoticiasHome() {
  return (
    <section className="bg-[#f3f3f3] pt-10 pb-20 lg:pt-14 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1f78c1]">
            Actualidad
          </p>

          <h2 className="mt-3 text-4xl font-extrabold text-[#722b4d] sm:text-5xl lg:text-6xl">
            Social
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
            Mantente informado sobre las últimas novedades del departamento.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {NEWS_PREVIEW_ITEMS.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}