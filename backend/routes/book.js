const express = require('express');
const auth = require('../middleware/auth');
const router =  express.Router(); //méthode d'exress router 
const multer = require('../middleware/multer-config');
const bookCtrl = require ('../controllers/book')

//crud 
  
//Route pour post les requêtes
router.post('/', auth, multer, bookCtrl.createBooks);

 
//route de modification 
router.put('/:id', auth, bookCtrl.modifyBooks);

//route de suppression 
router.delete('/:id', auth, bookCtrl.deleteBooks);

//route de lecture 
//route trouver un seul books par son ID
router.get('/:id', auth, bookCtrl.getOneBooks);

//route get renvoie Things dans la base de données
router.get('/', auth, bookCtrl.getAllBooks);

module.exports = router;