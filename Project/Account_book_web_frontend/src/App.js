import React, { useState, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./LayOut/Header";
import Sidebar from "./LayOut/Sidebar";
import Transactions from "./Components/Transaction/Transaction";
import AddTransaction from "./Components/Transaction/AddTransaction";
import Feedback from "./Components/FeedBack/FeedBack";
import Help from "./Components/Help/Help";
import Notes from "./Components/Note/Note";
import MyBusiness from "./Components/MyBussiness/MyBussiness";
import AddBook from "./Components/MyBussiness/AddBook";
import BookEdit from "./Components/MyBussiness/BookEdit";
import NoteSidebar from "./Components/Note/NoteSidebar";
import ReportsSidebar from "./Components/Report/ReportSidebar";
import Archive from "./Components/Archieve/Archieve";
import Notification from "./Components/Notifications/Notification";
import Login from "./Auth/Login";
import AccountTransactions from "./Components/Account/AccountTransactions";
import Signup from "./Auth/SignUp";
import PeriodicReport from "./Components/Report/PeriodicReport";
import AssignBook from "./Components/MyBussiness/AssignBook";
import ProtectedRoute from "./routes/protectedRoute";
import NotFound from "./Components/notFound";
import AssignedBooks from "./Components/MyBussiness/viewAssignBook";
import UserTransactions from "./Components/Transaction/UserTransaction";
import SettlementRequests from "./Components/SettlementRequest/settlementRequest";
import RegisterUSer from "./Components/RegisterUSer/registerUser";
import BookList from "./Components/MyBussiness/viewBook";
import UserBookList from "./Components/MyBussiness/userBooks";
import SettledTransactionForm from "./Components/MyBussiness/SettledTransaction";
import CollectionAccount from "./Components/Transaction/CollectionAccount";
import Collection from "./Components/Transaction/Collection";
import { useSidebar } from "./context/SidebarContext";
// Lazy-loaded components for improved performance
const AddNewAccount = lazy(() => import("./Components/Account/AddNewAccount"));
const Settings = lazy(() => import("./Components/Settings/Settings"));
const Transaction = lazy(() =>
  import("./Components/Transaction/AddTransaction")
);
const UpcomingTransactions = lazy(() =>
  import("./Components/UpcomingTransaction/UpcomingTransaction")
);
const Category = lazy(() => import("./Components/Category/Category"));
const AddCategory = lazy(() => import("./Components/Category/AddCategory"));
const Account = lazy(() => import("./Components/Account/Account"));
function App() {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useSidebar(); // use context

  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgotPassword" ||
    location.pathname === "/resetPassword";

  return (
    <div className="App d-flex vh-100">
      {!isAuthPage && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <div className="main-content flex-grow-1 d-flex flex-column">
        {/* Add sticky-top to Header */}
        {!isAuthPage && (
          <Header
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            className="sticky-top"
          />
        )}
        {/* Ensure the content scrolls */}
        <div
          className="content flex-grow-1 overflow-auto"
          style={{
            marginLeft: isAuthPage ? "0" : isSidebarOpen ? "195px" : "70px",
          }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/registerUser" element={<RegisterUSer />} />
            <Route
              path="/bussiness"
              element={
                <ProtectedRoute>
                  <MyBusiness />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-book"
              element={
                <ProtectedRoute>
                  <AddBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-book"
              element={
                <ProtectedRoute>
                  <BookEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/accounts"
              element={
                <ProtectedRoute>
                  {" "}
                  <Account />
                </ProtectedRoute>
              }
            />
            CollectionAccount
            <Route
              path="/collection"
              element={
                <ProtectedRoute>
                  {" "}
                  <CollectionAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-account"
              element={
                <ProtectedRoute>
                  <AddNewAccount />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new-transaction"
              element={
                <ProtectedRoute>
                  <AddTransaction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upcoming-transactions"
              element={
                <ProtectedRoute>
                  <UpcomingTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Category />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-category"
              element={
                <ProtectedRoute>
                  <AddCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Help />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <NoteSidebar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsSidebar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <ProtectedRoute>
                  <Archive />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/:id"
              element={
                <ProtectedRoute>
                  <AccountTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collection/:id"
              element={
                <ProtectedRoute>
                  <Collection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/assignBook"
              element={
                <ProtectedRoute>
                  <AssignBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/viewAssignBook"
              element={
                <ProtectedRoute>
                  <AssignedBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/userTransactions/:userId"
              element={<UserTransactions />}
            />
            <Route
              path="/viewSettlementRequest"
              element={<SettlementRequests />}
            />
            <Route path="/userBooks/:userId" element={<UserBookList />} />
            <Route
              path="/settledTransactions/:userId"
              element={<SettledTransactionForm />}
            />
            <Route path="/booksList" element={<BookList />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <NotFound />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
