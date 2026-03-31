import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center mb-8 bg-white p-4 rounded-xl shadow-sm border">
      <ul className="flex flex-wrap space-x-2 sm:space-x-8 items-center text-sm font-bold">
        <li>
          {step1 ? (
            <Link to="/login" className="text-gray-900 border-b-2 border-gray-900 pb-1">Sign In</Link>
          ) : (
            <span className="text-gray-400">Sign In</span>
          )}
        </li>
        <li className="text-gray-400 text-xs">❯</li>
        <li>
          {step2 ? (
            <Link to="/shipping" className="text-gray-900 border-b-2 border-gray-900 pb-1">Shipping</Link>
          ) : (
            <span className="text-gray-400">Shipping</span>
          )}
        </li>
        <li className="text-gray-400 text-xs">❯</li>
        <li>
          {step3 ? (
            <Link to="/payment" className="text-gray-900 border-b-2 border-gray-900 pb-1">Payment</Link>
          ) : (
            <span className="text-gray-400">Payment</span>
          )}
        </li>
        <li className="text-gray-400 text-xs">❯</li>
        <li>
          {step4 ? (
            <Link to="/placeorder" className="text-gray-900 border-b-2 border-gray-900 pb-1">Place Order</Link>
          ) : (
            <span className="text-gray-400">Place Order</span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;
