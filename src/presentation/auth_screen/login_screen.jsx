import React, {useEffect, useState} from 'react';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = () => {
  
  const [formState, setFormState] = useState({
    email: '',
    password: ''
  });

  const { mutate: login, data: user } = useAuth()

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };
  
  const handleSubmit = e => {
    e.preventDefault()
    login(formState)

    // const res = loginMutation;
    // console.log("🚀 ~ handleSubmit ~ res:", res)
  }


  return (    
    <main className="fixed inset-0 flex items-center justify-center bg-slate-100">
      <div className="w-[450px] rounded-lg shadow-md bg-white">
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <h1 className="text-xl text-black font-semibold text-center mb-6">
            Login
          </h1>
          
          <div className="space-y-1">
            <label className="block text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formState.email} // Liên kết với state
              onChange={handleInputChange} // Lắng nghe sự thay đổi
              className="w-full px-3 py-2 rounded-md bg-white text-black 
                border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600
              "
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formState.password} // Liên kết với state
              onChange={handleInputChange} // Lắng nghe sự thay đổi
              className="w-full px-3 py-2 rounded-md bg-white text-black 
                border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600
              "
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Go to Sign Up
              </a>
            </p>
          </div>
        
          
          <div className="text-center mt-4">
            <a
              href="#"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginScreen;