const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const load = exports.loadDirectory = async (dir) => {
  const readdir = promisify(fs.readdir);
  const stat = promisify(fs.stat);

  const files = await readdir(dir);
  const list = [];

  await Promise.all(files.map(async (f) => {
    const currentPath = path.join(dir, f);
    const stats = await stat(currentPath);

    if (stats.isFile() && path.extname(currentPath) === '.js') {
      list.push(currentPath);
    } else if (stats.isDirectory()) {
      const files = await load(currentPath);
      list.push(...files);
    }
  }));

  return list;
};
