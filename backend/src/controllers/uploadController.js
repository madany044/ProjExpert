const { Readable } = require('stream');
const cloudinary = require('../services/cloudinary');

// Upload a single file (multipart/form-data field name: 'file')
const uploadFile = async (req, res) => {
  try {
    console.log('uploadFile called, req.file:', req.file ? `${req.file.originalname} (${req.file.mimetype})` : 'undefined');
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const buffer = req.file.buffer;
    const filename = req.file.originalname;
    const mimeType = req.file.mimetype;

    console.log(`Uploading ${filename} (${mimeType}, ${buffer.length} bytes) to Cloudinary...`);

    // Server-side MIME whitelist
    const ALLOWED_MIMES = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/zip', 'application/x-zip-compressed',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (!ALLOWED_MIMES.includes(mimeType)) {
      return res.status(400).json({ message: 'File type not allowed' });
    }

    let responded = false;
    const uploadStream = cloudinary.uploader.upload_stream({ folder: 'projxpert' }, (error, result) => {
      if (responded) return; // prevent double response
      responded = true;
      if (error) {
        console.error('Cloudinary upload error', error);
        return res.status(500).json({ message: 'Upload failed', error: error.message });
      }
      console.log('Cloudinary upload success:', result.public_id);
      // result contains url, secure_url, public_id
      res.json({ url: result.secure_url, filename, mimeType, public_id: result.public_id });
    });

    // Handle stream errors
    uploadStream.on('error', (err) => {
      if (responded) return;
      responded = true;
      console.error('Upload stream error', err);
      res.status(500).json({ message: 'Stream error', error: err.message });
    });

    // Create a readable stream from the buffer without external deps
    const readStream = new Readable();
    readStream.push(buffer);
    readStream.push(null);
    readStream.pipe(uploadStream);
  } catch (err) {
    console.error('uploadFile error', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete by public_id (passed in body)
const deleteFile = async (req, res) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: 'Missing public_id' });
    const result = await cloudinary.uploader.destroy(public_id);
    res.json({ ok: true, result });
  } catch (err) {
    console.error('deleteFile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadFile, deleteFile };
