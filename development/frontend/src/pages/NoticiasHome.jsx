import { Link } from "react-router-dom";
import { useLatestNews } from "../hooks/useLatestNews"; // Ajusta la ruta según tu estructura

/**
 * Renders a calendar SVG icon.
 *
 * @returns {JSX.Element} The calendar icon component.
 * @throws {Error} No exceptions thrown.
 */
function CalendarIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
    </svg>
  );
}

/**
 * Formats an ISO date string into a localized Spanish format.
 *
 * @param {string} isoDate - The ISO date string from the database.
 * @returns {string} The formatted date string (e.g., "24 de Marzo, 2026").
 * @throws {Error} Silently catches parsing errors and returns fallback text.
 */
export function formatDate(isoDate) {
  if (!isoDate) return "Fecha desconocida";
  try {
    const dateObj = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('es-ES', options);
    return formattedDate.replace(/ de ([a-z])/, (match, letter) => ` de ${letter.toUpperCase()}`);
  } catch (error) {
    return "Fecha desconocida";
  }
}

/**
 * Renders a single news card with navigation.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.item - The news data object.
 * @returns {JSX.Element} The rendered article card.
 * @throws {Error} No exceptions thrown.
 */
function NewsCard({ item }) {
  const imageSource = item.image_url || "/images/seminario.jpg";
  const categoryColor = "bg-[#1f78c1]";

  return (
    <article className="group overflow-hidden rounded-md bg-white shadow-md border-2 border-[#722b4d]/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#722b4d] flex flex-col h-full">
      {/* Recuerda que si prefieres usar el slug de tu BD, cambia item.id por item.slug */}
      <Link to={`/vinculacion-con-el-medio-detalle/${item.slug}`} className="flex flex-col h-full">
        <div className="relative h-64 overflow-hidden lg:h-80 shrink-0">
          <img
            src={imageSource}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = "/images/seminario.jpg"; }}
          />
          <span className={`absolute left-4 top-4 rounded px-3 py-1 text-sm font-semibold text-white ${categoryColor}`}>
            Noticia
          </span>
        </div>

        <div className="px-5 py-5 flex flex-col grow">
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <CalendarIcon />
            <span>{formatDate(item.published_at)}</span>
          </div>

          <h3 className="line-clamp-2 text-[1.9rem] font-bold leading-tight text-[#722b4d] md:text-[2rem] lg:text-[2.1rem]">
            {item.title}
          </h3>

          <p className="mt-4 line-clamp-3 text-base leading-8 text-gray-600 grow">
            {item.content || "Sin descripción disponible."}
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
 * Main component for displaying the latest news section on the homepage.
 * Delagates data fetching to useLatestNews hook to maintain low complexity.
 *
 * @returns {JSX.Element} The rendered news section.
 * @throws {Error} No exceptions thrown.
 */
export default function NoticiasHome() {
  const { latestNews, isLoading, error } = useLatestNews();

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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-[#722b4d] text-lg font-semibold animate-pulse">Cargando las últimas noticias...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 border border-red-200 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : latestNews.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border border-gray-200 bg-white rounded-lg">
            Aún no hay noticias publicadas.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {latestNews.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}