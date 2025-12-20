import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { FirebaseError } from "firebase/app";

import { useAuth } from "../../auth/useAuth";
import { Modal } from "../Modal/Modal";
import styles from "./AuthModal.module.css";
import { loginWithEmail, registerWithEmail } from "../../services/auth/authApi";

type Mode = "login" | "register";

type FormValues = {
  name?: string;
  email: string;
  password: string;
};

type Props = {
  isOpen: boolean;
  mode: Mode;
  onClose: () => void;
  onModeChange: (nextMode: Mode) => void;
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

function getAuthErrorMessage(code?: string) {
  switch (code) {
    case "auth/user-not-found":
      return "User with this email does not exist";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    default:
      return "Authentication error. Please try again.";
  }
}

export function AuthModal({ isOpen, mode, onClose, onModeChange }: Props) {
  const { user } = useAuth();

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
    setError,
    clearErrors,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    context: { mode },
    defaultValues: { name: "", email: "", password: "" },
    mode: "onSubmit",
  });

  useEffect(() => {
    if (user && isOpen) {
      reset();
      clearErrors("root");
      onClose();
    }
  }, [user, isOpen, reset, clearErrors, onClose]);

  const submitText = mode === "login" ? "Log In" : "Sign Up";

  const onSubmit = async (values: FormValues) => {
    try {
      clearErrors("root");

      if (mode === "login") {
        await loginWithEmail(values.email, values.password);
      } else {
        await registerWithEmail(values.email, values.password);
      }

      reset();
      onClose();
    } catch (error) {
      const fbError = error as FirebaseError;
      setError("root", { message: getAuthErrorMessage(fbError.code) });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        clearErrors("root");
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

        {errors.root?.message && (
          <p className={styles.authError}>{errors.root.message}</p>
        )}

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : submitText}
        </button>

        <div className={styles.switchRow}>
          {mode === "login" ? (
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => {
                clearErrors("root");
                reset();
                onModeChange("register");
              }}
            >
              No account? Sign Up
            </button>
          ) : (
            <button
              type="button"
              className={styles.switchBtn}
              onClick={() => {
                clearErrors("root");
                reset();
                onModeChange("login");
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
