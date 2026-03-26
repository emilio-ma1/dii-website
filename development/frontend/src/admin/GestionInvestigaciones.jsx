import { useState, useEffect } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useResearchData } from "../hooks/useResearchData";
import { ProjectForm } from "../components/Research/ProjectForm";
import { ProjectCard } from "../components/Research/ProjectCard";

const DEFAULT_PERMISSIONS = {
  createProject: false,
  editProject: false,
  deleteProject: false,
  manageAccounts: false,
};

const EMPTY_FORM = {
  id: "",
  title: "",
  authors: [], 
  category_id: "", 
  year: "",
  abstract: "", 
  pdf_url: "", 
  status: "in_progress",
  image_file: null,
  pdf_file: null,
};

/**
 * Main container for research project management.
 * Coordinates state, permissions, and layout rendering.
 *
 * @returns {JSX.Element} The research management view.
 */
export default function ResearchManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  // Lógica delegada al Custom Hook
  const shouldFetchDependencies = permissions.createProject || permissions.editProject;
  const { availableAuthors, categories } = useResearchData(shouldFetchDependencies);

  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingProjectId);

  const resetFormState = () => {
    setShowForm(false);
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
  };

  const initializeNewProject = () => {
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const loadProjectForEditing = (project) => {
    setEditingProjectId(project.id);
    setFormData({
      id: project.id || "",
      title: project.title || "",
      authors: project.authors ? project.authors.map(a => ({ ...a, full_name: a.name || a.full_name })) : [], 
      category_id: project.category_id || "",
      year: project.year || "",
      abstract: project.abstract || "",
      status: project.status || "in_progress",
      image_file: null,
      pdf_file: null,
    });
    setShowForm(true);
  };

  const deleteProject = async (projectId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta investigación? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
        alert("¡Proyecto eliminado con éxito!");
      } else {
        const data = await response.json();
        alert(`Error al eliminar: ${data.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("[ERROR] Network failure deleting project:", error);
      alert("Error de red al intentar eliminar el proyecto.");
    }
  };

  const updateFormState = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];
      const isImage = name === "image_file";
      const maxSizeInBytes = isImage ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB o 5MB

      if (file.size > maxSizeInBytes) {
        alert(`El archivo es demasiado pesado. El límite máximo es ${isImage ? '2MB para imágenes' : '5MB para documentos PDF'}.`);
        event.target.value = "";
        return;
      }

      setFormData((previousFormData) => ({
        ...previousFormData,
        [name]: file,
      }));
    } else {
      setFormData((previousFormData) => ({
        ...previousFormData,
        [name]: value,
      }));
    }
  };

  // Función para buscar los proyectos en la BD
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token"); 
      
      if (!token) {
        console.log("Esperando token de autenticación...");
        return;
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/panel`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data); 
      } else if (response.status === 401 || response.status === 403) {
        console.warn("Sesión expirada. Por favor, inicia sesión de nuevo.");
      }
    } catch (error) {
      console.error("[ERROR] No se pudieron cargar los proyectos:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const submitProjectData = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing 
        ? `${import.meta.env.VITE_API_URL}/api/projects/${editingProjectId}`
        : `${import.meta.env.VITE_API_URL}/api/projects`;

      const submitData = new FormData();

      submitData.append("title", formData.title || "");
      submitData.append("category_id", formData.category_id || "");
      submitData.append("year", formData.year || "");
      submitData.append("abstract", formData.abstract || "");
      submitData.append("status", formData.status || "in_progress");

      submitData.append("authors", JSON.stringify(formData.authors || []));

      if (formData.image_file) {
        submitData.append("image", formData.image_file);
      }
      if (formData.pdf_file) {
        submitData.append("pdf", formData.pdf_file);
      }

      const response = await fetch(url, {
        method: method, 
        headers: { 
          "Authorization": `Bearer ${token}`
        },
        body: submitData, // Enviamos el objeto FormData directamente, NO JSON.stringify()
      });

      if (response.ok) {
        alert(isEditing ? "¡Proyecto actualizado con éxito!" : "¡Proyecto guardado con éxito!");
        resetFormState();
        fetchProjects(); // Recargamos la lista limpia
      } else {
        const data = await response.json();
        alert(`Error al guardar: ${data.message}`);
      }
    } catch (error) {
      console.error("[ERROR] Network failure saving project:", error);
      alert("Error de red al intentar guardar el proyecto.");
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Investigaciones
        </h1>

        {permissions.createProject && (
          <button
            type="button"
            onClick={initializeNewProject}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Proyecto
          </button>
        )}
      </div>

      <div className="mt-8">
        {showForm ? (
          <ProjectForm
            formData={formData}
            onChange={updateFormState}
            onSubmit={submitProjectData}
            onCancel={resetFormState}
            isEditing={isEditing}
            availableUsers={availableAuthors} 
            setFormData={setFormData}
            categories={categories}
          />
        ) : (
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={loadProjectForEditing}
                  onDelete={deleteProject}
                  permissions={permissions}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
                No hay proyectos registrados todavía.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}