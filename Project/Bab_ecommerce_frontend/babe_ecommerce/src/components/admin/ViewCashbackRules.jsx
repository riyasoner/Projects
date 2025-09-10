import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { useLocation } from "react-router-dom";
import endpoints from "../../api/endpoints";

function ViewCashbackRules() {
  const { get } = useApi();
  const { state } = useLocation();
  const id = state?.id;
  const [cashbackRule, setCashbackRule] = useState(null);

  useEffect(() => {
    if (id) fetchCashbackRuleById();
  }, [id]);

  const fetchCashbackRuleById = async () => {
    try {
      const res = await get(`${endpoints.getCashbackRuleById}/${id}`);
      setCashbackRule(res.cashbackRule || {});
    } catch (error) {
      console.log("Error fetching cashback rule by id", error);
    }
  };

  if (!cashbackRule) {
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading Cashback Rule...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="bg-purple text-white px-6 py-4">
          <h2 className="text-2xl font-semibold">
            Cashback Rule: {cashbackRule.name}
          </h2>
          <p className="text-sm opacity-80">{cashbackRule.description}</p>
        </div>

        <div className="p-6">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-semibold w-1/3 bg-gray-50">Rule ID</td>
                <td className="p-3">{cashbackRule.id}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Type</td>
                <td className="p-3">{cashbackRule.cashbackType}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Value</td>
                <td className="p-3">{cashbackRule.cashbackValue}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Minimum Purchase</td>
                <td className="p-3">{cashbackRule.minPurchaseAmount}</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Categories</td>
                <td className="p-3">
                  {cashbackRule.applicableCategories?.join(", ") || "—"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Products</td>
                <td className="p-3">
                  {cashbackRule.applicableProducts?.join(", ") || "—"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Payment Methods</td>
                <td className="p-3">
                  {cashbackRule.paymentMethods?.join(", ")}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Start Date</td>
                <td className="p-3">
                  {new Date(cashbackRule.startDate).toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">End Date</td>
                <td className="p-3">
                  {new Date(cashbackRule.endDate).toLocaleString()}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Status</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cashbackRule.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cashbackRule.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold bg-gray-50">Created At</td>
                <td className="p-3">
                  {new Date(cashbackRule.createdAt).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold bg-gray-50">Updated At</td>
                <td className="p-3">
                  {new Date(cashbackRule.updatedAt).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ViewCashbackRules;
