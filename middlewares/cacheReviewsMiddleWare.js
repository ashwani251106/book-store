const redis = require("../config/redisConfig");

// 1. Cache: Public review section for a single book profile
const cacheReviewOfABook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const book_review_key = `reviews:book:${bookId}`;

        const reviews_string = await redis.get(book_review_key);
        if (!reviews_string) {
            console.log(" Cache miss: sending book reviews request to DB");
            return next();
        }

        console.log("Cache hit: Serving book reviews from Redis");
        const reviews_json = JSON.parse(reviews_string);
        return res.status(200).json({
            success: true,
            reviews: reviews_json
        });
    } catch (error) {
        console.error("Error in cacheReviewOfABook:", error.message);
        return next(); // Fall back seamlessly to DB if Redis acts up
    }
};

// 2. Cache: Private review history dashboard for a logged-in user
const cacheReviewOfAUser = async (req, res, next) => { 
    try {
        const userId = req.user._id;
        const user_review_key = `reviews:user:${userId}`; 

        const reviews_string = await redis.get(user_review_key);
        if (!reviews_string) {
            console.log(" Cache miss: sending user review history request to DB");
            return next();
        }

        console.log(" Cache hit: Serving user review history from Redis");
        const reviews_json = JSON.parse(reviews_string);
        return res.status(200).json({
            message: `${reviews_json.length} reviews found!`,
            content: reviews_json
        });
    } catch (error) {
        console.error("Error in cacheReviewOfAUser:", error.message);
        return next();
    }
};


module.exports = { 
    cacheReviewOfABook, 
    cacheReviewOfAUser 
};