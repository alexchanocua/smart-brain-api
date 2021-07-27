const handleRegister = (req, res, db, bcrypt) => {
    // destructor email, name, pasword from body
    const {email, name, password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    // using a transaction 
    //  insert the hashed password & email to db: login
    //  then insert the login email,name, and date to the db: users
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0], 
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'));
}

module.exports = {
    handleRegister: handleRegister
};