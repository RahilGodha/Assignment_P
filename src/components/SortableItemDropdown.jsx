import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import LinkComponent from "./LinkComponent";

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

export default SortableItemDropdown;
