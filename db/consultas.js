const { pool } = require('./generapool.js');



//INSERT candidato
const insertUsuario = async (values) => {
   // console.log('usuario', Object.values(values))
    const insertQuery = {
        text: "INSERT INTO usuario (nombre,balance) VALUES ($1,$2)",
        values
    };
    try {      
        try {
            await pool.query(insertQuery);
        } catch (error) {
            throw error;
        }
    } catch (error) {
        throw error;
    } 
}

const getUsuarios = async () => {
    const getQuery = {
        text: "SELECT id,nombre,balance FROM usuario ORDER BY id ASC",
    }
    try {
        try {
            const result = await pool.query(getQuery);
            return result.rows
        } catch (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}

const updateUsuario = async (values) => {
    //console.log('usuarioupdate', Object.values(values))
    const updateQuery = {
        text: "UPDATE usuario SET nombre = $1, balance = $2 WHERE id = $3 ",//linea 205 index.html agrego id.
        values
    };
    try {

        try {
            await pool.query(updateQuery);
        } catch (error) {
            throw error
        }

    } catch (error) {
        throw error
    }
}

const deleteUsuario = async (id) => {
    const deleteQuery = {
        text: "DELETE FROM usuario WHERE id = $1",
        values: [id]
    };

    try {
      
        try {
            await pool.query(deleteQuery); 
        } catch (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}

const insertTransferencia = async (values) => {
    console.log('valor', values)
    const inserttransf = {
        text:  "INSERT INTO transferencia (emisor, receptor, monto, fecha) VALUES ((SELECT id FROM usuario WHERE nombre = $1), (SELECT id FROM usuario WHERE nombre = $2), $3, NOW());",
        values
    }
    let [emisor,receptor,monto] = values
    const balanceSuma = {
        text: "UPDATE usuario SET balance = balance + $2 WHERE id = (SELECT id FROM usuario WHERE nombre = $1)",
        values:[receptor,monto]
        
    }

    const balanceResta = {
        text: "UPDATE usuario SET balance = balance - $2 WHERE id = (SELECT id FROM usuario WHERE nombre = $1)",
        values:[values[0], values[2]]
        
    }

    try {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query(inserttransf)
            await client.query(balanceSuma)
            await client.query(balanceResta)
            await client.query("COMMIT");
            client.release();
            return true
        } catch (error) {
            await client.query("ROLLBACK");
            throw error
        }
    } catch (error) {
        throw error
    }

}

const getTransferencias = async () => {
    const getQuery = {
        text: "SELECT t.id, e.nombre, r.nombre, t.monto,t.fecha FROM transferencia AS t JOIN usuario AS e ON e.id = t.emisor JOIN usuario AS r ON r.id = t.receptor;",
        rowMode:"array"
    }
    try {
        try {
            const result = await pool.query(getQuery);
            //console.log(result.rows)
            return result.rows
        } catch (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}



 
module.exports = {
    insertUsuario,
    getUsuarios,
    updateUsuario,
    deleteUsuario,
    insertTransferencia,
    getTransferencias
}