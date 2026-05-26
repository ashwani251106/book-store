const crypto = require("crypto");
const razorpay = require("../config/razorpay.config");
const redis = require("../config/redisConfig");
const Book = require("../models/bookSchema");
const User = require("../models/userSchema"); 
const createOrderAndReserveStock = async (req, res) => {
    try {
        const { bookId, quantity } = req.body; 
        const buyingUser = req.user;

        if (!buyingUser) {
            return res.status(401).json({ message: "User authentication missing" });
        }
        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }

        const quantityNeeded = parseInt(quantity) || 1;
        const stockKey = `stock:book:${bookId}`;
        const reservationKey = `reservation:user:${buyingUser._id}:book:${bookId}`;

      
        let cachedStock = await redis.get(stockKey);
        if (cachedStock === null) {
            const currentDbBook = await Book.findById(bookId).select("stock price").lean();
            if (!currentDbBook) {
                return res.status(404).json({ message: "Book not found in store" });
            }
            await redis.set(stockKey, currentDbBook.stock);
            cachedStock = currentDbBook.stock;
        }

      
        const remainingStock = await redis.decrby(stockKey, quantityNeeded);

      
        if (remainingStock < 0) {
            await redis.incrby(stockKey, quantityNeeded); 
            return res.status(400).json({ 
                message: `Insufficient inventory remaining. Only ${parseInt(cachedStock)} left.` 
            });
        }

      
        const targetBook = await Book.findById(bookId).select("price").lean();
        const paymentAmount = targetBook.price * 100 * quantityNeeded; 
        const options = {
            amount: paymentAmount,
            currency: "INR",
            receipt: `rec_${buyingUser._id.toString().slice(-6)}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

      
        const reservationData = {
            userId: buyingUser._id,
            bookId: bookId,
            quantity: quantityNeeded,
            razorpayOrderId: order.id
        };
        
       
        await redis.setex(reservationKey, 600, JSON.stringify(reservationData));

        return res.status(201).json({
            success: true,
            order,
            message: "Stock successfully locked for 10 minutes. Proceed to payment modal."
        });

    } catch (error) {
        console.log("🚨 Order Creation & Hold Error:", error);
        return res.status(500).json({ message: "Internal server processing failure" });
    }
};


const verifyPaymentAndFinalize = async (req, res) => {
    try {
        const { order_id, payment_id, signature, bookId } = req.body;
        const buyingUser = req.user;

        if (!buyingUser) {
            return res.status(401).json({ message: "User context not found" });
        }

      
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(order_id + "|" + payment_id);
        const generatedSig = hmac.digest("hex");

        if (generatedSig !== signature) {
            return res.status(400).json({
                success: false,
                message: "Payment signature validation failed. Potential tampering."
            });
        }

       
        const reservationKey = `reservation:user:${buyingUser._id}:book:${bookId}`;
        const cachedReservation = await redis.get(reservationKey);

        let finalQuantity = 1; 
        if (cachedReservation) {
            const parsedReservation = JSON.parse(cachedReservation);
            finalQuantity = parsedReservation.quantity;
        }

      e
        const updatedBook = await Book.findByIdAndUpdate(
            bookId, 
            { $inc: { stock: -finalQuantity } }, 
            { new: true }
        );

        await User.findByIdAndUpdate(buyingUser._id, {
            $push: { books_taken: bookId }
        });

     
        const view_book_key = `viewbookkey:${bookId}`;
        await redis.del(view_book_key);     
        await redis.del(reservationKey);    
        return res.status(200).json({
            success: true,
            message: "Book bought successfully, database synced, caches updated!",
            book: updatedBook ? updatedBook.name : "Unknown Book"
        });

    } catch (error) {
        console.error("🚨 Payment Verification Lifecycle Error:", error.message);
        return res.status(500).json({ message: "Internal server error finishing transaction." });
    }
};

module.exports = {
    createOrderAndReserveStock,
    verifyPaymentAndFinalize
};