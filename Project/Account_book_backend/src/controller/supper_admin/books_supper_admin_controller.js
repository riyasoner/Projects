const { where, Op } = require("sequelize");
const db = require("../../../config/config"); // Adjust the path to your config file
const Book = db.book;
const User = db.user;
const account = db.account;
const transaction = db.transaction
const alloted_book = db.alloted_book

// Assign book to User
// const assign_Book = async (req, res) => {
//     try {
//         const { userId, bookId } = req.body;

//         // Validate input
//         if (!userId || !bookId) {
//             return res.status(400).json({
//                 status: false,
//                 message: "User ID and Book ID are required."
//             });
//         }

//         // Check if the book exists
//         const check_book = await Book.findOne({ where: { id: bookId } });
//         if (!check_book) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Book not found."
//             });
//         }

//         // Check if the user exists
//         const check_user = await User.findOne({ where: { id: userId } });
//         if (!check_user) {
//             return res.status(404).json({
//                 status: false,
//                 message: "User not found."
//             });
//         }

//         const add_assign_book = await alloted_book.create({
//           userId:userId,
//           bookId:bookId,
//           assign_by:"Super Admin"
//         })

//         // // Assign the book to the user
//         // const [updatedRows] = await Book.update(
//         //     { userId: userId },
//         //     { where: { id: bookId } }
//         // );

//         if (add_assign_book === 0) {
//             return res.status(500).json({
//                 status: false,
//                 message: "Failed to assign book."
//             });
//         }

//         return res.status(200).json({
//             status: true,
//             message: "Book assigned to the user successfully.",
//             data: add_assign_book
//         });
//     } catch (error) {
//         console.error("Error in book assignment API:", error.message);
//         return res.status(500).json({
//             status: false,
//             message: "Internal server error.",
//             error: error.message
//         });
//     }
// };

// Multiple Books Assign to One user
const assign_Book = async (req, res) => {
    try {
        const { userId, bookId, read_book, create_book, update_book, delete_book } = req.body;

        // Validate input
        if (!userId || !Array.isArray(bookId) || bookId.length === 0) {
            return res.status(400).json({
                status: false,
                message: "User ID and an array of Book IDs are required.",
                data: []
            });
        }

        // Check if the user exists
        const checkUser = await User.findOne({ where: { id: userId } });
        if (!checkUser) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
                data: []
            });
        }

        // Fetch valid book IDs
        const validBooks = await Book.findAll({
            where: { id: { [Op.in]: bookId } }
        });
        const validBookIds = validBooks.map(book => book.id);

        if (validBookIds.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No valid books found to assign.",
                data: []
            });
        }

        // Find already assigned books
        const alreadyAssigned = await alloted_book.findAll({
            where: {
                userId: userId,
                bookId: { [Op.in]: validBookIds }
            }
        });

        const alreadyAssignedBookIds = alreadyAssigned.map(book => book.bookId);

        // Filter books that need to be assigned
        const booksToAssign = validBookIds.filter(bookId => !alreadyAssignedBookIds.includes(bookId));

        let assignedBooks = [];

        if (booksToAssign.length > 0) {
            assignedBooks = await alloted_book.bulkCreate(
                booksToAssign.map(bookId => ({
                    userId: userId,
                    bookId: bookId,
                    assign_by: "Super Admin"
                }))
            );
        }

        // Prepare update fields
        const updateFields = {};
        if (read_book !== undefined) updateFields.read_book = read_book;
        if (create_book !== undefined) updateFields.create_book = create_book;
        if (update_book !== undefined) updateFields.update_book = update_book;
        if (delete_book !== undefined) updateFields.delete_book = delete_book;

        let updatedBooks = [];
        if (Object.keys(updateFields).length > 0) {
            await alloted_book.update(updateFields, {
                where: { 
                    userId: userId, 
                    bookId: { [Op.in]: validBookIds }  
                }
            });

            // Fetch updated books
            updatedBooks = await alloted_book.findAll({
                where: { userId: userId, bookId: { [Op.in]: validBookIds } },
                attributes: ['id','userId', 'bookId', 'read_book', 'create_book', 'update_book', 'delete_book'],
                include: [
                  {
                    model: Book,
                    as: "book",
                    attributes: ["id", "name", "description"],
                  },
                ],
                order: [["id", "DESC"]],

            });
        }

        return res.status(200).json({
            status: true,
            message: "Books assigned and permissions updated successfully.",
            data: updatedBooks.length > 0 ? updatedBooks : assignedBooks
        });

    } catch (error) {
        console.error("Error in book assignment API:", error.message);
        return res.status(500).json({
            status: false,
            message: "An error occurred while assigning books.",
            error: error.message,
        });
    }
};

