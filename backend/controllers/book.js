const Book = require ("../models/books");
const fs = require ("fs");

exports.getAllBooks = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
}

exports.getSingleBook = (req, res, next) => {
    Book.findById(req.params.id)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(400).json({error}));
}

exports.getBestRatingBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));
}

exports.createBook = (req, res, next) => {
  console.log('Create book');

  const { title, author, year, genre, ratings, averageRating } = JSON.parse(req.body.book);
  const userId = req.auth.userId;
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

  const book = new Book({
    title,
    author,
    year,
    genre,
    ratings,
    averageRating,
    imageUrl,
    userId
  });
  console.log(book);

  book
    .save()
    .then(() => {
      res.status(201).json({ message: 'Objet enregistré !' });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;

    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ message: "Non autorisé à modifier ce livre." });
            } else {
                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Le livre a été modifié avec succès !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
 };

 exports.deleteBook = (req, res, next ) => {
    Book.findOne({_id: req.params.id})
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 }

 exports.createRatingBook = (req, res, next) => {
    const { id } = req.params;
    const { userId, rating} = req.body;
   
  
    Book.findById(id)
      .then(book => {
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }

   console.log(book);

        for (let i = 0; i < book.ratings.length; i++) {
          if (book.ratings[i].userId === userId) {
            return res.status(400).json({ message: 'L utilisateur a déjà noté ce livre' });
          }
        }
  
        book.ratings.push({
          userId : userId, 
          grade : rating
        });

       
  console.log(book);

        let sum = 0;
        for (let i = 0; i < book.ratings.length; i++) {
          sum += book.ratings[i].grade;
        
        }
        
        averageRating = sum / book.ratings.length;

       book.averageRating = parseInt(averageRating);
        console.log(book.averageRating);
  console.log(book);

        return  Book.updateOne({ _id: req.params.id }, { ratings:book.ratings, averageRating:book.averageRating })
        .then(data=> {
          if(data){
            res.status(201).json(book)
          }
        })
        .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(400).json({ message:'il y a eu une erreur' }));
  };

