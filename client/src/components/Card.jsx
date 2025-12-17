import {motion} from 'framer-motion'
export default function Card({ icon, title, description, className = "" }) {
  return (
    <motion.div
      initial={{y:-10, opacity:0}}
      whileInView={{y:0, opacity:1}}
      transition={{delay:1, type:'spring', stiffness:100, damping:10}}
      viewport={{once:true, amount:0.3}}
      className={`bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      <div className="flex flex-col items-start space-y-4">
        <motion.div 
          whileInView={{rotate:[0, -90, 90, 0]}}
          transition={{duration:0.5, delay:0.5}}
          
          className="text-gray-600 text-2xl">{icon}
        </motion.div>

        <motion.h3
        initial={{x:-50, opacity:0}}
        whileInView={{x:0, opacity:1}}
        transition={{duration:0.5, delay:0.5, ease:'easeInOut'}}
        className="text-lg font-semibold text-gray-900 leading-tight">
          {title}
        </motion.h3>

        <motion.p 
        initial={{x:50, opacity:0}}
        whileInView={{x:0, opacity:1}}
        transition={{duration:0.5, delay:0.5, ease:'easeOut'}}
        className="text-gray-600 text-sm leading-relaxed">{description}
        </motion.p>
      </div>
    </motion.div>
  );
}