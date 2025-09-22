import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { variantsContext } from "../context/motionContext";
import { useContext } from "react";

export default function FAQ({
  title = "Frequently Asked Questions",
  subtitle,
  faqs = [],
  className = "",
  allowMultipleOpen = false,
}) {
  const sharedData = useContext(variantsContext);
  const { textvariant, paraVariant, cardVariant, cardContainer } = sharedData;
  const [openItems, setOpenItems] = useState(
    faqs
      .map((faq, index) => (faq.defaultOpen ? index : -1))
      .filter((index) => index !== -1)
  );

  const inView = useInView({ once: true, amount: 0.3 });

  const toggleItem = (index) => {
    if (allowMultipleOpen) {
      setOpenItems((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenItems((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <motion.h2
              initial="hidden"
              whileInView="visible"
              variants={textvariant}
              viewport={{ once: true }}
              className="text-3xl font-bold text-gray-900"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial="hidden"
              whileInView="visible"
              variants={paraVariant}
              viewport={{ once: true }}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={cardContainer}
        viewport={{ once: true, amount: 0.5 }}
        className="space-y-4"
      >
        {faqs.map((faq, index) => {
          const isOpen = openItems.includes(index);
          return (
            <motion.div
              variants={cardVariant}
              key={index}
              className="border border-gray-200 rounded-lg bg-white"
            >
              <motion.button
                onClick={() => toggleItem(index)}
                className={`w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg cursor-pointer`}
                aria-expanded={isOpen}
              >
                <span className="text-gray-900 font-medium text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 text-gray-500 transition-transform duration-200">
                  {isOpen ? (
                    <FaChevronUp className="w-4 h-4" />
                  ) : (
                    <FaChevronDown className="w-4 h-4" />
                  )}
                </div>
              </motion.button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div className="mt-12 flex">
        <p className="text-gray-600 mb-4">Still have questions?</p>

        <Link
          to="/contact#contact-form"
          className="inline-flex items-center justify-center ml-3 mb-4 text-blue-500 font-semibold rounded-lg transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
