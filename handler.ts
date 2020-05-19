import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
const mysql      = require('mysql');
const querystring = require('querystring');


export const store: APIGatewayProxyHandler = async (event, _context) => {
    const connection = mysql.createConnection({
        host     : 'tikal-roadmap-rpi.c9zxb6rj9l9b.eu-west-1.rds.amazonaws.com',
        user     : 'admin',
        password : 'I3u0a2356',
        database : 'tikal_roadmap_rpi'
    });

    connection.connect();

    // Parse the post body
    const data = querystring.parse(event.body);

    // Access variables from body
    const {user_id, name, image_key} = data;

    connection.query(`
    INSERT INTO entries (user_id, name, image_key)
    VALUES (?, ?, ?);    
    `, [user_id, name, image_key]);

    connection.end();

    return {
        statusCode: 200,
        body: JSON.stringify({
            statusCode: 200,
            description: 'success'
        }, null, 2),
    };
};

export const get: APIGatewayProxyHandler = async (event, _context) => {
    const connection = mysql.createConnection({
        host     : 'tikal-roadmap-rpi.c9zxb6rj9l9b.eu-west-1.rds.amazonaws.com',
        user     : 'admin',
        password : 'I3u0a2356',
        database : 'tikal_roadmap_rpi'
    });

    connection.connect();

    const results = await new Promise((resolve, reject) => {
        connection.query('SELECT * FROM `entries` where 1', function (error, results, fields) {
            resolve(results)
        });
    });

    connection.end();

    return {
        statusCode: 200,
        body: JSON.stringify({
            results
        }, null, 2)
    }
};