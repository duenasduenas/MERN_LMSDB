import { Link } from "react-router-dom";
import { UserIcon, BookOpenIcon, PlusIcon, UsersIcon } from "lucide-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpenIcon className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Classroom</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Classroom
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Organize your classes, share assignments, and collaborate with ease.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-md"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              Sign in to Classroom
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create a class
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <BookOpenIcon className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Organize Classes</h3>
            </div>
            <p className="text-gray-600">
              Keep all your classes in one place with easy access to assignments, announcements, and grades.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <UsersIcon className="w-8 h-8 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Collaborate</h3>
            </div>
            <p className="text-gray-600">
              Work together with teachers and students through shared documents and real-time feedback.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <PlusIcon className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Get Started</h3>
            </div>
            <p className="text-gray-600">
              New to Classroom? Sign up today and start creating or joining classes instantly.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to dive in? Sign in or create an account to begin.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow-lg"
          >
            Go to Classroom
          </Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
