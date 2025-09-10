import React from 'react'
import Navbar from '../../layout/Navbar'
import Hero from './home/Hero'
import NewArrivals from './home/NewArrivals'
import TestimonialsSection from './home/TestimonialsSection'
import Footer from '../../layout/Footer'
import BlogSlider from './home/BlogSlider'

function UserHome() {
  return (
    <>
   
    <Hero/>
    <NewArrivals/>
    <BlogSlider/>
    <TestimonialsSection/>
    
    </>
  )
}

export default UserHome