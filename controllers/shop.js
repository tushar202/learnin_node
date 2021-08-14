const Product = require('../models/product');
const { get } = require('../routes/shop');
const { getDb } = require('../util/database');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products=>{
    res.render('shop/product-list.ejs',{
      prods:products,
      pageTitle:'products',
      path:'/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });  
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product=>{
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  })

};
    



exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(products=>{
    res.render('shop/index.ejs',{
      prods:products,
      pageTitle:'Shop',
      path:'/'
    });
  })
  .catch(err=>{
    console.log(err);
  });  
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(products=>{
    // console.log(products);
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products
    })
// console.log(products);
  })
  };
  
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
      
  //   });
  // });

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  Product.findById(prodId)
  .then(product=>{
    // console.log(product);
    return req.user.addToCart(product);
  })
  .then(result=>{
    res.redirect('/cart');
    // console.log(result);
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteCartItem(prodId)
  .then(result=>{
    res.redirect('/cart');
    console.log(result);
  })
  .catch(err=>{
    console.log(err);
  });
};

exports.postOrders=(req,res,next)=>{
  req.user.addOrder()
  .then(result=>{
    console.log(result);
    console.log("order Added");
    res.redirect('/orders');
  })
  .catch(err=>{
    console.log(err);
  })
}


exports.getOrders = (req, res, next) => {
  const db=getDb();
  req.user.getOrders()
  .then(orders=>{
    // console.log(products);
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders:orders
    });
  })
  .catch(err=>{
    console.log(err);
  })
 
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}
