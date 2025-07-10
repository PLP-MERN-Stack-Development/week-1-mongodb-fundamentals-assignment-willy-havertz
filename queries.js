

// 1. Find all books in a specific genre (e.g., "Fiction")
db.books.find({ genre: "Fiction" }).pretty();

// 2. Find books published after a certain year (e.g., after 1950)
db.books.find({ published_year: { $gt: 1950 } }).pretty();

// 3. Find books by a specific author (e.g., "George Orwell")
db.books.find({ author: "George Orwell" }).pretty();

// 4. Update the price of a specific book (e.g., set "The Alchemist" to 12.99)
db.books.updateOne({ title: "The Alchemist" }, { $set: { price: 12.99 } });

// 5. Delete a book by its title (e.g., "Moby Dick")
db.books.deleteOne({ title: "Moby Dick" });

// --- Task 3: Advanced Queries ---

// A. Find books that are in stock AND published after 2010
db.books
  .find({
    in_stock: true,
    published_year: { $gt: 2010 },
  })
  .pretty();

// B. Projection: return only title, author, and price for in-stock books
db.books
  .find(
    { in_stock: true },
    { projection: { _id: 0, title: 1, author: 1, price: 1 } }
  )
  .pretty();

// C. Sort by price ascending, then descending
db.books.find().sort({ price: 1 }).pretty(); // ascending
db.books.find().sort({ price: -1 }).pretty(); // descending

// D. Pagination: 5 books per page
const pageSize = 5;
function getPage(page) {
  print(`\n-- Page ${page} --`);
  db.books
    .find()
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .pretty();
}
// Usage: getPage(1); getPage(2);

// --- Task 4: Aggregation Pipeline ---

// 1. Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } },
  { $project: { _id: 0, genre: "$_id", avgPrice: 1 } },
]);

// 2. Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 },
  { $project: { _id: 0, author: "$_id", count: 1 } },
]);

// 3. Group books by publication decade and count
db.books.aggregate([
  {
    $bucket: {
      groupBy: "$published_year",
      boundaries: [1800, 1900, 1950, 2000, 2025],
      default: "Other",
      output: {
        count: { $sum: 1 },
        titles: { $push: "$title" },
      },
    },
  },
]);

// --- Task 5: Indexing ---

// 1. Create an index on title for faster lookups
db.books.createIndex({ title: 1 });

// 2. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

