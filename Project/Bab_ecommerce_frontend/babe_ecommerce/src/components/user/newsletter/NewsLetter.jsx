import React, { useState } from 'react'
import { toast } from 'react-toastify'
import useApi from '../../../hooks/useApi'
import endpoints from '../../../api/endpoints'

function NewsLetter() {
  const [email,setEmail]=useState("")
  const {post}=useApi()
  const handleSubmit=async()=>{
    try {
      const response=await post(endpoints.submitContactForm,{email:email});
      toast.success(response.message)
      setEmail("")
      
    } catch (error) {
       toast.error(error.message)
    }
  }
  
  return (
      <div className="bg-purple text-white rounded-xl mt-16 p-8 max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
  <h2
    className="text-2xl px-2 md:text-2xl font-bold text-left md:text-left"
    style={{ fontFamily: 'IntegralCF, sans-serif' }}
  >
    STAY UPTO DATE ABOUT <br /> OUR LATEST OFFERS
  </h2>

  {/* Input and Button stacked vertically */}
  <div className="flex flex-col items-center w-full md:w-auto gap-2">
    <input
      type="email"
      placeholder="Enter your email address"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="rounded-full px-5 py-3 w-full md:w-72 outline-none text-white placeholder-white border border-white"
    />
    <button
      onClick={handleSubmit}
      className="bg-white text-black px-6 py-3 font-semibold hover:bg-gray-200 transition w-full md:w-72"
      style={{ borderRadius: '50px' }}
    >
      Subscribe to Newsletter
    </button>
  </div>
</div>

  )
}

export default NewsLetter