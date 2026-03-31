import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-500 flex items-center">
              {'★'.repeat(Math.round(product.rating))}
              <span className="text-gray-300">
                {'★'.repeat(5 - Math.round(product.rating))}
              </span>
            </span>
            <span className="text-sm text-gray-500">
              ({product.numReviews} reviews)
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">${product.price}</h2>
      </div>
    </div>
  );
};

export default Product;
