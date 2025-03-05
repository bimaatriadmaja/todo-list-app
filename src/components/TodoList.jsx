import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTrash, FaSearch } from "react-icons/fa";
import { dummyTodos } from "../data/dummyTodos";

const TodoList = () => {
  const [todos, setTodos] = useState(dummyTodos); // Gunakan data dummy sebagai state awal
  const [inputValue, setInputValue] = useState("");
  const [editId, setEditId] = useState(null); // ID item yang sedang diedit
  const [editText, setEditText] = useState(""); // Teks yang sedang diedit
  const [searchQuery, setSearchQuery] = useState(""); // State untuk pencarian
  const [activeTab, setActiveTab] = useState("All"); // State untuk tab aktif

  // Load todos from local storage on component mount
  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || dummyTodos; // Gunakan data dummy jika tidak ada data di local storage
    setTodos(savedTodos);
  }, []);

  // Save todos to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Fungsi untuk menambahkan to-do
  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([
        { id: Date.now(), text: inputValue, completed: false },
        ...todos,
      ]);
      setInputValue("");
    }
  };  

  // Fungsi untuk menyimpan perubahan pada to-do yang diedit
  const saveEditedTodo = (id) => {
    if (editText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditId(null); // Reset mode edit
      setEditText("");
    }
  };

  // Fungsi untuk menandai to-do sebagai selesai/belum selesai
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Fungsi untuk menghapus to-do
  const deleteTodo = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };
  

  // Fungsi untuk menghapus semua tugas yang sudah selesai
  const handleDeleteDoneTasks = () => {
    const confirmed = window.confirm("Are you sure you want to delete all done tasks?");
    if (confirmed) {
      setTodos(todos.filter((todo) => !todo.completed));
    }
  };

  // Fungsi untuk menghapus semua tugas
  const handleDeleteAllTasks = () => {
    const confirmed = window.confirm("Are you sure you want to delete all tasks?");
    if (confirmed) {
      setTodos([]);
    }
  };

  // Fungsi untuk memfilter to-do berdasarkan search query
  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fungsi untuk memfilter to-do berdasarkan tab aktif
  const getFilteredTodosByTab = () => {
    switch (activeTab) {
      case "Done":
        return filteredTodos.filter((todo) => todo.completed);
      case "Todo":
        return filteredTodos.filter((todo) => !todo.completed);
      default:
        return filteredTodos;
    }
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-8 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg md:rounded-xl text-white">
      <h1 className="text-3xl font-semibold mb-6 text-center">To-Do List</h1>

      {/* Form Input untuk Menambah Todo */}
      <div className="flex flex-col sm:flex-row items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4 bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new task"
          className="w-full sm:w-[calc(100%-100px)] p-4 rounded-lg text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition-all duration-300"
        />
        <button
          onClick={addTodo}
          className="w-full sm:w-24 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Add
        </button>
      </div>

      {/* Form Input untuk Pencarian */}
      <div className="flex items-center mb-6 bg-white p-4 rounded-xl shadow-lg max-w-md mx-auto">
        <FaSearch className="text-gray-400 mr-2" /> {/* Ikon Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full p-2 rounded-lg text-gray-800 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md transition-all duration-300"
        />
      </div>

      {/* Tab untuk All, Done, dan Todo */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
          onClick={() => setActiveTab("All")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "All"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("Done")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "Done"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 hover:bg-green-100"
          }`}
        >
          Done
        </button>
        <button
          onClick={() => setActiveTab("Todo")}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            activeTab === "Todo"
              ? "bg-yellow-600 text-white"
              : "bg-white text-yellow-600 hover:bg-yellow-100"
          }`}
        >
          Todo
        </button>
      </div>

      {/* Daftar Todo */}
      <ul>
        {getFilteredTodosByTab().length === 0 ? (
          <p className="text-center text-white">No tasks found.</p>
        ) : (
          getFilteredTodosByTab().map((todo) => (
            <li
              key={todo.id}
              className="text-black flex items-center justify-between p-4 mb-4 bg-white bg-opacity-70 rounded-xl shadow-lg transition-all duration-300 hover:bg-opacity-90"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`px-4 py-2 text-white rounded-full ${
                  todo.completed ? "bg-green-500" : "bg-gray-500"
                } hover:bg-green-400 transition-all duration-300`}
              >
                {todo.completed ? "✔️" : "✅"}
              </button>

              {/* Teks Todo atau Input */}
              {editId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && saveEditedTodo(todo.id)}
                  className="flex-1 p-2 ml-2 mr-2 border border-gray-300 rounded-lg w-full sm:w-[calc(100%-100px)]"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 text-lg ml-2 ${
                    todo.completed ? "line-through text-red-400" : ""
                  }`}
                >
                  {todo.text}
                </span>
              )}

              {/* Tombol Edit, Save, dan Hapus dalam bentuk Ikon */}
              <div className="flex items-center space-x-4">
                {editId === todo.id ? (
                  <button
                    onClick={() => saveEditedTodo(todo.id)}
                    className="text-green-500 hover:text-green-700 transition-all duration-300"
                  >
                    <FaSave size={20} /> {/* Ikon Save */}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(todo.id);
                      setEditText(todo.text);
                    }}
                    className="text-yellow-500 hover:text-yellow-700 transition-all duration-300"
                  >
                    <FaEdit size={20} /> {/* Ikon Edit */}
                  </button>
                )}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 transition-all duration-300"
                >
                  <FaTrash size={20} /> {/* Ikon Hapus */}
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {/* Tombol Delete Done Tasks dan Delete All Tasks */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handleDeleteDoneTasks}
          className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 transition-all duration-300"
        >
          Delete Done Tasks
        </button>
        <button
          onClick={handleDeleteAllTasks}
          className="px-6 py-2 bg-red-700 text-white rounded-lg font-semibold shadow-md hover:bg-red-800 transition-all duration-300"
        >
          Delete All Tasks
        </button>
      </div>
    </div>
  );
};

export default TodoList;