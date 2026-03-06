import { Link } from "react-router-dom";

export default function Footer() {
    return(
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div className="flex justify-center md:justify-start">
                        <img
                            src="/images/logo-footer.png"
                            alt="Logo Footer"
                            className="h-[98px] w-auto object-contain flex-shrink-0"
                        />
                    </div>
                    <div className="flex justify-center">
                        <img
                            src="/images/contacto-por-unidades.png"
                            alt="Contacto por Unidades"
                            className="h-[115px] w-auto object-contain flex-shrink-0"
                        />
                    </div>
                    <div className="flex justify-center md:justify-end">
                        <img
                            src="/images/logo-cna.png"
                            alt="Logo Cna"
                            className="h-[98px] w-auto object-contain flex-shrink-0"
                        />
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8">
                    <div className="text-center text-xs text-gray-400">
                        {/* login */}
                        <Link to="/login" className="block text-xs opacity-60 hover:opacity-100 transition">
                        Iniciar Sesión
                        </Link>
                        <p className="mt-4">©{new Date().getFullYear()} Derechos reservados</p>
                        <p>Desarrollado por:<br />
                            Matias Wormald<br />
                            Emilio Maturana<br />
                            Felipe Urqueta<br />
                            Joselyn Montaño
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
