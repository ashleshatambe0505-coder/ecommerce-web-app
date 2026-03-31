import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide">
          ProShop
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/cart"
            className="flex items-center text-gray-300 hover:text-white transition group relative"
          >
            <FaShoppingCart className="mr-2 group-hover:scale-110 transition-transform" />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          
          {userInfo ? (
            <div className="relative group">
              <button className="flex items-center text-gray-300 hover:text-white transition">
                <FaUser className="mr-2" />
                <span>{userInfo.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 hidden group-hover:block">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                {userInfo.isAdmin && (
                  <>
                    <div className="border-t my-1"></div>
                    <span className="block px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Admin</span>
                    <Link to="/admin/productlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Products</Link>
                    <Link to="/admin/userlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Users</Link>
                    <Link to="/admin/orderlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                    <div className="border-t my-1"></div>
                  </>
                )}
                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center text-gray-300 hover:text-white transition group"
            >
              <FaUser className="mr-2 group-hover:scale-110 transition-transform" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
