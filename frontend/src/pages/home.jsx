import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Noticias from './NoticiasHome.jsx';

export default function Home() {
    {/*para el boton para subir hacia arriba */}
    const [showScrollTop, setShowScrollTop] = useState(false);
     useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return(
        <div className="bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 py-2 pt-16"> 
            <div className="max-w-6xl mx-auto text-center">
                {/* titulo */}
                <h1 className="font-bold text-gray-900 leading-tight mb-4 text-2xl sm:text-3xl md:text-4xl break-words">
                    DEPARTAMENTO DE INGENIERÍA INDUSTRIAL
                </h1>

                {/*descripción */}
                <div className="max-w-3xl mx-auto space-y-3 mb-14">
                    <p className="font-light text-gray-600 text-base sm:text-lg">
                        Somos el departamento académico del Departamento de Ingeniería
                        Industrial de la Universidad de La Serena, comprometidos con...
                    </p>
                    <p className="text-gray-500 text-sm sm:text-base">
                        Descripción del departamento. Líneas de investigación principales y
                        objetivos institucionales.
                    </p>
                </div>

                {/* tarjetas */}
                <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* tarjeta académico*/}
                    <Link to="/academico" className="group block"> 
                        <div className="bg-[#610b2f] rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5 sm:mb-6 text-center">
                                Académico/Docencia
                            </h3>
                            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                                {/* cuadro blanco */}
                                <div className="bg-white rounded-xl p-6 w-full md:w-64 shadow-md">
                                    <p className="text-base sm:text-lg text-gray-800 text-center leading-snug">
                                        <span className="font-semibold">Resumen del área</span>
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        <br />
                                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                                {/* ícono, después lo cambio por una imagen */}
                                <div className="w-32 h-32 rounded-xl bg-white/30 flex items-center justify-center">
                                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* tarjeta investigaciones */}
                    <Link to="/investigaciones" className="group block">
                        <div className="bg-[#610b2f] rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-5 sm:mb-6 text-center">
                                Investigaciones
                            </h3>
                            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                                {/* cuadro blanco */}
                                <div className="bg-white rounded-xl p-6 w-full md:w-64 shadow-md">
                                    <p className="text-base sm:text-lg text-gray-800 text-center leading-snug">
                                        <span className="font-semibold">Resumen del área</span>
                                        <br />
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        <br />
                                        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                </div>
                                {/* ícono, después lo cambio por una imagen */}
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white/30 flex items-center justify-center">
                                    <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
                <div className="mt-16">
                <Noticias />
             </div>
             {/* boton para volver al inicio */}
             <button
             onClick={scrollToTop}
             className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#610b2fde] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} aria-label="Volver arriba">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    </button>
                    </div>
                    );
                }