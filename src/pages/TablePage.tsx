import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  selectFormData,
  selectSortConfig,
  selectFilters,
  selectPagination,
  selectLoading,
  selectError,
  selectTotal,
} from "../store/form-service/selectors";
import type { FormData } from "../store/form-service/types";
import {
  addFormData,
  editFormData,
  deleteFormData,
  setSortConfig,
  setFilters,
  setPagination,
  fetchEntries,
} from "../store/form-service/formSlice";
import { useState, useEffect } from "react";
import { ROUTES } from "../core/constants";
import type { AppDispatch } from "../store";
import { ButtonPagination } from "../components/PaginationComponents";

type PaginationType = "button" | "scroll";

export default function TablePage() {
  const data = useSelector(selectFormData);
  const sortConfig = useSelector(selectSortConfig);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const total = useSelector(selectTotal);
  const dispatch = useDispatch<AppDispatch>();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<FormData>({
    id: "",
    firstName: "",
    lastName: "",
    age: 0,
    description: "",
  });
  const [ageMin, setAgeMin] = useState<number | undefined>(filters?.ageMin);
  const [ageMax, setAgeMax] = useState<number | undefined>(filters?.ageMax);
  const [substring, setSubstring] = useState<string>(filters?.substring || "");
  const [paginationType, setPaginationType] = useState<PaginationType>("button");
  const [infiniteData, setInfiniteData] = useState<FormData[]>([]);

  // Load initial data only if needed (no mock data)
  useEffect(() => {
    if (paginationType === "button" && total === 0) {
      dispatch(fetchEntries({ page: pagination.page, limit: pagination.limit, useMockData: false }));
    } else if (paginationType === "scroll" && total === 0) {
      setInfiniteData([]);
      dispatch(fetchEntries({ page: 1, limit: pagination.limit, useMockData: false }));
    }
  }, [dispatch, paginationType, pagination.limit, total]);

  // Handle infinite scroll data
  useEffect(() => {
    if (paginationType === "scroll" && data.length > 0) {
      if (pagination.page === 1) {
        setInfiniteData(data);
      } else {
        setInfiniteData((prev) => [...prev, ...data]);
      }
    }
  }, [data, pagination.page, paginationType]);

  // Infinite scroll effect
  useEffect(() => {
    if (paginationType === "scroll") {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 1000 &&
          !loading &&
          pagination.page * pagination.limit < total
        ) {
          const nextPage = pagination.page + 1;
          dispatch(setPagination({ ...pagination, page: nextPage }));
          dispatch(fetchEntries({ page: nextPage, limit: pagination.limit, useMockData: false }));
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loading, total, pagination, dispatch, paginationType]);

  const applyFilters = () => {
    dispatch(setFilters({ ageMin, ageMax, substring }));
    dispatch(setPagination({ page: 1, limit: pagination.limit }));
    setInfiniteData([]);
  };

  const clearFilters = () => {
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSubstring("");
    dispatch(setFilters({}));
    dispatch(setPagination({ page: 1, limit: pagination.limit }));
    setInfiniteData([]);
  };

  const handleSort = (key: keyof FormData) => {
    dispatch(
      setSortConfig({
        key,
        direction:
          sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
      })
    );
    dispatch(setPagination({ page: 1, limit: pagination.limit }));
    setInfiniteData([]);
  };

  const handleEdit = (index: number) => {
    const actualData = paginationType === "scroll" ? infiniteData : data;
    setEditIndex(index);
    setEditData(actualData[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      dispatch(editFormData({ index: editIndex, updatedData: editData }));
      setEditIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    dispatch(deleteFormData(index));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ ...pagination, page }));
    dispatch(fetchEntries({ page, limit: pagination.limit, useMockData: false }));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
    setInfiniteData([]);
  };

  const totalPages = Math.ceil(total / pagination.limit);
  const currentData = paginationType === "scroll" ? infiniteData : data;

  const renderTable = () => (
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
              {sortConfig?.key === "age" && (sortConfig.direction === "asc" ? "↑" : "↓")}
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
          {currentData.map((row, i) => (
            <tr key={row.id} className="hover:bg-blue-50 transition-colors">
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
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="flex-1 min-h-screen flex flex-col items-center p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Table of Data</h2>

          {/* Pagination Type Selector */}
          <div className="mb-4 flex gap-4">
            <button
              onClick={() => setPaginationType("button")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginationType === "button"
                  ? "bg-white text-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Button Pagination
            </button>
            <button
              onClick={() => setPaginationType("scroll")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                paginationType === "scroll"
                  ? "bg-white text-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Infinite Scroll
            </button>
          </div>

          {/* Filters */}
          <div className="mb-6 w-full max-w-xl bg-gradient-to-r from-orange-500 to-purple-600 p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Age Min
                </label>
                <input
                  type="number"
                  value={ageMin ?? ""}
                  onChange={(e) =>
                    setAgeMin(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Age Max
                </label>
                <input
                  type="number"
                  value={ageMax ?? ""}
                  onChange={(e) =>
                    setAgeMax(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Search Substring
                </label>
                <input
                  type="text"
                  value={substring}
                  onChange={(e) => setSubstring(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-between flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={applyFilters}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-pink-500 hover:to-yellow-500 transition-all duration-300 ease-in-out disabled:opacity-50"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 ease-in-out disabled:opacity-50"
                >
                  Clear Filters
                </button>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-white text-sm font-medium">
                  Items per page:
                </label>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="px-2 py-1 rounded border border-gray-300 bg-white text-gray-800"
                  disabled={loading}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && currentData.length === 0 && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

        
          

          {/* Data Display */}
          {!loading && currentData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white text-lg">You don't have any data yet.</p>
              <p className="text-white/70 text-sm mt-2">
                Try adding some data via the form or adjust your filters.
              </p>
            </div>
          ) : (
            <>
              {renderTable()}

              {/* Pagination */}
              {paginationType === "button" && (
                <ButtonPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}

              {/* Infinite Scroll Loading */}
              {paginationType === "scroll" && loading && currentData.length > 0 && (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}

              {/* End of data message */}
              {paginationType === "scroll" &&
                !loading &&
                currentData.length > 0 &&
                pagination.page * pagination.limit >= total && (
                  <div className="text-center mt-4 text-white/70">
                    No more data to load
                  </div>
                )}
            </>
          )}

          {/* Stats */}
          {currentData.length > 0 && (
            <div className="mt-4 text-white text-sm">
              Showing {currentData.length} of {total} entries
            </div>
          )}

          {/* Edit Modal */}
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