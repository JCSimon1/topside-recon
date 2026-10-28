import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useConfig, useCreateRound } from "../api/queries";
import { toPayload } from "../lib/rounds";
import { roundFormSchema, type RoundFormValues } from "../lib/roundSchema";
import Button from "./Button";
import Field from "./Field";

interface RoundFormProps {
  nextNumber: number;
}

const inputClass =
  "w-full rounded-sm border border-border bg-panel-alt px-2.5 py-2 font-mono text-[13.5px] outline-none focus:border-accent-2";

const defaults = (nextNumber: number): RoundFormValues => {
  const now = new Date();
  return {
    number: nextNumber,
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
    map: "",
    condition: "",
    money: 0,
    xp: 0,
  };
};

export default function RoundForm({ nextNumber }: RoundFormProps) {
  const { data: config } = useConfig();
  const { mutate, isPending } = useCreateRound();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoundFormValues>({
    resolver: zodResolver(roundFormSchema),
    defaultValues: defaults(nextNumber),
  });

  const onSubmit = (values: RoundFormValues) =>
    mutate(toPayload(values), {
      onSuccess: () => reset(defaults(nextNumber + 1)),
    });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-2 gap-x-4 gap-y-3.5 md:grid-cols-4"
    >
      <Field label="Nummer" error={errors.number?.message}>
        <input
          type="number"
          className={inputClass}
          {...register("number", { valueAsNumber: true })}
        />
      </Field>
      <Field label="Datum" error={errors.date?.message}>
        <input type="date" className={inputClass} {...register("date")} />
      </Field>
      <Field label="Uhrzeit" error={errors.time?.message}>
        <input type="time" className={inputClass} {...register("time")} />
      </Field>
      <Field label="Map" error={errors.map?.message}>
        <input list="mapOptions" className={inputClass} {...register("map")} />
        <datalist id="mapOptions">
          {config?.maps.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </Field>
      <Field label="Map Condition" error={errors.condition?.message}>
        <input className={inputClass} {...register("condition")} />
      </Field>
      <Field label="$ verdient" error={errors.money?.message}>
        <input
          type="number"
          className={inputClass}
          {...register("money", { valueAsNumber: true })}
        />
      </Field>
      <Field label="XP erhalten" error={errors.xp?.message}>
        <input
          type="number"
          className={inputClass}
          {...register("xp", { valueAsNumber: true })}
        />
      </Field>
      <div className="col-span-full flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          Runde speichern
        </Button>
      </div>
    </form>
  );
}
