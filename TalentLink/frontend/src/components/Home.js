import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useCountUp } from '../hooks/useAnimations';
import { heroVariants, cardVariants, fadeInUpVariants } from '../utils/animations';

const Home = () => {
  console.log("Home component rendering");
  
  const freelancersCount = useCountUp(20000, { duration: 2000 });
  const projectsCount = useCountUp(10000, { duration: 2000 });
  const satisfactionCount = useCountUp(98, { duration: 2000, suffix: '%' });
  
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <motion.nav 
        className="fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-100 shadow-sm"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              TL
            </motion.div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              TalentLink
            </span>
          </motion.div>

          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors">Home</Link>
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline transition-colors">Log In</Link>
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition shadow-sm hover:shadow-md">
                Sign Up
              </Link>
            </motion.span>
          </motion.div>
        </div>
      </motion.nav>

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={heroVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div 
            className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6, type: "spring", stiffness: 200 }}
          >
            #1 Freelance Marketplace
          </motion.div>
          <motion.h1 
            className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Hire the best talent <br />
            <motion.span 
              className="text-blue-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              anywhere, anytime.
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-500 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            Connect with top-tier freelancers and clients. Whether you need a developer, designer, or writer, TalentLink makes it easy to build your dream team.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <motion.span
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:text-lg shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                Find Talent
              </Link>
            </motion.span>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.div 
            className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          <motion.img 
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80" 
            alt="Professional team collaboration" 
            className="rounded-3xl shadow-2xl w-full object-cover transform rotate-1 hover:rotate-0 transition-transform duration-500"
            whileHover={{ scale: 1.02, rotate: 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div 
            className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6, type: "spring", stiffness: 200 }}
          >
             <div className="bg-green-100 p-2 rounded-full">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">Verified Talent</p>
                <p className="text-xs text-gray-500">Top 1% Vetted</p>
             </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="bg-white py-12 border-y border-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100"
            variants={fadeInUpVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="p-4" variants={fadeInUpVariants}>
              <motion.div 
                className="text-4xl font-bold text-blue-600 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                {freelancersCount}
              </motion.div>
              <motion.div 
                className="text-gray-500 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Freelancers
              </motion.div>
            </motion.div>
            <motion.div className="p-4" variants={fadeInUpVariants}>
              <motion.div 
                className="text-4xl font-bold text-blue-600 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.1 }}
              >
                {projectsCount}
              </motion.div>
              <motion.div 
                className="text-gray-500 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Projects Completed
              </motion.div>
            </motion.div>
            <motion.div className="p-4" variants={fadeInUpVariants}>
              <motion.div 
                className="text-4xl font-bold text-blue-600 mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, delay: 0.2 }}
              >
                {satisfactionCount}
              </motion.div>
              <motion.div 
                className="text-gray-500 font-medium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Satisfaction Rate
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
         <motion.h2 
           className="text-3xl font-bold text-gray-900 mb-4"
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
         >
           Why Choose TalentLink?
         </motion.h2>
         <motion.p 
           className="text-gray-500 max-w-2xl mx-auto mb-12"
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
         >
            We provide the tools and security you need to focus on what matters most: your work.
         </motion.p>
         
         <motion.div 
           className="grid md:grid-cols-3 gap-8"
           variants={cardVariants}
           initial="initial"
           whileInView="animate"
           viewport={{ once: true }}
         >
            {[
                { title: 'Safe Payments', desc: 'Secure transactions and payment protection for peace of mind.' },
                { title: 'Top Quality', desc: 'Access a curated network of professional freelancers.' },
                { title: '24/7 Support', desc: 'Our dedicated team is here to help you anytime, anywhere.' }
            ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="bg-gray-50 p-8 rounded-2xl hover:bg-blue-50 transition-colors group cursor-pointer"
                  variants={cardVariants}
                  whileHover="hover"
                >
                    <motion.h3 
                      className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-500"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 + 0.2 }}
                    >
                      {item.desc}
                    </motion.p>
                </motion.div>
            ))}
         </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-8 mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-400 mb-2">
              © 2026 TalentLink. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
               <span className="text-blue-400 font-semibold"></span>
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;