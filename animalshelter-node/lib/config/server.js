// cors = Cross-Origin Resource Sharing; we have to set this to 'true' so that the browser will allow us to access the
// RESTful API established by this Node server

'use strict';

module.exports = {
  connections: {
    routes: {
      cors: true
    }
  }
};
