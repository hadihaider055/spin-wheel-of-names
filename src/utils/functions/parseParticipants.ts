import { ParsedData, Participant } from "../types/common";

export const parseParticipants = (text: string): ParsedData => {
  const lines = text.split("\n").filter((line) => line.trim());
  const categories: string[] = [];
  const participants: Participant[] = [];
  let currentCategory = "Participants";

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (trimmedLine.includes(":") && !trimmedLine.match(/\(\w+\)/)) {
      currentCategory = trimmedLine.replace(":", "").trim();
      if (!categories.includes(currentCategory)) {
        categories.push(currentCategory);
      }
    } else if (trimmedLine) {
      const match = trimmedLine.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        const [, name, grade] = match;
        participants.push({
          id: `${Date.now()}-${Math.random()}-${participants.length}`,
          name: name.trim(),
          grade: grade.trim(),
          category: currentCategory,
        });
      } else {
        participants.push({
          id: `${Date.now()}-${Math.random()}-${participants.length}`,
          name: trimmedLine,
          grade: "",
          category: currentCategory,
        });
      }
    }
  });

  if (categories.length === 0 && participants.length > 0) {
    categories.push(currentCategory);
  }

  return { categories, participants };
};
