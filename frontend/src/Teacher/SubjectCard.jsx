import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { PenSquareIcon, BookOpenIcon, UsersIcon, ArrowLeftIcon, TrashIcon, CheckIcon, XIcon, UploadIcon, EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ToggleEnrollement from "../components/ToggleEnrollment.jsx";
import removeStudent from "../components/RemoveStudent.jsx";
import UnenrollBtn from "../components/RemoveSubject.jsx";
import DeleteActivity from "../components/activity/DeleteActivity.jsx";

function SubjectCard() {
  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ subject: "", code: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5001/api/subject/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubject(res.data.subject);
        setEditForm({
          subject: res.data.subject.subject,
          code: res.data.subject.code,
        });
      } catch (error) {
        console.error(error.response?.data || error.message);
        alert("Failed to fetch subject");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:5001/api/subject/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubject((prev) => ({ ...prev, ...editForm }));
      setEditing(false);
      alert(res.data.message || "Subject updated successfully!");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to update subject");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteActivity = (activityId) => {
    setSubject((prev) => ({
      ...prev,
      activity: prev.activity.filter((a) => a._id !== activityId),
    }));
  };

  const handleRemoveLocal = (studentId) => {
    setSubject((prev) => ({
      ...prev,
      student: prev.student.filter((s) => s._id !== studentId),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subject...</p>
        </div>
      </div>
    );
  }

  if (!subject) return <p className="text-center text-gray-500">Subject not found.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Classroom</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/teacher/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Dashboard
            </Link>
            {subject._id && <UnenrollBtn code={subject.code} />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Subject Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              {editing ? (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={editForm.subject}
                      onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                    <input
                      type="text"
                      value={editForm.code}
                      onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updating}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckIcon className="w-5 h-5 mr-2" /> {updating ? "Updating..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      <XIcon className="w-5 h-5 mr-2" /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-3xl font-bold text-gray-900">{subject.subject}</h2>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                    >
                      <PenSquareIcon className="w-4 h-4 mr-1" /> Edit
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">Subject Code: {subject.code}</p>
                  {subject._id && <ToggleEnrollement subjectId={subject._id} />}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to={`/upload-lesson/${id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block"
          >
            <div className="flex items-center">
              <UploadIcon className="w-10 h-10 text-blue-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Upload Lesson</h3>
                <p className="text-gray-600">Add new lessons for students</p>
              </div>
            </div>
          </Link>
          <Link
            to={`/enrolled-students/${id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block"
          >
            <div className="flex items-center">
              <EyeIcon className="w-10 h-10 text-green-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Enrolled Students</h3>
                <p className="text-gray-600">View and manage students</p>
              </div>
            </div>
          </Link>
          <Link
            to={`/create-activity/${subject._id}`}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 block"
          >
            <div className="flex items-center">
              <PenSquareIcon className="w-10 h-10 text-purple-600 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Activity</h3>
                <p className="text-gray-600">Assign tasks to students</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Students Section */}
        {subject.student && subject.student.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6 gap-2">
              <UsersIcon className="w-6 h-6 text-gray-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Enrolled Students</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subject.student.map((stud) => (
                <div
                  key={stud._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {stud.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-gray-900">{stud.name}</span>
                  </div>
                  <button
                    onClick={() => removeStudent(stud._id, subject._id, handleRemoveLocal)}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Section */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-900">Classwork</h3>
            </div>
          </div>

          {subject.activity && subject.activity.length > 0 ? (
            <div className="space-y-4">
              {subject.activity.map((act) => (
                <Link
                  key={act._id}
                  to={`/activity/${act._id}`}
                  className="group block bg-gray-50 rounded-lg hover:bg-blue-50 border border-gray-200 hover:border-blue-300 transition-all duration-200 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <BookOpenIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-blue-600">{act.activity}</p>
                        <p className="text-sm text-gray-500">
                          Posted {new Date(act.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DeleteActivity
                        activityId={act._id}
                        onDelete={handleDeleteActivity}
                      />
                      <span className="text-sm font-medium text-blue-600">View activity</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="w-14 h-14 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No activities yet</p>
              <p className="text-gray-400 mt-1">Create an activity to start classwork</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SubjectCard;