"use client";

import { useRegisterUserMutation } from "@/services/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/* ─── Inline styles (zero new deps) ──────────────────────────── */
const S = {
    // layout
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "linear-gradient(135deg, #0A0F1E 0%, #110D2E 60%, #0D1A2E 100%)",
        padding: "2rem",
        fontFamily: "Inter, 'Segoe UI', system-ui, -apple-system, sans-serif",
    } as React.CSSProperties,

    card: {
        width: "100%",
        maxWidth: 480,
        background:
            "linear-gradient(160deg, rgba(124,58,237,0.08) 0%, rgba(10,15,30,0.95) 100%)",
        border: "1px solid rgba(124,58,237,0.25)",
        borderRadius: 20,
        padding: "2.5rem",
        boxShadow:
            "0 0 0 1px rgba(124,58,237,0.1), 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.08)",
        backdropFilter: "blur(20px)",
    } as React.CSSProperties,

    // header
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem",
    } as React.CSSProperties,

    logoMark: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    } as React.CSSProperties,

    logoIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: "linear-gradient(135deg, #7C3AED, #A3E635)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
    } as React.CSSProperties,

    logoText: {
        fontSize: 14,
        fontWeight: 600,
        color: "#C4B5FD",
        letterSpacing: "0.12em",
        textTransform: "uppercase" as const,
    },

    stepBadge: {
        fontSize: 11,
        fontWeight: 600,
        color: "#7C3AED",
        background: "rgba(124,58,237,0.12)",
        border: "1px solid rgba(124,58,237,0.3)",
        borderRadius: 999,
        padding: "4px 12px",
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
    },

    // title block
    titleBlock: {
        marginBottom: "2rem",
    } as React.CSSProperties,

    eyebrow: {
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.2em",
        textTransform: "uppercase" as const,
        color: "#A3E635",
        marginBottom: 8,
    },

    title: {
        fontSize: 28,
        fontWeight: 800,
        color: "#FFFFFF",
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        margin: 0,
    } as React.CSSProperties,

    subtitle: {
        fontSize: 14,
        color: "rgba(196,181,253,0.6)",
        marginTop: 6,
        lineHeight: 1.5,
    } as React.CSSProperties,

    // divider
    divider: {
        height: 1,
        background:
            "linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)",
        marginBottom: "2rem",
    } as React.CSSProperties,

    // fields
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
        marginBottom: "1.5rem",
    } as React.CSSProperties,

    fullCol: {
        gridColumn: "1 / -1",
    } as React.CSSProperties,

    // field wrappers (applied via className on Field)
    // — handled via <style> tag below

    // actions
    actions: {
        display: "flex",
        gap: 12,
        alignItems: "center",
        marginTop: "1.75rem",
    } as React.CSSProperties,

    footer: {
        marginTop: "1.5rem",
        textAlign: "center" as const,
        fontSize: 12,
        color: "rgba(196,181,253,0.4)",
        lineHeight: 1.6,
    },
};

/* ─── Injected <style> for pseudo-states & animations ────────── */
const inlineCSS = `
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fieldGlow {
    from { box-shadow: 0 0 0 0 rgba(124,58,237,0.5); }
    to   { box-shadow: 0 0 0 4px rgba(124,58,237,0); }
  }

  .rf-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .rf-field[data-invalid="true"] .rf-label { color: #F87171; }
  .rf-field[data-invalid="true"] .rf-input {
    border-color: rgba(248,113,113,0.6) !important;
    background: rgba(248,113,113,0.04) !important;
  }

  .rf-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #C4B5FD;
    transition: color 0.2s;
  }

  .rf-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 14px;
    font-family: inherit;
    color: #FFFFFF;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(124,58,237,0.25);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .rf-input::placeholder { color: rgba(196,181,253,0.3); }
  .rf-input:focus {
    border-color: #7C3AED;
    background: rgba(124,58,237,0.08);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.15), inset 0 0 0 1px rgba(124,58,237,0.4);
    animation: fieldGlow 0.4s ease-out;
  }
  .rf-input:-webkit-autofill,
  .rf-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #110D2E inset;
    -webkit-text-fill-color: #fff;
  }

  .rf-error {
    font-size: 11px;
    color: #F87171;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }

  /* Primary CTA */
  .rf-btn-primary {
    position: relative;
    overflow: hidden;
    padding: 11px 28px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #0A0F1E;
    background: #A3E635;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.2s, opacity 0.2s;
    box-shadow: 0 4px 20px rgba(163,230,53,0.35);
    flex-shrink: 0;
  }
  .rf-btn-primary::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(255,255,255,0.5) 50%,
      transparent 70%
    );
    background-size: 200%;
    background-position: -200% center;
    transition: background-position 0s;
  }
  .rf-btn-primary:hover:not(:disabled)::before {
    animation: shimmer 0.55s ease forwards;
  }
  .rf-btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(163,230,53,0.45);
  }
  .rf-btn-primary:active:not(:disabled) { transform: translateY(0); }
  .rf-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Ghost reset btn */
  .rf-btn-ghost {
    padding: 11px 20px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: rgba(196,181,253,0.6);
    background: transparent;
    border: 1px solid rgba(124,58,237,0.2);
    border-radius: 10px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }
  .rf-btn-ghost:hover:not(:disabled) {
    color: #C4B5FD;
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.07);
  }
  .rf-btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Loading dots */
  .rf-dots::after {
    content: "";
    display: inline-block;
    animation: dots 1.2s infinite;
  }
  @keyframes dots {
    0%   { content: ""; }
    33%  { content: "."; }
    66%  { content: ".."; }
    100% { content: "..."; }
  }
`;

