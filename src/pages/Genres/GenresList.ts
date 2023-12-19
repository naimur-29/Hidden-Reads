// Types:
type Genre = {
  name: string;
};

export const GenresList: Genre[] = [
  { name: "Isekai" },
  { name: "Fantasy" },
  { name: "Slice of Life" },
  { name: "Romance" },
  { name: "Adventure" },
  { name: "Science Fiction" },
  { name: "Mystery" },
  { name: "Horror" },
  { name: "School Life" },
  { name: "Harem" },
  { name: "Comedy" },
  { name: "Drama" },
  { name: "Historical" },
  { name: "Shoujo" },
  { name: "Shounen" },
  { name: "Mecha" },
  { name: "Supernatural" },
  { name: "Psychological" },
  { name: "Sports" },
  { name: "Iyashikei" },
  { name: "Music" },
  { name: "Thriller" },
  { name: "Cyberpunk" },
  { name: "Superpower" },
  { name: "Military" },
  { name: "Historical Fiction" },
  { name: "Game" },
  { name: "Isekai Reincarnation" },
  { name: "Demons" },
  { name: "Vampire" },
  { name: "Ecchi" },
  { name: "Sci-Fi" },
].sort((a, b) => {
  if (a.name > b.name) return 1;
  else if (a.name < b.name) return -1;
  return 0;
});
