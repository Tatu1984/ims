import * as repo from "@/backend/repositories/ticket.repository";
import { AppError } from "@/backend/utils/error-handler.util";
import { appConfig } from "@/config/app.config";

export async function getAll(filters?: Parameters<typeof repo.findAll>[0]) {
  return repo.findAll(filters);
}

export async function getById(id: string) {
  const record = await repo.findById(id);
  if (!record) throw new AppError(404, "Ticket not found");
  return record;
}

export async function create(data: Omit<Parameters<typeof repo.create>[0], "ticketNumber">) {
  const maxNumber = await repo.findMaxTicketNumber();
  let next = 1;
  if (maxNumber) {
    const num = parseInt(maxNumber.replace(`${appConfig.ticketPrefix}-`, ""), 10);
    if (!isNaN(num)) next = num + 1;
  }
  const ticketNumber = `${appConfig.ticketPrefix}-${String(next).padStart(4, "0")}`;

  return repo.create({ ...data, ticketNumber });
}

export async function update(id: string, data: Parameters<typeof repo.update>[1]) {
  await getById(id);
  return repo.update(id, data);
}

export async function remove(id: string) {
  await getById(id);
  return repo.remove(id);
}
