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
    let date: Date;
    
    // If it's a string in ISO format without timezone, parse it as local time
    if (typeof dateInput === "string" && dateInput.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
      const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (match) {
        date = new Date(
          parseInt(match[1]),
          parseInt(match[2]) - 1,
          parseInt(match[3]),
          parseInt(match[4]),
          parseInt(match[5])
        );
      } else {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }
    
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
    let date: Date;
    
    // If it's a string in ISO format without timezone, parse it as local time
    if (typeof dateInput === "string" && dateInput.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/)) {
      const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (match) {
        date = new Date(
          parseInt(match[1]),
          parseInt(match[2]) - 1,
          parseInt(match[3]),
          parseInt(match[4]),
          parseInt(match[5])
        );
      } else {
        date = new Date(dateInput);
      }
    } else {
      date = new Date(dateInput);
    }
    
    if (isNaN(date.getTime())) return "—";
    return format(date, "dd-MM-yyyy | HH:mm", { locale: vi });
  } catch {
    return "—";
  }
};
