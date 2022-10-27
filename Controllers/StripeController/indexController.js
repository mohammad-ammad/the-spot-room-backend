const stripe = require("stripe")("sk_test_51KBg9jG0gapMqUsSStaMHsN1MITaZYel2SaHzyo57eLlcYeRalafEJEfp7z2LcmNQdwGCxc1Bss3tJsUxuYyh4mN00t7rt6YoV")
const { uuid } = require('uuidv4');

exports.create = async (req,res) => {
    const {product, token} = req.body;
    const idempotencyKey = uuid();

    // res.status(200).json(idempotencyKey) 

    stripe.customers.create({
        email:token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount:product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email:token.email,
            description:product.name,
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        },{idempotencyKey})
    }).then(result => res.status(200).json(
        {
            success:true,
            data:result,
            trxId:idempotencyKey
        }
    ))
    .catch(err => res.status(401).json(err.message))
}