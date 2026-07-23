export default function ProductCard({ vehicle, isAdmin, isGuest, onPurchase, onEdit, onDelete, onRestock }) {
  const outOfStock = vehicle.quantity <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1">
            {vehicle.category}
          </span>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            outOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
          }`}
        >
          {outOfStock ? 'Out of stock' : `${vehicle.quantity} in stock`}
        </span>
      </div>

      <p className="text-2xl font-bold text-slate-900">
        ${Number(vehicle.price).toLocaleString()}
      </p>

      <button
        onClick={() => onPurchase(vehicle._id)}
        disabled={outOfStock}
        className={`w-full font-medium py-2 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed ${
          isGuest
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {outOfStock ? 'Unavailable' : isGuest ? 'Register to Purchase' : 'Purchase'}
      </button>

      {isAdmin && (
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onEdit(vehicle)}
            className="flex-1 text-sm bg-slate-100 text-slate-700 py-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onRestock(vehicle._id)}
            className="flex-1 text-sm bg-amber-50 text-amber-700 py-1.5 rounded-lg hover:bg-amber-100 transition"
          >
            Restock
          </button>
          <button
            onClick={() => onDelete(vehicle._id)}
            className="flex-1 text-sm bg-red-50 text-red-600 py-1.5 rounded-lg hover:bg-red-100 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
