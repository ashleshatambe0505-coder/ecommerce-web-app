import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '../slices/ordersApiSlice';
import { useSelector } from 'react-redux';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: isPaying, error: payError }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleUpiPayment = async () => {
    try {
      await payOrder({
        orderId,
        details: {
          id: 'mock_upi_' + Date.now().toString(),
          status: 'succeeded',
          update_time: new Date().toISOString(),
          receipt_email: order.user.email,
        },
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading Order...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error.data?.message || error.error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 break-all">Order: {order._id}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Shipping Information</h2>
            <p className="text-gray-700 mb-2"><strong>Name: </strong> {order.user.name}</p>
            <p className="text-gray-700 mb-4"><strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">{order.user.email}</a></p>
            <p className="text-gray-700 mb-4">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-800 px-4 py-3 rounded border border-green-200">Delivered on {order.deliveredAt}</div>
            ) : (
              <div className="bg-red-100 text-red-800 px-4 py-3 rounded border border-red-200">Not Delivered</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Payment Status</h2>
            <p className="text-gray-700 mb-4">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 px-4 py-3 rounded border border-green-200">Paid on {order.paidAt}</div>
            ) : (
              <div className="bg-red-100 text-red-800 px-4 py-3 rounded border border-red-200">Not Paid</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
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
          </div>
        </div>

        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md border sticky top-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-gray-600">Items:</span> <span className="font-semibold">${order.itemsPrice}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Shipping:</span> <span className="font-semibold">${order.shippingPrice}</span></div>
              <div className="flex justify-between border-b pb-3"><span className="text-gray-600">Tax:</span> <span className="font-semibold">${order.taxPrice}</span></div>
              <div className="flex justify-between items-center text-lg"><span className="font-bold text-gray-900">Total:</span> <span className="font-bold text-gray-900">${order.totalPrice}</span></div>
            </div>
            
            {!order.isPaid && (
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded text-center hover:bg-blue-700 transition"
                  onClick={handleUpiPayment}
                  disabled={isPaying}
                >
                  {isPaying ? 'Processing Payment...' : 'Complete Mock UPI Payment'}
                </button>
                {payError && <div className="text-red-500 font-bold mt-2 text-center">{payError?.data?.message || payError?.error || 'Failed to update order status!'}</div>}
              </div>
            )}
            
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <div className="mt-4">
                <button
                  type="button"
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded text-center hover:bg-gray-800 transition"
                  onClick={deliverHandler}
                  disabled={loadingDeliver}
                >
                  {loadingDeliver ? 'Marking as Delivered...' : 'Mark As Delivered'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
