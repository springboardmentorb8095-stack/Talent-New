const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// Enhanced logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.header('X-Frame-Options', 'DENY');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Log build directory contents
try {
  const buildPath = path.join(__dirname, 'build');
  console.log('📁 Build directory contents:');
  if (fs.existsSync(buildPath)) {
    const files = fs.readdirSync(buildPath);
    files.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('  ❌ Build directory not found!');
  }
} catch (err) {
  console.error('Error reading build directory:', err);
}

// Serve static files first with detailed logging
app.use(express.static(path.join(__dirname, 'build'), {
  dotfiles: 'ignore',
  etag: true,
  extensions: ['html', 'js', 'css', 'json', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico'],
  index: ['index.html'],
  maxAge: '1d',
  redirect: false,
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else if (path.includes('static')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    console.log(`📄 Serving static file: ${path}`);
  }
}));

// Handle specific routes with detailed logging
const routes = ['/login', '/dashboard', '/profile', '/projects', '/register', '/', '/chats', '/calendar', '/clients', '/settings', '/notifications', '/proposals', '/contracts', '/freelancers', '/post-project'];

routes.forEach(route => {
  app.get(route, (req, res) => {
    console.log(`🎯 Handling route: ${req.url}`);
    const indexPath = path.join(__dirname, 'build', 'index.html');
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`❌ Error sending index.html for ${req.url}:`, err);
          res.status(500).json({ 
            error: 'Internal Server Error', 
            message: 'Could not serve index.html',
            route: req.url 
          });
        } else {
          console.log(`✅ Successfully served index.html for ${req.url}`);
        }
      });
    } else {
      console.error(`❌ index.html not found at: ${indexPath}`);
      res.status(404).json({ 
        error: 'Not Found', 
        message: 'index.html not found',
        path: indexPath 
      });
    }
  });
});

// Catch-all handler for any other routes
app.get('*', (req, res) => {
  console.log(`🕸️  Catch-all handler for: ${req.url}`);
  const indexPath = path.join(__dirname, 'build', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`❌ Error in catch-all handler for ${req.url}:`, err);
        res.status(500).json({ 
          error: 'Internal Server Error', 
          message: 'Could not serve application',
          route: req.url 
        });
      }
    });
  } else {
    console.error(`❌ index.html not found in catch-all handler`);
    res.status(404).json({ 
      error: 'Not Found', 
      message: 'Application files not found',
      route: req.url 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`💥 Unhandled error for ${req.url}:`, err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    route: req.url 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Express server running on port ${PORT}`);
  console.log(`📁 Serving React app from: ${path.join(__dirname, 'build')}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 All routes will be served with index.html`);
});