// Get all assign books through user id
const getAssiBookByUserId = async (req, res) => {
  try {
    const { userId } = req.query;

    const getBooks = await alloted_book.findAll({
      where: { userId: userId },
      include: [

        {
          model: Book,
          as: "book",
          attributes: ['id', 'name', 'description']
        },
        {
          model: User,
          as: "user",
          attributes: ['id', 'name', 'user_type', 'email_id', 'phone_no'],

        }
      ],
      order: [['id', 'DESC']]
    });

    if (!getBooks || getBooks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "Books are not found according this user id",
        data: []
      });
    }

        // Transform the response to move `bookId` after `name` and `description`
        const formattedBooks = getBooks.map((book) => ({
          id: book.id,
          name: book.book?.name || null,
          bookId: book.book?.id || null, // Move bookId here
          description: book.book?.description || null,
          userId: book.userId,
          createdAt: book.createdAt,
          updatedAt: book.updatedAt,
          user: book.user,
        }));

    return res.status(200).json({
      status: true,
      message: "Books are retrieved successfully",
      data: formattedBooks
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// Get all user through book id
const getUsersthroughbookId = async (req, res) => {
  try {
    const { bookId } = req.query;

    if (!bookId) {
      return res.status(400).json({
        status: false,
        message: "bookId is required",
        data: [],
      });
    }

    const getBooks = await alloted_book.findAll({
      where: { bookId: bookId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "user_type", "email_id", "phone_no"],
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!getBooks || getBooks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No users found for this bookId",
        data: [],
      });
    }

    // Group users under the given bookId
    const responseData = {
      bookId: bookId,
      users: getBooks
        .map((book) => book.user)
        .filter((user) => user !== null), // Remove null values if any
    };

    return res.status(200).json({
      status: true,
      message: "Users retrieved successfully for the given bookId",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


// Get all assign books / shared booklist
const getAllAssiBook = async (req, res) => {
  try {
    const getBooks = await alloted_book.findAll({
      include: [
        {
          model: User,
          as: "user", // Must match the alias in the belongsTo association
          attributes: ["id", "name", "user_type", "email_id", "phone_no"],
        },
        {
          model: Book, 
          as: "book", 
          attributes: ["id", "name"], // Fetch book name along with ID
        },
      ],
      order: [["id", "DESC"]],
    });

    if (!getBooks || getBooks.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No assigned books found",
        data: [],
      });
    }

    // Group books by bookId and aggregate users
    const groupedBooks = getBooks.reduce((acc, book) => {
      const { bookId, user,book: bookDetails } = book;

      if (!acc[bookId]) {
        acc[bookId] = {
          bookId: bookId,
          bookName: bookDetails ? bookDetails.name : "Unknown", // Add book name
          users: [],
        };
      }

      if (user) {
        acc[bookId].users.push(user);
      }

      return acc;
    }, {});

    // Convert object to array format
    const formattedBooks = Object.values(groupedBooks);

    return res.status(200).json({
      status: true,
      message: "Assigned books retrieved successfully",
      data: formattedBooks,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

const deleteAllotedBook = async (req, res) => {
  try {
    const { userId, bookId } = req.query;

    const deleted = await alloted_book.destroy({
      where: {
        userId,
        bookId
      }
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Alloted book not found for the given user and book"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Alloted book deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

module.exports = {
    assign_Book,
    getAssiBookByUserId,
    getAllAssiBook,
    getUsersthroughbookId,
    deleteAllotedBook
}