/* Check if User is an application Reviewer */
async function reviewerOnly(req, res, next) {
    if (req.roles.includes('reviewer') || req.roles.includes('admin')) {
      next()
    } else {
      return res.status(403).json({ error: 'Reviewers Only' });
    }
  }
  
  module.exports = reviewerOnly