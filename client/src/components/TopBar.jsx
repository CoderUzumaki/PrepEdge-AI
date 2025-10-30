import React, { useEffect } from "react";
import { ArrowBigUp } from "lucide-react";
import Styled from "styled-components";

const OnTopBar = () => {
  const [isvisible, setIsVisible] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  const onTopbtn = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // Updated scroll handler to calculate progress
  const handleScroll = () => {
    const winScroll =  document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    setScrollProgress(scrolled);
    
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container>
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />
      {isvisible && (
        <div className="on-top-bar" onClick={onTopbtn}>
          <ArrowBigUp />
        </div>
      )}
    </Container>
  );
};

const Container = Styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    background: #00abff;
 
  }

  .on-top-bar {
    position: fixed;
    bottom: 20px;
    right: 18px;
    background-color: #fff;
    color: #1a1a1a;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: #0039ff;
    }
  }
`;

export default OnTopBar;