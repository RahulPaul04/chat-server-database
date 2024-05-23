const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();


const middlewarequeue = []

server.use(middlewares)

server.use(jsonServer.bodyParser)

server.use((req,res,next)=>{
  if(req.method == 'GET'){
    if(req.query.firsttime){
      next()
    }
    else{
      middlewarequeue.push(next)
  
      setTimeout(()=>{
        next()
        next == middlewarequeue[0] && middlewarequeue.shift()
      },5000)
    }
    
  }
  else{
    next()
  }
})

server.use((req,res,next)=>{
  if(req.method == "POST" || req.method == "PUT" || req.method == "DELETE"){
    console.log("post request handiling");
    next()
    console.log("post request after next");
    console.log(middlewarequeue,middlewarequeue.length);
    while(middlewarequeue.length>0){
      console.log("resolving all polled requests");
      nextfun = middlewarequeue.shift()
      nextfun()
    }
   
  }
  else{
    next()
  }
})

server.use(router)

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});



