import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentSales } from "@/lib/dummyData";

export default function RecentSalesTable({ title = "Recent Transactions", limit }) {
  const data = limit ? recentSales.slice(0, limit) : recentSales;

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{sale.user}</span>
                    <span className="text-xs text-muted-foreground">{sale.date}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={sale.status === "Completed" ? "default" : "secondary"}
                    className={sale.status === "Failed" ? "bg-destructive hover:bg-destructive/80" : ""}
                  >
                    {sale.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{sale.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}