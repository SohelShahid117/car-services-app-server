/*
1.install jsonwebtoken in server side
2.jwt.sign(payload,secret,{expiresIn:}) in post method
3.token client:token send to client side
*/

/*
*how to store token in client side:
    1.memory
    2.local storage-XSS
    3.cookies:http only
*/

/*
1.set cookies with http only.for development secure:false
2.cors setting-->
    app.use(cors({
        origin:['http://localhost:5173'],
        credentials:true
    }));
3.client side axios setting
in axios set -->withCredential:true
*/
