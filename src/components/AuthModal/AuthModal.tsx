import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Modal } from "../Modal/Modal";
import styles from "./AuthModal.module.css";
import { loginWithEmail, registerWithEmail } from "../../services/auth/authApi";

type Mode = "login" | "register";

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

const schema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup.string().when("$mode", {
    is: "register",
    then: (s) => s.required("Name is required"),
    otherwise: (s) => s.notRequired(),
  }),
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Min 6 characters"),
});

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function AuthModal({ isOpen, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("login");

  const title = useMemo(
    () => (mode === "login" ? "Log In" : "Registration"),
    [mode]
  );

  const description = useMemo(
    () =>
      mode === "login"
        ? "Welcome back! Please enter your credentials to access your account and continue your search for a teacher."
        : "Thank you for your interest in our platform! In order to register, we need some information. Please provide us with the following information.",
    [mode]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    context: { mode },
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  });

  const submitText = mode === "login" ? "Log In" : "Sign Up";

  const onSubmit = async (values: FormValues) => {
    if (mode === "login") {
      await loginWithEmail(values.email, values.password);
    } else {
      await registerWithEmail(values.email, values.password);
    }

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

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {mode === "register" && (
          <label className={styles.field}>
            <span className={styles.label}>Name</span>
            <input className={styles.input} type="text" {...register("name")} />
            {errors.name && (
              <span className={styles.error}>{errors.name.message}</span>
            )}
          </label>
        )}

        <label className={styles.field}>
          <span className={styles.label}>Email</span>
          <input className={styles.input} type="email" {...register("email")} />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Password</span>
          <input
            className={styles.input}
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </label>

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : submitText}
        </button>

        <div className={styles.switchRow}>
          {mode === "login" ? (
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => {
                setMode("register");
                reset();
              }}
            >
              No account? Sign Up
            </button>
          ) : (
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => {
                setMode("login");
                reset();
              }}
            >
              Already have an account? Log In
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
