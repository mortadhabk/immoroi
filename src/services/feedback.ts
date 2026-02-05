export type FeedbackPayload = {
  userId: string | null;
  name: string | null;
  email: string;
  type: string;
  subject: string;
  description: string;
  impact: string;
  modules: string[];
  allowContact: boolean;
  sourcePage: string;
};

export const submitFeedback = async (payload: FeedbackPayload) => {
  const res = await fetch('/server/index.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Erreur lors de l'envoi.");
  }
  return res.json();
};
