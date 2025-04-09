import { useState, useEffect, useRef } from "react";
import "./App.css";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import EntryForm from "./components/EntryFrom";
import Navbar from "./components/Navbar";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });
  const savedOrder = useState(() => {
    const saved = localStorage.getItem("menuOrder");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      name,
      text,
    };

    setEntries((prev) => [...prev, newEntry]);

    // Reset form
    setName("");
    setText("");
    setShowForm(false);
  };

  useEffect(() => {
    localStorage.setItem("entries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    if (entries.length === 0) {
      localStorage.removeItem("menuOrder");
      setItems([]);
    }
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("menuOrder", JSON.stringify(items));
  }, [items]);

  const onDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const baseMenu = [];
  useEffect(() => {
    let updated = [...baseMenu];
    if (entries.length > 0 && entries.length < 6) {
      updated.push(...entries.map((entry) => entry.name));
    } else if (entries.length >= 6) {
      updated.push(...entries.slice(0, 5).map((entry) => entry.name));
      updated.push("Links");
    }

    if (savedOrder[0]) {
      const validOrder = savedOrder[0].filter((item) => updated.includes(item));
      const remaining = updated.filter((item) => !validOrder.includes(item));

      setItems([...validOrder, ...remaining]);
    } else {
      setItems(updated);
    }
    // setItems(updated);
  }, [entries]);

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar
        items={items}
        setItems={setItems}
        entries={entries}
        onDelete={onDelete}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        setShowForm={setShowForm}
        showForm={showForm}
      />
      {/* Main Content */}
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Hello, Rahil!</h1>
        <p className="mt-3 text-gray-600 text-lg">
          Welcome to your React + Tailwind app.
        </p>

        {/* Conditional Form */}
        {showForm && (
          <EntryForm
            name={name}
            setName={setName}
            text={text}
            setText={setText}
            handleSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}

export default App;
