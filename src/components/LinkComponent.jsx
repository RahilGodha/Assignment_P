import React from "react";

const LinkComponent = (props) => {
  return (
    <div
      key={props.index}
      className="flex items-center justify-between bg-white  rounded-lg  p-3 m-2 "
    >
      <a
        href={props.entry.text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 font-medium hover:underline"
      >
        {props.entry.name}
      </a>
      <button
        onClick={() => props.onDelete(props.index)}
        className="ml-4  text-black px-3 py-1 rounded  transition text-sm"
      >
        ✕
      </button>
    </div>
  );
};

export default LinkComponent;
