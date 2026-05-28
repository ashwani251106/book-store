const redis = require("../config/redisConfig");

// 1. Cache: Books listed by a specific user
const cacheBookByUser = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const book_key = `getBookByUser:${userId}`;

        const book_data_string = await redis.get(book_key);
        if (!book_data_string) {
            console.log("❌ Cache miss: go to DB");
            return next();
        }

        console.log("⚡ Cache hit: Serving user books list");
        const book_data_json = JSON.parse(book_data_string);
        return res.status(200).json({
           message:"books by user send from redis",
           allBooks:book_data_json
           
        });
    } catch (error) {
        console.error("Error in cacheBookByUser:", error.message);
        return next(); // Fallback cleanly to DB on Redis failure
    }
};

// 2. Cache: Chapters belonging to a specific book
const cacheChaptersofABook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const chapter_key = `getchaptersofabook:${bookId}`; // 🛠️ Fixed: Added namespace colon

        const chapterNames_string = await redis.get(chapter_key);
        if (!chapterNames_string) {
            console.log(" Cache miss: redirecting to DB");
            return next();
        }

        console.log(" Cache hit: Serving book chapters");
        const chapterNames_json = JSON.parse(chapterNames_string);
        return res.status(200).json({
            message: `${chapterNames_json.length} chapters found!`,
            chapterNames: chapterNames_json
        });
    } catch (error) {
        console.error("Error in cacheChaptersofABook:", error.message);
        return next();
    }
};

// 3. Cache: Single deep-dive book details view
const cacheViewBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const view_book_key = `viewbookkey:${bookId}`;
        const book_string = await redis.get(view_book_key);
        if (!book_string) {
            console.log("❌ Cache miss: sending the request to DB");
            return next();
        }

        console.log("⚡ Cache hit: Serving book view payload");
        const book_obj = JSON.parse(book_string);
        const liveStock = await redis.get(`stock:book:${bookId}`);


        if (liveStock !== null) {
            book_obj.stock = parseInt(liveStock);
        }
        return res.status(200).json({
            bookId,
            bookName: book_obj.name,
            bookAuthor: book_obj.author,
            bookPublication: book_obj.publication,
            bookEdition: book_obj.edition,
            bookStock: book_obj.stock,
            bookPrice: book_obj.price
        });
    } catch (error) {
        console.error("Error in cacheViewBook:", error.message);
        return next();
    }
};

// 4. Cache: Global original source marketplace books
const cacheOriginalBooks = async (req, res, next) => {
    try {
        const original_source_key = `originalsourcekey:original`;

        const original_books_string = await redis.get(original_source_key);
        if (!original_books_string) {
            console.log(" Cache miss: directing to the DB");
            return next();
        }

        console.log(" Cache hit: Serving marketplace original books");
        const original_books_json = JSON.parse(original_books_string);
        return res.status(200).json({
            allOriginalBooks: original_books_json
        });
    } catch (error) {
        console.error("Error in cacheOriginalBooks:", error.message);
        return next();
    }
};

// 5. Cache: Global used source marketplace books
const cacheUsedBooks = async (req, res, next) => {
    try {
        const used_source_key = `usedsourcekey:used`;

        const used_books_string = await redis.get(used_source_key);
        if (!used_books_string) {
            console.log(" Cache miss: directing to the DB");
            return next();
        }

        console.log(" Cache hit: Serving marketplace used books");
        const used_books_json = JSON.parse(used_books_string);


        return res.status(200).json({
            allUsedBooks: used_books_json
        });
    } catch (error) {
        console.error("Error in cacheUsedBooks:", error.message);
        return next();
    }
};

// 6. Cache: Personal unpublished drafts workspace list
const cacheUnpublishedBooks = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const draft_of_user = `getalldraftofauser:${userId}`;

        const get_drafts_string = await redis.get(draft_of_user);
        if (!get_drafts_string) {
            console.log(" Cache miss: sending to the DB");
            return next();
        }

        console.log("⚡ Cache hit: Serving user drafts list");
        const get_drafts_json = JSON.parse(get_drafts_string);
        return res.status(200).json({
            message: `${get_drafts_json.length} books are in progress`,
            getdrafts: get_drafts_json
        });
    } catch (error) {
        console.error("Error in cacheUnpublishedBooks:", error.message);
        return next();
    }
};

module.exports = {
    cacheBookByUser,
    cacheChaptersofABook,
    cacheViewBook,
    cacheOriginalBooks,
    cacheUsedBooks,
    cacheUnpublishedBooks
};