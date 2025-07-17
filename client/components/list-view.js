import { SearchIcon } from "lucide-react";
import { useState } from "react";

function Entry({ company_name, category, summary, date }) {
  let formattedDate = 'Invalid Date';
  
  try {
    const dateObj = new Date(date);
    if (!isNaN(dateObj.getTime())) {
      formattedDate = dateObj.toISOString().split("T")[0];
    }
  } catch (error) {
    console.warn('Invalid date format:', date);
  }

  return (
    <>
      {/* Desktop Table Layout */}
      <div className="hidden sm:grid text-secondary text-md group grid-cols-12 gap-4 py-3">
        <div className="col-span-2 font-medium text-black text-sm">
          {company_name}
        </div>
        <div className="col-span-2 text-xs text-black px-2 py-1 self-start">
          {category}
        </div>
        <div className="col-span-6 text-black text-sm leading-relaxed">
          {summary}
        </div>
        <div className="col-span-2 text-right">
          <p className="font-berkeley text-black text-sm whitespace-nowrap">
            {formattedDate}
          </p>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="block sm:hidden bg-white/10 backdrop-blur-sm border border-gray-200/30 rounded-lg p-4 mb-3 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-black text-sm">{company_name}</h3>
          <span className="text-xs text-gray-600 font-berkeley">{formattedDate}</span>
        </div>
        <div className="mb-2">
          <span className="inline-block bg-black/10 backdrop-blur-sm text-black text-xs px-2 py-1 rounded border border-gray-300/30">
            {category}
          </span>
        </div>
        <p className="text-black text-sm leading-relaxed">{summary}</p>
      </div>
    </>
  );
}

export default function ListView({ entries }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredEntries = entries.filter((entry) => {
    const searchableText = `${entry.company_name} ${entry.category} ${entry.summary}`.toLowerCase();
    return searchableText.includes(searchTerm);
  });

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[240px] flex-grow">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
placeholder="Search"
            onChange={handleSearchChange}
            className="w-full rounded-md border border-gray-400 bg-[#f0eadd] px-3 py-2.5 pl-8 text-sm font-medium text-gray-600 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden sm:grid grid-cols-12 gap-4 py-2 border-b border-gray-200 mb-2">
        <div className="col-span-2 font-medium text-black uppercase tracking-wide font-courier" style={{fontSize: '15px'}}>
          Company
        </div>
        <div className="col-span-2 font-medium text-black uppercase tracking-wide font-courier" style={{fontSize: '15px'}}>
          Category
        </div>
        <div className="col-span-6 font-medium text-black uppercase tracking-wide font-courier" style={{fontSize: '15px'}}>
          Summary
        </div>
        <div className="col-span-2 font-medium text-black uppercase tracking-wide text-right font-courier" style={{fontSize: '15px'}}>
          Date
        </div>
      </div>

      {filteredEntries.map((entry, index) => (
        <Entry
          key={index}
          company_name={entry.company_name}
          category={entry.category}
          summary={entry.summary}
          date={entry.date}
        />
      ))}
    </>
  );
}
