const path = require('path');
const experience = require(path.join(process.cwd(), 'dist/assets/data/experience.json'));

export default function handler(req, res) {
  res.status(200).json(experience);
}
