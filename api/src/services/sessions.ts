import { AuthorisationError } from "../errors";

const sessions = new Map<string, string>();

export const verifySessionToken = async (token: string): Promise<string> => {
  const userId = sessions.get(token);
  if (!userId) {
    throw new AuthorisationError("Invalid session token");
  }
  return userId;
};

export const createSession = (token: string, userId: string) => {
  sessions.set(token, userId);
};
