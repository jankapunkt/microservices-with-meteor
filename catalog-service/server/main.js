import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'
import bodyParser from 'body-parser'
import { Products } from '../imports/Products'
import '../fixtures/defaultProducts'

const http = WebApp.connectHandlers

// proper post body encoding
http.urlEncoded(bodyParser)
http.json(bodyParser)

// connect to your logger, if desired
const log = (...args) => console.log(...args)

// this is an open HTTP POST route, where the
// warehouse service can update product availability
http.use('/warehouse/update', function (req, res, next) {
  const { productId, available } = req.body
  log('/warehouse/update', { productId, available })

  if (Products.find({ productId }).count() > 0) {
    const transform = {
      productId: productId,
      available: available === 'true' // http requests wrap Boolean to String :(
    }

    // if not updated we respond with an error code to the service
    const updated = Products.update({ productId }, { $set: transform })
    if (!updated) {
      log('/warehouse/update not updated')
      res.writeHead(500)
      res.end()
      return
    }
  }

  res.writeHead(200)
  res.end()
})

// We can provide a publication, so the shop can subscribe to products
Meteor.publish('getAvailableProducts', function ({ category } = {}) {
  log('[publications.getAvailableProducts]:', { category })
  const query = { available: true }

  if (category) {
    query.category = category
  }

  return Products.find(query)
})

// We can provide a Method, so the shop can fetch products
Meteor.methods({
  getAvailableProducts: function ({ category } = {}) {
    log('[methods.getAvailableProducts]:', { category })
    const query = { available: true }

    if (category) {
      query.category = category
    }

    return Products.find(query).fetch() // don't forget .fetch() in methods!
  }
})