/* ─── Tiny internal primitives (replace shadcn components) ────── */
// We wrap the shadcn components with our own className/style overrides.
// The logic (Controller, useForm, mutation) stays 100% intact.

import React from "react";

function RFField({
    children,
    invalid,
    style,
}: {
    children: React.ReactNode;
    invalid?: boolean;
    style?: React.CSSProperties;
}) {
    return (
        <div
            className="rf-field"
            data-invalid={invalid ? "true" : undefined}
            style={style}
        >
            {children}
        </div>
    );
}

function RFLabel({
    htmlFor,
    children,
}: {
    htmlFor?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="rf-label" htmlFor={htmlFor}>
            {children}
        </label>
    );
}

function RFInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input className="rf-input" {...props} />;
}

function RFError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <span className="rf-error">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5.5" stroke="#F87171" />
                <path
                    d="M6 3.5v3M6 8v.5"
                    stroke="#F87171"
                    strokeLinecap="round"
                />
            </svg>
            {message}
        </span>
    );
}

/* ─── Schema (unchanged) ─────────────────────────────────────── */
const formSchema = z
    .object({
        username: z.string().min(3, "Username must be at least 3 characters."),
        email: z.email("Enter a valid email address."),
        password: z.string().min(3, "Password must be at least 3 characters."),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

type RegisterFormValues = z.infer<typeof formSchema>;

/* ─── Main component ─────────────────────────────────────────── */
export default function RegisterForm() {
    const [registerUser, { isLoading }] = useRegisterUserMutation();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        try {
            const response = await registerUser(values).unwrap();
            toast.success(
                response.message ?? "Account registered successfully.",
            );
            form.reset();
        } catch (error) {
            const message =
                typeof error === "object" &&
                error !== null &&
                "data" in error &&
                typeof error.data === "object" &&
                error.data !== null &&
                "message" in error.data &&
                typeof error.data.message === "string"
                    ? error.data.message
                    : "Registration failed. Please try again.";
            toast.error(message);
        }
    }

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    return (
        <div style={S.wrapper}>
            {/* Inject styles */}
            <style>{inlineCSS}</style>

            <div style={S.card}>
                {/* Header */}
                <div style={S.header}>
                    <div style={S.logoMark}>
                        <div style={S.logoIcon}>✦</div>
                        <span style={S.logoText}>Forma</span>
                    </div>
                    <span style={S.stepBadge}>Step 1 of 1</span>
                </div>

                {/* Title */}
                <div style={S.titleBlock}>
                    <p style={S.eyebrow}>Get started</p>
                    <h1 style={S.title}>Create your account</h1>
                    <p style={S.subtitle}>
                        Join thousands of teams already using Forma.
                    </p>
                </div>

                <div style={S.divider} />

                {/* Form — logic entirely untouched */}
                <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
                    <div style={S.grid}>
                        {/* Username */}
                        <Controller
                            control={form.control}
                            name="username"
                            render={({ field, fieldState }) => (
                                <RFField
                                    invalid={fieldState.invalid}
                                    style={S.fullCol}
                                >
                                    <RFLabel htmlFor={field.name}>
                                        Username
                                    </RFLabel>
                                    <RFInput
                                        id={field.name}
                                        type="text"
                                        autoComplete="username"
                                        placeholder="john_doe"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    <RFError
                                        message={fieldState.error?.message}
                                    />
                                </RFField>
                            )}
                        />

                        {/* Email */}
                        <Controller
                            control={form.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <RFField
                                    invalid={fieldState.invalid}
                                    style={S.fullCol}
                                >
                                    <RFLabel htmlFor={field.name}>
                                        Email
                                    </RFLabel>
                                    <RFInput
                                        id={field.name}
                                        type="email"
                                        autoComplete="email"
                                        placeholder="john@company.com"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    <RFError
                                        message={fieldState.error?.message}
                                    />
                                </RFField>
                            )}
                        />

                        {/* Password */}
                        <Controller
                            control={form.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <RFField invalid={fieldState.invalid}>
                                    <RFLabel htmlFor={field.name}>
                                        Password
                                    </RFLabel>
                                    <RFInput
                                        id={field.name}
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    <RFError
                                        message={fieldState.error?.message}
                                    />
                                </RFField>
                            )}
                        />

                        {/* Confirm Password */}
                        <Controller
                            control={form.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                                <RFField invalid={fieldState.invalid}>
                                    <RFLabel htmlFor={field.name}>
                                        Confirm
                                    </RFLabel>
                                    <RFInput
                                        id={field.name}
                                        type="password"
                                        autoComplete="new-password"
                                        placeholder="••••••••"
                                        aria-invalid={fieldState.invalid}
                                        {...field}
                                    />
                                    <RFError
                                        message={fieldState.error?.message}
                                    />
                                </RFField>
                            )}
                        />
                    </div>

                    {/* Actions */}
                    <div style={S.actions}>
                        <button
                            type="submit"
                            className="rf-btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="rf-dots">Creating</span>
                            ) : (
                                "Create account →"
                            )}
                        </button>
                        <button
                            type="reset"
                            className="rf-btn-ghost"
                            disabled={isLoading}
                        >
                            Reset
                        </button>
                    </div>

                    <p style={S.footer}>
                        By creating an account you agree to our{" "}
                        <span style={{ color: "#C4B5FD", cursor: "pointer" }}>
                            Terms of Service
                        </span>{" "}
                        and{" "}
                        <span style={{ color: "#C4B5FD", cursor: "pointer" }}>
                            Privacy Policy
                        </span>
                        .
                    </p>
                </form>
            </div>
        </div>
    );
}
