CREATE DATABASE IF NOT exists asistencias_db;

USE asistencias_db;

CREATE TABLE Account (
    id VARCHAR(12) NOT NULL default 'T000' unique,
    email VARCHAR(80) NOT NULL default 'example@email.com' unique,
    password VARCHAR(100) NOT NULL default '',
    rol VARCHAR(7) NOT NULL default '',
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES Useruniversity(id)
);
