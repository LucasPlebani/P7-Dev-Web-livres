const Book = require('../models/book');

exports.createBooks = (req, res, next) => { //route de base
    
};

exports.modifyBooks = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) //Utilisation de updateOne() Cela nous permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument.
    .then(() => res.status(200).json({ message: 'livre modifié !' }))
    .catch(error => res.status(400).json ({ error }));
  };


exports.deleteBooks = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id }) //utilisation de deleteOne() 
    .then(() => res.status(200).json ({ message: 'livre supprimé !'}) )
    .catch(error => res.status(400).json ({ error }));
  };

  exports.getOneBooks = (req, res, next) => {  //méthode get pour répondre uniquement aux demandes GET à cet endpoint 
    Book.findOne({ _id: req.params.id })  //méthode findOne() dans notre modèle Thing pour trouver le Thing unique ayant le même _id que le paramètre de la requête 
    .then(book => res.status(200).json(book))  //promise et envoie au front-end
    .catch(error => res.status(404).json ({ error })) ; //si aucun est trouvé error 404
  };

  exports.getAllBooks = (req, res, next) => {
    Book.find() // renvoie le tableau contenant les Things 
    .then(books => res.status(200).json(books)) 
    .catch(error => res.status(400).json({ error }));
    };