const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');

const subirImagen = async (dataUri, carpeta = 'educonnect/fotos') => {
  const { secure_url } = await cloudinary.uploader.upload(dataUri, {
    folder: carpeta,
    resource_type: 'image',
  });
  return secure_url;
};

const subirArchivo = async (dataUri, carpeta = 'educonnect/documentos') => {
  if (!dataUri) return null;
  if (
    typeof dataUri === 'string' &&
    (dataUri.startsWith('http://') ||
      dataUri.startsWith('https://') ||
      dataUri.startsWith('/uploads/'))
  ) {
    return dataUri;
  }

  // 1. Guardar copia local exacta del archivo PDF en disco
  const uploadsDir = path.join(__dirname, '../../uploads/documentos');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {
    // Directorio ya existe
  }

  let localUrl = null;
  if (typeof dataUri === 'string' && dataUri.startsWith('data:')) {
    try {
      const parts = dataUri.split(',');
      if (parts[1]) {
        const buffer = Buffer.from(parts[1], 'base64');
        const filename = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.pdf`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        localUrl = `/uploads/documentos/${filename}`;
      }
    } catch (saveErr) {
      console.error('Error guardando copia local del PDF:', saveErr);
    }
  }

  // 2. Intentar subir a Cloudinary si está habilitado
  try {
    const res = await cloudinary.uploader.upload(dataUri, {
      folder: carpeta,
      resource_type: 'raw',
    });
    // Retornamos la URL local si existe para lectura directa o la de Cloudinary
    return localUrl || res.secure_url;
  } catch (error) {
    console.error('Aviso al subir PDF a Cloudinary (usando almacenamiento local):', error.message || error);
    return localUrl || dataUri;
  }
};

module.exports = { subirImagen, subirArchivo };