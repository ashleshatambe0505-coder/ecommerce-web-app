import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  const { data: orders, isLoading: loadingOrders, error: errorOrders } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
        dispatch(setCredentials(res));
        setMessage(null);
        setSuccessMsg('Profile Updated Successfully! If your account was upgraded, log out and back in to see the Admin dashboard.');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        setMessage(err?.data?.message || err.error);
        setSuccessMsg(null);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      <div className="flex flex-col md:flex-row md:space-x-8">
        
        {/* Profile Update Section */}
        <div className="md:w-1/3">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">User Profile</h2>
          
          {message && <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 font-semibold">{message}</div>}
          {successMsg && <div className="bg-green-100 text-green-800 px-4 py-3 rounded mb-4 font-semibold text-sm">{successMsg}</div>}

          <form onSubmit={submitHandler} className="bg-white p-6 rounded-2xl shadow-xl border">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Name</label>
              <input
                type="text"
                placeholder="Enter new name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Email Address</label>
              <input
                type="email"
                placeholder="Enter new email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Password</label>
              <input
                type="password"
                placeholder="Enter new password (optional)"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loadingUpdateProfile}
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition"
            >
              Update Profile
            </button>
            {loadingUpdateProfile && <div className="text-center mt-2 text-sm text-gray-500">Updating...</div>}
          </form>
        </div>

        {/* My Orders Section */}
        <div className="md:w-2/3 mt-8 md:mt-0">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>
          
          {loadingOrders ? (
            <div className="text-center text-gray-600 mt-10">Loading orders...</div>
          ) : errorOrders ? (
            <div className="text-center text-red-500">{errorOrders?.data?.message || errorOrders.error}</div>
          ) : orders.length === 0 ? (
            <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded text-center">You have no orders right now.</div>
          ) : (
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">ID</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">DATE</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase">TOTAL</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase text-center">PAID</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase text-center">DELIVERED</th>
                      <th className="px-6 py-4 font-bold text-gray-600 text-sm uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-700 font-mono">{order._id.substring(0, 10)}...</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.createdAt.substring(0, 10)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.totalPrice}</td>
                        <td className="px-6 py-4 text-center">
                          {order.isPaid ? (
                            <span className="text-green-600 cursor-pointer" title={order.paidAt.substring(0, 10)}>
                              <FaCheck className="inline" />
                            </span>
                          ) : (
                            <span className="text-red-500"><FaTimes className="inline" /></span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {order.isDelivered ? (
                            <span className="text-green-600 cursor-pointer" title={order.deliveredAt.substring(0, 10)}>
                              <FaCheck className="inline" />
                            </span>
                          ) : (
                            <span className="text-red-500"><FaTimes className="inline" /></span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/order/${order._id}`} className="bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-bold py-1.5 px-3 rounded text-sm shadow-sm inline-block">
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default ProfileScreen;
