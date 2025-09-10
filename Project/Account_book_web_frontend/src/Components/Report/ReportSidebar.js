import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PeriodicReport from "./PeriodicReport";
import CategoryDistribution from "./CategoryDistribution";
import Summary from "./Summary";
import { FaChartBar, FaExchangeAlt, FaThList } from "react-icons/fa";
import useApi from "../../hooks/useApi";
import endPoints from "../../api/endPoints";
import AccountReport from "./AccountReport";
import CategoryReport from "./CategoryReport";
import CategoryDistributionName from "./CategoryDistributionName";
const ReportsSidebar = () => {
  const [activeComponent, setActiveComponent] = useState("Summary");
  const [activeSection, setActiveSection] = useState("Income-Expense");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [selectedAccountType, setSelectedAccountType] = useState([]);

  const { get } = useApi();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const renderContent = () => {
    switch (activeComponent) {
      case "PeriodicReport":
        return (
          <PeriodicReport
            sectionName={activeSection}
            category={categoryName}
            accountName={selectedAccount}
          />
        );
      case "CategoryDistribution":
        return <CategoryDistribution sectionName={activeSection} />;
      case "AccountReport":
        return (
          <AccountReport
            sectionName={activeSection}
            accountName={selectedAccount}
            accountType={selectedAccountType}
          />
        );
      case "CategoryReport":
        return (
          <CategoryReport
            sectionName={activeSection}
            category={selectedCategory}
          />
        );
      case "CategoryDistributionName":
        return <CategoryDistributionName accountName={selectedAccount} />;
      case "Summary":
      default:
        return <Summary />;
    }
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };
  const handlePeriodicReportClick = () => {
    if (selectedCategory) {
      setCategoryName(selectedCategory);
      setActiveSection(selectedCategory);
      setActiveComponent("CategoryReport");
    } else if (selectedAccount) {
      setSelectedAccount(selectedAccount);
      setActiveSection(selectedAccount);
      setActiveComponent("AccountReport");
    } else if (selectedAccountType) {
      console.log("hel");
      setSelectedAccountType(selectedAccountType);
      setActiveSection(selectedAccountType);
      setActiveComponent("AccountReport");
    } else {
      alert("please first select");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await get(`${endPoints.getCategories}?userId=${userId}`);
      if (response?.data) {
        setCategories(response.data);
      } else {
        console.warn("No categories found.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchAccounts = async () => {
    try {
      const bookId = localStorage.getItem("bookId");
      const userId = localStorage.getItem("userId");
      const userType = localStorage.getItem("userType");

      const params = {};

      if (bookId) {
        params.bookId = bookId;
      }

      if (userType == "admin" || userType == "user") {
        if (userId) {
          params.userId = userId;
        }
      }

      const response = await get(endPoints.getAllAccounts, { params });

      if (response?.data) {
        setAccounts(response.data);
      } else {
        console.warn("No data received from API.");
      }
    } catch (error) {
      console.error("Error fetching accounts:", error.message || error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchAccounts();

    const handleBookChange = () => {
      fetchAccounts(); // re-fetch accounts when book changes
    };

    window.addEventListener("selectedBookUpdated", handleBookChange);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("selectedBookUpdated", handleBookChange);
    };
  }, []);
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className="sidebar bg-light"
        style={{
          position: "fixed",
          // left: "190px",
          top: "0",
          height: "100vh", // Full viewport height
          width: "300px",
          borderRight: "1px solid #ccc",
          overflowY: "auto", // Enable vertical scrolling
          backgroundColor: "white",
          zIndex: 1000,
          marginTop: "67px",
        }}
      >
        {/* Sidebar Header */}
        <div
          className="sticky-top"
          style={{
            backgroundColor: "#419EB9",
            color: "white",
            padding: "4px",
          }}
        >
          <h5 className="text-uppercase d-flex align-items-left">Reports</h5>
        </div>

        {/* Summary Section */}
        <div>
          <div
            className="mb-2 p-1 sticky-top"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">Summary</h6>
          </div>
          <span>Overall account totals of your business</span>
          <button
            className="btn float-end"
            style={{ color: "green" }}
            onClick={() => setActiveComponent("Summary")}
          >
            Show
          </button>
        </div>

        {/* Income-Expense Section */}
        <div>
          <div
            className="mt-5 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">
              Income-Expense
            </h6>
          </div>
          <span className="" style={{ fontSize: "16px" }}>
            INCOME: Sales to listed/unlisted customers. Other direct incomes.
            <br />
            EXPENSE: Supplier, inventory, personnel expenses. Other direct
            expenses.
          </span>

          <div className="mt-3 d-flex flex-column align-items-end">
            <button
              onClick={() => {
                setActiveComponent("PeriodicReport");
                setActiveSection("Income-Expense");
              }}
              className="d-flex align-items-center mb-2 btn btn-link"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaChartBar className="me-2" />
              Periodic Report
            </button>
            <button
              onClick={() => setActiveComponent("CategoryDistribution")}
              className="d-flex align-items-center mb-2 btn btn-link"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaThList className="me-2" />
              Category Distribution
            </button>
            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>

        {/* Payment-Collection Section */}
        <div className="">
          <div
            className="mt-1 p-1 "
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">
              Payment - Collection
            </h6>
          </div>
          <span className="" style={{ fontSize: "16px" }}>
            PAYMENT: Credit card and supplier payments, other direct payments.
            <br /> COLLECTION: from listed / unlisted customers
          </span>
          <div className="mt-2 d-flex flex-column align-items-end">
            <button
              onClick={() => {
                setActiveComponent("PeriodicReport");
                setActiveSection("Payment-Collection");
                console.log(
                  "Setting component to PeriodicReport and section to Payment-Collection"
                );
              }}
              className="d-flex align-items-center mb-2 btn btn-link"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaChartBar className="me-2" />
              Periodic Report
            </button>
            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        {/* Purchase - Sale Section */}
        <div>
          <div
            className="mt-1 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">
              Purchase - Sale{" "}
            </h6>
          </div>
          <span className="" style={{ fontSize: "16px" }}>
            Buy from listed providers, sell to listed customers
          </span>
          <div className=" d-flex flex-column align-items-end">
            <button
              onClick={() => {
                setActiveComponent("PeriodicReport");
                setActiveSection("Purchase-Sale");
              }}
              className="d-flex align-items-center mb-2 btn btn-link"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaChartBar className="me-2" />
              Periodic Report
            </button>

            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        {/* cash bank */}
        <div>
          <div
            className="mt-1 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">
              CASH - BANK
            </h6>
          </div>
          <span className="" style={{ fontSize: "16px" }}>
            All transactions for your cash, bank or savings accounts
          </span>
          <div className=" d-flex flex-column align-items-end">
            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        {/* sale */}
        <div>
          <div
            className="mt-1 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">SALES</h6>
          </div>
          <span className="" style={{ fontSize: "16px" }}>
            Simple sale list
          </span>
          <div className=" d-flex flex-column align-items-end">
            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        <div>
          <div
            className="mt-1 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">
              Sale - Collection
            </h6>
          </div>
          <span className="" style={{ fontSize: "16px" }}>
            Sales and collections for listed customers
          </span>
          <div className=" d-flex flex-column align-items-end">
            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        <div>
          <div
            className="mt-1 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">ACCOUNT </h6>
          </div>
          <div className="form-group mt-2">
            <select
              style={{
                backgroundColor: "#E5EAEC",
                width: "250px",
                marginLeft: "10px",
                border: "none",
                padding: "2px",
              }}
              className=""
              value={selectedAccount}
              onChange={handleAccountChange} // Ensure handleAccountChange updates selectedAccount
            >
              <option value="choose Account">Choose Account</option>
              {accounts.length > 0 ? (
                accounts.map((accountGroup) =>
                  accountGroup.accounts.map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))
                )
              ) : (
                <option disabled>No accounts available</option>
              )}
            </select>
          </div>
          <div className="d-flex flex-column align-items-end">
            <button
              onClick={handlePeriodicReportClick} // Corrected to use onClick
              className="d-flex align-items-center mb-2 btn btn-link"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaChartBar className="me-2" />
              Periodic Report
            </button>
            {/* <button
                            onClick={() => setActiveComponent("CategoryDistributionName")}
                            className="d-flex align-items-center mb-2 btn btn-link"
                            style={{ textDecoration: "none", color: "blue" }}
                        >
                            <FaThList className="me-2" />
                            Category Distribution
                        </button> */}
            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        <div>
          <div
            className="mt-1 p-1"
            style={{
              backgroundColor: "#E5EAEC",
              color: "#316D58",
            }}
          >
            <h6 className="text-uppercase d-flex align-items-left">CATEGORY</h6>
          </div>
          <div className="form-group mt-2">
            <select
              style={{
                backgroundColor: "#E5EAEC",
                width: "250px",
                marginLeft: "10px",
                border: "none",
                padding: "2px",
              }}
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              <option value="">Choose Category</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-column align-items-end">
            <button
              onClick={handlePeriodicReportClick}
              className="d-flex align-items-center mb-2 btn btn-link"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaChartBar className="me-2" />
              Periodic Report
            </button>

            <Link
              to="/transactions"
              className="d-flex align-items-center"
              style={{ textDecoration: "none", color: "blue" }}
            >
              <FaExchangeAlt className="me-2" />
              Transaction
            </Link>
          </div>
        </div>
        {/* <div>
                    <div
                        className="mt-1 p-1"
                        style={{
                            backgroundColor: "#E5EAEC",
                            color: "#316D58",
                        }}
                    >
                        <h6 className="text-uppercase d-flex align-items-left">ACCOUNT TYPE


                        </h6>
                    </div>
                    <div className="form-group mt-1">
                        <select
                            style={{
                                backgroundColor: "#E5EAEC",
                                width: "250px",
                                marginLeft: "10px",
                                border: "none",
                                padding: "2px",
                            }}
                            className="form-select"
                            value={selectedAccountType} // Added value to bind the selected account type
                            onChange={(e) => setSelectedAccountType(e.target.value)} // Handle change
                        >
                            <option value="choose Account">Choose Account Type</option>
                            {accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <option key={account.id} value={account.account_type}>
                                        {account.account_type}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No accounts available</option>
                            )}
                        </select>
                    </div>
                    <div className=" d-flex flex-column align-items-end">
                        <button
                            onClick={handlePeriodicReportClick} // Corrected to use onClick
                            className="d-flex align-items-center mb-2 btn btn-link"
                            style={{ textDecoration: "none", color: "blue" }}
                        >
                            <FaChartBar className="me-2" />
                            Periodic Report
                        </button>
                        <Link to="/transactions" className="d-flex align-items-center" style={{ textDecoration: "none", color: "blue" }}>
                            <FaExchangeAlt className="me-2" />
                            Transaction
                        </Link>

                    </div>
                </div> */}
        <hr />
        <div>
          <span style={{ marginBottom: "500px" }}>EXCHANGE</span>
          <button className="btn mb-5 float-end" style={{ color: "green" }}>
            Show
          </button>
        </div>
        <hr />

        {/* Other sections */}
        {/* You can repeat similar code structure for other sections like "Purchase - Sale", "CASH - BANK", etc. */}
      </div>

      {/* Content Area */}
      <div
        className="content"
        style={{
          marginLeft: "300px",
          width: "200px",
          flex: 1,
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default ReportsSidebar;
