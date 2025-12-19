import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Modal } from "../Modal/Modal";
import styles from "./BookTrialModal.module.css";

type Reason = "career" | "kids" | "abroad" | "exams" | "culture";

type FormValues = {
  reason: Reason;
  fullName: string;
  email: string;
  phone: string;
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  reason: yup
    .mixed<Reason>()
    .oneOf(["career", "kids", "abroad", "exams", "culture"])
    .required("Please choose a reason"),
  fullName: yup.string().required("Full name is required").min(2, "Too short"),
  email: yup.string().required("Email is required").email("Invalid email"),
  phone: yup.string().required("Phone number is required").min(6, "Too short"),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  avatarUrl?: string;
};

const reasons: Array<{ value: Reason; label: string }> = [
  { value: "career", label: "Career and business" },
  { value: "kids", label: "Lesson for kids" },
  { value: "abroad", label: "Living abroad" },
  { value: "exams", label: "Exams and coursework" },
  { value: "culture", label: "Culture, travel or hobby" },
];

export function BookTrialModal({
  isOpen,
  onClose,
  teacherName,
  avatarUrl,
}: Props) {
  const title = "Book trial lesson";

  const description = useMemo(
    () =>
      "Our experienced tutor will assess your current language level, discuss your learning goals, and tailor the lesson to your specific needs.",
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: "career",
      fullName: "",
      email: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  const selectedReason = useWatch({ control, name: "reason" });

  // коли закрили модалку — скидаємо форму
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (values: FormValues) => {
    // Тут поки без бекенда: просто перевіримо логіку
    // На майбутнє можна писати в Firebase (bookings)
    console.log("BOOK TRIAL:", { teacherName, ...values });

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title={title}
    >
      <p className={styles.description}>{description}</p>

      <div className={styles.teacherRow}>
        {avatarUrl ? (
          <img className={styles.avatar} src={avatarUrl} alt={teacherName} />
        ) : (
          <div className={styles.avatarStub} />
        )}

        <div>
          <div className={styles.teacherLabel}>Your teacher</div>
          <div className={styles.teacherName}>{teacherName}</div>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <h3 className={styles.question}>
          What is your main reason for learning English?
        </h3>

        <div className={styles.radios}>
          {reasons.map((r) => (
            <label key={r.value} className={styles.radioRow}>
              <input
                type="radio"
                value={r.value}
                {...register("reason")}
                checked={selectedReason === r.value}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>

        {errors.reason && (
          <p className={styles.error}>{errors.reason.message}</p>
        )}

        <div className={styles.fields}>
          <label className={styles.field}>
            <input
              className={styles.input}
              type="text"
              placeholder="Full Name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName.message}</span>
            )}
          </label>

          <label className={styles.field}>
            <input
              className={styles.input}
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </label>

          <label className={styles.field}>
            <input
              className={styles.input}
              type="tel"
              placeholder="Phone number"
              {...register("phone")}
            />
            {errors.phone && (
              <span className={styles.error}>{errors.phone.message}</span>
            )}
          </label>
        </div>

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : "Book"}
        </button>
      </form>
    </Modal>
  );
}
