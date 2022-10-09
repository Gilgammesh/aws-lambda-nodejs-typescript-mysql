import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { pool } from '../../database/connection';
import { Usuario } from '../../models/usuario';

const create = (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.body) {
    const body = JSON.parse(event.body);

    const usuario: Usuario = {
      nombres: body.nombres,
      apellido_paterno: body.apellido_paterno,
      apellido_materno: body.apellido_materno,
      dni: body.dni,
      email: body.email,
      movil: body.movil,
      edad: body.edad,
      creadoEn: new Date(),
      actualizadoEn: new Date()
    };

    const sql = 'INSERT INTO usuarios SET ? ;';

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
        connection.query(sql, [usuario], (error, results) => {
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
                message: 'Se creó el usuario correctamente',
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
        message: 'No se ha proporcionado un cuerpo en la petición'
      })
    });
  }
};

export default create;
