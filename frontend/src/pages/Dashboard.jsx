import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import VehicleFormModal from '../components/VehicleFormModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({ make: '', category: '', minPrice: '', maxPrice: '' });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const hasFilters = Object.values(filters).some((v) => v !== '');
      const res = hasFilters
        ? await api.get('/vehicles/search', { params: filters })
        : await api.get('/vehicles');
      setVehicles(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  async function handlePurchase(id) {
    if (!user) {
      navigate('/register');
      return;
    }
    try {
      await api.post(`/vehicles/${id}/purchase`);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed');
    }
  }

  async function handleRestock(id) {
    const amount = prompt('How many units to add?', '5');
    if (!amount) return;
    try {
      await api.post(`/vehicles/${id}/restock`, { amount: Number(amount) });
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Restock failed');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this vehicle?')) return;
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  }

  function openAddModal() {
    setEditingVehicle(null);
    setModalOpen(true);
  }

  function openEditModal(vehicle) {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  }

  async function handleFormSubmit(data) {
    try {
      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle._id}`, data);
      } else {
        await api.post('/vehicles', data);
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg shadow-sm">
              🚗
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">AutoStock</h1>
              <p className="text-xs text-slate-400 leading-tight">Dealership Inventory</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-full pl-1 pr-3 py-1">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center uppercase">
                    {user?.name?.charAt(0) || '?'}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-slate-700">{user?.name}</p>
                    <p
                      className={`text-[11px] font-medium capitalize ${
                        isAdmin ? 'text-amber-600' : 'text-slate-400'
                      }`}
                    >
                      {user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="text-sm font-medium bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Make</label>
            <input
              value={filters.make}
              onChange={(e) => setFilters({ ...filters, make: e.target.value })}
              placeholder="e.g. Toyota"
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <input
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              placeholder="e.g. Sedan"
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Min Price</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              className="w-28 px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setFilters({ make: '', category: '', minPrice: '', maxPrice: '' })}
            className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1.5"
          >
            Clear
          </button>

          {isAdmin && (
            <button
              onClick={openAddModal}
              className="ml-auto bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              + Add Vehicle
            </button>
          )}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</div>}

        {loading ? (
          <p className="text-slate-500 text-center py-12">Loading vehicles...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-slate-500 text-center py-12">No vehicles found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <ProductCard
                key={v._id}
                vehicle={v}
                isAdmin={isAdmin}
                isGuest={!user}
                onPurchase={handlePurchase}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}
      </main>

      <VehicleFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingVehicle}
      />
    </div>
  );
}
