import { ThermomixStep } from "@/lib/types";
import { Timer, Thermometer, Gauge, Wrench } from "lucide-react";

function formatTime(seconds: number | null): string | null {
  if (seconds === null) return null;
  if (seconds < 60) return `${seconds} Sek.`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  if (sec === 0) return `${min} Min.`;
  return `${min} Min. ${sec} Sek.`;
}

export default function RecipeSteps({ steps }: { steps: ThermomixStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <div
          key={step.step_number}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4"
        >
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-7 h-7 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full flex items-center justify-center text-sm font-semibold">
              {step.step_number}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                {step.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {step.time_seconds !== null && (
                  <Badge icon={<Timer className="w-3 h-3" />}>
                    {formatTime(step.time_seconds)}
                  </Badge>
                )}
                {step.temperature !== null && (
                  <Badge icon={<Thermometer className="w-3 h-3" />}>
                    {step.temperature}°C
                  </Badge>
                )}
                {step.speed && (
                  <Badge icon={<Gauge className="w-3 h-3" />}>
                    {step.speed}
                  </Badge>
                )}
                {step.accessory && step.accessory !== "Mixtopf" && (
                  <Badge icon={<Wrench className="w-3 h-3" />}>
                    {step.accessory}
                  </Badge>
                )}
              </div>

              {step.tip && (
                <p className="text-xs text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 rounded-lg px-2.5 py-1.5 mt-2">
                  {step.tip}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Badge({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full">
      {icon}
      {children}
    </span>
  );
}
