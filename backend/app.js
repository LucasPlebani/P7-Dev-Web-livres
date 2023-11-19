const express = require('express');
const bodyParser = require('body-parser'); //utilisation de BodyParser pour analyser les données Json 
const mongoose = require('mongoose');
const path = require('path');  // chemin ('path') en direction du fichier image qui est statique 
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');


//connection à MongoDB atlas 
mongoose.connect('mongodb+srv://lucas_plebani14:j8u28WMoi4SY5Lkd@atlascluster.cgn3jq8.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express();

  //CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //* pour que tous puisse acceder a l'api 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
 // Répondre aux requêtes OPTIONS avec un statut 200 OK
 if (req.method === 'OPTIONS') {
  res.sendStatus(200);
} else {
  next();
}
});

app.use(bodyParser.json());


app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));  //__dirname enregistre et actualise l'appli dans le navigateur

module.exports = app; 