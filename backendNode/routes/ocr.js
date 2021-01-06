const express = require('express')
const tessaract = require('tesseract.js')
const multer = require('multer');
const fs = require('fs-extra')

const router = new express.Router()

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/images/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage })

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const createWorker = tessaract.createWorker;
        const worker = createWorker();
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng')

        const { data: { text } } = await worker.recognize(req.file.path)

        // remove image from path "req.file.path"
        await fs.remove(req.file.path)

        res.send(text)
    } catch (error) {
        res.send(error)
    }
})


module.exports = router