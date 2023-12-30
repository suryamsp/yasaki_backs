import  jwt  from "jsonwebtoken";

export const authe= (request, response, next)=>{
    try{
      const token= request.header("x-auth-token");
    console.log(token);
    jwt.verify(token, "suryamsp");
    next();
    } catch(err){
      response.status(401).send({message:err.message});
    }
  }
