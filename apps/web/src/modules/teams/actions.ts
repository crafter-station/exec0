"use server";

import { auth } from "@exec0/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createOrganization(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;

  if (!name || !slug) {
    return { error: "Name and slug are required" };
  }

  try {
    await auth.api.createOrganization({
      body: {
        name,
        slug,
      },
      headers: await headers(),
    });

    revalidatePath("/teams");
    return { success: true, message: "Organización creada correctamente" };
  } catch (error) {
    console.error("Error creating organization:", error);
    return { error: "No se pudo crear la organización" };
  }
}
