/**
 * @file AccountManagement.jsx
 * @description Main container for user account management. Acts as a Thin Controller.
 */

import { useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useAccountManagement } from "../hooks/useAccountManagement";
import { UserForm } from "../components/Accounts/UserForm";
import { UserCard } from "../components/Accounts/UserCard";

const DEFAULT_PERMISSIONS = {
  createProject: false,
  editProject: false,
  deleteProject: false,
  manageAccounts: false,
};

const EMPTY_FORM = {
  id: "",
  fullName: "",
  email: "",
  password: "",
  role: "teacher",
};

/**
 * Sorts an array of users alphabetically by their full name.
 *
 * @param {Array<object>} users The list of users to sort.
 * @returns {Array<object>} A new sorted array.
 */
const sortUsersByName = (users) => {
  return [...users].sort((firstUser, secondUser) =>
    firstUser.fullName.localeCompare(secondUser.fullName)
  );
};

export default function AccountManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  
  // Custom Hook abstrae toda la lógica compleja de red y estado
  const {
    users,
    isSaving,
    message,
    errorMessage,
    clearFeedbackMessages,
    deleteUser,
    updateUser,
    createUser
  } = useAccountManagement(permissions.manageAccounts);
  
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingUserId);
  const sortedUsers = useMemo(() => sortUsersByName(users), [users]);

  const resetLocalFormState = () => {
    setShowForm(false);
    setEditingUserId(null);
    setFormData(EMPTY_FORM);
    clearFeedbackMessages();
  };

  const handleNewUser = () => {
    resetLocalFormState();
    setShowForm(true);
  };

  const handleEditUser = (selectedUser) => {
    setEditingUserId(selectedUser.id);
    setFormData({
      id: selectedUser.id,
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      password: "",
      role: selectedUser.role,
    });
    clearFeedbackMessages();
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    await deleteUser(userId);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearFeedbackMessages();

    let success;
    if (isEditing) {
      success = await updateUser(editingUserId, formData);
    } else {
      success = await createUser(formData);
    }

    if (success) {
      setShowForm(false);
      setEditingUserId(null);
      setFormData(EMPTY_FORM);
    }
  };

  if (!permissions.manageAccounts) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="mt-2 text-sm">No tienes permisos para acceder a la gestión de cuentas.</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Cuentas
        </h1>
        <button
          type="button"
          onClick={handleNewUser}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          + Nuevo Usuario
        </button>
      </div>

      {message && <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
      {errorMessage && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

      <div className="mt-8">
        {showForm ? (
          <UserForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetLocalFormState}
            isEditing={isEditing}
            isSaving={isSaving}
          />
        ) : (
          <div className="space-y-4">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((listedUser) => (
                <UserCard
                  key={listedUser.id}
                  user={listedUser}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  canDelete={listedUser.id !== user?.id}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
                No hay usuarios registrados todavía.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}