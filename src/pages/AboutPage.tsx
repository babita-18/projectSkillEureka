import { Link } from 'react-router-dom';
import About_Bg from '../assets/About_bg.jpg';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12" >

      <div className="max-w-3xl mx-auto">

<div
    className="absolute top-0 left-0 w-[800px] h-full bg-cover bg-center"
    style={{
      backgroundImage: `url(${About_Bg})`,
      zIndex: -1,
    }}
  />

    { /*   <div className="  absolute inset-0 bg-cover bg-center filter blur-xs brightness-75 "
          style={{ backgroundImage: `url(${About_Bg})`, zIndex: -1 }}
        />*/}

        <h1 className="text-3xl text-white  font-bold text-center mb-8">About Skill Eureka</h1>

        <div className="prose max-w-none">
          <p className="text-lg text-white mb-6">
            Skill Eureka is a not-for-profit initiative by Bright Eureka, with a mission to make high-quality education accessible to everyone—completely free from ads, subscriptions, or distractions.
          </p>

          <p className="text-lg text-white mb-6">
            Built by a passionate development team from IIT Guwahati, Skill Eureka is a platform where educators can share their existing educational content, and learners can explore a library of valuable resources without barriers. Our goal is to create an open, inclusive ecosystem that prioritizes learning over monetization and empowers creators to make a lasting impact.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/become-creator" className="btn btn-primary text-lg px-8 py-3">
            Become a Creator
          </Link>
        </div>
      </div>
    </div>

  );
};

export default AboutPage;