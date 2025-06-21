export interface Participant {
  id: string;
  name: string;
  grade: string;
  category: string;
}

export interface ParsedData {
  categories: string[];
  participants: Participant[];
}
