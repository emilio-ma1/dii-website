import { Link } from "react-router-dom";

/**
 * Lista de noticias mostradas en la página de inicio.
 * Cada elemento contiene la información básica para
 * mostrar una tarjeta de noticia.
 */
const NEWS_PREVIEW_ITEMS = [
  {
    id: 1,
    title: "Título",
    summary: "Resumen breve",
    imageSrc: "/images/news.jpg",
    imageAlt: "Noticia",
    to: "/noticias",
  },
  {
    id: 2,
    title: "Título",
    summary: "Resumen breve",
    imageSrc: "/images/news.jpg",
    imageAlt: "Noticia",
    to: "/noticias",
  },
  {
    id: 3,
    title: "Título",
    summary: "Resumen breve",
    imageSrc: "/images/news.jpg",
    imageAlt: "Noticia",
    to: "/noticias",
  },
];

/**
 * Tarjeta individual de noticia utilizada en la sección
 * de noticias de la página principal.
 *
 * @param {object} item - Información de la noticia
 */
function NewsCard({ item }) {
  return (
    <Link to={item.to} className="group/card block w-full">
      {/* contenedor principal de la tarjeta */}
      <article className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full group-hover/card:shadow-[0_25px_50px_rgba(97,11,47,1)] group-hover/card:-translate-y-3 transition-all duration-500 hover:shadow-purple-500/50">
      {/* sección de imagen */}
        <div className="pt-2 pb-1 px-2 bg-[#722b4d]">
          <div className="bg-white rounded-2xl p-4 flex items-center justify-center h-44 lg:h-52">
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className="w-36 h-36 object-contain group-hover/card:scale-110 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        </div>
        {/* sección de texto */}
        <div className="bg-[#722b4d] px-8 py-6 rounded-b-3xl text-white">
          <p className="text-sm mb-3 opacity-90 leading-relaxed">{item.summary}</p>
          <h3 className="text-base font-semibold line-clamp-2">{item.title}</h3>
        </div>
      </article>
    </Link>
  );
}

/**
 * Sección de noticias mostrada en la página de inicio.
 * Presenta una vista previa de las noticias recientes
 * del departamento.
 */
export default function NoticiasHome() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* título de la sección */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Social</h2>

        {/* grilla de noticias */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mx-4 lg:mx-8">
          {NEWS_PREVIEW_ITEMS.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}