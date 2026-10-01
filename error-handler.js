/* ==========================================================
   GLOBAL ERROR HANDLING UTILITY
========================================================== */

const ErrorHandler = {
  // Toast notification at bottom
  showToast(message, isError = true, duration = 4000) {
    let toast = document.getElementById('globalErrorToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalErrorToast';
      toast.className = 'error-toast hide';
      document.body.appendChild(toast);
    }
    
    const messageText = document.createElement('span');
    messageText.textContent = message;
    toast.innerHTML = '';
    toast.appendChild(messageText);
    toast.classList.remove('hide', 'success');
    if (!isError) toast.classList.add('success');
    toast.classList.add('show');
    
    if (duration) {
      setTimeout(() => {
        toast.classList.add('hide');
        toast.classList.remove('show');
      }, duration);
    }
  },

  // Display error message inline
  showErrorMessage(container, message, code = '') {
    if (!container) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.role = 'alert';
    
    let content = message;
    if (code) content += ` (Code: ${code})`;
    
    errorDiv.textContent = content;
    container.insertAdjacentElement('afterbegin', errorDiv);
    
    return errorDiv;
  },

  // Clear error messages
  clearErrors(container) {
    if (container) {
      container.querySelectorAll('.error-message').forEach(el => el.remove());
    }
  },

  // Show full page error state
  showErrorState(container, title = 'Something went wrong', message = 'Please try refreshing the page or contact support.') {
    if (!container) return;
    
    container.innerHTML = `
      <div class="error-state">
        <div class="error-state-content">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#E53E3E" stroke-width="1.5"/><path d="M12 8V12" stroke="#E53E3E" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="16" r="0.8" fill="#E53E3E"/></svg>
          <h3 style="color:#333; margin:16px 0 8px; font-size:16px;">${escHTML(title)}</h3>
          <p style="color:#666; font-size:14px; margin-bottom:16px;">${escHTML(message)}</p>
          <button class="btn btn-gold btn-sm" onclick="location.reload()">Try Again</button>
        </div>
      </div>
    `;
  },

  // Handle network errors
  handleNetworkError(error, context = '') {
    console.error(`Network Error${context ? ' (' + context + ')' : ''}:`, error);
    
    let message = 'Network error. Please check your connection.';
    if (error.message === 'Failed to fetch') {
      message = 'Unable to connect. Please check your internet connection.';
    } else if (error.status === 404) {
      message = 'The requested resource was not found.';
    } else if (error.status === 500) {
      message = 'Server error. Please try again later.';
    } else if (error.status === 503) {
      message = 'Service temporarily unavailable. Please try again later.';
    }
    
    this.showToast(message, true);
    return message;
  },

  // Handle validation errors
  handleValidationError(error, fieldName = '') {
    console.error(`Validation Error${fieldName ? ' - ' + fieldName : ''}:`, error);
    
    let message = 'Please check your input and try again.';
    if (fieldName) {
      message = `${fieldName} is invalid. Please check and try again.`;
    }
    
    this.showToast(message, true);
    return message;
  },

  // Handle auth errors
  handleAuthError(error) {
    console.error('Authentication Error:', error);
    this.showToast('Please log in to continue.', true);
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  },

  // Handle data errors
  handleDataError(error, action = 'loading') {
    console.error(`Data Error (${action}):`, error);
    
    let message = 'Unable to ' + action + ' data. Please try again.';
    this.showToast(message, true);
    return message;
  },

  // Wrap async operations with error handling
  async withErrorHandling(asyncFn, context = 'Operation') {
    try {
      return await asyncFn();
    } catch (error) {
      console.error(`${context} failed:`, error);
      this.handleNetworkError(error, context);
      throw error;
    }
  },

  // Validate email
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate phone
  isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  // Validate required field
  isRequired(value) {
    return value && value.trim().length > 0;
  }
};

// Helper: Escape HTML
function escHTML(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}

if (typeof window !== "undefined") { window.ErrorHandler = ErrorHandler; }
