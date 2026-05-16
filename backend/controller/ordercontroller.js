import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import crypto from "crypto"
import Razorpay from "razorpay"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

console.log("Razorpay KEY_ID loaded:", process.env.RAZORPAY_KEY_ID ? "✅ YES" : "❌ MISSING")

// ─── Helper: group cart items by shop ────────────────────────────────────────
const buildShopOrders = async (cartitem) => {
  const groupitembyid = {}

  cartitem.forEach((item) => {
    const shopid = item.shop
    if (!groupitembyid[shopid]) groupitembyid[shopid] = []
    groupitembyid[shopid].push(item)
  })

  const shoporders = await Promise.all(
    Object.keys(groupitembyid).map(async (shopid) => {
      const shopi = await Shop.findById(shopid).populate("owner")
      if (!shopi) throw new Error("shop not found")

      const items = groupitembyid[shopid]
      const subtotal = items.reduce(
        (sum, i) => sum + Number(i.price) * Number(i.quantity),
        0
      )

      return {
        shop: shopi._id,
        owner: shopi.owner?._id || null,
        subtotal,
        shoporderitems: items.map((i) => ({
          item: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
      }
    })
  )

  return shoporders
}

// ─── COD: Place Order ─────────────────────────────────────────────────────────
export const placeorder = async (req, res) => {
  try {
    const { address, paymentmethod, cartitem, totalamount } = req.body

    if (!cartitem || cartitem.length === 0)
      return res.status(400).json({ message: "cart is empty" })

    if (!address?.text || address?.latitude == null || address?.longitude == null)
      return res.status(400).json({ message: "delivery address is not defined" })

    const shoporders = await buildShopOrders(cartitem)

    const neworder = await Order.create({
      user: req.userId,
      paymentmethod,
      paymentstatus: "pending",
      address,
      totalamount,
      shoporders,
    })

    return res.status(201).json({ message: "Order placed", order: neworder })
  } catch (error) {
    res.status(500).json({ message: `placeorder error: ${error.message}` })
  }
}

// ─── ONLINE: Step 1 — Create Razorpay Order ───────────────────────────────────
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body // amount in ₹

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" })

    const options = {
      amount: Math.round(amount * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }

    const razorpayOrder = await razorpay.orders.create(options)

    return res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    res.status(500).json({ message: `createRazorpayOrder error: ${error.message}` })
  }
}

// ─── ONLINE: Step 2 — Verify Payment & Save Order ─────────────────────────────
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      address,
      cartitem,
      totalamount,
    } = req.body

    // 1. Verify HMAC-SHA256 signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." })
    }

    // 2. Build shop orders and save to DB
    const shoporders = await buildShopOrders(cartitem)

    const neworder = await Order.create({
      user: req.userId,
      paymentmethod: "online",
      paymentstatus: "paid",
      razorpay_order_id,
      razorpay_payment_id,
      address,
      totalamount,
      shoporders,
    })

    return res.status(201).json({ message: "Payment verified. Order placed.", order: neworder })
  } catch (error) {
    res.status(500).json({ message: `verifyPayment error: ${error.message}` })
  }
}

// ─── GET: Fetch My Orders ─────────────────────────────────────────────────────
export const getmyorders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .populate("shoporders.shop", "name image")
    return res.status(200).json({ orders })
  } catch (error) {
    res.status(500).json({ message: `getmyorders error: ${error.message}` })
  }
}