import { useState, useEffect } from 'react';

const emptyForm = { make: '', model: '', category: '', price: '', quantity: '' };

export default function VehicleFormModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(
      initialData
        ? {
            make: initialData.make,
            model: initialData.model,
            category: initialData.category,
            price: initialData.price,
            quantity: initialData.quantity,
          }
        : emptyForm
    );
  }, [initialData, open]);

  if (!open) return null;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {initialData ? 'Edit Vehicle' : 'Add Vehicle'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="make"
            required
            value={form.make}
            onChange={handleChange}
            placeholder="Make (e.g. Toyota)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="model"
            required
            value={form.model}
            onChange={handleChange}
            placeholder="Model (e.g. Corolla)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            placeholder="Category (e.g. Sedan)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="price"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="quantity"
            type="number"
            min="0"
            required
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {initialData ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
