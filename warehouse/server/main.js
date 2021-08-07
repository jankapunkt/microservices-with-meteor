import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'

// fake data for some products
const productIds = [
  '012345',
  'abcdef',
  'foobar'
]

const randomProductId = () => productIds[Math.floor(Math.random() * 3)]
const randomAvailable = () => Math.random() <= 0.5

Meteor.startup(() => {
  Meteor.setInterval(() => {
    const params = {
      productId: randomProductId(),
      available: randomAvailable()
    }

    const response = HTTP.post('http://localhost:3000/warehouse/update', { params })

    if (response.ok) {
      console.debug(response.statusCode, 'updated product', params)
    } else {
      console.error(response.statusCode, 'update product failed', params)
    }
  }, 5000) // change this value to get faster or slower updates
})
