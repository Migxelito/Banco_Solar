const http = require('http');
const url = require('url');
const fsPromise = require('fs/promises');
const { captaErrores } = require('./util/errores');
const { Console } = require('console');
const { insertUsuario, getUsuarios, updateUsuario, deleteUsuario, insertTransferencia, getTransferencias } = require('./db/consultas');

const PORT = 3000;
http
    .createServer(async (req, res) => {
        if (req.url == "/" && req.method == "GET") {
            res.writeHead(200, { "Content-type": "text/html" });
            try {
                const html = await fsPromise.readFile("exam7/index.html", "utf8");
                res.end(html);
            } catch (error) {
                captaErrores(error, res);  
            }
        }

        else if ((req.url == "/usuario") && (req.method == "POST")) {
            let body = "";
            req.on("data", (chunck) => {
                body += chunck;
            })
            req.on("end", async () => {
                try {
                    const usuario = JSON.parse(body);
                    //console.log('usuario', Object.values(usuario))
                    await insertUsuario(Object.values(usuario))
                    res.writeHead(201).end()
                } catch (error) {
                    captaErrores(error, res);
                }
            })
        }
        
        else if ((req.url == "/usuarios") && (req.method == "GET")) {
            try {
                const usuarios = await getUsuarios();
                res.writeHead(201, { "Content-type": "application/json" }).end(JSON.stringify(usuarios));
            } catch (error) {
                captaErrores(error, res);
            }
        }

        else if ((req.url.startsWith("/usuario?id")) && (req.method == "PUT")) {
            let body = "";
            req.on("data", (chunck) => {
                body += chunck;
            })
            req.on("end", async () => {
                console.log(body)
                try {
                    const usuario = JSON.parse(body);
                    await updateUsuario(Object.values(usuario))
                    console.log(usuario)
                    res.writeHead(201).end()
                } catch (error) {
                    captaErrores(error, res);
                }
            })
        }

        
        else if ((req.url.startsWith("/usuario?id")) && (req.method == "DELETE")) {
            let { id } = url.parse(req.url, true).query;
            try {
                await deleteUsuario(id);
                res.writeHead(201).end("usuario eliminado")
            } catch (error) {
                captaErrores(error, res);
            }
        }

        else if ((req.url == "/transferencia") && (req.method == "POST")) {
            let body = "";
            req.on("data", (chunck) => {
                body += chunck;
            })
            req.on("end", async () => {
                try {
                    const transferencia = JSON.parse(body);
                    //console.log('transferencia', Object.values(transferencia))
                    await insertTransferencia(Object.values(transferencia))
                    res.writeHead(201, { "Content-type": "application/json" }).end(JSON.stringify(transferencia));
                   // res.writeHead(201).end()
                } catch (error) {
                    captaErrores(error, res);
                }
            })
        }

        else if ((req.url == "/transferencias") && (req.method == "GET")) {
            try {
                const transferencias = await getTransferencias();
                res.writeHead(201, { "Content-type": "application/json" }).end(JSON.stringify(transferencias));
            } catch (error) {
                captaErrores(error, res);
            }
        }


    })
    .listen(PORT, () => console.log(`Corriendo en el puerto ${PORT}`))