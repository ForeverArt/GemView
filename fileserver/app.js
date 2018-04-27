const express = require('express');
const app = express();
const cors = require('cors');

const playbackRouter = require('./playbackRouter');

app.use(cors());
app.use('/static', express.static('public'));
app.use('/playback', playbackRouter);

const server = app.listen(9000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
