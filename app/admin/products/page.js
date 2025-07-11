'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    description: '',
    features: '',
    inStock: true
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInput = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setForm(f => ({ ...f, image: data.imageUrl }));
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        features: form.features.split(',').map(f => f.trim()).filter(f => f),
      };

      const url = editId ? `/api/products/${editId}` : '/api/products';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        await fetchProducts();
        setForm({ name: '', price: '', originalPrice: '', image: '', category: '', description: '', features: '', inStock: true });
        setShowForm(false);
        setEditId(null);
        setImagePreview(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image,
      category: product.category,
      description: product.description,
      features: product.features.join(', '),
      inStock: product.inStock
    });
    setEditId(product.id);
    setShowForm(true);
    setImagePreview(product.image);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchProducts();
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => { 
            setShowForm(true); 
            setEditId(null); 
            setForm({ name: '', price: '', originalPrice: '', image: '', category: '', description: '', features: '', inStock: true });
            setImagePreview(null);
          }}
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <form className="bg-white p-6 rounded shadow mb-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleInput} placeholder="Name" className="border p-2 rounded" required />
            <input name="price" value={form.price} onChange={handleInput} placeholder="Price" type="number" step="0.01" className="border p-2 rounded" required />
            <input name="originalPrice" value={form.originalPrice} onChange={handleInput} placeholder="Original Price" type="number" step="0.01" className="border p-2 rounded" />
            
            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={uploading}
                  />
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                  {uploading && <p className="mt-1 text-xs text-blue-600">Uploading...</p>}
                </div>
                {(imagePreview || form.image) && (
                  <div className="w-20 h-20 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={imagePreview || form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              {/* Fallback URL input */}
              <div className="mt-2">
                <input 
                  name="image" 
                  value={form.image} 
                  onChange={handleInput} 
                  placeholder="Or enter image URL manually" 
                  className="w-full border p-2 rounded text-sm" 
                />
              </div>
            </div>

            <select name="category" value={form.category} onChange={handleInput} className="border p-2 rounded" required>
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <input name="features" value={form.features} onChange={handleInput} placeholder="Features (comma separated)" className="border p-2 rounded" />
            <input name="description" value={form.description} onChange={handleInput} placeholder="Description" className="border p-2 rounded md:col-span-2" required />
            <label className="flex items-center space-x-2 md:col-span-2">
              <input type="checkbox" name="inStock" checked={form.inStock} onChange={handleInput} />
              <span>In Stock</span>
            </label>
          </div>
          <div className="mt-4 flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit" disabled={loading || uploading}>
              {loading ? 'Saving...' : (editId ? 'Update' : 'Add')} Product
            </button>
            <button 
              className="bg-gray-200 px-4 py-2 rounded" 
              type="button" 
              onClick={() => {
                setShowForm(false);
                setImagePreview(null);
              }}
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
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/48/48';
                      }}
                    />
                  </div>
                </td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">${product.price}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.inStock ? 'Yes' : 'No'}</td>
                <td className="p-3 space-x-2">
                  <button className="text-blue-600 hover:underline" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Link href="/admin" className="inline-block mt-8 text-blue-600 hover:underline">← Back to Dashboard</Link>
    </div>
  );
}
