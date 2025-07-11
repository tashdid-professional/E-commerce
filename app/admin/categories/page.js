'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editId ? `/api/categories/${editId}` : '/api/categories';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await fetchCategories();
        setForm({ name: '' });
        setShowForm(false);
        setEditId(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name });
    setEditId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? This will also delete all products in this category.')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchCategories();
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="text-center">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Categories</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => { setShowForm(true); setEditId(null); }}
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <form className="bg-white p-6 rounded shadow mb-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <input 
              name="name" 
              value={form.name} 
              onChange={handleInput} 
              placeholder="Category Name" 
              className="border p-2 rounded" 
              required 
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (editId ? 'Update' : 'Add')} Category
            </button>
            <button 
              className="bg-gray-200 px-4 py-2 rounded" 
              type="button" 
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Product Count</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="p-3">{category.name}</td>
                <td className="p-3">{category.count}</td>
                <td className="p-3 space-x-2">
                  <button 
                    className="text-blue-600 hover:underline" 
                    onClick={() => handleEdit(category)}
                  >
                    Edit
                  </button>
                  <button 
                    className="text-red-600 hover:underline" 
                    onClick={() => handleDelete(category.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Link href="/admin" className="inline-block mt-8 text-green-600 hover:underline">← Back to Dashboard</Link>
    </div>
  );
}
