const path = require('path');
const skills = require(path.join(process.cwd(), 'dist/assets/data/skills.json'));

export default function handler(req, res) {
  res.status(200).json(skills);
}
