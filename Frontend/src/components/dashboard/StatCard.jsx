import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, change, trend, icon: Icon, className }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="flex items-center text-xs text-muted-foreground mt-1">
          {trend === "up" && <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />}
          {trend === "down" && <ArrowDown className="mr-1 h-3 w-3 text-red-500" />}
          {trend === "neutral" && <Minus className="mr-1 h-3 w-3" />}
          
          <span
            className={cn(
              trend === "up" && "text-emerald-500",
              trend === "down" && "text-red-500"
            )}
          >
            {change}
          </span>
          <span className="ml-1">from last month</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;