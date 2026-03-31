import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-tight">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="bg-blue-100 p-4 rounded text-blue-800 shadow-sm">
            Your cart is empty.{' '}
            <Link to="/" className="font-bold underline hover:text-blue-900">
              Go Back
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-white shadow-sm rounded-xl border">
                <div className="flex items-center space-x-4 w-1/2">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <Link to={`/product/${item._id}`} className="font-semibold text-gray-800 hover:underline line-clamp-1 text-sm sm:text-base">
                    {item.name}
                  </Link>
                </div>
                <div className="w-1/6 text-gray-900 font-bold">${item.price}</div>
                <div className="w-1/6">
                  <select
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="p-1 border rounded bg-gray-50 outline-none w-full"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-1/6 text-right">
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="md:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-md border sticky top-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-4 text-gray-800">
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
          </h2>
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
          </div>
          <button
            onClick={checkoutHandler}
            disabled={cartItems.length === 0}
            className={`w-full py-3 px-4 rounded font-bold text-white transition ${
              cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
