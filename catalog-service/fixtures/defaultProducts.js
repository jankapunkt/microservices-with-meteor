import { Meteor } from 'meteor/meteor'
import { Products } from '../imports/Products'

const fixedDocs = [
  {
    productId: 'foobar',
    name: 'Dev Keyboard',
    description: 'makes you pro dev',
    category: 'electronics',
    price: 1000,
    available: true
  },
  {
    productId: '012345',
    name: 'Pro Gamepad',
    description: 'makes you pro gamer',
    category: 'electronics',
    price: 300,
    available: true
  },
  {
    productId: 'abcdef',
    name: 'Pro Headset',
    description: 'makes you pro musician',
    category: 'electronics',
    price: 800,
    available: true
  }
]

// to make the start easier for you, we add some default docs here
Meteor.startup(() => {
  if (Products.find().count() === 0) {
    fixedDocs.forEach(doc => Products.insert(doc))
  }
})
