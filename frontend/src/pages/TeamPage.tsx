import { Instagram, Linkedin, Github, Twitter } from 'lucide-react';
import { mockTeamMembers } from '../data/mockData';

const TeamPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 ">
      <h1 className="text-3xl font-bold text-center mb-12">Our Team</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {mockTeamMembers.map(member => (
          <div key={member.id} className="h-70 bg-primary-light rounded-lg shadow-card overflow-hidden">
            <div className="h-64 bg-primary-light">
              <img 
                src={member.profilePic} 
                alt={member.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-[#4FC3F7] font-medium">{member.role}</p>
              
              <p className="mt-4 text-gray-600">
                {member.bio}
              </p>
              
              <div className="mt-6 flex space-x-4">
                {member.socialLinks.linkedin && (
                  <a 
                    href={member.socialLinks.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#0077B5]  hover:bg-primary-dark rounded-lg p-1 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                
                {member.socialLinks.github && (
                  <a 
                    href={member.socialLinks.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                     className="text-[#333]   hover:bg-primary-dark rounded-lg p-1 transition-colors"
                   
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                
                {member.socialLinks.twitter && (
                  <a 
                    href={member.socialLinks.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#1DA1F2]    hover:bg-primary-dark rounded-lg p-1 transition-colors"
                   
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;