const Vehicle = require('../models/Vehicle');

async function createVehicle(req, res) {
  try {
    const { make, model, category, price, quantity } = req.body;
    if (!make || !model || !category || price == null) {
      return res.status(400).json({ message: 'make, model, category and price are required' });
    }
    const vehicle = await Vehicle.create({ make, model, category, price, quantity: quantity || 0 });
    return res.status(201).json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create vehicle', error: err.message });
  }
}

async function getVehicles(req, res) {
  try {
    const vehicles = await Vehicle.find();
    return res.status(200).json(vehicles);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch vehicles', error: err.message });
  }
}

async function searchVehicles(req, res) {
  try {
    const { make, model, category, minPrice, maxPrice } = req.query;
    const filter = {};
    if (make) filter.make = new RegExp(make, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (category) filter.category = new RegExp(category, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const vehicles = await Vehicle.find(filter);
    return res.status(200).json(vehicles);
  } catch (err) {
    return res.status(500).json({ message: 'Search failed', error: err.message });
  }
}

async function updateVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    return res.status(200).json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
}

async function deleteVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    return res.status(200).json({ message: 'Vehicle deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Delete failed', error: err.message });
  }
}

async function purchaseVehicle(req, res) {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.quantity <= 0) {
      return res.status(400).json({ message: 'Vehicle out of stock' });
    }
    vehicle.quantity -= 1;
    await vehicle.save();
    return res.status(200).json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: 'Purchase failed', error: err.message });
  }
}

async function restockVehicle(req, res) {
  try {
    const { amount } = req.body;
    const inc = Number(amount) > 0 ? Number(amount) : 1;
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    vehicle.quantity += inc;
    await vehicle.save();
    return res.status(200).json(vehicle);
  } catch (err) {
    return res.status(500).json({ message: 'Restock failed', error: err.message });
  }
}

module.exports = {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
};
