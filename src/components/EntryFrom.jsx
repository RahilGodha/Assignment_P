const EntryForm = ({ name, setName, text, setText, handleSubmit }) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-white p-6 rounded-xl shadow-lg w-full max-w-md mx-auto space-y-4"
    >
      <h2 className="text-2xl font-bold text-gray-800">Add New Entry</h2>

      <label className="block text-sm font-semibold text-gray-700">Name</label>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <label className="block text-sm font-semibold text-gray-700">Text</label>
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
  );
};

export default EntryForm;
