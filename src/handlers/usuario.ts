import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { Usuario } from '../models/usuario';
import { pool } from '../database/connection';

// Crear un usuario
export const create = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
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

// Listar Usuarios
export const list = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
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

// Obtener datos de un usuario
export const get = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
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

// Actualizar datos de un usuario
export const update = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
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

export const remove = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.pathParameters) {
    const id = parseInt(event.pathParameters.id as string, 10);

    const sql = 'DELETE FROM usuarios WHERE id = ? ;';

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
                message: 'Se removió el usuario correctamente',
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
