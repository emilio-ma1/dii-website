import { useParams } from "react-router-dom";

export default function InvestigacionDetalle() {
  const { id } = useParams();

  return (
    <div className="min-h-screen pt-28 px-6">
      <h1 className="text-4xl font-bold text-[#722b4d]">
        Detalle de investigación
      </h1>

      <p className="mt-4 text-gray-600">
        ID del proyecto: {id}
      </p>
    </div>
  );
}