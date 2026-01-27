import { auth } from "@exec0/auth";
import { headers } from "next/headers";
import Image from "next/image";

export default async function TeamsList() {
  const data = await auth.api.listOrganizations({
    headers: await headers(),
  });

  if (!data || data.length === 0) {
    return <div>No organizations found.</div>;
  }

  return (
    <div>
      <h1>Teams</h1>
      <div>
        {data.map((org) => (
          <div key={org.id}>
            <h2>{org.name}</h2>
            {org.logo && <Image src={org.logo} alt={org.name} />}
            <p>{org.slug}</p>
            <p>{new Date(org.createdAt).toLocaleDateString("es-ES")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
