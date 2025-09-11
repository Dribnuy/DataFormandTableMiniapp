import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  selectFormData,
  selectSortConfig,
} from "../store/form-service/selectors";
import type { FormData } from "../store/form-service/types";
import {
  editFormData,
  deleteFormData,
  setSortConfig,
  setFilters,
} from "../store/form-service/formSlice";
import { useState } from "react";
import { ROUTES } from "../shared/constants";

export default function TablePage() {
  const data = useSelector(selectFormData);
  const sortConfig = useSelector(selectSortConfig);
  const dispatch = useDispatch();
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<FormData>({
    id: "",
    firstName: "",
    lastName: "",
    age: 0,
    description: "",
  });
  const [ageMin, setAgeMin] = useState<number | undefined>();
  const [ageMax, setAgeMax] = useState<number | undefined>();
  const [substring, setSubstring] = useState<string>("");

  const applyFilters = () => {
    dispatch(setFilters({ ageMin, ageMax, substring }));
  };

  const clearFilters = () => {
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSubstring("");
    dispatch(setFilters({}));
  };

  const handleSort = (key: keyof FormData) => {
    dispatch(
      setSortConfig({
        key,
        direction:
          sortConfig?.key === key && sortConfig.direction === "asc"
            ? "desc"
            : "asc",
      }),
    );
  };

  const handleEdit = (index: number) => {
    console.log("Edit clicked for index:", index, "data:", data[index]);
    setEditIndex(index);
    setEditData(data[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      console.log("Saving edited data:", editData);
      dispatch(editFormData({ index: editIndex, updatedData: editData }));
      setEditIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    console.log("Delete clicked for index:", index);
    dispatch(deleteFormData(index));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex-1 min-h-screen flex flex-col items-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-black">Table of Data</h2>

          {}
          <div className="mb-18 w-full max-w-xl bg-gradient-to-r from-orange-500 to-purple-600  p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700">Age Min</label>
                <input
                  type="number"
                  value={ageMin ?? ""}
                  onChange={(e) =>
                    setAgeMin(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700">Age Max</label>
                <input
                  type="number"
                  value={ageMax ?? ""}
                  onChange={(e) =>
                    setAgeMax(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700">Search Substring</label>
                <input
                  type="text"
                  value={substring}
                  onChange={(e) => setSubstring(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={applyFilters}
                className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-500  hover:from-pink-500 hover:to-yellow-500  transition-all duration-2000 ease-in-out"
              >
                Apply Filters
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-gray-500 to-gray-500  hover:from-gray-900 hover:to-white transition-all duration-1000 ease-in-out"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {data.length === 0 ? (
            <p className="text-white">You don't have any data yet.</p>
          ) : (
            <div className="w-full max-w-6xl">
              <table className="w-full table-auto border-collapse border-2 border-white bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-700">
                    <th
                      className="border border-white px-4 py-3 text-black font-bold cursor-pointer"
                      onClick={() => handleSort("firstName")}
                    >
                      Name{" "}
                      {sortConfig?.key === "firstName" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="border border-white px-4 py-3 text-black font-bold cursor-pointer"
                      onClick={() => handleSort("lastName")}
                    >
                      Surname{" "}
                      {sortConfig?.key === "lastName" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="border border-white px-4 py-3 text-black font-bold cursor-pointer"
                      onClick={() => handleSort("age")}
                    >
                      Age{" "}
                      {sortConfig?.key === "age" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="border border-white px-4 py-3 text-black font-bold cursor-pointer"
                      onClick={() => handleSort("description")}
                    >
                      Description{" "}
                      {sortConfig?.key === "description" &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="border border-white px-4 py-3 text-black font-semibold"
                      style={{ minWidth: "150px" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">
                        {row.firstName}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">
                        {row.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800">
                        {row.age}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-800 max-w-xs truncate">
                        {row.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEdit(i)}
                            className="px-3 py-1 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            style={{ minWidth: "60px" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(i)}
                            className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                            style={{ minWidth: "60px" }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Edit Entry
                </h3>
                <div className="space-y-4">
                  <input
                    value={editData.firstName}
                    onChange={(e) =>
                      setEditData({ ...editData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Name"
                  />
                  <input
                    value={editData.lastName}
                    onChange={(e) =>
                      setEditData({ ...editData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Surname"
                  />
                  <input
                    type="number"
                    value={editData.age}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        age: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Age"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Description"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditIndex(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <Link
            to={ROUTES.FORM}
            className="mt-6 px-6 py-2 bg-white text-blue-600 font-semibold rounded-full shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl border border-blue-200"
          >
            Back To Form
          </Link>
        </div>
      </div>
    </div>
  );
}
