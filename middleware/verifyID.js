const verifyID = () => {
  return (req, res, next) => {
    const refreshToken = req.cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
        if (refreshToken !== decoded.refreshToken) return res.sendStatus(403); //Forbidden
        if (refreshToken === decoded.refreshToken) next();
      }
    );
  };
};

module.exports = verifyID;
