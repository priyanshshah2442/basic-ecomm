const mongoose = require('mongoose');
const bcrypt=require('bcrypt');
const db = 'mongodb+srv://priyansh_ecomm:priyansh24@cluster0.i9pznor.mongodb.net/E-commerce?retryWrites=true&w=majority';
module.exports.createSchema = async () => {
    await mongoose.connect(db, {
        // useNewUrlParser: true,
        // useCreateIndex:true,
        // useUnifiedTopology:true,
        // useFindAndModify:false
    }).then(() => {
        console.log("connection successful");
    }).catch((err) => {
        console.log("Failed", err);
    });
    const schema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, 'please enter name']
        },
        price: Number,
        brand: String,
        imgurl: String,
        imgfilename: String
        // img:{
        //     url:String,
        //     filename:String
        // }
    });
    Product = mongoose.model('product', schema);
}
module.exports.createUserSchema = async () => {
    await mongoose.connect(db).then(() => {
        console.log("connection successful");
    }).catch((err) => {
        console.log("Failed", err);
    });
    const schema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        }
    });
    User = mongoose.model('user', schema);
}
module.exports.isUserUnique = async function (email) {
    let data = await User.findOne({ email: email });
    // console.log(data["email"])
    if (data === null) {
        return true;
    }
    else {
        return false;
    }
}
module.exports.insert = async (name, price, brand, imgurl, imgfilename) => {

    let data = new Product({
        name: name,
        price: price,
        brand: brand,
        imgurl: imgurl,
        imgfilename: imgfilename
    })
    return result = JSON.stringify(await data.save());
    // console.log(result);

};
module.exports.registerUser = async (email, password) => {
    let user = new User({
        email: email,
        password: password,
    })
    return result = JSON.stringify(await user.save());
    // console.log(result);


};
module.exports.showDbs = async () => {

    let data = await Product.find();
    let result = JSON.stringify(data);
    console.log(result);
    return result;
}
module.exports.showUsers = async () => {

    let data = await User.find();
    let result = JSON.stringify(data);
    console.log(result);
    return result;
}

module.exports.login=async(email,password)=>{
    let data=await User.findOne({email:email});
    const isMatch=await bcrypt.compare(password,data["password"]);
    if(data===null)
    {
        return false;
    }
    else
    {
        if(isMatch)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

}