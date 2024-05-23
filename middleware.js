const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();


const middlewarequeue = []

server.use(middlewares)

server.use(jsonServer.bodyParser)

server.use((req,res,next)=>{
  if(req.method == 'GET'){
    middlewarequeue.push(next)
  
    setTimeout(()=>{
      next()
      next == middlewarequeue[0] && middlewarequeue.shift()
    },5000)
  }
  else{
    next()
  }
})

server.use((req,res,next)=>{
  if(req.method == "POST"){
    console.log("post request handiling");
    next()
    console.log("post request after next");
    while(middlewarequeue.length>0){
      nextfun = middlewarequeue.shift()
      nextfun()
    }
  }
})

server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});



