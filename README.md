# AWS Serverless Lambda - Nodejs - Typescript - MySQL

Función Lambda del tipo Rest Api. Usando el framework Serverless, con Nodejs, Typescript y Mysql.
Definimos un CRUD sencillo para una entidad de Usuarios.

## Consideraciones Previas

### Herramientas

Necesitaremos tener instaladas en nuestra máquina local:

> **Nodejs**: versión 16.X (de preferencia la versión LTS Gallium 16.17.1)

> **Serverless**: Framework Core versión 3.2 ó superior y SDK versión 4.3 ó superior

> **MySQL**: versión 5.7 ó superior (con editor recomendado WorkBench)

### Base de datos MySQL

Necesitaremos crear la tabla "usuarios", tanto en nuestro MySQL Local y el de RDS AWS MySQL.  
Nos ayudaremos del editor MySQL preferido o el recomendado WorkBench y ejecutamos el siguiente script SQL.

```sql
CREATE TABLE development.usuarios (
id INT NOT NULL UNIQUE AUTO_INCREMENT,
nombres VARCHAR(255) NOT NULL,
apellido_paterno VARCHAR(255) NOT NULL,
apellido_materno VARCHAR(255) NOT NULL,
dni VARCHAR(8) UNIQUE NOT NULL,
email VARCHAR(255) NOT NULL,
movil VARCHAR(9) NOT NULL,
edad INT NOT NULL,
estado TINYINT DEFAULT 1,
creadoEn TIMESTAMP NOT NULL,
actualizadoEn TIMESTAMP NOT NULL,
CONSTRAINT PK_Usuario PRIMARY KEY (id)
);
```

Nota: si el nombre de su esquema es diferente que "development", cambiarlo por el que está usando.

## Instalación

Instalar dependencias del proyecto y de desarrollo:

```sh
npm install
```

```sh
npm install -D
```

## Variables de Entorno

### Variables de Desarrollo

Renombramos el archivo `.env.dev.example` que se encuenta en la raíz del proyecto por `.env.dev`

Editamos el archivo con los datos de nuestra base de datos MySQL Local (versión 5.7 en adelante)

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre-base-datos
DB_USER=root
DB_PASSWORD=123
```

### Variables de Producción

Renombramos el archivo `.env.prod.example` que se encuenta en la raíz del proyecto por `.env.prod`

Editamos el archivo con los datos de nuestra base de datos MySQL o Aurora de Amazon Web Services

```
DB_HOST=xxx.xxx.xxx.amazonaws.com
DB_PORT=3306
DB_NAME=nombre-base-datos
DB_USER=admin
DB_PASSWORD=secret
```

## Configuración de VPC

En el archivo `serverless.yml`, debemos agregar los datos de nuestro vpc con las configuraciones que tenemos en Aws Console, si en caso hemos creado reglas. Agregamos el Id del grupo de seguridad y los ids de las subredes.

```yaml
provider:
  name: aws
  runtime: nodejs16.x
  vpc:
    securityGroupIds:
      - sg-xxxxxxxxxxxxxx
    subnetIds:
      - subnet-xxxxxxxxxxxxxx1
      - subnet-xxxxxxxxxxxxxx2
      - subnet-xxxxxxxxxxxxxx3
      - subnet-xxxxxxxxxxxxxx4
      - subnet-xxxxxxxxxxxxxx5
      - subnet-xxxxxxxxxxxxxx6
```

## Despliegue

### Entorno de Desarrollo Local

Ejecutamos el script

```sh
npm run local
```

Que es equivalente al script

```sh
serverless offline --stage dev
```

Se despliega en modo local con el stage de desarrollo.
En consola veremos lo siguiente:

```shell
DOTENV: Loading environment variables from .env.dev:
         - DB_HOST
         - DB_PORT
         - DB_NAME
         - DB_USER
         - DB_PASSWORD
Compiling with Typescript...
Using local tsconfig.json - tsconfig.json
Typescript compiled.
Watching typescript files...

Starting Offline at stage dev (us-east-1)

