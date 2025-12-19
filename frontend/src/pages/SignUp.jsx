import { Link } from "react-router-dom";
import { GraduationCapIcon, UserCheckIcon, BookOpenIcon } from "lucide-react";

export default function SignupSelect() {
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
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Account
          </h2>
          <p className="text-xl text-gray-600">
            Choose your role to get started with Classroom.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            to="/signup/student"
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-gray-200 hover:border-blue-300 group"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <GraduationCapIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Student</h3>
              <p className="text-gray-600 mb-6">
                Join classes, submit assignments, and track your progress.
              </p>
              <span className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Get Started as Student
              </span>
            </div>
          </Link>

          <Link
            to="/signup/teacher"
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 border border-gray-200 hover:border-green-300 group"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 group-hover:bg-green-200 transition-colors">
                <UserCheckIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">I'm a Teacher</h3>
              <p className="text-gray-600 mb-6">
                Create classes, assign work, and manage your students.
              </p>
              <span className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors">
                Get Started as Teacher
              </span>
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
