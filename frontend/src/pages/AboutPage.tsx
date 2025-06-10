import { Link } from 'react-router-dom';
import About_Bg from '../assets/About_bg.jpg';

const AboutPage = () => {
  return (
   <div className="relative w-full pt-16 overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center brightness-75"
    style={{ backgroundImage: `url(${About_Bg})` }} // Update with your image
  />

  {/* Content Wrapper */}
  <div className="relative z-10 flex items-center justify-center px-4 sm:px-6 md:px-12 py-16 md:py-28">
    <div className="bg-black bg-opacity-50 text-white rounded-xl p-6 sm:p-10 max-w-3xl w-full">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center md:text-left">
        About Skill Eureka
      </h2>
      <p className="text-base sm:text-lg leading-relaxed mb-4 text-center md:text-left">
        Skill Eureka is a not-for-profit initiative by Bright Eureka, with a mission to make
        high-quality education accessible to everyone—completely free from ads, subscriptions, or distractions.
      </p>
      <p className="text-base sm:text-lg leading-relaxed mb-6 text-center md:text-left">
        Built by a passionate development team from IIT Guwahati, Skill Eureka is a platform
        where educators can share content and learners can explore a library of valuable resources without barriers.
        Our goal is to build an open, inclusive ecosystem that prioritizes learning over monetization.
      </p>
      <div className="mt-10 text-center">
          <Link to="/become-creator" className="btn btn-primary text-lg px-8 py-3">
            Become a Creator
          </Link>
        </div>
    </div>
  </div>
</div>

  );
};

export default AboutPage;

{/*  <div className="mt-10 text-center">
          <Link to="/become-creator" className="btn btn-primary text-lg px-8 py-3">
            Become a Creator
          </Link>
        </div> */}