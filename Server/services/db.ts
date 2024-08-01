import mysql, { Connection } from "mysql2/promise";

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME_DATABASE;

export async function initDataBase(): Promise<Connection | null> {
    let connection: Connection | null = null;
  
    try {
        connection = await mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database,
        });
    } catch (e) {
        console.error(e.message || e);
        return null;
    }
  
    console.log(`Connection to DB ProductsApplication established`);
    return connection;
}