"use client";
import { useState, useEffect } from "react";
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, Upload, X } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", department: "", priority: "medium", due_date: "" });
  const [busy, setBusy] = useState(false);
  
  // Evidence state
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileDesc, setFileDesc] = useState("");

  async function loadTasks() {
    try {
      const res = await fetch("/api/tasks/list");
      const data = await res.json();
      if (data.tasks) setTasks(data.tasks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTasks(); }, []);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });
      if (!res.ok) throw new Error("Failed to create");
      setShowNew(false);
      setNewTask({ title: "", description: "", department: "", priority: "medium", due_date: "" });
      loadTasks();
    } catch (e) { alert((e as Error).message); } finally { setBusy(false); }
  }

  async function updateStatus(id: string, status: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (selectedTask?.id === id) setSelectedTask({...selectedTask, status});
  }

  async function openTask(task: any) {
    setSelectedTask(task);
    setEvidenceList([]);
    setFile(null);
    setFileDesc("");
    
    // Fetch evidence for this task
    const res = await fetch(`/api/evidence/${task.id}`);
    const data = await res.json();
    if (data.evidence) setEvidenceList(data.evidence);
  }

  async function uploadEvidence(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !selectedTask) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("task_id", selectedTask.id);
    formData.append("description", fileDesc);

    try {
      const res = await fetch("/api/evidence", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      
      // Refresh evidence list
      const refreshRes = await fetch(`/api/evidence/${selectedTask.id}`);
      const refreshData = await refreshRes.json();
      setEvidenceList(refreshData.evidence || []);
      setFile(null);
      setFileDesc("");
    } catch (e) { alert((e as Error).message); } finally { setUploading(false); }
  }

  const columns = [
    { id: "not_started", label: "Not Started", icon: Circle, color: "text-gray-500" },
    { id: "in_progress", label: "In Progress", icon: Clock, color: "text-blue-500" },
    { id: "blocked", label: "Blocked", icon: AlertCircle, color: "text-red-500" },
    { id: "completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-8 h-full flex flex-col pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Action Center</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage compliance tasks and attach evidence.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="inline-flex items-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 font-medium hover:opacity-80 transition shadow-sm w-full md:w-auto justify-center">
          <Plus size={18} /> New Task
        </button>
      </header>

      {/* New Task Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={createTask} className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold">Create Task</h2>
            <input required placeholder="Task Title" className="w-full rounded border p-3" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
            <textarea placeholder="Description" className="w-full rounded border p-3" rows={2} value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Department" className="w-full rounded border p-3" value={newTask.department} onChange={e => setNewTask({...newTask, department: e.target.value})} />
              <select className="w-full rounded border p-3" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <input type="date" className="w-full rounded border p-3" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNew(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={busy} className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg">{busy ? "Saving..." : "Create Task"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Task Detail / Evidence Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{selectedTask.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedTask.department} · {selectedTask.priority} priority</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Status changer */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Status</label>
                <select 
                  className="w-full md:w-auto rounded border p-2 text-sm"
                  value={selectedTask.status}
                  onChange={(e) => updateStatus(selectedTask.id, e.target.value)}
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Evidence Section */}
              <div>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Upload size={16}/> Attached Evidence</h3>
                
                {evidenceList.length === 0 ? (
                  <p className="text-sm text-gray-500 italic mb-4">No evidence attached yet.</p>
                ) : (
                  <ul className="space-y-2 mb-4">
                    {evidenceList.map(e => (
                      <li key={e.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                        <span className="font-medium truncate">{e.file_name}</span>
                        <a href={`https://ncbtyjxayxzoekhqnqcn.supabase.co/storage/v1/object/public/evidence/${e.file_path}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Download</a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Upload form */}
                <form onSubmit={uploadEvidence} className="mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl space-y-3">
                  <input required type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm block w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-black file:text-white" />
                  <input placeholder="Short description (optional)" className="w-full rounded border p-2 text-sm" value={fileDesc} onChange={e => setFileDesc(e.target.value)} />
                  <button disabled={!file || uploading} type="submit" className="w-full rounded bg-black dark:bg-white text-white dark:text-black px-4 py-2 font-medium disabled:opacity-50">
                    {uploading ? "Uploading..." : "Upload Evidence"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 items-start pb-4">
        {columns.map(col => (
          <div key={col.id} className="bg-gray-100/50 dark:bg-gray-900/50 rounded-2xl p-4 min-h-[400px] border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4 px-1">
              <col.icon size={16} className={col.color} />
              <h3 className="font-semibold text-sm">{col.label}</h3>
              <span className="ml-auto text-xs font-bold bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {tasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div key={task.id} onClick={() => openTask(task)} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer">
                  <p className="font-semibold text-sm leading-tight mb-2">{task.title}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.department && <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{task.department}</span>}
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>{task.priority}</span>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4 italic">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}