"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export interface Incident {
  id: number;
  created_at: string;
  type: string;
  description: string;
  location: string;
  status: string;
  worker_id: number;
}

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("incident")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching incidents:", error);
      } else {
        setIncidents(data as Incident[]);
      }

      setLoading(false);
    };

    fetchIncidents();
  }, []);

  return (
    <div className="bg-cyan-950 min-h-screen">
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-4">Incident Status</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <DataTable columns={columns} data={incidents} />
        )}
      </div>
    </div>
  );
}
