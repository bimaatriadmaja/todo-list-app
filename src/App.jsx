import React from "react";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="pt-0 pb-0 md:pt-10 md:pb-10 bg-gray-900">
      <div>
        <TodoList />
      </div>
    </div>
  );
}

export default App;
