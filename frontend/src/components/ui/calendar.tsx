import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { setMonth, setYear } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(props.defaultMonth || props.selected as Date || new Date());

  // Sync with selected date when it changes
  React.useEffect(() => {
    if (props.selected && props.selected instanceof Date) {
      setCurrentMonth(props.selected);
    }
  }, [props.selected]);

  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, []);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = setMonth(currentMonth, parseInt(monthIndex));
    setCurrentMonth(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(currentMonth, parseInt(year));
    setCurrentMonth(newDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today);
  };

  return (
    <div className="p-3 pointer-events-auto">
      <DayPicker
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        showOutsideDays={showOutsideDays}
        className={cn("", className)}
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-3",
          caption: "flex justify-between items-center px-1",
          caption_label: "hidden",
          nav: "flex items-center gap-1",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 hover:bg-accent transition-colors",
          ),
          nav_button_previous: "",
          nav_button_next: "",
          table: "w-full border-collapse",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-9 font-medium text-[0.75rem] uppercase",
          row: "flex w-full mt-1",
          cell: cn(
            "relative h-9 w-9 text-center text-sm p-0",
            "focus-within:relative focus-within:z-20",
            "[&:has([aria-selected])]:bg-accent/50 [&:has([aria-selected])]:rounded-md",
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent/80 transition-colors rounded-md"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-md",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground/50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
          day_disabled: "text-muted-foreground/30",
          day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
          Caption: ({ displayMonth }) => (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <Select
                  value={displayMonth.getMonth().toString()}
                  onValueChange={handleMonthChange}
                >
                  <SelectTrigger className="h-8 w-[80px] text-sm font-medium border border-border/50 rounded-md px-2 bg-background hover:bg-accent/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    {MONTHS.map((month, index) => (
                      <SelectItem key={month} value={index.toString()} className="text-sm">
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={displayMonth.getFullYear().toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="h-8 w-[75px] text-sm font-medium border border-border/50 rounded-md px-2 bg-background hover:bg-accent/50 transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[280px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()} className="text-sm">
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTodayClick}
                  className="h-8 px-2 text-xs font-medium hover:bg-accent/50"
                >
                  Today
                </Button>
              </div>
            </div>
          ),
        }}
        {...props}
      />
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
