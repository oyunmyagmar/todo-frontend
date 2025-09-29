"use client";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => console.log(data, "data"));
  }, []);
  return <div>page</div>;
};
export default Home;
