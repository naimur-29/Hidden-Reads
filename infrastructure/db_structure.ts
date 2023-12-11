export type books = [
  {
    title: string;
    author: string;
    synopsis: string;
    published: string;
    status: string;
    volumes: number;
    genres: string;
    views?: number;
    downloads?: number;
    info_link: string;
    cover_link: string;
    cover_shade: string;
  }
];

export type bookDownloads = [
  {
    links: [
      {
        context: string;
        epub: string;
        pdf: string;
      }
    ];
  }
];
