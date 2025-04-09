import { useState, useEffect, useRef } from "react";
import "./App.css";
import LinkComponent from "./components/LinkComponent";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 transition text-sm"
    >
      {id}
    </li>
  );
};

function App() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  // const [entries, setEntries] = useState([]);
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem("entries");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Text:", text);

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

  const onDelete = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const defaultItems = ["Home", "About", "Contact", "Feedback"];

  const dynamicItems =
    entries.length > 1
      ? ["Links"]
      : entries.length === 1
      ? [entries[0].name]
      : [];

  const [items, setItems] = useState([...defaultItems, ...dynamicItems]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">MySite</div>

        <ul className="flex gap-6 text-gray-700 font-medium">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex gap-4">
                {items.map((item) => (
                  <SortableItem key={item} id={item} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
          {/* <li className="hover:text-blue-500 cursor-pointer">Home</li>
          <li className="hover:text-blue-500 cursor-pointer">About</li>
          <li className="hover:text-blue-500 cursor-pointer">Contact</li>
          <li className="hover:text-blue-500 cursor-pointer">Feedback</li> */}
          {entries.length > 1 && (
            <li className="relative group cursor-pointer">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="hover:text-green-600 cursor-pointer"
              >
                Links ▼
              </button>
              {/* <span className="hover:text-green-600">Links ▼</span> */}
              {showDropdown && (
                <ul className="absolute bg-white border mt-2 shadow-md rounded-md z-10 min-w-[150px]">
                  {entries.map((entry, index) => (
                    <LinkComponent
                      index={index}
                      entry={entry}
                      onDelete={onDelete}
                    ></LinkComponent>
                  ))}
                </ul>
              )}
            </li>
          )}
          {entries.length === 1 && (
            <li>
              <a
                href={entries[0].text}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-600"
              >
                {entries[0].name}
              </a>
            </li>
          )}
        </ul>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          Add Entry
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        <h1 className="text-3xl font-semibold">Hello, Rahil!</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your React + Tailwind app.
        </p>

        {/* Conditional Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Add New Entry
            </h2>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              required
            />

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              required
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
          </form>
        )}
      </main>
    </div>
  );
}

export default App;
