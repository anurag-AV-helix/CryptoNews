const pg = require('pg');

exports.lambdaHandler = async (event, context) => {
    let response;
    let client;
    try {
        client = new pg.Client({
            user: 'dbmasteruser',
            host: 'cryptodb.cktgeluy4zgr.ap-south-1.rds.amazonaws.com',
            database: 'cryptonews',
            password: 'dbmasteruser',
            port: 5432,
        });
        client.connect();
        const result = await client.query('SELECT * FROM cryptonewstable');
        response = {
            'statusCode': 200,
            'body': JSON.stringify({ "data": result.rows })
        };
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        client.end();
    }
    return response;
};