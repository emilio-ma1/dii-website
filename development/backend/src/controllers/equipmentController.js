const equipmentModel = require("../models/equipmentModel");

async function getEquipment(req, res) {
  try {
    const equipment = await equipmentModel.getAll();
    return res.status(200).json(equipment);
  } catch (error) {
    console.error("[ERROR] Failed to fetch equipment:", error);
    return res.status(500).json({ message: "No se pudo obtener el equipamiento." });
  }
}

async function getEquipmentById(req, res) {
  try {
    const { id } = req.params;
    const item = await equipmentModel.getById(id);

    if (!item) {
      return res.status(404).json({ message: "Equipamiento no encontrado." });
    }

    return res.status(200).json(item);
  } catch (error) {
    console.error("[ERROR] Failed to fetch equipment by id:", error);
    return res.status(500).json({ message: "No se pudo obtener el equipamiento." });
  }
}

async function createEquipment(req, res) {
  try {
    const { name, description, image_url } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const created = await equipmentModel.create({
      name: name.trim(),
      description,
      image_url,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("[ERROR] Failed to create equipment:", error);
    return res.status(500).json({ message: "No se pudo crear el equipamiento." });
  }
}

async function updateEquipment(req, res) {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const updated = await equipmentModel.update(id, {
      name: name.trim(),
      description,
      image_url,
    });

    if (!updated) {
      return res.status(404).json({ message: "Equipamiento no encontrado." });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error("[ERROR] Failed to update equipment:", error);
    return res.status(500).json({ message: "No se pudo actualizar el equipamiento." });
  }
}

async function deleteEquipment(req, res) {
  try {
    const { id } = req.params;
    const deleted = await equipmentModel.remove(id);

    if (!deleted) {
      return res.status(404).json({ message: "Equipamiento no encontrado." });
    }

    return res.status(200).json({ message: "Equipamiento eliminado correctamente." });
  } catch (error) {
    console.error("[ERROR] Failed to delete equipment:", error);
    return res.status(500).json({ message: "No se pudo eliminar el equipamiento." });
  }
}

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};