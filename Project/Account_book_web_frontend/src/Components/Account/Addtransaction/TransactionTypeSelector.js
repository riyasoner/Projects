function TransactionTypeSelector({ transactionType, setTransactionType }) {
  const types = [
    "EXPENSE",
    "INCOME",
    "PAYMENT",
    "COLLECTION",
    "TRANSFER",
    "STARTING_BALANCE",
  ];

  const getBtnProps = (type) => {
    const isActive = transactionType === type;
    const baseClass = `btn btn-sm`;

    // Default styles
    let className = baseClass;
    let style = {};

    switch (type) {
      case "EXPENSE":
        className += isActive ? " btn-danger" : " btn-outline-danger";
        break;
      case "INCOME":
        className += isActive ? " btn-primary" : " btn-outline-primary";
        break;
      case "PAYMENT":
        className += isActive ? " btn-success" : " btn-outline-success";
        break;
      case "COLLECTION":
        className += " btn";
        style = {
          backgroundColor: isActive ? "purple" : "transparent",
          border: "1px solid purple",
          color: isActive ? "white" : "purple",
        };
        break;
      case "TRANSFER":
        className += " btn";
        style = {
          backgroundColor: isActive ? "orange" : "transparent",
          border: "1px solid orange",
          color: isActive ? "white" : "orange",
        };
        break;
      case "STARTING_BALANCE":
        className += " btn";
        style = {
          backgroundColor: isActive ? "chocolate" : "transparent",
          border: "1px solid chocolate",
          color: isActive ? "white" : "chocolate",
        };
        break;
      default:
        className += isActive ? " btn-secondary" : " btn-outline-secondary";
    }

    return { className, style };
  };

  return (
    <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
      {types.map((type) => {
        const { className, style } = getBtnProps(type);
        return (
          <button
            key={type}
            className={className}
            style={style}
            onClick={() => setTransactionType(type)}
          >
            {type
              .replace(/_/g, " ")
              .toLowerCase()
              .replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        );
      })}
    </div>
  );
}

export default TransactionTypeSelector;
