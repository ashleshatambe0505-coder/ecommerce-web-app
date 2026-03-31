import { useGetProductsQuery } from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div className="text-center mt-10">Loading Products...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error loading products</div>;

  return (
    <div className="max-w-6xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button className="bg-gray-900 text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition">
          + Create Product
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden text-sm md:text-base">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product._id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListScreen;
