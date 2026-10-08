type Session = {
  token: string;
  userId: string;
  organizationId: string;
  email: string;
  role: "admin" | "member";
};

export const getSession = (): Session => {
  const raw = localStorage.getItem("session");
  if (!raw) {
    window.location.assign("/login");
    throw new Error("Not authenticated");
  }
  return JSON.parse(raw);
};

export const getSessionToken = () => getSession().token;

export const useAuth = () => getSession();
