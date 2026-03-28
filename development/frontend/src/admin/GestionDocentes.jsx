/**
 * @file TeacherManagement.jsx
 * @description
 * Main container for Teacher Profiles management. Acts as a Thin Controller.
 * Responsibilities:
 * - Manage local UI state (form visibility, current editing profile).
 * - Transform UI events into API-ready payloads (packing FormData for binary images).
 * - Enforce role-based access control for teacher profile views.
 */
import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useTeacherManagement } from "../hooks/useTeacherManagement";
import { TeacherForm } from "../components/Teachers/TeacherForm";
import { TeacherCard } from "../components/Teachers/TeacherCard";

const DEFAULT_PERMISSIONS = { createTeacher: false, editTeacher: false, deleteTeacher: false };

const EMPTY_FORM = { id: "", user_id: "", area: "", degree: "", image_file: null };

/**
 * Main component for the Teacher Management view.
 *
 * @returns {JSX.Element} The rendered teacher management dashboard.
 */
export default function TeacherManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const { teachers, availableUsers, isSaving, saveTeacherProfile, deleteTeacherProfile } = useTeacherManagement(permissions.createTeacher);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  /**
   * Resets the local form state to its initial empty configuration.
   *
   * @returns {void}
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Populates the form with existing data when triggering edit mode.
   *
   * @param {object} teacher The teacher record to be edited.
   * @returns {void}
   */
  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setFormData({
      id: teacher.id,
      user_id: teacher.user_id || "",
      user_name: teacher.user_name || "",
      area: teacher.area || "",
      degree: teacher.degree || "",
      image_file: null
    });
    setShowForm(true);
  };

  /**
   * Prompts for confirmation and triggers the deletion of a teacher profile.
   *
   * @param {string|number} id The unique identifier of the teacher profile.
   * @returns {Promise<void>}
   */
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este perfil público? La cuenta de usuario seguirá existiendo.")) {
      await deleteTeacherProfile(id);
    }
  };

  /**
   * Updates the form state based on user input.
   * Includes a validation guard to prevent uploading files larger than 2MB.
   *
   * @param {Event} e The input change event from the form.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files && files.length > 0) {
      const selectedFile = files[0];

      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("La imagen excede el límite de 2MB permitidos.");
        e.target.value = "";
        return;
      }

      setFormData((prev) => ({ ...prev, image_file: selectedFile }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the form submission.
   * Packs the JSON state into a FormData object to support multipart/form-data.
   *
   * @param {Event} event The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append("user_id", formData.user_id || "");
    submitData.append("area", formData.area || "");
    submitData.append("degree", formData.degree || "");

    if (formData.image_file) {
      submitData.append("image", formData.image_file);
    }

    const success = await saveTeacherProfile(submitData, editingId);
    if (success) resetFormState();
  };

  // RBAC Guard
  if (!permissions.createTeacher) {
    return <div className="p-8 text-center text-red-600 font-bold">Acceso Denegado</div>;
  }

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#722b4d]">Gestión de Docentes</h1>
        <button onClick={() => { resetFormState(); setShowForm(true); }} className="bg-[#722b4d] text-white px-5 py-3 rounded-xl shadow-md transition hover:opacity-90">
          + Enlazar Perfil
        </button>
      </div>

      {showForm ? (
        <TeacherForm
          formData={formData}
          availableUsers={availableUsers}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetFormState}
          isEditing={Boolean(editingId)}
          isSaving={isSaving}
        />
      ) : (
        <div className="space-y-4">
          {teachers.length > 0 ? (
            teachers.map(t => <TeacherCard key={t.id} teacher={t} onEdit={handleEdit} onDelete={handleDelete} permissions={permissions} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
              No hay perfiles de docentes registrados.
            </div>
          )}
        </div>
      )}
    </section>
  );
}