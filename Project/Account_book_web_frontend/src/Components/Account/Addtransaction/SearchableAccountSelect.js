import React from "react";
import Select from "react-select";

function SearchableAccountSelect({ accounts, value, onChange, accountId }) {
  const flattenedAccounts = accounts.flatMap((group) => group.accounts);

  // Remove current account
  const options = flattenedAccounts
    .filter((acc) => acc.id !== accountId)
    .map((acc) => ({
      value: acc.id,
      label: acc.name,
    }));

  // Only show selected option if it's NOT the current account
  const selectedOption =
    value && value !== accountId
      ? options.find((opt) => opt.value === value)
      : null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(selected) => onChange(selected?.value || "")}
      placeholder="Search account..."
      isClearable
      menuPlacement="auto"
      menuPosition="fixed"
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
      }}
    />
  );
}

export default SearchableAccountSelect;
