import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import SortableItemDropdown from "./SortableItemDropdown";

const Navbar = ({
  items,
  setItems,
  entries,
  onDelete,
  showDropdown,
  setShowDropdown,
  setShowForm,
  showForm,
}) => {
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
  );
};

export default Navbar;
