const jwt = require('jsonwebtoken');
const jwtSecret="heyayuhs"
const fetchuser=(req,res,next)=>
{
    //get the user fromthe jwt token and add id to req object
    const token =req.header("auth-token")//in the header we name authtoken.since it is a request so we are writing in the header
    if(!token)
    {
        res.status(401).send({error: "pls authenticate using a valid token"})
    }
    try 
    {
        const data=jwt.verify(token,jwtSecret)
        req.user=data.user//if token is invalid so we dont get any data so it is written within try catch statement

        // so according to token we are now accessing the users data 
        next()
        
    } 
    catch (error) 
    {
        res.status(401).send({error: "pls authenticate using a valid token"})
        
    }
}
module.exports=fetchuser