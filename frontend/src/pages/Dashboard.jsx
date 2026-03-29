import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskForm, setTaskForm] = useState({ title: "", description: "", status: "pending", priority: "medium" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await updateTask(editingId, taskForm);
        setSuccess("Task updated successfully");
      } else {
        await createTask(taskForm);
        setSuccess("Task created successfully");
      }
      setTaskForm({ title: "", description: "", status: "pending", priority: "medium" });
      setEditingId(null);
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Task operation failed");
    }
  };

  const handleEdit = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority
    });
    setEditingId(task._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setSuccess("Task deleted successfully");
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/3 w-96 h-96 ${isAdmin ? "bg-amber-500/8" : "bg-purple-500/8"} rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 ${isAdmin ? "bg-orange-500/8" : "bg-blue-500/8"} rounded-full blur-3xl animate-pulse [animation-delay:2s]`} />
      </div>

      {/* Navbar */}
      <nav className="relative border-b border-white/5 backdrop-blur-lg bg-white/2">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${isAdmin ? "from-amber-500 to-orange-500" : "from-purple-500 to-blue-500"} flex items-center justify-center`}>
              {isAdmin ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              {isAdmin ? "Admin Panel" : "Dashboard"}
            </span>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              isAdmin ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-blue-500/15 text-blue-400 border border-blue-500/20"
            }`}>
              {user?.role || "user"}
            </span>
          </div>
          <button onClick={handleLogout} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 text-sm font-medium">
            Sign out
          </button>
        </div>
      </nav>

      <main className="relative max-w-6xl mx-auto px-6 py-12">
        {/* User Stats Card */}
        <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl ${isAdmin ? "shadow-amber-500/5" : "shadow-purple-500/5"}`}>
          <div className="flex items-center gap-5 mb-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isAdmin ? "from-amber-500 to-orange-500" : "from-purple-500 to-blue-500"} flex items-center justify-center text-2xl font-bold shadow-lg`}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome, {user?.name}</h2>
              <p className="text-white/40 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100">{error}</div>}
        {success && <div className="mb-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-100">{success}</div>}

        {/* Task Form Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Manage Tasks</h3>
          <button 
            onClick={() => { setShowForm(!showForm); setEditingId(null); setTaskForm({ title: "", description: "", status: "pending", priority: "medium" }); }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${showForm ? 'bg-red-500/20 border border-red-500/50 text-red-100' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
          >
            {showForm ? "Cancel" : editingId ? "Edit Task" : "+ Add Task"}
          </button>
        </div>

        {/* Task Form */}
        {showForm && (
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
            <h4 className="text-lg font-bold mb-4">{editingId ? "Update Task" : "Create New Task"}</h4>
            <form onSubmit={handleSubmitTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-white/60 mb-1">Title</label>
                <input 
                  type="text" required 
                  value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea 
                  value={taskForm.description} onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Status</label>
                <select 
                  value={taskForm.status} onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none"
                >
                  <option value="pending" className="bg-slate-900">Pending</option>
                  <option value="in-progress" className="bg-slate-900">In Progress</option>
                  <option value="completed" className="bg-slate-900">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Priority</label>
                <select 
                  value={taskForm.priority} onChange={(e) => setTaskForm({...taskForm, priority: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none"
                >
                  <option value="low" className="bg-slate-900">Low</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="high" className="bg-slate-900">High</option>
                </select>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                  {editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="md:col-span-2 text-center py-10 text-white/40 italic">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="md:col-span-2 text-center py-10 text-white/40 border border-dashed border-white/10 rounded-3xl">No tasks yet. Create one above!</div>
          ) : (
            tasks.map(task => (
              <div key={task._id} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 group hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold ${
                      task.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : 
                      task.status === "in-progress" ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/60"
                    }`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] uppercase font-bold ${
                      task.priority === "high" ? "bg-red-500/20 text-red-400" : 
                      task.priority === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-slate-500/20 text-slate-400"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  {isAdmin && task.user && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/40">Owner: {task.user.name}</span>
                  )}
                </div>
                <h4 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap mb-1">{task.title}</h4>
                <p className="text-sm text-white/40 h-10 overflow-hidden line-clamp-2">{task.description || "No description"}</p>
                
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(task)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-blue-400 hover:bg-blue-400/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
                  <button onClick={() => handleDelete(task._id)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-red-400 hover:bg-red-400/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg></button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="text-center py-10 text-white/10 text-xs">
        © 2026 AdminDash Task Manager • Secure JWT Authentication
      </footer>
    </div>
  );
}
