import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import { useNavigate } from "react-router-dom";
import TransactionTypeSelector from "./Addtransaction/TransactionTypeSelector";
import CollectionFields from "./Addtransaction/CollectionFields";
import TransactionFormFields from "./Addtransaction/TransactionFormFields";
import StartingBalanceControls from "./Addtransaction/StartingBalanceControls";
import AddTransactionButton from "./Addtransaction/AddTransactionButton";
import { encryptId } from "../../utils/encryption";

function AddTransaction({
  accountId,
  onAddTransaction,
  bookId,
  account,
  accountBalance,
}) {
  const { post, get } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    toAccount: Number(accountId),
    transactionType: "EXPENSE",
    transactionDate: new Date().toISOString().slice(0, 16),
    collKishtType: "monthly",
    collTotalAmount: "",
    collEmiDueDate: "",
    collEmiTimes: "",
    startingBalanceOperation: "",
    image: null,
    bookId: localStorage.getItem("bookId") || "",
    userId: account.userId,
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "toAccount" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const {
      description,
      amount,
      toAccount,
      category,
      transactionType,
      collKishtType,
      collTotalAmount,
      collEmiDueDate,
      collEmiTimes,
      startingBalanceOperation,
      image,
      userId,
      bookId,
    } = formData;

    if (!description || !amount || !category) {
      alert("Please fill all required fields!");
      return;
    }

    const flatAccounts = accounts.flatMap((group) => group.accounts);
    const sourceAccount = flatAccounts.find((a) => a.id === Number(accountId));
    const targetAccount = flatAccounts.find((a) => a.id === Number(toAccount));

    if (!sourceAccount || !targetAccount) {
      alert("Source or target account not found.");
      return;
    }

    const transactionData = {
      transaction_type: startingBalanceOperation
        ? startingBalanceOperation.toUpperCase()
        : transactionType.toUpperCase(),
      transaction_date: formData.transactionDate,
      transaction_time: new Date().toTimeString().split(" ")[0],
      category,
      description,
      to_account: toAccount,
      amount: parseFloat(amount) || 0,
      accountId,
      bookId,
      userId,
      source_acc_name: sourceAccount?.name || "",
      target_acc_name: targetAccount?.name || "",
      ...(transactionType === "COLLECTION" && {
        coll_kisht_type: collKishtType,
        coll_total_amount: parseFloat(collTotalAmount) || 0,
        coll_emiDue_date: collEmiDueDate,
        coll_emi_times: parseInt(collEmiTimes) || 0,
      }),
      ...(transactionType === "STARTING_BALANCE" && {
        transaction_type: startingBalanceOperation.toUpperCase(),
      }),
      ...(image && { image }),
    };

    setLoading(true);

    try {
      const response = await post(endPoints.addTransaction, transactionData);
      alert(response.message || "Transaction added successfully!");
      if (transactionType === "COLLECTION") {
        const encryptedId = encryptId(accountId);
        navigate(`/collection/${encryptedId}`);
      }
      if (onAddTransaction) await onAddTransaction();

      setFormData((prev) => ({
        ...prev,
        description: "",
        amount: "",
        category: "",
        toAccount: accountId,
        transactionType: "EXPENSE",
        transactionDate: new Date().toISOString().slice(0, 16),
        collKishtType: "",
        collTotalAmount: "",
        collEmiDueDate: "",
        collEmiTimes: "",
        startingBalanceOperation: "",
        image: null,
      }));
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          get(endPoints.getCategories, { params: { userId } }),
          get(endPoints.getAllAccounts, { params: { bookId } }),
        ]);
        setCategories(catRes?.data || []);
        setAccounts(accRes?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setCategories([]);
        setAccounts([]);
      }
    };

    fetchData();
  }, [bookId, get, userId]);

  useEffect(() => {
    const needsCurrentAccount = [
      "INCOME",
      "EXPENSE",
      "STARTING_BALANCE",
    ].includes(formData.transactionType);
    setFormData((prev) => ({
      ...prev,
      toAccount: needsCurrentAccount ? Number(accountId) : "",
    }));
  }, [formData.transactionType, accountId]);

  return (
    <div className="mt-2 pt-2 sticky-bottom shadow-sm">
      <div
        className="card shadow-sm p-3 position-relative"
        style={{ paddingTop: "3rem" }}
      >
        <div
          className={`position-absolute top-0 end-0 fw-bold px-2 py-1 border-bottom border-start rounded-bottom 
    ${
      accountBalance < 0
        ? "bg-white text-danger border-danger"
        : "bg-white text-primary border-primary"
    }`}
          style={{ transform: "translateY(-50%)" }}
        >
          Total Available Balance: ₹{accountBalance}
        </div>

        <div className="row g-3 align-items-end">
          <TransactionFormFields
            formData={formData}
            handleChange={handleChange}
            categories={categories}
            accounts={accounts}
            accountId={accountId}
          />
          <AddTransactionButton onClick={handleSubmit} loading={loading} />
        </div>

        {formData.transactionType === "COLLECTION" && (
          <CollectionFields formData={formData} handleChange={handleChange} />
        )}

        {formData.transactionType === "STARTING_BALANCE" && (
          <StartingBalanceControls
            formData={formData}
            setFormData={setFormData}
          />
        )}

        <TransactionTypeSelector
          transactionType={formData.transactionType}
          setTransactionType={(type) =>
            setFormData((prev) => ({ ...prev, transactionType: type }))
          }
        />
      </div>
    </div>
  );
}

export default AddTransaction;
