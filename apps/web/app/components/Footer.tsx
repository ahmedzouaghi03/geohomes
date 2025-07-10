export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sousse Planner</h3>
            <p className="text-gray-400">
              The leading real estate marketplace in Tunisia.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="aboutUs" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <p className="text-gray-400">Email: contact@sousseplanner.com</p>
            <p className="text-gray-400">Phone: +216 29 389 994</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Sousse Planner. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
