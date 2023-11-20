const express = require('express');
const auth = require('../middleware/auth');
const router =  express.Router(); //méthode d'express router 
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/book')
const resizeImage = require('../middleware/sharp-config')
//crud 
 
//route trouver un seul books par son ID
router.get('/:id', bookCtrl.getOneBooks);

//route get récupérée tous les livres
router.get('/', bookCtrl.getAllBooks);  

router.get('/bestrating', bookCtrl.getBestrating);

router.post('/:id/rating', auth, bookCtrl.createRating);

//Route pour post les requêtes
router.post('/', auth, multer, resizeImage, bookCtrl.createBooks); // ajout multer 

 
//route de modification 
router.put('/:id', auth, multer, resizeImage, bookCtrl.modifyBooks);

//route de suppression 
router.delete('/:id', auth, bookCtrl.deleteBooks);




module.exports = router;