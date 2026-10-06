const cloudinary = require('../config/cloudinary');

const subirImagen = async (dataUri, carpeta = 'educonnect/fotos') => {
  const { secure_url } = await cloudinary.uploader.upload(dataUri, {
    folder: carpeta,
    resource_type: 'image',
  });
  return secure_url;
};

const subirPDF = async (dataUri, carpeta = 'educonnect/documentos') => {
  const { secure_url } = await cloudinary.uploader.upload(dataUri, {
    folder: carpeta,
    resource_type: 'raw',
  });
  return secure_url;
};

module.exports = { subirImagen, subirPDF };