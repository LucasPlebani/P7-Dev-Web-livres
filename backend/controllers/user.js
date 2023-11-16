const bcrypt = require('bcrypt'); // Utilisation Bcrypt pour hacher le mdp
const jwt = require('jsonwebtoken');
const User =  require ('../models/User');

exports.signup = (req, res, next) => {
bcrypt.hash(req.body.password, 10) //hachage du mdp 10 fois
    .then(hash => {
        const user = new User ({ 
            email: req.body.email, 
            password: hash
        });
        user.save()
        .then(() => res.status(201).json({ message: 'utilisatieur créé !'}))
        .catch(error => res.status(400).json ({ error }));
    })
    .catch(error => res.status(500).json ({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (user === null) {
            res.status(401).json({message: 'Paire indetfiant/mot de passe incorrecte'}); // n'existe pas 
        } else {
            bcrypt.compare(req.body.password, user.password) 
            .then(valid => {
                if (!valid) { //si identifiant valide
                    res.status(401).json({message: 'Paire indentifiant/mot de passe incorrecte'}); //Incorrecte

                } else {
                    res.status(200).json({ 
                        userId: user._id, 
                        token: jwt.sign( //fonction sign de jsonwebtoken pour chiffrer un nouveau token
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET', //token contient un payload avec et validité limitée.
                            { expiresIn: '24h'} // devra se reconnecter au bout de 24 h + envoie d'un nouveau token
                        )     //valide

                    });
                }
            }) .catch(error => {
                res.status(500).json( { error });
            })
        }
    })
    .catch(error => {
        res.status(500).json( {error} );
    })
};