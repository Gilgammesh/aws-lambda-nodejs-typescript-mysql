import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { pool } from '../../database/connection';

const list = (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const sql = 'SELECT * FROM usuarios;';
  console.log('estoy listando');

  pool.getConnection((err, connection) => {
    if (err) {
      callback(null, {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          message: err
        })
      });
    } else {
      connection.query(sql, (error, results) => {
        if (error) {
          callback(null, {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              success: false,
              message: error
            })
          });
        } else {
          callback(null, {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              success: true,
              message: 'Se obtuvo la lista de todos los usuarios correctamente',
              data: results
            })
          });
          connection.release();
        }
      });
    }
  });
};

export default list;
