import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error.data?.message || 'Error loading product'}</div>;

  return (
    <>
      <Link className="bg-gray-200 text-gray-800 px-4 py-2 rounded mb-6 inline-block hover:bg-gray-300 transition" to="/">
        Go Back
      </Link>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img src={product.image} alt={product.name} className="w-full rounded-2xl shadow-md" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h2>
          <div className="border-t border-b py-4 my-2">
            <p className="text-2xl font-semibold text-gray-900">${product.price}</p>
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between mb-4 border-b pb-2">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>
            
            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <span className="font-semibold text-gray-700">Qty:</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-white border rounded px-3 py-1 outline-none"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className={`w-full py-3 rounded text-white font-bold transition ${
                product.countInStock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800'
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductScreen;
