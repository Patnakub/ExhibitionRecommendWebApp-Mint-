'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [resendEmail, setResendEmail] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState(false);
  const [inputErrors, setInputErrors] = useState({
      username: '',
      email: ''
  });
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    gender: '',
    dob: '',
    interests: [] as string[],
  });
/*สำหรับการแสดงผลของ background image ตาม step ที่กำหนด*/
  const getBackground = (step: number) => {
    switch (step) {
      case 0:
        return "url('/regis1.svg')";
      case 1:
        return "url('/regis2.svg')";
      case 2:
        return "url('/regis3.svg')";
      case 3:
        return "url('/regis4.svg')";
      case 4:
        return "url('/regis5.svg')";
      default:
        return "url('/regis6.svg')";
    }
  };

  const steps = ['User Info', 'Gender & Birthdate', 'Interests', 'Register'];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => c.name));
        } else {
          console.error('Unexpected response format:', data);
          setCategories([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      });
  }, []);
  

  const isStepValid = () => {
    if (step === 0) {
      const { username, password, email } = formData;
      return (
        username.trim() !== '' &&
        password.trim().length >= 6 &&
        email.trim() !== '' &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      );
    }
    if (step === 1) {
      const { gender, dob } = formData;
      const today = new Date().toISOString().split('T')[0];
      return gender && dob && dob <= today;
    }
    if (step === 2) {
      return formData.interests.length > 0;
    }
    return true;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleButtonClick = (value: string) => {
    setFormData((prev) => {
      const isSelected = prev.interests.includes(value);
      let updated = isSelected
        ? prev.interests.filter((v) => v !== value)
        : [...prev.interests, value];
      if (updated.length > 3) updated = updated.slice(0, 3);
      return { ...prev, interests: updated };
    });
  };

  const handleNext = async () => {
    const valid = isStepValid();
    setShowErrors(true);
  
    // เคลียร์ error เก่า
    setInputErrors({ username: '', email: '' });
  
    if (!valid) return;
  
    if (step === 0) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/check-duplicate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username.trim(),
            email: formData.email.trim(),
          }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          setInputErrors((prev) => ({
            ...prev,
            [data.field]: data.message
          }));
          return; // หยุดไม่ให้ไป step ต่อ
        }
      } catch (err) {
        alert('ไม่สามารถเชื่อมต่อกับระบบได้');
        return;
      }
    }
  
    setShowErrors(false);
    if (step === 2) {
      console.log('interests:', formData.interests);
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };
  

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
          email: formData.email.trim(),
          birthdate: formData.dob,
          gender: formData.gender,
          interests: formData.interests.filter(i => typeof i === 'string'), 
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setStep(3); // show success
      } else {
        alert(data.msg || data.error || 'เกิดข้อผิดพลาดในการสมัคร');
      }
    } catch {
      alert('สมัครไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
    }
  };
  

  const handleResend = async () => {
    setResendMessage('');
    setResendError(false);
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      setResendMessage(data.message || data.error || 'ส่งล้มเหลว');
      setResendError(!res.ok);
    } catch {
      setResendMessage('ไม่สามารถเชื่อมต่อกับระบบได้');
      setResendError(true);
    }
  };
  

  // ✅ แสดงหน้ากล่อง Resend Verification แบบเต็มแทน Signup
  if (step === 4) {
    return (
      <motion.div
  key={step}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
  className="min-h-screen flex items-center justify-center"
  style={{
    backgroundImage: getBackground(step),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold text-[#5372A4] mb-4">Resend Verification</h2>
          <p className="text-sm text-gray-600 mb-6">Enter your email to receive a new verification link.</p>
          <input
            type="email"
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5372A4] mb-6"
          />
          {resendMessage && (
            <p className={`text-sm mt-1 mb-4 ${resendError ? 'text-red-500' : 'text-gray-700'}`}>
              {resendMessage}
            </p>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleResend}
              className="bg-[#5372A4] text-white px-6 py-2 rounded-full hover:bg-[#415a8a] transition"
            >
              Resend Verification
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-[#5372A4] text-white px-6 py-2 rounded-full hover:bg-[#415a8a] transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      </motion.div>
    );
  }

  // ✅ หน้าสมัคร (step 0–3)
  return (
    <motion.div
  key={step}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
  className="min-h-screen flex items-center justify-center"
  style={{
    backgroundImage: getBackground(step),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Signup</h1>
        <div className="flex justify-center space-x-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${index === step ? 'bg-gray-800' : 'bg-[#D9D9D9]'}`}
            ></div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 text-left"
          >
            {step === 0 && (
              <>
                <label className="block text-sm mb-1">User Name *</label>
                <input type="text" value={formData.username} onChange={(e) => handleChange('username', e.target.value)} className="w-full p-3 bg-gray-100 rounded-md" />
                {showErrors && formData.username.trim() === '' && (
                  <p className="text-red-500 text-sm mt-1">กรุณากรอกชื่อผู้ใช้</p>
                )}
                {inputErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{inputErrors.username}</p>
                )}

                <label className="block text-sm mb-1">Password *</label>
                <input type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} className="w-full p-3 bg-gray-100 rounded-md" />
                {showErrors && formData.password.length < 6 && <p className="text-red-500 text-sm mt-1">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>}

                <label className="block text-sm mb-1">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full p-3 bg-gray-100 rounded-md" />
                {showErrors && formData.email.trim() === '' ? (
                  <p className="text-red-500 text-sm mt-1">กรุณากรอกอีเมล</p>
                ) : showErrors && !formData.email.includes('@') ? (
                  <p className="text-red-500 text-sm mt-1">รูปแบบอีเมลไม่ถูกต้อง</p>
                ) : null}
                {inputErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{inputErrors.email}</p>
                )}
              </>
            )}
            {step === 1 && (
              <>
                <label className="block text-sm mb-1">Gender *</label>
                <div className="flex space-x-4">
                  {['male', 'female', 'other'].map((g) => (
                    <label key={g} className="flex items-center">
                      <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={(e) => handleChange('gender', e.target.value)} className="mr-2" />
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </label>
                  ))}
                </div>
                {showErrors && formData.gender === '' && <p className="text-red-500 text-sm mt-1">กรุณาเลือกเพศ</p>}

                <label className="block text-sm mb-1 mt-4">Date of Birth *</label>
                <input type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} className="w-full p-3 bg-gray-100 rounded-md" />
                {showErrors && formData.dob > new Date().toISOString().split('T')[0] && <p className="text-red-500 text-sm mt-1">วันเกิดต้องไม่เกินวันนี้</p>}
              </>
            )}
            {step === 2 && (
              <>
                <label className="block text-sm mb-1 text-center">What are you interested in?</label>
                <p className="block text-xs mb-1 mt-4 text-center">This will recommend event for you</p>
                {formData.interests.length < 3 && (
                  <p className="block text-sm mb-1 text-center text-black">
                    Pick {3 - formData.interests.length} More
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {categories.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleButtonClick(interest)}
                      type="button"
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {showErrors && formData.interests.length === 0 && (
                  <p className="text-red-500 text-sm mt-1">กรุณาเลือกอย่างน้อย 1 หมวดความสนใจ</p>
                )}
              </>
            )}
            {step === 3 && (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-[#5372A4]">Register Success!</h2>
                <p className="text-sm text-gray-700">Please check your email to verify before logging in.</p>
                <div className="flex justify-center gap-4">
                  <button onClick={() => setStep(4)} className="bg-[#5372A4] text-white px-6 py-2 rounded-full hover:bg-[#415a8a] transition">Resend Verification</button>
                  <button onClick={() => router.push('/login')} className="bg-[#5372A4] text-white px-6 py-2 rounded-full hover:bg-[#415a8a] transition">Login</button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 3 && (
          <div className="flex justify-between items-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
              disabled={step === 0}
              className={`w-1/2 py-3 rounded-full border ${
                step === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100'
              }`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-1/2 py-3 rounded-full bg-[#5372A4] text-white hover:bg-blue-700"
            >
              {step === 2 ? 'Register' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
