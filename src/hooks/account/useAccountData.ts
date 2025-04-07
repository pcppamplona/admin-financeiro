import { api } from "@/lib/utils";

export async function UseAccount() {
  try {
    const response = await api.get("accounts").json();
    return response;
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return null;
  }
}