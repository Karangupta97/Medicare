// Status samples as badges and alerts. Every one has an icon and a text label (color is never the
// only signal). Emergency is a solid fill; the others are a subtle fill. Info uses the secondary family.
import type { ReactNode } from "react";
import { CheckCircleIcon, EmergencyIcon, InfoIcon, WarningIcon, XCircleIcon, type IconProps } from "./icons";
import { Panel } from "./panel";

type Status = {
  readonly id: string;
  readonly label: string;
  readonly Icon: (props: IconProps) => ReactNode;
  readonly badge: string;
  readonly alert: string;
  readonly title: string;
  readonly body: string;
  readonly message: string;
};

const STATUSES: readonly Status[] = [
  {
    id: "success",
    label: "Success",
    Icon: CheckCircleIcon,
    badge: "bg-success-subtle text-success",
    alert: "border-success bg-success-subtle",
    title: "text-success",
    body: "text-text",
    message: "Your report was verified and added to your records.",
  },
  {
    id: "warning",
    label: "Warning",
    Icon: WarningIcon,
    badge: "bg-warning-subtle text-warning",
    alert: "border-warning bg-warning-subtle",
    title: "text-warning",
    body: "text-text",
    message: "Your storage is almost full. Free up space to keep uploading.",
  },
  {
    id: "danger",
    label: "Danger",
    Icon: XCircleIcon,
    badge: "bg-danger-subtle text-danger",
    alert: "border-danger bg-danger-subtle",
    title: "text-danger",
    body: "text-text",
    message: "The upload failed. Delete this report only if you are sure.",
  },
  {
    id: "info",
    label: "Info",
    Icon: InfoIcon,
    badge: "bg-secondary-subtle text-on-secondary-subtle",
    alert: "border-secondary bg-secondary-subtle",
    title: "text-on-secondary-subtle",
    body: "text-text",
    message: "Reports are kept for 10 years unless you delete them.",
  },
  {
    id: "emergency",
    label: "Emergency",
    Icon: EmergencyIcon,
    badge: "bg-emergency text-on-emergency",
    alert: "border-emergency bg-emergency",
    title: "text-on-emergency",
    body: "text-on-emergency",
    message: "Critical result needs immediate action. Contact the patient now.",
  },
];

export function StatusPanel() {
  return (
    <div className="space-y-6">
      <Panel title="Badges" description="Subtle fill with the status color as text. Emergency is a solid fill.">
        <ul className="flex flex-wrap gap-3">
          {STATUSES.map((status) => (
            <li key={status.id}>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${status.badge}`}>
                <status.Icon />
                {status.label}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Alerts" description="Emergency and danger look different on purpose: emergency is reserved for medical alerts that need immediate action.">
        <ul className="grid gap-4 @2xl:grid-cols-2">
          {STATUSES.map((status) => (
            <li key={status.id} className={`flex items-start gap-3 rounded-xl border p-4 ${status.alert}`}>
              <status.Icon className={`mt-0.5 size-5 shrink-0 ${status.title}`} />
              <div className="min-w-0">
                <p className={`font-bold ${status.title}`}>{status.label}</p>
                <p className={`mt-1 text-sm ${status.body}`}>{status.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
