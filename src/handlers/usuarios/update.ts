import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { pool } from '../../database/connection';
import { Usuario } from '../../models/usuario';

const update = (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.pathParameters && event.body) {
    const id = parseInt(event.pathParameters.id as string, 10);

    const body = JSON.parse(event.body);

    const usuario: Partial<Usuario> = { ...body, actualizadoEn: new Date() };

    const sql = 'UPDATE usuarios SET ? WHERE id = ? ;';

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
        connection.query(sql, [usuario, id], (error, results) => {
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
                message: 'Se actualizó los datos del usuario correctamente',
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

export default update;
