import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Show,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import { diaryApi, DiaryEntry } from "../api/diary";
import CalendarHeader from "../components/CalendarHeader";
import DayHeaders from "../components/DayHeaders";
import CalendarGrid from "../components/CalendarGrid";
import RatingLegend from "../components/RatingLegend";
import { getMonthName } from "../utils";

const Diary: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const [currentYear, setCurrentYear] = createSignal(now.getFullYear());
  const [currentMonth, setCurrentMonth] = createSignal(now.getMonth() + 1);

  const [diaryEntries] = createResource(
    () => ({
      authenticated: isAuthenticated(),
      userId: user()?.userId,
      year: currentYear(),
      month: currentMonth(),
    }),

    async (params) => {
      if (!params.authenticated || !params.userId) return [];
      return await diaryApi.getDiaryEntries(
        params.userId,
        params.year,
        params.month,
      );
    },
  );

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    const currentUser = user();
    if (currentUser?.userType !== "PATIENT") {
      navigate("/", { replace: true });
    }
  });

  const goToPreviousMonth = () => {
    if (currentMonth() === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear() - 1);
    } else {
      setCurrentMonth(currentMonth() - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth() === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear() + 1);
    } else {
      setCurrentMonth(currentMonth() + 1);
    }
  };

  const generateCalendarDays = () => {
    const year = currentYear();
    const month = currentMonth();
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const mondayBasedStart = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days: Array<{
      day: number | null;
      isCurrentMonth: boolean;
      date: Date | null;
    }> = [];

    for (let i = 0; i < mondayBasedStart; i++) {
      days.push({ day: null, isCurrentMonth: false, date: null });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month - 1, day),
      });
    }

    return days;
  };

  const getEntryForDate = (date: Date | null): DiaryEntry | undefined => {
    if (!date || !diaryEntries()) return undefined;
    const dateStr = date.toISOString().split("T")[0];
    return diaryEntries()!.find((entry) => entry.date === dateStr);
  };

  const handleDayClick = (date: Date | null) => {
    if (!date) return;
    const entry = getEntryForDate(date);
    if (entry) {
      console.log("Diary entry clicked:", entry);
      // TODO: Open modal to view/edit entry
    } else {
      console.log("No entry for this date, could create one");
      // TODO: Open modal to create entry
    }
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">My Diary</h1>
        <p class="text-gray-600">Track your daily thoughts and feelings</p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6">
        <CalendarHeader
          monthName={getMonthName(currentYear(), currentMonth())}
          onPreviousMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
        />

        <DayHeaders />
        <Show
          when={!diaryEntries.loading}
          fallback={
            <div class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          }
        >
          <CalendarGrid
            days={generateCalendarDays()}
            getEntryForDate={getEntryForDate}
            onDayClick={handleDayClick}
          />
        </Show>
        <RatingLegend />
      </div>
    </div>
  );
};

export default Diary;
