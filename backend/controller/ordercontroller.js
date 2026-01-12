import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"

export const placeorder = async (req,res)=>{
    try {
        const{address, paymentmethod,cartitem,totalamount}=req.body

       
        if(cartitem.length==0){
           return res.status(400).json({message:"cart is empty"})
        }

        if(!address?.text || !address?.latitude==null || !address?.longitude==null){
          return res.status(400).json({message:"delivery address is not defined"}) 
        }

        const groupitembyid ={}

        cartitem.forEach(item => {
            const shopid= item.shop
            if(!groupitembyid[shopid]){
                groupitembyid[shopid]=[]
            }
            groupitembyid[shopid].push(item)
        });

          const shoporders = await Promise.all( Object.keys(groupitembyid).map(async(shopid)=>{
            const shopi = await Shop.findById(shopid).populate("owner")
            if(!shopi){
               return  res.status(400).json({message:"shop not defined"}) 
                
            }
 const items = groupitembyid[shopid]
                const subtotal= items.reduce((sum,i)=>{
    sum+Number(i.price)*Number(i.quantity)
},0)

             

                 return{
                    shop:shopi?._id,
                   owner: shopi.owner?._id || null,
                    subtotal,
                    shoporderitems:items.map((i)=>({
                       item:i._id,
                       name:i.name,
                       price:i.price,
                       quantity:i.quantity

                    }))
                 }

          }) )

         const neworder = await Order.create({
            user:req.userId,
            paymentmethod,
            address,
            totalamount,
            shoporders
         })
          return res.status(201).json({message:neworder})

          

    } catch (error) {
        
 res.status(500).json({message:`ordercontroller${error}`})


    }

}