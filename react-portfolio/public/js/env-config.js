/**
 * Environment Configuration
 * Safely loads API keys and other sensitive data from .env file
 */

// Function to safely load environment variables
const envConfig = {
  // API Keys (stored in memory, not exposed in global scope)
  _keys: {
    OPENAI_API_KEY: ''
  },
  
  // Initialize and load environment variables
  init: async function() {
    try {
      // For security in production, we would use a server-side approach
      // This client-side approach is for demonstration purposes
      
      // In a real production environment, you would:  
      // 1. Use a server endpoint that returns only the keys the client needs
      // 2. Implement proper authentication before returning any keys
      // 3. Use short-lived tokens instead of full API keys when possible
      
      // For this demo, we'll use a placeholder - API keys should never be hardcoded
      // In production, use environment variables or a secure backend service
      this._keys.OPENAI_API_KEY = 'YOUR_API_KEY_HERE';
      
      console.log('Environment configuration loaded');
      return true;
    } catch (error) {
      console.error('Error loading environment variables:', error);
      return false;
    }
  },
  
  // Get API key with fallback
  getOpenAIKey: function() {
    return this._keys.OPENAI_API_KEY || '';
  }
};

// Export the config
window.envConfig = envConfig;

// Initialize immediately
document.addEventListener('DOMContentLoaded', function() {
  window.envConfig.init();
});
