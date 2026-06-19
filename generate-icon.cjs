const sharp = require('sharp')
const fs    = require('fs')

const svgCode = fs.readFileSync('./public/icons.svg')

sharp(svgCode)
  .resize(512, 512)
  .png()
  .toFile('./public/icon-512.png', (err) => {
    if (err) console.error(err)
    else console.log('✅ icon-512.png erstellt!')
  })

sharp(svgCode)
  .resize(192, 192)
  .png()
  .toFile('./public/icon-192.png', (err) => {
    if (err) console.error(err)
    else console.log('✅ icon-192.png erstellt!')
  })