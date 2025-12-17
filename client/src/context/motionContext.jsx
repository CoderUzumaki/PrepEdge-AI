import React, { Children, createContext } from "react";

export const variantsContext = createContext({});

export function VariantsProvider({ children }) {
  const textvariant = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { delay: 0.5, duration: 1, ease: "easeOut" },
    },
  };
  const paraVariant = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
      rotateY: 0,
      opacity: 1,
      transition: { delay: 0.7, duration: 1, ease: "easeOut" },
    },
  };
  const sectionVariant = {
    hidden: { opacity: 0, y: -100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.3,
        type: "spring",
        stiffness: 120,
        damping: 10,
      },
    },
  };

  const cardContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.25,
        ease: "easeInOut",
        when: "beforeChildren",
      },
    },
  };
  const cardVariant = {
    hidden: { x: -80, y: -80, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.6 },
    },
  };

  const sharedData = {
    sectionVariant,
    textvariant,
    cardVariant,
    cardContainer,
    paraVariant,
  };
  return (
    <variantsContext.Provider value={sharedData}>
      {children}
    </variantsContext.Provider>
  );
}
