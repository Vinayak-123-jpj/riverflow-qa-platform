export function authHeaders(jwt: string | null): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(jwt ? { "x-appwrite-jwt": jwt } : {}),
  };
}

export async function authFetch(
  jwt: string | null,
  input: RequestInfo | URL,
  init?: RequestInit
) {
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (jwt) headers.set("x-appwrite-jwt", jwt);

  return fetch(input, { ...init, headers });
}
