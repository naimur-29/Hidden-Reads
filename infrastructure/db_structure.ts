type books = [
  {
    id: string;
    title: string;
    author: string;
    synopsis: string;
    published: string;
    status: string;
    volumes: number;
    genres: string;
    views: number;
    downloads: number;
    info_link: string;
    cover_link: string;
    cover_shade: string;
  }
];

type bookDownloads = [
  {
    id: string;
    links: [
      {
        context: string;
        epub: string;
        pdf: string;
      }
    ];
  }
];
