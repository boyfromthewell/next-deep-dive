export interface BookData {
  id: number;
  title: string;
  subTitle: string;
  author: string;
  publisher: string;
  description: string;
  coverImgUrl: string;
}

export interface ReviewData {
  id: number;
  createdAt: string;
  content: string;
  author: string;
  bookId: number;
}
