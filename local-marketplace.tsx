import React, { useState } from 'react';
import { Search, ShoppingCart, MapPin, Store, Clock, Package, Calendar, Edit, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LocalMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);
  const [isSellerView, setIsSellerView] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Sample data - in a real app this would come from an API
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "Mike's Electronics",
      distance: "0.8",
      rating: 4.5,
      products: [
        { 
          id: 1, 
          name: "Wireless Earbuds", 
          price: 89.99, 
          inStock: true,
          preorderAvailable: true,
          estimatedRestockDate: "2025-01-25",
          deliveryTime: "2-3 days",
          quantity: 5
        },
        { 
          id: 2, 
          name: "Phone Charger", 
          price: 19.99, 
          inStock: true,
          preorderAvailable: false,
          deliveryTime: "Same day",
          quantity: 15
        },
        { 
          id: 3, 
          name: "Smart Watch", 
          price: 199.99, 
          inStock: false,
          preorderAvailable: true,
          estimatedRestockDate: "2025-02-01",
          deliveryTime: "5-7 days",
          quantity: 0
        }
      ]
    }
  ]);

  const addToCart = (product, isPreorder = false) => {
    setCart([...cart, { ...product, isPreorder }]);
  };

  const updateProduct = (storeId, productId, updates) => {
    setStores(stores.map(store => {
      if (store.id === storeId) {
        return {
          ...store,
          products: store.products.map(product => 
            product.id === productId ? { ...product, ...updates } : product
          )
        };
      }
      return store;
    }));
  };

  const addNewProduct = (storeId) => {
    const newProduct = {
      id: Date.now(),
      name: "",
      price: 0,
      inStock: true,
      preorderAvailable: false,
      deliveryTime: "1-2 days",
      quantity: 0
    };
    setStores(stores.map(store => {
      if (store.id === storeId) {
        return {
          ...store,
          products: [...store.products, newProduct]
        };
      }
      return store;
    }));
    setEditingProduct(newProduct.id);
  };

  const deleteProduct = (storeId, productId) => {
    setStores(stores.map(store => {
      if (store.id === storeId) {
        return {
          ...store,
          products: store.products.filter(product => product.id !== productId)
        };
      }
      return store;
    }));
  };

  const filteredStores = stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.products.some(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsSellerView(!isSellerView)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Switch to {isSellerView ? 'Buyer' : 'Seller'} View
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search stores or products..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Store Listings */}
      <div className="grid gap-4 mb-6">
        {filteredStores.map(store => (
          <Card key={store.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Store className="text-blue-600" size={24} />
                {store.name}
              </CardTitle>
              {!isSellerView && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  {store.distance} miles away
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {store.products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                    {isSellerView && editingProduct === product.id ? (
                      // Seller Edit Form
                      <div className="w-full space-y-2">
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(store.id, product.id, { name: e.target.value })}
                          className="w-full p-2 border rounded"
                          placeholder="Product name"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => updateProduct(store.id, product.id, { price: parseFloat(e.target.value) })}
                            className="w-32 p-2 border rounded"
                            placeholder="Price"
                          />
                          <input
                            type="number"
                            value={product.quantity}
                            onChange={(e) => updateProduct(store.id, product.id, { 
                              quantity: parseInt(e.target.value),
                              inStock: parseInt(e.target.value) > 0 
                            })}
                            className="w-32 p-2 border rounded"
                            placeholder="Quantity"
                          />
                          <input
                            type="text"
                            value={product.deliveryTime}
                            onChange={(e) => updateProduct(store.id, product.id, { deliveryTime: e.target.value })}
                            className="flex-1 p-2 border rounded"
                            placeholder="Delivery time"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            <Save size={16} /> Save
                          </button>
                          <button
                            onClick={() => deleteProduct(store.id, product.id)}
                            className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">${product.price}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={14} />
                            Delivery: {product.deliveryTime}
                          </div>
                          {!product.inStock && product.preorderAvailable && (
                            <div className="text-sm text-blue-600">
                              <Calendar size={14} className="inline mr-1" />
                              Expected: {new Date(product.estimatedRestockDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isSellerView ? (
                            <button
                              onClick={() => setEditingProduct(product.id)}
                              className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
                            >
                              <Edit size={16} /> Edit
                            </button>
                          ) : (
                            <>
                              {product.inStock ? (
                                <button
                                  onClick={() => addToCart(product)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                  Add to Cart
                                </button>
                              ) : product.preorderAvailable ? (
                                <button
                                  onClick={() => addToCart(product, true)}
                                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                  Pre-order
                                </button>
                              ) : (
                                <span className="flex items-center gap-1 text-red-500">
                                  <Package size={16} />
                                  Out of Stock
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {isSellerView && (
                  <button
                    onClick={() => addNewProduct(store.id)}
                    className="flex items-center justify-center gap-2 p-2 border rounded border-dashed text-gray-500 hover:bg-gray-50"
                  >
                    <Plus size={20} />
                    Add New Product
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Shopping Cart - Only visible in buyer view */}
      {!isSellerView && (
        <Card className="sticky bottom-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart size={24} />
              Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length > 0 ? (
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span>{item.name}</span>
                      {item.isPreorder && (
                        <span className="ml-2 text-sm text-blue-600">(Pre-order)</span>
                      )}
                    </div>
                    <span>${item.price}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Pay in App
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
                    Pay at Store
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">Your cart is empty</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocalMarketplace;