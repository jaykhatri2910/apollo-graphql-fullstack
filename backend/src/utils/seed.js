const path = require('path');

// Delegate to root-level seed script to ensure a single source of truth
require(path.resolve(__dirname, '../../../seed/index.js'));
