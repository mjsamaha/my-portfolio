const path = require('path');
const projects = require(path.join(process.cwd(), 'dist/assets/data/projects.json'));

export default function handler(req, res) {
  res.status(200).json(projects);
}


