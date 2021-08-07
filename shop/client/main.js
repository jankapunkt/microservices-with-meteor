import { Template } from 'meteor/templating'
import { Mongo } from 'meteor/mongo'
import { ReactiveVar } from 'meteor/reactive-var'
import { DDP } from 'meteor/ddp-client'
import 'mini.css/dist/mini-dark.css'
import './main.html'

// at very first we establish a connection to our catalog-service
// in a real app we would read the remote url from Meteor.settings
// see: https://docs.meteor.com/api/core.html#Meteor-settings
const remote = 'http://localhost:3000'
const serviceConnection = DDP.connect(remote)

// we need to pass the connection as option to the Mongo.Collection
// constructor; otherwise the subscription mechanism doesn't "know"
// where the subscribed documents will be stored
export const Products = new Mongo.Collection('products', {
  connection: serviceConnection
})

Template.products.onCreated(function () {
  // we create some reactive variable to store our fetch result
  const instance = this
  instance.fetchedProducts = new ReactiveVar()

  // we can't get our data immediately, since we don't know the connection
  // status yet, so we wrap it into a function to be called on "connected"
  const getData = () => {
    const params = { category: 'electronics' }

    // option 1 - fetch using method call via remote connection
    serviceConnection.call('getAvailableProducts', params, (err, products) => {
      if (err) return console.error(err)

      // insert the fetched products into our reactive data store
      instance.fetchedProducts.set(products)
    })

    // options 2 - subscribe via remote connection, documents will be
    // added / updated / removed to our Products collection automagically
    serviceConnection.subscribe('getAvailableProducts', params, {
      onStop: error => console.error(error),
      onReady: () => console.debug('getAvailableProducts sub ready')
    })
  }

  // we reactively wait for the connected status and then stop the Tracker
  instance.autorun(computation => {
    const status = serviceConnection.status()
    console.debug(remote, { status: status.status })

    if (status.connected) {
      setTimeout(() => getData(), 500)
      computation.stop()
    }
  })
})

Template.products.helpers({
  subscribedProducts () {
    return Products.find({ available: true })
  },
  fetchedProducts () {
    return Template.instance().fetchedProducts.get()
  }
})
