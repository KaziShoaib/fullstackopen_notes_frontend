import React from 'react';
import '../index.css';


const Footer = () => {
  let footerStyle = {
    color:'green',
    fontStyle:'italic',
    fontSize:16
  };
  return (
    <div style={footerStyle}>
      <em>Created by Kazi Shoaib Muhammad</em>
    </div>
  );
};


export default Footer;