import { Mongo } from 'meteor/mongo'

export const Products = new Mongo.Collection('products')

// used to automagically generate forms via AutoForm and SimpleSchema
// use with aldeed:collection2 to validate document inserts and updates
Products.schema = {
  productId: String,
  name: String,
  description: String,
  category: String,
  price: Number,
  available: Boolean
}
