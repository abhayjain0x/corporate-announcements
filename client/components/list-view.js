import { SearchIcon } from "lucide-react";
import { useState } from "react";

function Entry({ company_name, category, summary, date, url }) {
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
          {url ? (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {company_name}
            </a>
          ) : (
            company_name
          )}
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
          <h3 className="font-medium text-black text-sm">
            {url ? (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {company_name}
              </a>
            ) : (
              company_name
            )}
          </h3>
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
  const [dateFilter, setDateFilter] = useState("today");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    setCurrentPage(1);
    if (event.target.value !== "custom") {
      setCustomDate("");
    }
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleCustomDateChange = (event) => {
    setCustomDate(event.target.value);
    setCurrentPage(1);
  };

  // Get unique categories from entries
  const uniqueCategories = [...new Set(entries.map(entry => entry.category))].filter(Boolean).sort();

  const getDateCategory = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) return "today";
    
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 7) return "week";
    if (diffDays <= 30) return "month";
    return "older";
  };

  const filteredEntries = entries.filter((entry) => {
    const searchableText = `${entry.company_name} ${entry.category} ${entry.summary}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchTerm);
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || entry.category === categoryFilter;
    
    // Date filter
    let matchesDate = true;
    if (dateFilter === "custom" && customDate) {
      const entryDate = new Date(entry.date);
      const selectedDate = new Date(customDate);
      matchesDate = entryDate.toDateString() === selectedDate.toDateString();
    } else if (dateFilter !== "all" && dateFilter !== "custom") {
      const dateCategory = getDateCategory(entry.date);
      if (dateFilter === "week") {
        matchesDate = dateCategory === "today" || dateCategory === "week";
      } else if (dateFilter === "month") {
        matchesDate = dateCategory === "today" || dateCategory === "week" || dateCategory === "month";
      } else {
        matchesDate = dateCategory === dateFilter;
      }
    }
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + entriesPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

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
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              className="appearance-none rounded-md border border-gray-400 bg-[#f0eadd] px-3 py-2.5 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="appearance-none rounded-md border border-gray-400 bg-[#f0eadd] px-3 py-2.5 pr-8 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="older">Older</option>
                <option value="custom">Custom Date</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {dateFilter === "custom" && (
              <div className="relative">
                <input
                  type="date"
                  value={customDate}
                  onChange={handleCustomDateChange}
                  className="rounded-md border border-gray-400 bg-[#f0eadd] px-3 py-2.5 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            )}
          </div>
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

      {paginatedEntries.map((entry, index) => (
        <Entry
          key={index}
          company_name={entry.company_name}
          category={entry.category}
          summary={entry.summary}
          date={entry.date}
          url={entry.url}
        />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + entriesPerPage, filteredEntries.length)} of {filteredEntries.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-400 rounded-md bg-[#f0eadd] text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-400 rounded-md bg-[#f0eadd] text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
