import jwt from 'jsonwebtoken'

const extractToken = (req) => {
    // Check Authorization header first (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    // Fall back to cookie
    return req.cookies?.token;
};

export const authenticate = (req , res , next) => {
    const token = extractToken(req);
    if(!token){
        return res.status(401).send({message : "You need to login first" , success : false});
    }
    jwt.verify(token , process.env.JWT_SECRET , (err , decode)=> {
        if(err){
            return res.status(401).send({message : "Token not valid , Please Contact Admin" , success : false});
        }
        req.user = decode;
        next();
    })
}
export const authenticateOrganizer = (req , res , next) => {
    const token = extractToken(req);
    if(!token){
        return res.status(401).send({message : "You need to login first" , success : false});
    }
    jwt.verify(token , process.env.JWT_SECRET , (err , decode)=> {
        if(err){
            return res.status(401).send({message : "Token not valid , Please Contact Admin" , success : false});
        }
        if(decode.role == 'Organizer'){
            req.user = decode;
            next();
        }
        else{
            return res.status(400).send({
                message : "Unauthorized Access",
                success : false
            })
        }
    })
}

export const authenticateAttendee = (req , res , next) => {
    const token = extractToken(req);
    if(!token){
        return res.status(401).send({message : "You need to login first" , success : false});
    }
    jwt.verify(token , process.env.JWT_SECRET , (err , decode)=> {
        if(err){
            return res.status(401).send({message : "Token not valid , Please Contact Admin" , success : false});
        }
        if(decode.role == 'Attendee'){
            req.user = decode;
            next();
        }
        else{
            return res.status(400).send({
                message : "Unauthorized Access",
                success : false
            })
        }
    })
}