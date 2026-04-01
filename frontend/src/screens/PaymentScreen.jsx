import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <CheckoutSteps step1 step2 step3 />
      <div className="bg-white p-8 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Payment Method</h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-4 cursor-pointer">Select Method</label>
            <div className="flex items-center mb-4 bg-gray-50 p-4 rounded-xl border">
              <input
                type="radio"
                className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                id="UPI"
                name="paymentMethod"
                value="UPI"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="UPI" className="ml-3 block text-gray-800 font-bold">
                Mock UPI Simulator
              </label>
            </div>
            {/* Can add Paypal here as well */}
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition">
            Continue To Summary
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
