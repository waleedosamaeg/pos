export default (req , res )=>{
        const authHeader = req.headers.authorization;
               
                
        if (!authHeader  ) { 
                return {state : false , reason : "no.token.provided"}
        }
        const headerParts = authHeader.split(/\s+/)
        const token = headerParts[1]
        if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== "bearer" || !token) {
                return {state:false , reason : "authorization.header.malformed"}
        } 
        
        if (token.split(".").length !== 3) { 
                return {state: false , reason :"jwt.token.malformed !"}

        }
        return {state : true , token}

}