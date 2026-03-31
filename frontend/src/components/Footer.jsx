const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 text-center">
      <div className="container mx-auto px-4">
        <p>ProShop &copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
