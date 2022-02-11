const login = (req, res) => {
    //login api logic here
    res.send({"message": "Trying to login?"});
};


const AuthController = {
    login
};

module.exports = AuthController;