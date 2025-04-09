import { useSortable } from "@dnd-kit/sortable";
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

export default SortableItem;
