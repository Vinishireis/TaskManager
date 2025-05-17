const multer = require('multer')

// Configuração de Armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename : (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

// Filtro de Arquivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Somente arquivos nos formatos .jpeg, .jpg e .png'), false)
    }
}

const upload = multer({ storage, fileFilter})

module.exports = upload;