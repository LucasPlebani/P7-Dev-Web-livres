const Book = require('../models/book');
const fs = require('fs');

exports.createBooks = (req, res, next) => {

  const bookObject = JSON.parse(req.body.book);  // Récupération des informations dans la requête
  delete bookObject._id; // Suppression de l'id pour génération d'un nouvel id unique par MongoDB
  delete bookObject._userId;// Suppression du userId pour associer le livre à l'userId authentifié

  // Création d'un nouvel objet Book à partir des données de la requête
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      // URL de l'image : protocole, hôte, nom du fichier
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // Enregistrement dans la base de donnée
  book.save()
  .then(() => { res.status(201).json({ message: 'livre enregistré !' }) })
  .catch(error => { 
    console.error(error); // Affiche l'erreur dans la console du serveur
    res.status(400).json({ error });
  });

};

//COMMENTAIRE A FAIRE SUR LA ROUTE MODIFIER + MULTER
exports.modifyBooks = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};
// Route supprimé 

exports.deleteBooks = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {    // Si l'utilisateur à bien créer le book alors il peut modifié
              res.status(401).json({message: 'Not authorized'}); // sinon pas authorized 
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {     // fonction unlick ('fs') pour supprimé le fichier 
                  Book.deleteOne({_id: req.params.id})   //Le package fs expose des méthodes pour interagir avec le système de fichiers du serveur.

                                                          //La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

  exports.getOneBooks = (req, res, next) => {  //méthode get pour répondre uniquement aux demandes GET à cet endpoint 
    Book.findOne({ _id: req.params.id })  //méthode findOne() dans notre modèle Thing pour trouver le book unique ayant le même _id que le paramètre de la requête 
    .then(book => res.status(200).json(book))  //promise et envoie au front-end
    .catch(error => res.status(404).json ({ error })) ; //si aucun est trouvé error 404
  };

  exports.getAllBooks = (req, res, next) => {
    Book.find() // renvoie le tableau contenant les Books
    .then(books => res.status(200).json(books)) 
    .catch(error => res.status(400).json({ error }));
    };

    //fonction d'obtention les 3 meilleurs livres 
    exports.getBestrating = (req, res, next) => {
        Book.find({}) //intéroge et recherche les livres les mieux notés
            .sort({averageRating: -1})  // Note moyenne
            .limit(3)  //max 3 books
        .then((bestRatedBooks) => { res.status(200).json(bestRatedBooks) })
        .catch(error => { res.status(400).json( { error })});
    };

    exports.createRating = (req, res, next) => {
        Book.findOne({ _id: req.params.id })  //recherche via le paramètre id
          .then(book => {
            const currentUserId = req.auth.userId; 
            const existingRating = book.ratings.find(rating => rating.userId === currentUserId);
      
            if (existingRating) {
              return res.status(400).json({ error: 'Note déjà ajoutée auparavant.' });
            }
            //envoie de la note du livre 
            book.ratings.push({
              userId: req.auth.userId,
              grade: req.body.rating
            });
            //calcul des moyennes de rating 
            const totalRatings = book.ratings.reduce((total, rating) => total + rating.grade, 0); //méthode réduce pour parcourir
            const averageRating = Math.round(totalRatings / book.ratings.length);  //obtention de la moyenne via methode round 
            book.averageRating = averageRating; //moyenne calculé et ajouté à averageRating
      
            book.save()
              .then(() => {
                res.status(200).json(book);
              })
              .catch(error => {
                res.status(400).json({ error: error.message });
              });
          })
          .catch(error => {
            res.status(400).json({ error: error.message });
          });
      };
      