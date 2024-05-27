const captaErrores = (error,res)=>{
    console.log('error', error.message);
    res.writeHead(500).end(JSON.stringify(error));
}

module.exports = {
    captaErrores
}