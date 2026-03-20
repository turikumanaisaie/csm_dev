const [step, setStep] = useState(1);
const [formData, setFormData] = useState({
  firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '', phone: '',
  orgName: '', orgInfo: '', orgType: 'school', orgAddress: '', orgContactEmail: '', orgContactPhone: '', apiKeyManual: ''
});
const [profileImage, setProfileImage] = useState(null);

const handleNext = () => setStep(2);
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  Object.entries(formData).forEach(([key, val]) => data.append(key, val));
  if (profileImage) data.append('profileImage', profileImage);

  try {
    await api.post('/auth/register', data);
    // redirect to verify page
  } catch (err) {
    setError(err.response?.data?.message);
  }
};