import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase-config';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchTasks(currentUser.uid);
    }
  }, []);

  const fetchTasks = (userId) => {
    const taskRef = query(collection(db, 'tasks'), where('userId', '==', userId));
    onSnapshot(taskRef, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '' || newTaskDescription.trim() === '') {
      alert('Title and Description cannot be empty');
      return;
    }
    try {
      setLoading(true);
      const taskRef = collection(db, 'tasks');
      await addDoc(taskRef, {
        title: newTaskTitle,
        description: newTaskDescription,
        userId: user.uid,
        createdAt: new Date(),
      });
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error adding task: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (taskId, title, description) => {
    setIsEditing(true);
    setCurrentTaskId(taskId);
    setUpdatedTitle(title);
    setUpdatedDescription(description);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (updatedTitle.trim() === '' || updatedDescription.trim() === '') {
      alert('Title and Description cannot be empty');
      return;
    }
    try {
      const taskRef = doc(db, 'tasks', currentTaskId);
      await updateDoc(taskRef, {
        title: updatedTitle,
        description: updatedDescription,
      });
      setIsEditing(false);
      setCurrentTaskId(null);
      setUpdatedTitle('');
      setUpdatedDescription('');
    } catch (error) {
      console.error('Error updating task: ', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="task-manager-container p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="header mb-6 text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Task Manager</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>

      {/* Add New Task Section */}
      <div className="add-task-section mb-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Add New Task</h2>
        <form onSubmit={handleAddTask} className="space-y-4">
          <input
            type="text"
            placeholder="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </div>

      {/* Search Section */}
      <div className="search-task mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tasks"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Edit Task Section */}
      {isEditing && (
        <div className="edit-task-section mb-6">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">Edit Task</h2>
          <form onSubmit={handleUpdateTask}>
            <input
              type="text"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-yellow-500"
            />
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {/* Task List Section */}
      <div className="task-list">
        <h2 className="text-2xl font-bold mb-4 text-purple-600">Task List</h2>
        {tasks
          .filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-md mb-4 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() =>
                    handleEditTask(task.id, task.title, task.description)
                  }
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TaskManager;