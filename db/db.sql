CREATE DATABASE bancosolar;
\c bancosolar

CREATE TABLE usuario (
id SERIAL PRIMARY KEY,
nombre VARCHAR(50),
balance FLOAT CHECK (balance >= 0));

CREATE TABLE transferencia (
id SERIAL PRIMARY KEY,
emisor INT,
receptor INT, 
monto FLOAT, 
fecha TIMESTAMP, 
FOREIGN KEY (emisor) REFERENCES usuario(id), 
FOREIGN KEY (receptor) REFERENCES usuario(id));

SELECT t.fecha, e.nombre 
FROM transferencia AS t
JOIN usuario AS e ON e.id = t.emisor

SELECT t.fecha, e.nombre, r.nombre, t.monto 
FROM transferencia AS t 
JOIN usuario AS e ON e.id = t.emisor 
JOIN usuario AS r ON r.id = t.receptor;