/**
 * Password Validation Utility
 * Enforces application-level password complexity requirements
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (optional but recommended)
 */

const passwordValidator = {
    /**
     * Minimum password length
     */
    MIN_LENGTH: 8,

    /**
     * Maximum password length
     */
    MAX_LENGTH: 128,

    /**
     * Regular expressions for validation
     */
    patterns: {
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/,
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    },

    /**
     * Validate password against all requirements
     * @param {string} password - The password to validate
     * @returns {Object} - Validation result with isValid flag and error messages
     */
    validate(password) {
        const errors = [];

        // Check if password is provided
        if (!password) {
            return {
                isValid: false,
                errors: ['Password is required']
            };
        }

        // Check minimum length
        if (password.length < this.MIN_LENGTH) {
            errors.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
        }

        // Check maximum length
        if (password.length > this.MAX_LENGTH) {
            errors.push(`Password must not exceed ${this.MAX_LENGTH} characters`);
        }

        // Check for uppercase letter
        if (!this.patterns.uppercase.test(password)) {
            errors.push('Password must contain at least one uppercase letter (A-Z)');
        }

        // Check for lowercase letter
        if (!this.patterns.lowercase.test(password)) {
            errors.push('Password must contain at least one lowercase letter (a-z)');
        }

        // Check for number
        if (!this.patterns.number.test(password)) {
            errors.push('Password must contain at least one number (0-9)');
        }

        // Check for common weak passwords
        const weakPasswords = ['password', '12345678', 'qwerty', 'abc123', 'letmein'];
        const lowerPassword = password.toLowerCase();
        if (weakPasswords.some(weak => lowerPassword.includes(weak))) {
            errors.push('Password is too common or easily guessable');
        }

        // Check for sequential characters
        if (this.hasSequentialChars(password)) {
            errors.push('Password contains sequential characters (e.g., abc, 123, xyz)');
        }

        // Check for repeated characters
        if (this.hasRepeatedChars(password)) {
            errors.push('Password contains too many repeated characters');
        }

        return {
            isValid: errors.length === 0,
            errors: errors,
            strength: this.calculateStrength(password)
        };
    },

    /**
     * Check if password contains sequential characters
     * @param {string} password - The password to check
     * @returns {boolean} - True if sequential characters found
     */
    hasSequentialChars(password) {
        const sequences = [
            'abcdefghijklmnopqrstuvwxyz',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '0123456789',
            'qwertyuiop',
            'asdfghjkl',
            'zxcvbnm'
        ];

        const lower = password.toLowerCase();
        for (let i = 0; i < lower.length - 2; i++) {
            const substr = lower.substring(i, i + 3);
            for (const seq of sequences) {
                if (seq.includes(substr)) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Check if password has too many repeated characters
     * @param {string} password - The password to check
     * @returns {boolean} - True if too many repeated characters
     */
    hasRepeatedChars(password) {
        const repeated = /(.)\1{2,}/; // Same character repeated 3+ times
        return repeated.test(password);
    },

    /**
     * Calculate password strength score
     * @param {string} password - The password to evaluate
     * @returns {Object} - Strength score and label
     */
    calculateStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 12,
            uppercase: this.patterns.uppercase.test(password),
            lowercase: this.patterns.lowercase.test(password),
            numbers: (password.match(/[0-9]/g) || []).length >= 2,
            special: this.patterns.special.test(password),
            mixed: password.length >= 10 &&
                   this.patterns.uppercase.test(password) &&
                   this.patterns.lowercase.test(password) &&
                   this.patterns.number.test(password) &&
                   this.patterns.special.test(password)
        };

        score = Object.values(checks).filter(Boolean).length;

        let label = 'weak';
        if (score >= 5) label = 'strong';
        else if (score >= 3) label = 'medium';

        return {
            score,
            maxScore: 6,
            label,
            checks
        };
    },

    /**
     * Generate a strong random password
     * @param {number} length - Desired password length (default: 16)
     * @returns {string} - Generated password
     */
    generate(length = 16) {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        const allChars = uppercase + lowercase + numbers + special;
        let password = '';

        // Ensure at least one of each character type
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        // Fill remaining length with random characters
        for (let i = 4; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password
        return password.split('').sort(() => 0.5 - Math.random()).join('');
    },

    /**
     * Get password requirements description
     * @returns {string} - Human-readable requirements
     */
    getRequirements() {
        return [
            `At least ${this.MIN_LENGTH} characters long`,
            'At least one uppercase letter (A-Z)',
            'At least one lowercase letter (a-z)',
            'At least one number (0-9)',
            'No sequential characters (e.g., abc, 123)',
            'No more than 2 repeated characters in a row'
        ];
    }
};

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = passwordValidator;
}

if (typeof window !== 'undefined') {
    window.passwordValidator = passwordValidator;
}
