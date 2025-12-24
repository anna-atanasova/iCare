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
import { therapistApi } from "../api/therapist";
import CalendarHeader from "../components/CalendarHeader";
import DayHeaders from "../components/DayHeaders";
import CalendarGrid from "../components/CalendarGrid";
import RatingLegend from "../components/RatingLegend";
import DiaryModal from "../components/DiaryModal";
import PatientSelector from "../components/PatientSelector";
import { getMonthName, dateToString, getTodayString } from "../utils";

const Diary: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const [currentYear, setCurrentYear] = createSignal(now.getFullYear());
  const [currentMonth, setCurrentMonth] = createSignal(now.getMonth() + 1);
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [selectedDateStr, setSelectedDateStr] = createSignal<string | null>(
    null,
  );
  const [selectedEntry, setSelectedEntry] = createSignal<
    DiaryEntry | undefined
  >(undefined);

  const [selectedPatientId, setSelectedPatientId] = createSignal<number | null>(
    null,
  );
  const isTherapist = () => user()?.userType === "THERAPIST";

  const [patients] = createResource(
    () => ({
      authenticated: isAuthenticated(),
      isTherapist: isTherapist(),
    }),
    async (params) => {
      if (!params.authenticated || !params.isTherapist) return [];
      return await therapistApi.getTherapistPatients();
    },
  );

  createEffect(() => {
    const patientList = patients();
    if (
      isTherapist() &&
      patientList &&
      patientList.length > 0 &&
      selectedPatientId() === null
    ) {
      setSelectedPatientId(patientList[0].userId);
    }
  });

  const [diaryEntries, { refetch }] = createResource(
    () => ({
      authenticated: isAuthenticated(),
      userId: isTherapist() ? selectedPatientId() : user()?.userId,
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
    const dateStr = dateToString(date);
    return diaryEntries()!.find((entry) => entry.date === dateStr);
  };

  const isToday = (dateStr: string): boolean => dateStr === getTodayString();

  const handleDayClick = (date: Date | null) => {
    if (isTherapist() || !date) return;

    const dateStr = dateToString(date);
    const entry = getEntryForDate(date);

    if (!entry && !isToday(dateStr)) {
      return;
    }

    setSelectedDateStr(dateStr);
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleSaveEntry = async (rating: number, content: string) => {
    const dateStr = selectedDateStr();
    if (!dateStr) return;

    const entry = selectedEntry();

    if (entry) {
      const updateData: { content: string; dailyRating?: number } = { content };

      if (isToday(dateStr)) {
        updateData.dailyRating = rating;
      }

      await diaryApi.updateDiaryEntry(entry.idDiary, updateData);
    } else {
      await diaryApi.createDiaryEntry({
        dailyRating: rating,
        content,
      });
    }

    refetch();
    setIsModalOpen(false);
    setSelectedDateStr(null);
    setSelectedEntry(undefined);
  };

  const handleDeleteEntry = async () => {
    const entry = selectedEntry();
    if (!entry) return;

    await diaryApi.deleteDiaryEntry(entry.idDiary);

    refetch();
    setIsModalOpen(false);
    setSelectedDateStr(null);
    setSelectedEntry(undefined);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDateStr(null);
    setSelectedEntry(undefined);
  };

  const getSelectedDate = (): Date | null => {
    const dateStr = selectedDateStr();
    if (!dateStr) return null;

    const [year, month, day] = dateStr.split("-").map(Number);

    return new Date(year, month - 1, day);
  };

  return (
    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {isTherapist() ? "Patient Diaries" : "My Diary"}
        </h1>
        <p class="text-gray-600">
          {isTherapist()
            ? "View your patients' daily mood ratings"
            : "Track your daily thoughts and feelings"}
        </p>
      </div>

      <Show when={isTherapist()}>
        <PatientSelector
          patients={patients()}
          loading={patients.loading}
          selectedPatientId={selectedPatientId()}
          onPatientChange={setSelectedPatientId}
        />
      </Show>

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

      <Show when={selectedDateStr() && getSelectedDate()}>
        <DiaryModal
          isOpen={isModalOpen()}
          onClose={handleCloseModal}
          entry={selectedEntry()}
          date={getSelectedDate()!}
          onSave={handleSaveEntry}
          onDelete={handleDeleteEntry}
          isToday={isToday(selectedDateStr()!)}
        />
      </Show>
    </div>
  );
};

export default Diary;
