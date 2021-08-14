const mongodb=require('mongodb');
const getDb=require('../util/database').getDb;

class User{
    constructor(username,email,cart,id){
        this.name=username;
        this.email=email;
        this.cart=cart,
        this._id=id;
    }
    save(){
        const db=getDb();
        return db.collection('user').insertOne(this)
        .then(user=>{
            return user
            console.log('Okay-user-created');
            // console.log(user);
        })
        .catch(err=>{
            console.log(err);
        });

    }


    addToCart(product){
        const updatedCartItems=[...this.cart.items];
        let f=0;
        for(let i=0;i<updatedCartItems.length;i++){
            console.log(updatedCartItems[i].productId.toString());
            console.log(product._id.toString());

            // console.log(product._id);
            if(updatedCartItems[i].productId.toString()===product._id.toString()){
                f=1;
                console.log(1);
                updatedCartItems[i].quantity+=1;
            }
        }
        if(!f){
            updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:1});
        }
        // console.log(product);
        const updatedCart={items:updatedCartItems};
        // const updatedCart={items:[{productId:product._id,quantity:1}]};
        const db=getDb();
        // console.log(updatedCart);
        return db.collection('user').updateOne(
            {_id:new mongodb.ObjectId(this._id)},
            {$set:{cart:updatedCart}}
        );
    
}


    getCart(){
        const db=getDb();
        const productIds=this.cart.items.map(i=>{
            return i.productId;
        });
        return db
        .collection('products')
        .find({_id:{$in:productIds}})
        .toArray()
        .then(products=>{
            // console.log(products);
            return products.map(p=>{
                // console.log(p);
                return {...p,quantity:this.cart.items.find(i=>{
                    // console.log(i);
                    return i.productId.toString()===p._id.toString();
                }).quantity};
            })
        })
    }

    deleteCartItem(prodId){
        const db=getDb();
        const cartItems=this.cart.items;
        const updatedCartItems=[];
        for(let i=0;i<cartItems.length;i++){
            if(cartItems[i].productId.toString()!=prodId){
                    updatedCartItems.push(cartItems[i]);
            }
        }
        const updatedCart={items:updatedCartItems};
        return db.collection('user')
        .updateOne({_id:this._id},{$set:{cart:updatedCart}});
        

    }

    addOrder(){
        const db=getDb();
        return this.getCart()
        .then(products=>{
            console.log(this.name+'username')
            const order={
                items:products,
                user:{
                    _id:new mongodb.ObjectId(this._id),
                    name:this.name
                }
            }
            return db.collection('orders')
        .insertOne(order)
        })
        .then(result=>{
            console.log(result);
            this.cart={items:[]};
            return db.collection('user')
            .updateOne(
                {_id:new mongodb.ObjectId(this._id)}
                ,{$set:{cart:{items:[]}}}
            );
        })
        .catch(err=>{
            console.log(err);
        })
        
        
    }
// // console.log(products);
// return products.map(p=>{
//     // console.log(p);
//     return {...p,quantity:this.cart.items.find(i=>{
//         // console.log(i);
//         return i.productId.toString()===p._id.toString();
//     }).quantity};

    getOrders(){
        const db=getDb();
        return db.collection('orders')
        .find({'user._id':new mongodb.ObjectId(this._id)})
        .toArray();
    }

    static findById(userId){
        const db=getDb();
        return db
        .collection('user')
        .find({_id:new mongodb.ObjectId(userId)})
        .next()
        .then(user=>{
            // console.log(user);
            return user;
        })
        .catch(err=>{
            console.log(err);
        })
    }
}


module.exports=User;