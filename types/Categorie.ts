export type Categorie = {
  id: number;
  title: string;
  createdAt: string;
  isDeleted: boolean;
  _count: {
    questions: number;
  }
}