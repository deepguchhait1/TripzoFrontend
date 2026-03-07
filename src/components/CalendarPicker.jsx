import { useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CalendarPicker = ({ value, onChange, minDate }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const min = minDate ? new Date(minDate) : today;
  min.setHours(0, 0, 0, 0);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const [viewYear, setViewYear] = useState(
    selectedDate ? selectedDate.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate ? selectedDate.getMonth() : today.getMonth()
  );

  const { days, startDay } = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    return {
      days: daysInMonth,
      startDay: firstDay,
    };
  }, [viewYear, viewMonth]);

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const canGoPrev = () => {
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const lastDayOfPrev = new Date(prevYear, prevMonth + 1, 0);
    return lastDayOfPrev >= min;
  };

  const isDisabled = (day) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < min;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  };

  const isToday = (day) => {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth() === viewMonth &&
      today.getDate() === day
    );
  };

  const handleSelect = (day) => {
    if (isDisabled(day)) return;
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
  };

  const cells = [];
  for (let i = 0; i < startDay; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }
  for (let day = 1; day <= days; day++) {
    const disabled = isDisabled(day);
    const selected = isSelected(day);
    const todayMark = isToday(day);

    cells.push(
      <button
        key={day}
        type="button"
        disabled={disabled}
        onClick={() => handleSelect(day)}
        className={`relative w-full aspect-square rounded-lg text-xs font-medium transition-all duration-150 
          ${disabled
            ? "text-gray-300 cursor-not-allowed"
            : selected
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200 scale-105"
              : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer"
          }
          ${todayMark && !selected ? "ring-1.5 ring-emerald-300 ring-inset" : ""}
        `}
      >
        {day}
        {todayMark && !selected && (
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full" />
        )}
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev()}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <FaChevronLeft className="text-xs" />
        </button>
        <h4 className="text-sm font-semibold text-gray-800">
          {MONTHS[viewMonth]} {viewYear}
        </h4>
        <button
          type="button"
          onClick={goNext}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
        >
          <FaChevronRight className="text-xs" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-gray-400 py-0.5"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">{cells}</div>

      {/* Selected date display */}
      {selectedDate && (
        <div className="mt-2 pt-2 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Selected:{" "}
            <span className="font-semibold text-emerald-600">
              {selectedDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