Offline [http for lambda] listening on http://localhost:3002
Function names exposed for local invocation by aws-sdk:
           * getUsuarios: aws-lambda-nodejs-typescript-mysql-dev-getUsuarios
           * createUsuario: aws-lambda-nodejs-typescript-mysql-dev-createUsuario
           * getUsuario: aws-lambda-nodejs-typescript-mysql-dev-getUsuario
           * updateUsuario: aws-lambda-nodejs-typescript-mysql-dev-updateUsuario
           * removeUsuario: aws-lambda-nodejs-typescript-mysql-dev-removeUsuario

   ┌───────────────────────────────────────────────────────────────────────────────────┐
   │                                                                                   │
   │   GET    | http://localhost:3000/dev/usuarios                                     │
   │   POST   | http://localhost:3000/2015-03-31/functions/getUsuarios/invocations     │
   │   POST   | http://localhost:3000/dev/usuarios                                     │
   │   POST   | http://localhost:3000/2015-03-31/functions/createUsuario/invocations   │
   │   GET    | http://localhost:3000/dev/usuarios/{id}                                │
   │   POST   | http://localhost:3000/2015-03-31/functions/getUsuario/invocations      │
   │   PUT    | http://localhost:3000/dev/usuarios/{id}                                │
   │   POST   | http://localhost:3000/2015-03-31/functions/updateUsuario/invocations   │
   │   DELETE | http://localhost:3000/dev/usuarios/{id}                                │
   │   POST   | http://localhost:3000/2015-03-31/functions/removeUsuario/invocations   │
   │                                                                                   │
   └───────────────────────────────────────────────────────────────────────────────────┘

Server ready: http://localhost:3000 🚀
```

Luego podremos probar nuestras peticiones Http usando nuestro Rest client favorito (Postman, Thunder Client, Curl, etc.)

### Entorno de Producción en AWS Lambda

Ejecutamos el script

```sh
npm run deploy
```

Que es equivalente al script

```sh
serverless deploy --stage prod
```

Se despliega a Aws Funciones Lambda con el stage de producción.
En consola veremos lo siguiente:

```shell
DOTENV: Loading environment variables from .env.prod:
         - DB_HOST
         - DB_PORT
         - DB_NAME
         - DB_USER
         - DB_PASSWORD

Deploying aws-lambda-nodejs-typescript-mysql to stage prod (us-east-1)
Compiling with Typescript...
Using local tsconfig.json - tsconfig.json
Typescript compiled.
✔ Pruning of functions complete

✔ Service deployed to stack aws-lambda-nodejs-typescript-mysql-prod (400s)

endpoints:
  GET - https://xxx.xxx.xxx.amazonaws.com/prod/usuarios
  POST - https://xxx.xxx.xxx.amazonaws.com/prod/usuarios
  GET - https://xxx.xxx.xxx.amazonaws.com/prod/usuarios/{id}
  PUT - https://xxx.xxx.xxx.amazonaws.com/prod/usuarios/{id}
  DELETE - https://xxx.xxx.xxx.amazonaws.com/prod/usuarios/{id}
functions:
  getUsuarios: aws-lambda-nodejs-typescript-mysql-prod-getUsuarios (5.5 kB)
  createUsuario: aws-lambda-nodejs-typescript-mysql-prod-createUsuario (5.5 kB)
  getUsuario: aws-lambda-nodejs-typescript-mysql-prod-getUsuario (5.5 kB)
  updateUsuario: aws-lambda-nodejs-typescript-mysql-prod-updateUsuario (5.5 kB)
  removeUsuario: aws-lambda-nodejs-typescript-mysql-prod-removeUsuario (5.5 kB)
```

Luego podremos probar nuestras peticiones Http en la nube con nuestro Rest cliente favorito (Postman, Thunder Client, Curl, etc.) ó proporcionamos estos endpoints al equipo FrontEnd.

## Plugins

> **serverless-plugin-typescript**: Soporte de typescript para lambdas

> **serverless-dotenv-plugin**: Soporte para variables de entorno

> **serverless-prune-plugin**: Para borrar versiones anteriores de las funciones y evitar consumo

> **serverless-offline**: Soporte para trabajar con lambdas de manera local
