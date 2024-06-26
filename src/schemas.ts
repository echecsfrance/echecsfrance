import { z } from "zod";

import { TimeControl } from "@/types";

export const contactUsSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1, { message: "FormValidation.required" }),
  message: z.string().min(1, { message: "FormValidation.required" }),
});

export const addTournamentSchema = z.object({
  name: z.string().min(1, { message: "FormValidation.required" }),
  email: z.string().email(),
  message: z.string().optional(),

  tournament: z.object({
    address: z.string().min(1, { message: "FormValidation.required" }),
    town: z.string().min(1, { message: "FormValidation.required" }),
    department: z.string().min(1, { message: "FormValidation.required" }),
    tournament: z.string().min(1, { message: "FormValidation.required" }),
    url: z.string().url({ message: "FormValidation.url" }),
    time_control: z.nativeEnum(TimeControl),
    norm_tournament: z.boolean(),
    date: z.date(),
    coordinates: z.array(z.number()).length(2),
    country: z.string().min(1, { message: "FormValidation.required" }),
  }),
});

export const fetchTournamentResultsSchema = z.object({
  id: z.string().min(1, { message: "FormValidation.required" }),
});
