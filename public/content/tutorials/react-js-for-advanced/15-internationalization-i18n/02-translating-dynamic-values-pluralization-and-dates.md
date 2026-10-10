# Translating Dynamic Values, Pluralization, and Dates

Basic word-for-word string translation breaks down when handling grammatically complex linguistic rules. Different human languages possess completely different rules for **pluralization** (e.g. English has 2 plural forms, Arabic has 6, Japanese has 0), dynamic currency formatting, and localized calendar dates. Handling these correctly requires combining `i18next` with the native browser `Intl` API.

---

## 1. Enterprise Pluralization Rules

In English, pluralization is binary (1 item vs many items). In other languages (Russian, Polish, Arabic), nouns change forms based on specific numerical remainder patterns:

```json
// public/locales/en/common.json
{
  "itemCount_one": "You have {{count}} item in your cart",
  "itemCount_other": "You have {{count}} items in your cart",
  "itemCount_zero": "Your shopping cart is completely empty"
}
```

```json
// public/locales/ar/common.json (Arabic has 6 plural forms!)
{
  "itemCount_zero": "سلتك فارغة",
  "itemCount_one": "لديك عنصر واحد في سلتك",
  "itemCount_two": "لديك عنصران في سلتك",
  "itemCount_few": "لديك {{count}} عناصر في سلتك",
  "itemCount_many": "لديك {{count}} عنصراً في سلتك",
  "itemCount_other": "لديك {{count}} عنصر في سلتك"
}
```

When invoking `t()`, pass `count`:

```tsx
// React automatically selects the correct linguistic plural form!
<p>{t("itemCount", { count: items.length })}</p>
```

---

## 2. Number and Currency Localization via `Intl.NumberFormat`

Never format currency with hardcoded dollar signs (`$${amount}`). Different countries format numbers differently (e.g. `$1,250.50` in the US vs `1.250,50 €` in Germany):

```ts
export function formatCurrency(amount: number, locale: string, currency: string = "USD"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

// In en-US: formatCurrency(1250.5, "en-US", "USD") ──► "$1,250.50"
// In de-DE: formatCurrency(1250.5, "de-DE", "EUR") ──► "1.250,50 €"
```

---

## 3. Date & Time Localization via `Intl.DateTimeFormat`

Formatting dates directly with string concatenation generates confusing timestamps (is `05/06/2026` May 6 or June 5?). Use `Intl.DateTimeFormat`:

```tsx
import React from "react";
import { useTranslation } from "react-i18next";

export function TransactionDateBadge({ timestamp }: { timestamp: Date }) {
  const { i18n } = useTranslation();

  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "full",
    timeStyle: "short",
  }).format(timestamp);

  return <span className="text-xs font-mono text-slate-400">{formattedDate}</span>;
}

// In en-US: "Tuesday, September 15, 2026 at 4:30 AM"
// In de-DE: "Dienstag, 15. September 2026 um 04:30"
// In ja-JP: "2026年9月15日火曜日 4:30"
```

---

## 4. Relative Time Formatting (`Intl.RelativeTimeFormat`)

For real-time feeds displaying "5 minutes ago" or "in 2 days":

```ts
export function formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit, locale: string) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return rtf.format(value, unit);
}

// formatRelativeTime(-5, "minute", "en") ──► "5 minutes ago"
// formatRelativeTime(-5, "minute", "es") ──► "hace 5 minutos"
// formatRelativeTime(1, "day", "de")     ──► "morgen"
```

---

## Practice Quiz

### Q1: Why is naive pluralization (count === 1 ? "item" : "items") considered an internationalization anti-pattern?
- A) It crashes the V8 engine
- B) Many world languages (like Arabic, Polish, Russian) have 3 to 6 distinct plural grammatical forms based on numerical values rather than a binary singular/plural rule
- C) English does not support plurals
- D) It violates HTML5 standards
**Answer:** B
**Explanation:** Grammatical pluralization varies widely across global languages; assuming every language uses binary singular/plural rules results in broken grammar for multilingual users.

### Q2: How does i18next determine which plural translation key to use?
- A) It calls an external AI service
- B) It evaluates the count option passed to t("key", { count }) against CLDR (Common Locale Data Repository) plural rules for the active language
- C) It counts the number of characters in the string
- D) It defaults to English rules
**Answer:** B
**Explanation:** i18next includes built-in CLDR plural rules to map the numerical count parameter to the correct language suffix (_one, _two, _few, _many, _other).

### Q3: Why should native browser Intl APIs (Intl.NumberFormat, Intl.DateTimeFormat) be preferred over heavy external formatting libraries?
- A) They are built directly into modern browser JavaScript engines with 0 KB bundle weight and comprehensive international localization data
- B) External libraries are illegal in enterprise apps
- C) Intl APIs run on the server
- D) Intl APIs only work with US Dollars
**Answer:** A
**Explanation:** The ECMAScript Intl specification is natively implemented in all modern browser runtimes, providing accurate internationalization without adding hundreds of kilobytes to your bundle.

### Q4: How does a German locale format the number 1234567.89 compared to US English?
- A) They are completely identical
- B) German uses periods as thousands separators and commas as decimals (1.234.567,89), whereas US English uses commas for thousands and periods for decimals (1,234,567.89)
- C) German omits all decimal places
- D) German reverses the digits
**Answer:** B
**Explanation:** European conventions invert periods and commas relative to American formatting, making automated locale-aware formatting via Intl.NumberFormat essential.

### Q5: What does numeric: "auto" provide in Intl.RelativeTimeFormat?
- A) It formats numbers automatically into currency
- B) It translates values like -1 day into idiomatic natural phrases like "yesterday" or "ayer" rather than "1 day ago"
- C) It rounds all numbers to the nearest integer
- D) It sets the timezone to UTC
**Answer:** B
**Explanation:** The numeric: "auto" configuration option produces idiomatic expressions like "yesterday", "tomorrow", or "last week" when applicable.
