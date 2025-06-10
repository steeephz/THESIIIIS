import axios from 'axios';

// Replace with your Laravel backend URL
const API_URL = 'http://your-backend-url.com/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Announcements API
export const announcementApi = {
    // Get all active announcements
    getAnnouncements: async () => {
        try {
            const response = await api.get('/announcements');
            return response.data;
        } catch (error) {
            console.error('Error fetching announcements:', error);
            throw error;
        }
    }
};

// Payments API
export const paymentApi = {
    // Submit a new payment
    submitPayment: async (paymentData) => {
        try {
            const formData = new FormData();
            
            // Add payment details to form data
            Object.keys(paymentData).forEach(key => {
                if (key === 'proof_of_payment') {
                    // Handle image file
                    formData.append('proof_of_payment', {
                        uri: paymentData.proof_of_payment,
                        type: 'image/jpeg',
                        name: 'payment_proof.jpg'
                    });
                } else {
                    formData.append(key, paymentData[key]);
                }
            });

            const response = await api.post('/payments', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting payment:', error);
            throw error;
        }
    },

    // Get payment history for a customer
    getPaymentHistory: async (customerId) => {
        try {
            const response = await api.get(`/payments/customer/${customerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching payment history:', error);
            throw error;
        }
    }
}; 