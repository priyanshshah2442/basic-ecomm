const multer=require('multer');
const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:'webprojectsms',
    api_key:575176961214179,
    api_secret:'fLQh67jRXL9mu9QZsCW51WHrViE',

});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'sample',
      allowedFormats:['jpg','jpeg','png']
    //   format: async (req, file) => ['jpeg','png','jpg'] // supports promises as well
      
    },
  });

  const parser = multer({ storage: storage });
  module.exports={cloudinary,storage,parser};