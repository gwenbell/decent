var fs = require('fs')
var path = require('path')
var ssbKeys = require('ssb-keys')
var stringify = require('pull-stringify')
var config = require('./plugins/ssb-config/inject')(process.env.ssb_appname)

var keys = ssbKeys.loadOrCreateSync(path.join(config.path, 'secret'))

var manifestFile = path.join(config.path, 'manifest.json')

var createSbot = require('./lib')
  .use(require('./plugins/master'))
  .use(require('./plugins/gossip'))
  .use(require('./plugins/replicate'))
  .use(require('ssb-friends'))
  .use(require('ssb-blobs'))
  .use(require('./plugins/invite'))
  .use(require('./plugins/local'))
  .use(require('./plugins/logging'))
  .use(require('./plugins/private'))
  .use(require('ssb-query'))
  .use(require('ssb-links'))
  .use(require('./plugins/ssb-ws'))
  .use(require('ssb-ebt'))
  .use(require('./plugins/serve'))

config.keys = keys
var server = createSbot(config)

fs.writeFileSync(
  manifestFile, JSON.stringify(server.getManifest(), null, 2)
)

