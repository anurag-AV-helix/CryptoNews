const axios = require('axios');
const pg = require('pg');

exports.lambdaHandler = async (event, context) => {
    let response;
    let result;
    let client;
    try {
        let news = await axios.get('https://cryptonews-api.com/api/v1/category?section=general&items=50&token=jqgw4nacmgofhkyjddooagzd9qm776tflljgifn4');
        news = news.data.data;
        client = new pg.Client({
            user: 'dbmasteruser',
            host: 'cryptodb.cktgeluy4zgr.ap-south-1.rds.amazonaws.com',
            database: 'cryptonews',
            password: 'dbmasteruser',
            port: 5432,
        });
        client.connect();
        await client.query('BEGIN');
        await client.query('TRUNCATE cryptonewstable');
        let query = `INSERT INTO public."cryptonewstable"(
        news_url, image_url, title, text, source_name, date, sentiment, type)
        VALUES ($1,	$2,	$3,	$4,	$5, $6,	$7,	$8)`;
        for (var i of news) {
            result = await client.query(query, [i.news_url, i.image_url, i.title, i.text,
            i.source_name, i.date, i.sentiment, i.type]);
            if (!result.rowCount)
                throw 'data not inserted';
        }
        await client.query('COMMIT');
        response = {
            'statusCode': 200,
            'body': result
        };
    } catch (err) {
        console.log(err);
        await client.query('ROLLBACK');
        response = {
            'statusCode': 500,
            'body': err
        };
    } finally {
        client.end();
    }
    return response;
};