import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        // Attempt to fetch sales. 
        // Note: Backend might restrict this for Cashiers.
        const res = await API.get("/sales"); 
        setSales(res.data.sales || []);
      } catch (err) {
        setError("Unable to load sales history. You may not have permission to view this data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (error) {
    return <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl m-4">{error}</div>;
  }

  return (
    <div className="space-y-6 fade-in p-2">
      <h2 className="text-3xl font-bold tracking-tight">Sales History</h2>
      
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
            ) : sales.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">No transactions found.</TableCell></TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell className="font-mono text-xs">{sale._id.slice(-8).toUpperCase()}</TableCell>
                  <TableCell>{new Date(sale.createdAt).toLocaleDateString()} {new Date(sale.createdAt).toLocaleTimeString()}</TableCell>
                  <TableCell>{sale.items.length} items</TableCell>
                  <TableCell className="text-right font-medium">${sale.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {sale.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SalesHistory;