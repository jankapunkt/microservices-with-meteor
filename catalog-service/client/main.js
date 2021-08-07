/* global AutoForm */
import { Template } from 'meteor/templating'
import { Tracker } from 'meteor/tracker'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Products } from '../imports/Products'
import SimpleSchema from 'simpl-schema'
import { AutoFormPlainTheme } from 'meteor/communitypackages:autoform-plain/static'
import 'meteor/aldeed:autoform/static'
import 'mini.css/dist/mini-dark.css'
import './main.html'

// init schema, forms and theming
AutoFormPlainTheme.load()
AutoForm.setDefaultTemplate('plain')
SimpleSchema.extendOptions(['autoform'])

// schema for inserting products,
// Tracker option for reactive validation messages
const productSchema = new SimpleSchema(Products.schema, { tracker: Tracker })

Template.products.onCreated(function () {
  const instance = this
  instance.state = new ReactiveDict()
})

Template.products.helpers({
  allProducts () {
    return Products.find()
  },
  productSchema () {
    return productSchema
  },
  addProduct () {
    return Template.instance().state.get('addProduct')
  }
})

Template.products.events({
  'click .addProduct' (event, templateInstance) {
    event.preventDefault()
    templateInstance.state.set('addProduct', true)
  },
  'submit #addProductForm' (event, templateInstance) {
    event.preventDefault()

    const productDoc = AutoForm.getFormValues('addProductForm').insertDoc
    Products.insert(productDoc)

    templateInstance.state.set('addProduct', false)
  }
})
