const { IncomingForm } = require('formidable');
const rimraf = require('rimraf');
const { PythonShell } = require('python-shell');
const uuidv4 = require('uuid/v4');
const fs = require('fs');
const { promisify } = require('util');
const sizeOf = promisify(require('image-size'));
const reduceFraction = require('./utils/reduceFraction');

const getAsyncPhotoSize = async file => {
  const dimensions = await sizeOf(`${__dirname}/result/${file}`);
  const [width, height] = reduceFraction(dimensions.width, dimensions.height);
  return {
    src: `http://localhost:8000/${file}`,
    width,
    height,
  };
};

const getData = async files => {
  return await Promise.all(files.map(file => getAsyncPhotoSize(file)));
};

exports.upload = function upload(req, res) {
  const form = new IncomingForm();
  form.parse(req);

  form.on('fileBegin', function(name, file) {
    file.path = `${__dirname}/data/${file.name}`;
  });
  form.on('file', function(name, file) {
    console.log(`Uploaded ${file.name}`);
  });
  form.on('end', () => {
    res.json();
  });
};

exports.getResult = (req, res) => {
  const filename = uuidv4();
  //Call python
  const options = {
    args: ['--images', 'data', '--output', `result/output_${filename}.png`],
  };
  PythonShell.run('image_stitching.py', options, function(err) {
    if (err) {
      console.log(err);
    }
    console.log('finished');
    const path = `http://localhost:8000/output_${filename}.png`;
    if (fs.existsSync(`${__dirname}/result/output_${filename}.png`)) {
      return res.json(path);
    }
    console.log("Can't not create images");
    return res.status(404).send('Bad request');
  });
};

exports.deleteUpload = (req, res) => {
  rimraf(`${__dirname}/data/${req.params.name}`, function() {
    console.log('done');
  });
  res.status(200).send('Delete success');
};

exports.deleteAll = (req, res) => {
  rimraf(`${__dirname}/data/*`, function() {
    console.log('done');
  });
  res.status(200).send('Delete success');
};

exports.getAllResult = (req, res) => {
  fs.readdir(`${__dirname}/result`, async function(err, files) {
    if (err) {
      return console.log(`Unable to scan directory: ${err}`);
    }
    const data = await getData(files);
    return res.json(data);
  });
};
