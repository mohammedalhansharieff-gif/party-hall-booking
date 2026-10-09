import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, MapPin, Users, IndianRupee } from 'lucide-react';
import { getAdminHalls, createHall, updateHall, deleteHall } from '../../api/admin.api';
import { Hall } from '../../types';
import { HallFormModal } from '../../components/admin/HallFormModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const AdminHalls: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);

  const loadHalls = async () => {
    try {
      setLoading(true);
      const data = await getAdminHalls();
      setHalls(data);
    } catch (err: any) {
      toast.error('Failed to load halls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHalls();
  }, []);

  const handleOpenCreate = () => {
    setEditingHall(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (hall: Hall) => {
    setEditingHall(hall);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: Partial<Hall>) => {
    if (editingHall) {
      await updateHall(editingHall.id, data);
      toast.success('Hall updated successfully');
    } else {
      await createHall(data);
      toast.success('Hall created successfully');
    }
    loadHalls();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to deactivate this hall?')) return;
    try {
      await deleteHall(id);
      toast.success('Hall deactivated');
      loadHalls();
    } catch (err: any) {
      toast.error(err.message || 'Deactivation failed');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading venue catalog..." className="min-h-[60vh]" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Venue Halls Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure banquet halls, upload venue photos, adjust capacities, and assign time slot prices.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-100 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hall</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.map((hall) => {
          const img =
            hall.images?.[0] ||
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={hall.id}
              className={`bg-white rounded-2xl border ${
                hall.isActive ? 'border-slate-200' : 'border-rose-200 bg-rose-50/20 opacity-75'
              } overflow-hidden shadow-sm flex flex-col justify-between`}
            >
              <div>
                <div className="aspect-[16/10] relative bg-slate-900 overflow-hidden">
                  <img src={img} alt={hall.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3">
                    {hall.isActive ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-rose-500 text-white px-2.5 py-0.5 rounded-full shadow-sm">
                        <XCircle className="w-3 h-3" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-slate-900 line-clamp-1">
                    {hall.name}
                  </h3>
                  <p className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{hall.location || 'Central City'}</span>
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {hall.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="flex items-center space-x-1 font-medium text-slate-700">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{hall.capacity} guests</span>
                    </span>
                    <span className="font-bold text-indigo-600">
                      ₹{hall.pricePerSlot.toLocaleString('en-IN')} / slot
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  onClick={() => handleOpenEdit(hall)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center space-x-1 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {hall.isActive && (
                  <button
                    onClick={() => handleDelete(hall.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 flex items-center space-x-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Deactivate</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <HallFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingHall}
      />
    </div>
  );
};
