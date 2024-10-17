import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEventStore } from '../../../store/eventStore';
import { useProductStore } from '../../../store/productStore';
import { useCartStore } from '../../../store/cartStore';

export const PosTerminal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEventStore();
  const { products, fetchProducts } = useProductStore();
  const { cart, addToCart, removeFromCart, getTotalCredits } = useCartStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const event = events.find(event => event._id === id);

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">{event.name}</h2>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <p className="text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <p className="text-2xl font-bold">Total</p>
          <div>
            <p className="text-2xl mb-2">{getTotalCredits()} credits</p>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold w-full hover:bg-blue-600 transition-colors">
              Complete Purchase
            </button>
          </div>
        </div>

      </div>

      {products.length === 0 ? (
        <div>Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product._id} className="border p-4 shadow-md rounded">
              <div className="flex justify-between items-center">
                <h3>{product.name}</h3>
                <p>{product.price} credits</p>
              </div>
              <div className="flex justify-between mt-2">
                <button 
                  onClick={() => removeFromCart(product._id)}
                  className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-bold w-16"
                >
                  -
                </button>
                <span className="text-2xl font-bold mx-4">{cart[product._id] || 0}</span>
                <button 
                  onClick={() => addToCart(product._id)}
                  className="bg-blue-500 text-white px-6 py-3 rounded text-lg font-bold w-16"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
