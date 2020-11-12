//=====================
//       PUERTO
//=====================
process.env.PORT = process.env.PORT || 3000;

//=====================
//      BD ENV
//=====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//    TOKEN DOWN
//=====================
process.env.CAD_TOKEN = '24h'

//=====================
//   SEED de auth
//=====================
process.env.SEED = process.env.SEED || 'ahora-es-cuando'

//=====================
//     DB Dynamic
//=====================
let uriDB;
if (process.env.NODE_ENV === 'dev') {
    uriDB = 'mongodb://localhost:27017/tesis';
} else {
    uriDB = process.env.MONGO_URI
}
process.env.URI_DB = uriDB;

//=====================
//    Google CLIENT
//=====================
process.env.CLIENT_ID = process.env.CLIENT_ID || ''