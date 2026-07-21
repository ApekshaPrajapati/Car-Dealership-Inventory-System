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

router.use(protect);

router.get('/search', searchVehicles); 
router.get('/', getVehicles);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', adminOnly, deleteVehicle);
router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', adminOnly, restockVehicle);

module.exports = router;
