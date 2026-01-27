import { Link } from 'react-router-dom';

export default function Noticias() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Social
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 mx-4 lg:mx-8">
          {/* primera tarjeta */}
          <Link to="/noticias" className="group/card block w-full">
            <article className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full group-hover/card:shadow-[0_25px_50px_rgba(97,11,47,1)] group-hover/card:-translate-y-3 transition-all duration-500 hover:shadow-purple-500/50">
              <div className="pt-2 pb-1 px-2 bg-[#610b2f]">
                <div className="bg-white rounded-2xl p-4 flex items-center justify-center h-44 lg:h-52">
                  <img
                    src="/images/news.jpg"
                    alt="Noticia"
                    className="w-36 h-36 object-contain group-hover/card:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="bg-[#610b2f] px-8 py-6 rounded-b-3xl text-white">
                <p className="text-sm mb-3 opacity-90 leading-relaxed">Resumen breve</p>
                <h3 className="text-base font-semibold line-clamp-2">Título</h3>
              </div>
            </article>
          </Link>

          {/* segunda tarjeta */}
          <Link to="/noticias" className="group/card block w-full">
            <article className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full group-hover/card:shadow-[0_25px_50px_rgba(97,11,47,1)] group-hover/card:-translate-y-3 transition-all duration-500 hover:shadow-purple-500/50">
              <div className="pt-2 pb-1 px-2 bg-[#610b2f]">
                <div className="bg-white rounded-2xl p-4 flex items-center justify-center h-44 lg:h-52">
                  <img src="/images/news.jpg" alt="Noticia" className="w-36 h-36 object-contain group-hover/card:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="bg-[#610b2f] px-8 py-6 rounded-b-3xl text-white">
                <p className="text-sm mb-3 opacity-90 leading-relaxed">Resumen Breve</p>
                <h3 className="text-base font-semibold line-clamp-2">Título</h3>
              </div>
            </article>
          </Link>

          {/* tercera tarjeta */}
          <Link to="/noticias" className="group/card block w-full">
            <article className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full group-hover/card:shadow-[0_25px_50px_rgba(97,11,47,1)] group-hover/card:-translate-y-3 transition-all duration-500 hover:shadow-purple-500/50">
              <div className="pt-2 pb-1 px-2 bg-[#610b2f]">
                <div className="bg-white rounded-2xl p-4 flex items-center justify-center h-44 lg:h-52">
                  <img src="/images/news.jpg" alt="Noticia" className="w-36 h-36 object-contain group-hover/card:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="bg-[#610b2f] px-8 py-6 rounded-b-3xl text-white">
                <p className="text-sm mb-3 opacity-90 leading-relaxed">Resumen breve</p>
                <h3 className="text-base font-semibold line-clamp-2">Título</h3>
              </div>
            </article>
          </Link>
        </div>
      </div>
    </section>
  );
}




