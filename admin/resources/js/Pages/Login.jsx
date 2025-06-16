const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const response = await axios.post('/admin/login', formData);
        
        if (response.data.success) {
            // Store staff ID in localStorage
            localStorage.setItem('staff_id', response.data.user.id);
            // Redirect to dashboard
            window.location.href = '/admin/dashboard';
        }
    } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
        setIsLoading(false);
    }
}; 