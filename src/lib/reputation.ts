import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";

export async function adjustReputation(userId: string, delta: number) {
  const prefs = await users.getPrefs<UserPrefs>(userId);
  const current = Number(prefs.reputation ?? 0);
  await users.updatePrefs<UserPrefs>(userId, {
    reputation: Math.max(0, current + delta),
  });
}
