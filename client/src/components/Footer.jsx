import { Link } from "react-router-dom";
import { SiX } from "react-icons/si";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { variantsContext } from "../context/motionContext";
import { useContext } from "react";
import { motion } from "framer-motion";

const quickLinks=[
  {
    id:1,
    path:"/",
    title:"Home"
  },
  {
    id:2,
    path:"/about",
    title:"About"
  },
  {
    id:3,
    path:"/interview/setup",
    title:"Practice"
  },
  {
    id:4,
    path:"/resources",
    title:"Resources"
  },
]

const supportLinks=[
  {
    id:1,
    path:"/contact",
    title:"Contact Us"
  },
  {
    id:2,
    path:"#",
    title:"Help Center"
  },
  {
    id:3,
    path:"#",
    title:"Privacy Policy"
  },
  {
    id:4,
    path:"#",
    title:"Terms Of Service"
  },
]

const socialMediaLinks=[
  {
    id:1,
    icon:<FaGithub className="h-7 w-7" />,
    href:'https://github.com/coderuzumaki/prepedge-ai',
    ariaLabel:'GitHub'

  },
  {
    id:2,
    icon:<SiX className="h-6 w-6 mt-0.5" />,
    href:'https://x.com/coderUzumaki',
    ariaLabel:'Twitter'

  },
  {
    id:3,
    icon:<FaLinkedin className="h-7 w-7" />,
    href:'https://www.linkedin.com/in/abhinavvv08',
    ariaLabel:'LinkedIn'

  },
  {
    id:4,
    icon:<FaEnvelope className="h-7 w-7" />,
    href:'mailto:astar1013vt@gmail.com',
    ariaLabel:'Email'

  },
]


export default function Footer() {
  const sharedData = useContext(variantsContext);
  const { sectionVariant, textvariant, cardVariant, cardContainer, paraVariant } =
    sharedData;
  return (
    <motion.footer 
    initial='hidden'
    whileInView='visible'
    variants={sectionVariant}
    viewport={{ once: true, amount: 0.2, margin: "-50px" }}
    className="bg-[#fafaf9] text-gray-900 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* upper section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div 
            initial='hidden'
               whileInView='visible'
               variants={textvariant}
               viewport={{ amount: 0.3, once: true }}
            className="flex items-center space-x-2 mb-3">
              <span 
               
              
              className="text-2xl font-bold text-gray-900">
                PrepEdge AI
              </span>
            </motion.div>
            <motion.p
             initial='hidden'
             whileInView='visible'
             variants={paraVariant}
             viewport={{ amount: 0.5, once: true }}
            className="text-lg text-gray-600 mb-4 max-w-md">
              Master your interview skills with AI-powered practice sessions, real-time feedback, 
              and personalized insights to help you land your dream job.
            </motion.p>
            <motion.div 
             initial='hidden'
             whileInView='visible'
             variants={cardContainer}
             viewport={{once:true}}
             className="flex space-x-4">
              {socialMediaLinks.map(({id, href, ariaLabel, icon})=>(
                <motion.a
                 variants={cardVariant}
                 key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-cyan-500 transition-colors duration-200"
                aria-label={ariaLabel}
              >
                {icon}
              </motion.a>
              ))}
            </motion.div>
          </div>
		  
		  {/* Quick Links */}
          <div>
            <motion.h3 
             initial='hidden'
             whileInView='visible'
             variants={textvariant}
             viewport={{once:true, amount:0.3}}
            className="text-xl font-semibold mb-4">
              <u>Quick Links</u>
            </motion.h3>
            <motion.ul 
             initial='hidden'
             whileInView='visible'
             variants={cardContainer}
             viewport={{once:true}}

            className="space-y-2">
              {quickLinks.map(({path, title, id})=>(
                <motion.li 
                 variants={cardVariant}
                key={id}>
                <Link to={path} className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  {title}
                </Link>
              </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Support */}
          <div>
            <motion.h3 
            initial='hidden'
             whileInView='visible'
             variants={textvariant}
             viewport={{once:true, amount:0.3}}
            className="text-xl font-semibold mb-4"><u>Support</u>
          </motion.h3>
            <motion.ul 
             initial='hidden'
             whileInView='visible'
             variants={cardContainer}
             viewport={{once:true}}
             className="space-y-2">
              {supportLinks.map(({path, title, id})=>(
                <motion.li
                 variants={cardVariant} 
                key={id}>
                <Link to={path} className="text-gray-600 hover:text-cyan-500 hover:scale-112 transition-all duration-200 inline-block">
                  {title}
                </Link>
              </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 mt-5 pt-5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px]">
            © {new Date().getFullYear()} PrepEdge AI. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-gray-500 hover:text-cyan-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px] transition-colors duration-200">
              Privacy
            </Link>
            <Link to="#" className="text-gray-500 hover:text-cyan-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px] transition-colors duration-200">
              Terms
            </Link>
            <Link to="#" className="text-gray-500 hover:text-cyan-500 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[16px] transition-colors duration-200">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
