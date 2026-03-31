import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="md:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Shipping</h2>
            <p className="text-gray-700">
              <strong>Address: </strong>
              {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{' '}
              {cart.shippingAddress.country}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
            <p className="text-gray-700">
              <strong>Method: </strong>
              {cart.paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <div className="text-red-500">Your cart is empty</div>
            ) : (
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 border-b pb-4 last:border-b-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <Link to={`/product/${item.product}`} className="flex-1 font-semibold text-gray-800 hover:underline line-clamp-1">
                      {item.name}
                    </Link>
                    <div className="font-bold text-gray-700 whitespace-nowrap">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border sticky top-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-gray-600">Items:</span> <span className="font-semibold">${cart.itemsPrice}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping:</span> <span className="font-semibold">${cart.shippingPrice}</span></div>
              <div className="flex justify-between border-b pb-3"><span className="text-gray-600">Tax:</span> <span className="font-semibold">${cart.taxPrice}</span></div>
              <div className="flex justify-between items-center text-lg"><span className="font-bold text-gray-900">Total:</span> <span className="font-bold text-gray-900">${cart.totalPrice}</span></div>
            </div>
            
            {error && <div className="mb-4 text-red-600 bg-red-100 p-2 text-sm rounded">{error.data?.message || 'Error occurred'}</div>}
            
            <button
              type="button"
              disabled={cart.cartItems.length === 0 || isLoading}
              className={`w-full py-3 px-4 rounded font-bold text-white transition ${
                cart.cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
              }`}
              onClick={placeOrderHandler}
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderScreen;
