import { format } from "date-fns";
import { vi } from "date-fns/locale";

/** ISO → yyyy-MM-dd */
export const isoDateOnly = (d?: string) =>
  d ? new Date(d).toISOString().split("T")[0] : "";

/** ISO → datetime-local input */
export const isoToLocalInput = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

/** datetime-local → ISO */
export const localInputToIso = (local: string) => {
  if (!local) return "";
  const d = new Date(local);
  return isNaN(d.getTime()) ? "" : d.toISOString();
};

/** Format date */
export const formatDate = (dateInput?: string | Date | null): string => {
  if (!dateInput) return "—";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "—";
    return format(date, "dd-MM-yyyy", { locale: vi });
  } catch {
    return "—";
  }
};

/** Format date + time */
export const formatDateTime = (dateInput?: string | Date | null): string => {
  if (!dateInput) return "—";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "—";
    return format(date, "dd-MM-yyyy | HH:mm", { locale: vi });
  } catch {
    return "—";
  }
};
