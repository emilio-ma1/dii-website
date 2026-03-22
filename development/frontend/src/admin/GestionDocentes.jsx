/**
 * @file TeacherManagement.jsx
 * @description Main container for Teacher Profiles management. Acts as a Thin Controller.
 */
import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useTeacherManagement } from "../hooks/useTeacherManagement";
import { TeacherForm } from "../components/Teachers/TeacherForm";
import { TeacherCard } from "../components/Teachers/TeacherCard";

const DEFAULT_PERMISSIONS = { createTeacher: false, editTeacher: false, deleteTeacher: false };
const EMPTY_FORM = { id: "", user_id: "", area: "", degree: "", image_url: "" };

export default function TeacherManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const { teachers, availableUsers, isSaving, saveTeacherProfile, deleteTeacherProfile } = useTeacherManagement(permissions.createTeacher);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setFormData({
      id: teacher.id,
      user_id: teacher.user_id,
      area: teacher.area,
      degree: teacher.degree,
      image_url: teacher.image_url || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este perfil público? La cuenta de usuario seguirá existiendo.")) {
      await deleteTeacherProfile(id);
    }
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await saveTeacherProfile(formData, editingId);
    if (success) resetFormState();
  };

  if (!permissions.createTeacher) {
    return <div className="p-8 text-center text-red-600 font-bold">Acceso Denegado</div>;
  }

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-[#722b4d]">Gestión de Docentes</h1>
        <button onClick={() => { resetFormState(); setShowForm(true); }} className="bg-[#722b4d] text-white px-5 py-3 rounded-xl shadow-md">
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