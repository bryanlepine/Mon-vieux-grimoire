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
    Book.find().sort({ rating: -1 }).limit(3)
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

 /**exports.createRatingBook = (req, res, next)=> {
    return 4 
 }**/

 exports.createRatingBook = (req, res, next) => {
    
    for(let i = 0 ; i < book.ratings.length; i++){
        if(book.ratings[i].userId === req.body.userId){
          return res.status(400).json({ message: 'User has already rated this book' });
        }
      }
  
    book.ratings.push({
        userId: req.body.userId,
        grade: req.body.grade
    });

    let sum = 0; 
    for(let i = 0 ; i < book.ratings.length; i++){
        sum += book.ratings[i].grade;
    }
    book.averageRating = sum / book.ratings.length;
 
   book.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
}; 

