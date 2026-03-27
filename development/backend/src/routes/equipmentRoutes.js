const express = require("express");
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require("../controllers/equipmentController");

router.get("/", getEquipment);
router.get("/:id", getEquipmentById);
router.post("/", createEquipment);
router.put("/:id", updateEquipment);
router.delete("/:id", deleteEquipment);

module.exports = router;