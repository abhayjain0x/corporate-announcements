import { LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ListView from "./list-view";

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAirtableData = async () => {
    try {
      console.log("Fetching Airtable data...");
      let allRecords = [];
      let offset = null;
      
      do {
        const url = `https://api.airtable.com/v0/app727E6XRxUhiNW7/tblqVD8DZ7STEeIKD?sort[0][field]=date&sort[0][direction]=desc${offset ? `&offset=${offset}` : ''}`;
        
        const response = await fetch(url, {
        headers: {
            'Authorization': 'Bearer patRTIph8DJrW3JXv.454641783dd1a025712ca81645b1031ee2202804a793c3772e4a92c2031760d3',
            'Content-Type': 'application/json'
        }
      });
        
        if (response.status === 429) {
          console.log("Rate limited, waiting 30 seconds...");
          await new Promise(resolve => setTimeout(resolve, 30000));
          continue;
        }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
        const data = await response.json();
        allRecords = [...allRecords, ...data.records];
        offset = data.offset;
        
        console.log(`Fetched ${data.records.length} records, total: ${allRecords.length}`);
      } while (offset);
      
      console.log("Total Airtable records fetched:", allRecords.length);
      
      if (allRecords.length === 0) {
        throw new Error("No records found in Airtable");
      }
      
      const processedEntries = allRecords.map(record => ({
        date: record.fields.date || '',
        company_name: record.fields.company_name || 'Unknown',
        category: record.fields.category || 'Unknown',
        summary: record.fields.summary || 'No summary available',
        url: record.fields.url || ''
      }));

      console.log("Processed entries:", processedEntries.length);
      setEntries(processedEntries);
      setLastUpdated(new Date());
      setIsError(false);
    } catch (error) {
      console.error("Error fetching Airtable data:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAirtableData();
    const interval = setInterval(fetchAirtableData, 30000);
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

      </div>
      <ListView entries={entries} />
    </div>
  );
}
