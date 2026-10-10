# Multi-Step Wizards and Dynamic Schema Validation with Yup

Enterprise onboarding, loan applications, and configuration setups frequently span multi-step wizard flows. Managing state across steps, validating only the fields relevant to the current active step, and supporting conditional branches based on previous answers requires advanced Formik and Yup orchestration.

---

## 1. Multi-Step Wizard Architecture

A production multi-step wizard must satisfy three criteria:
1. **Preserved Unified State:** State from Step 1 must persist when moving to Step 2 and Step 3 without submitting premature data to the server.
2. **Step-Specific Validation:** Clicking "Next" must validate **only** the inputs belonging to the active step.
3. **Step Navigation:** Users must be able to step backward ("Previous") without triggering validation blocks.

```
Step 1: Account Info  ──[Next: Validates Step 1]──► Step 2: Company Details ──[Next: Validates Step 2]──► Step 3: Review & Submit
       ▲                                                    │
       └──────────────────[Previous: No Validation]─────────┘
```

---

## 2. Implementing the Wizard with Dynamic Yup Schemas

```tsx
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define individual schemas for each step
const stepSchemas = [
  // Step 1 Schema: Personal Details
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  }),
  // Step 2 Schema: Organization Details with conditional field
  Yup.object({
    companyName: Yup.string().required("Company name is required"),
    hasTaxId: Yup.boolean(),
    taxId: Yup.string().when("hasTaxId", {
      is: true,
      then: (schema) => schema.required("Tax ID is required when registered"),
      otherwise: (schema) => schema.optional(),
    }),
  }),
  // Step 3 Schema: Plan Selection
  Yup.object({
    planTier: Yup.string().oneOf(["starter", "growth", "enterprise"]).required("Select a tier"),
  }),
];

export function MultiStepOnboardingWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const isLastStep = stepIndex === stepSchemas.length - 1;

  const currentValidationSchema = stepSchemas[stepIndex];

  return (
    <div className="max-w-xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-2xl text-white">
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        {["Identity", "Organization", "Subscription"].map((label, idx) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === stepIndex
                  ? "bg-cyan-500 text-slate-950"
                  : idx < stepIndex
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {idx + 1}
            </span>
            <span className={`text-xs font-medium ${idx === stepIndex ? "text-cyan-400" : "text-slate-500"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          companyName: "",
          hasTaxId: false,
          taxId: "",
          planTier: "growth",
        }}
        validationSchema={currentValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          if (!isLastStep) {
            // Advance to next step; Formik preserves all existing values in memory!
            setStepIndex((curr) => curr + 1);
            setSubmitting(false);
          } else {
            // Final submission
            console.log("Final Wizard Submission:", values);
            await new Promise((r) => setTimeout(r, 1200));
            setSubmitting(false);
            alert("Account provisioned successfully!");
          }
        }}
      >
        {({ values, isSubmitting }) => (
          <Form className="space-y-4">
            {/* Step 1 Content */}
            {stepIndex === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">First Name</label>
                  <Field name="firstName" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white" />
                  <ErrorMessage name="firstName" component="div" className="text-xs text-rose-400 mt-1" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Last Name</label>
                  <Field name="lastName" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white" />
                  <ErrorMessage name="lastName" component="div" className="text-xs text-rose-400 mt-1" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                  <Field name="email" type="email" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white" />
                  <ErrorMessage name="email" component="div" className="text-xs text-rose-400 mt-1" />
                </div>
              </div>
            )}

            {/* Step 2 Content */}
            {stepIndex === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Company Legal Name</label>
                  <Field name="companyName" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white" />
                  <ErrorMessage name="companyName" component="div" className="text-xs text-rose-400 mt-1" />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Field type="checkbox" name="hasTaxId" id="hasTaxId" className="h-4 w-4 rounded bg-slate-800 border-slate-700" />
                  <label htmlFor="hasTaxId" className="text-xs text-slate-300">Company is tax registered (VAT/EIN)</label>
                </div>

                {values.hasTaxId && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tax ID / EIN</label>
                    <Field name="taxId" className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white" />
                    <ErrorMessage name="taxId" component="div" className="text-xs text-rose-400 mt-1" />
                  </div>
                )}
              </div>
            )}

            {/* Step 3 Content */}
            {stepIndex === 2 && (
              <div className="space-y-4">
                <label className="block text-xs text-slate-400">Choose Deployment Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {["starter", "growth", "enterprise"].map((tier) => (
                    <label
                      key={tier}
                      className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center capitalize text-sm font-semibold transition ${
                        values.planTier === tier
                          ? "border-cyan-500 bg-cyan-950/40 text-cyan-300"
                          : "border-slate-800 bg-slate-800/40 text-slate-400"
                      }`}
                    >
                      <Field type="radio" name="planTier" value={tier} className="sr-only" />
                      {tier}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-800 mt-6">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => setStepIndex((curr) => curr - 1)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-lg"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-lg disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : isLastStep ? "Complete Registration" : "Continue"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
```

---

## Practice Quiz

### Q1: How does the multi-step wizard validate only the inputs on the active step?
- A) By dynamically passing the active step's validation schema (stepSchemas[stepIndex]) to Formik's validationSchema prop
- B) By deleting values from other steps
- C) By unmounting the browser DOM
- D) Formik cannot validate individual steps
**Answer:** A
**Explanation:** Dynamically supplying stepSchemas[stepIndex] to Formik's validationSchema prop ensures that when the user submits that step, Yup checks only the fields relevant to the current step.

### Q2: Why should the "Previous" step button be of type="button" rather than type="submit"?
- A) type="submit" would trigger Formik's onSubmit handler and run validation, preventing users from moving backward if current inputs are invalid
- B) type="button" looks better visually
- C) Browsers forbid more than one submit button per form
- D) type="button" reloads the page
**Answer:** A
**Explanation:** A button with type="button" prevents form submission and skips validation, allowing users to freely navigate backward even if the current step contains empty required fields.

### Q3: How do you achieve conditional validation in Yup (e.g. taxId required only if hasTaxId is true)?
- A) Yup.if()
- B) schema.when('hasTaxId', { is: true, then: ..., otherwise: ... })
- C) Yup.ternary()
- D) Yup.condition()
**Answer:** B
**Explanation:** The .when() method enables conditional schema definitions based on sibling or ancestor field values.

### Q4: Where is the unified form data stored as the user navigates between steps?
- A) In the browser cookie
- B) In Formik's centralized in-memory values object wrapped around the entire wizard
- C) In the operating system registry
- D) Formik discards data between steps
**Answer:** B
**Explanation:** The single parent Formik component wraps all steps, persisting values in memory across step changes without premature network submissions.

### Q5: What is the purpose of step indicator badges in enterprise wizard design?
- A) To increase CSS complexity
- B) To provide clear mental models of progress, completion status, and remaining effort for lengthy user workflows
- C) To speed up internet download speeds
- D) To prevent right-clicks
**Answer:** B
**Explanation:** Visual step trackers orient users, show how many steps remain, and indicate which sections have been completed or contain errors.
