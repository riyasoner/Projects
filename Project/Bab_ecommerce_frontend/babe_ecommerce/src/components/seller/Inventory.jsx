import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import endpoints from "../../api/endpoints";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";
import { AiOutlineEye } from "react-icons/ai";
import { FiEdit, FiCopy } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";

const Inventory = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const { get, del } = useApi();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await get(`${endpoints.getInventoryBySeller}?sellerId=${userId}`);
      setInventory(response.data || []);
    } catch (error) {
      console.log(error.message, "Error in Fetching Inventory");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await del(`${endpoints.deleteInventory}/${id}`);
      toast.success(response.message || "Inventory deleted");
      fetchInventory(); // Refresh list
    } catch (err) {
      toast.error(err.message || "Failed to delete Inventory");
    }
  };

  const handleDeleteClick = (id) => {
    confirmAlert({
      title: "Confirm Deletion",
      message: "Are you sure you want to delete this Inventory?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 satosi_bold">Inventory Management</h2>
        <p className="text-sm text-gray-500 satosi_regular">Manage your products</p>
      </div>

      <div className="flex justify-end gap-3 mb-5 satosi_regular">
        <button
          onClick={() => navigate("/seller/add_inventory")}
          className="flex items-center gap-2 button text-white text-sm px-4 py-2 rounded-[10px] hover:bg-purple-700 transition"
        >
          <FaPlus className="border border-white p-[2px] rounded-full" />
          Add Inventory
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              {/* <th className="px-4 py-3 text-left font-medium text-gray-600">Link</th> */}
              <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(inventory.length>0)? inventory.map((item, index) => {
              const product = item.product;
              return (
                <tr
                  key={index}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-3">{product.title}</td>
                  <td className="px-4 py-3">{product.slug}</td>
                  <td
                    className={`px-4 py-3 capitalize font-semibold ${product.status === "active" ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.status}
                  </td>
                  {/* <td className="px-4 py-3 flex items-center gap-2">
                    <span className="truncate max-w-[150px]">{product?.shareableLink}</span>
                    <button
                      className="text-gray-600 hover:text-black"
                      onClick={() => {
                        navigator.clipboard.writeText(product?.shareableLink);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <FiCopy size={18} />
                    </button>
                  </td> */}
                  <td className="px-4 py-3">
                    {new Date(product.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 flex gap-2 items-center">
                    {/* View */}
                    {/* <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/admin/view_product/${product.id}`)}
                    >
                      <AiOutlineEye size={18} />
                    </button> */}

                    {/* Edit */}
                    <button
                      className="text-yellow-600 hover:text-yellow-800"
                      onClick={() => navigate(`/seller/add_Inventory`,{state:{id:item.id}})}
                    >
                      <FiEdit size={18} />
                    </button>

                    {/* Delete */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </td>
                </tr>
              );
            }):(<tr><td colSpan={"5"} className="text-center">Not Found</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
