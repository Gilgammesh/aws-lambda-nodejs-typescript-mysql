import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { pool } from '../../database/connection';

const get = (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.pathParameters) {
    const id = parseInt(event.pathParameters.id as string, 10);

    const sql = 'SELECT * FROM usuarios WHERE id = ? ;';

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
        connection.query(sql, [id], (error, results) => {
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
                message: 'Se obtuvo los datos del usuario correctamente',
                data: results
              })
            });
            connection.release();
          }
        });
      }
    });
  } else {
    callback(null, {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: 'No se ha proporcionado un id de usuario'
      })
    });
  }
};

export default get;