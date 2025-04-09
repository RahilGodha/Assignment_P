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

const SortableItem = ({ id, onDelete, index }) => {
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
      // className="cursor-move px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 transition text-sm"
      className="cursor-move px-5 py-2 bg-blue-100 rounded-xl hover:bg-blue-200 transition text-base font-medium shadow-sm"
    >
      <div className="flex justify-between items-center">
        <div>{id}</div>
        <button
          onClick={() => onDelete(index)}
          className="ml-4 text-red-500 hover:text-red-700 font-bold"
        >
          x
        </button>
      </div>
    </li>
  );
};

const SortableItemDropdown = ({
  id,
  showDropdown,
  setShowDropdown,
  entries,
  onDelete,
}) => {
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
      {/* <li className="relative group cursor-pointer"> */}
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
        }}
        className="hover:text-green-600 cursor-pointer"
        aria-expanded={showDropdown}
      >
        Links ▼
      </button>

      {showDropdown && (
        <ul className="absolute bg-white border mt-2 shadow-md rounded-md z-10 min-w-[150px]">
          {entries.slice(5).map((entry, index) => (
            <LinkComponent
              key={index + 5}
              index={index + 5}
              entry={entry}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

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
      {/* <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">MySite</div> */}
      <nav className="bg-white shadow-lg px-8 py-4 flex justify-between items-center rounded-b-md">
        <div className="text-2xl font-extrabold text-blue-700 tracking-tight">
          MySite
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <ul className="flex gap-6 text-gray-700 font-medium">
              {items.map((item, index) =>
                item === "Links" ? (
                  <SortableItemDropdown
                    key={item}
                    id={item}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    entries={entries}
                    onDelete={onDelete}
                  />
                ) : (
                  <SortableItem
                    key={item}
                    id={item}
                    index={index}
                    onDelete={onDelete}
                  />
                )
              )}
            </ul>
          </SortableContext>
        </DndContext>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          Add Entry
        </button>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900">Hello, Rahil!</h1>
        <p className="mt-3 text-gray-600 text-lg">
          Welcome to your React + Tailwind app.
        </p>

        {/* Conditional Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800">Add New Entry</h2>

            <label className="block text-sm font-semibold text-gray-700">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <label className="block text-sm font-semibold text-gray-700">
              Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg w-full font-semibold"
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
