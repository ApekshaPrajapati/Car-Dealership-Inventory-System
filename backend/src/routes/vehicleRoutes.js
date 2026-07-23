const express = require('express');
const {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} = require('../controllers/vehicleController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Public: anyone can browse and search vehicles without logging in
router.get('/search', searchVehicles); // must come before /:id
router.get('/', getVehicles);

// Everything below requires login
router.use(protect);

router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', adminOnly, deleteVehicle);
router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', adminOnly, restockVehicle);

module.exports = router;