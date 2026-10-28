import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useConfig, useCreateRound, useUpdateRound } from "../api/queries";
import { toPayload } from "../lib/rounds";
import { roundFormSchema, type RoundFormValues } from "../lib/roundSchema";
import Button from "./Button";
import Field from "./Field";

import type { Round } from "../api/types";

interface RoundFormProps {
  editing: Round | null;
  nextNumber: number;
  onDone: () => void;
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

const fromRound = (r: Round): RoundFormValues => ({
  number: r.number,
  date: r.date,
  time: r.time,
  map: r.map,
  condition: r.condition,
  money: r.money,
  xp: r.xp,
});

export default function RoundForm({
  editing,
  nextNumber,
  onDone,
}: RoundFormProps) {
  const { data: config } = useConfig();
  const create = useCreateRound();
  const update = useUpdateRound();
  const isPending = create.isPending || update.isPending;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoundFormValues>({
    resolver: zodResolver(roundFormSchema),
    defaultValues: editing ? fromRound(editing) : defaults(nextNumber),
  });

  const onSubmit = (values: RoundFormValues) => {
    const payload = toPayload(values);
    if (editing) {
      update.mutate({ id: editing.id, payload }, { onSuccess: onDone });
    } else {
      create.mutate(payload, {
        onSuccess: () => reset(defaults(nextNumber + 1)),
      });
    }
  };

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
          {editing ? "Änderungen speichern" : "Runde speichern"}
        </Button>
        {editing && (
          <Button variant="ghost" onClick={onDone}>
            Abbrechen
          </Button>
        )}
      </div>
    </form>
  );
}
