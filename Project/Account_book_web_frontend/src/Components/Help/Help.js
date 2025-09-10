import React from "react";

const Help = () => {
  return (
    <div className="help-container mt-5">
            <h4 className="mb-4" style={{ backgroundColor: "#419EB9", color: "white", padding: "10px" }}>
                <i className="bi bi-question-circle me-2"></i> Help
            </h4>

      <div className="help-content">
        {/* Section 1 */}
        <h6>Where should I start?</h6>
        <p>
          If you want to monitor your income and expenses of your business entirely:
        </p>
        <ul>
          <li>Create cash, bank, credit card accounts as a first step</li>
          <li>
            Add income and expenses to these accounts. Example: cash meal
            payment, payment via credit card, pay bills via your bank account.
          </li>
        </ul>
        <p>If you want to follow your customers and suppliers:</p>
        <ul>
          <li>Create Payable/Receivable accounts for each of them</li>
          <li>Add transactions with buy, sale, payment, collection types</li>
        </ul>
        <p>In addition:</p>
        <ul>
          <li>
            Create Inventory accounts if your business is related to sale from
            inventory.
          </li>
          <li>
            Create Personnel accounts if you want to follow salary payments and
            advances.
          </li>
        </ul>
        <p>
          You will discover many unique and useful features by continuing to
          use.
        </p>

        {/* Section 2 */}
        <h6>Main Features</h6>
        <ul>
          <li>Save and monitor all incomes and expenses of your business</li>
          <li>Follow payable and receivable accounts</li>
          <li>
            Record your customers and keep track of related sales and payment
          </li>
          <li>Follow up your suppliers</li>
          <li>Follow salary and advance payments of your employees</li>
          <li>Monitor your inventory at a basic level</li>
          <li>
            Set reminders for regular payments such as rent, invoices, salaries,
            and future payments
          </li>
          <li>Set repeating transactions, installments for payments</li>
          <li>
            Share accounts with customers so they can track their debts
          </li>
          <li>Send account statements to your customers</li>
          <li>
            Share accounts or books with your staff. Make common payments and
            collections
          </li>
          <li>
            Analyze your financial situation with monthly income and expense
            reports
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Help;
