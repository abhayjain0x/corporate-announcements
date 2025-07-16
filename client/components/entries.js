import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ListView from "./list-view";

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchCsvData = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/abhayjain0x/corporate-announcement-web/main/catalyst-watch.csv?t=' + Date.now());
      const csvText = await response.text();
      
      const lines = csvText.trim().split('\n');
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const result = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          
          return {
            date: result[0],
            company_name: result[1],
            category: result[2], 
            summary: result[3]
          };
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setEntries(data);
      setLastUpdated(new Date());
      setIsError(false);
    } catch (error) {
      console.error("Error fetching CSV data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchCsvData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchCsvData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );

  if (isError) return <div className="text-center">Error fetching data</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
        </div>
        <div className="text-xs text-gray-500">
          Auto-refreshing every 30s
        </div>
      </div>
      <ListView entries={entries} />
    </div>
  );
}
