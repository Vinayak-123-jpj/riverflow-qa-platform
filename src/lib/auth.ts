import env from "@/app/env";
import { Account, Client, Models } from "node-appwrite";
import { NextRequest } from "next/server";
import { UserPrefs } from "@/store/Auth";

export function getJwtFromRequest(request: NextRequest): string | null {
  const header =
    request.headers.get("x-appwrite-jwt") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  return header || null;
}

export async function getAuthenticatedUser(
  request: NextRequest
): Promise<Models.User<UserPrefs> | null> {
  const jwt = getJwtFromRequest(request);
  if (!jwt) return null;

  const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setJWT(jwt);

  const account = new Account(client);

  try {
    return await account.get<UserPrefs>();
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
