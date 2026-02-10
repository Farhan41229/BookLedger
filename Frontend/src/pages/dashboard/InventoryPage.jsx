import { useState, useEffect } from "react";
import API from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, CheckCircle, RefreshCcw } from "lucide-react";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fetchInventory = async () => {
  //   setLoading(true);
  //   try {
  //     // In a real app, this would be a specific endpoint like /inventory/status
  //     const res = await API.get("/books"); 
  //     setInventory(res.data.data || res.data || []);
  //   } catch (error) {
  //     console.error("Failed to load inventory");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await API.get("/books"); 
      // --- FIX START ---
      setInventory(res.data.books || []);
      // --- FIX END ---
    } catch (error) {
      console.error("Failed to load inventory");
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchInventory();
  }, []);

  // Derived Metrics
  const lowStockItems = inventory.filter(item => item.stock <= item.reorderLevel);
  const totalItems = inventory.reduce((acc, item) => acc + item.stock, 0);
  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);

  return (
    <div className="space-y-6 fade-in p-2">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inventory Status</h2>
        <Button variant="outline" onClick={fetchInventory}><RefreshCcw className="mr-2 h-4 w-4" /> Refresh</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                <span className="text-emerald-500 font-bold">$</span>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-amber-600">{lowStockItems.length}</div>
                <p className="text-xs text-muted-foreground">Items below reorder level</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Units</CardTitle>
                <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
        </Card>
      </div>

      {/* Low Stock Table */}
      <Card className="border-amber-200 dark:border-amber-900/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Reorder Recommendations
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Reorder Level</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lowStockItems.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center h-24 text-muted-foreground"><CheckCircle className="inline mr-2 h-4 w-4 text-emerald-500"/>All stock levels are healthy.</TableCell></TableRow>
                    ) : (
                        lowStockItems.map(item => (
                            <TableRow key={item._id}>
                                <TableCell className="font-medium">{item.title}</TableCell>
                                <TableCell>
                                    <Badge variant="destructive">{item.stock}</Badge>
                                </TableCell>
                                <TableCell>{item.reorderLevel}</TableCell>
                                <TableCell className="text-muted-foreground">{item.supplier || "N/A"}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline">Create PO</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;