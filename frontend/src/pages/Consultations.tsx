import {
  Component,
  createEffect,
  createResource,
  createSignal,
  Show,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../context/AuthContext";
import {
  consultationApi,
  Consultation,
  CreateConsultationRequest,
  UpdateConsultationRequest,
  isConsultationPaid,
} from "../api/consultation";
import ConsultationTable from "../components/ConsultationTable";
import ConsultationModal from "../components/ConsultationModal";
import { patientApi } from "../api/patient";
import { Therapy } from "../api/therapy";

const Consultations: Component = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [editingConsultation, setEditingConsultation] =
    createSignal<Consultation | null>(null);
  const [formData, setFormData] = createSignal({
    patientId: 0,
    date: "",
    price: 0,
    advice: "",
    dateOfPayment: null as string | null,
  });
  const [newTherapies, setNewTherapies] = createSignal<Therapy[]>([]);
  const [existingTherapies, setExistingTherapies] = createSignal<Therapy[]>([]);

  const isTherapist = () => user()?.userType === "THERAPIST";

  const [patients] = createResource(
    () => ({
      authenticated: isAuthenticated(),
      isTherapist: isTherapist(),
    }),
    async (params) => {
      if (!params.authenticated || !params.isTherapist) return [];
      return await patientApi.getAllPatients();
    },
  );

  const [consultations, { refetch }] = createResource(
    () => ({
      authenticated: isAuthenticated(),
      userId: user()?.userId,
      isTherapist: isTherapist(),
    }),
    async (params) => {
      if (!params.authenticated || !params.userId || !params.isTherapist)
        return [];
      return await consultationApi.getTherapistConsultations(params.userId);
    },
  );

  createEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isTherapist()) {
      navigate("/", { replace: true });
    }
  });

  const openCreateModal = () => {
    setEditingConsultation(null);
    setNewTherapies([]);
    setExistingTherapies([]);
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      patientId: patients()?.[0]?.userId || 0,
      date: today,
      price: 0,
      advice: "",
      dateOfPayment: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setExistingTherapies(consultation.therapies || []);
    setNewTherapies([]);
    setFormData({
      patientId: consultation.patientId,
      date: consultation.date,
      price: consultation.price,
      advice: consultation.advice,
      dateOfPayment: consultation.dateOfPayment,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConsultation(null);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    try {
      const data = formData();
      const therapiesToSend = newTherapies().map((t) => ({
        name: t.name,
        dose: t.dose,
        expDate: t.expDate,
      }));

      if (editingConsultation()) {
        const updateData: UpdateConsultationRequest = {
          date: data.date,
          price: data.price,
          advice: data.advice,
          dateOfPayment: data.dateOfPayment,
          therapies: therapiesToSend,
        };
        await consultationApi.updateConsultation(
          editingConsultation()!.idConsultation,
          updateData,
        );
      } else {
        const createData: CreateConsultationRequest = {
          patientId: data.patientId,
          date: data.date,
          price: data.price,
          advice: data.advice,
          dateOfPayment: data.dateOfPayment,
          therapies: therapiesToSend,
        };
        await consultationApi.createConsultation(createData);
      }

      refetch();
      closeModal();
    } catch (error: any) {
      alert(error.message || "Failed to save consultation");
    }
  };

  const handleDelete = async (consultationId: number) => {
    if (!confirm("Are you sure you want to delete this consultation?")) return;

    try {
      await consultationApi.deleteConsultation(consultationId);
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to delete consultation");
    }
  };

  const togglePaymentStatus = async (consultation: Consultation) => {
    try {
      const updateData: UpdateConsultationRequest = {
        dateOfPayment: isConsultationPaid(consultation)
          ? null
          : new Date().toISOString().split("T")[0],
      };
      await consultationApi.updateConsultation(
        consultation.idConsultation,
        updateData,
      );
      refetch();
    } catch (error: any) {
      alert(error.message || "Failed to update payment status");
    }
  };

  return (
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-3xl font-bold text-gray-900">Consultation Records</h1>
        <button
          onClick={openCreateModal}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Log New Consultation
        </button>
      </div>

      <Show
        when={!consultations.loading}
        fallback={<div class="text-center py-8">Loading consultations...</div>}
      >
        <Show
          when={(consultations()?.length ?? 0) > 0}
          fallback={
            <div class="text-center py-8 text-gray-500">
              No consultations logged yet. Click "Log New Consultation" to add
              one.
            </div>
          }
        >
          <ConsultationTable
            consultations={consultations()!}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onTogglePayment={togglePaymentStatus}
          />
        </Show>
      </Show>

      <Show when={isModalOpen()}>
        <ConsultationModal
          editingConsultation={editingConsultation()}
          formData={formData()}
          patients={patients() || []}
          newTherapies={newTherapies()}
          existingTherapies={existingTherapies()}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onFormChange={setFormData}
          onNewTherapiesChange={setNewTherapies}
          onExistingTherapiesChange={(therapies) => {
            setExistingTherapies(therapies);
            refetch();
          }}
        />
      </Show>
    </div>
  );
};

export default Consultations;
