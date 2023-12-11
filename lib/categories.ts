export enum Category {
  arts = "arts",
  business = "business",
  comedy = "comedy",
  education = "education",
  fiction = "fiction",
  games = "games",
  health = "health",
  history = "history",
  music = "music",
  news = "news",
  science = "science",
  sports = "sports",
  technology = "technology",
  tv = "tv",
}

export const getCategoryList = (): string[] => {
  return Object.values(Category);
};

export default Category;
